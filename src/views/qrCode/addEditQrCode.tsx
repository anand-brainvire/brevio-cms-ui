import { useMutation, useQuery } from '@apollo/client';
import { ROUTES, STATUS, STATUS_RADIO } from '@config/constant';
import { useFormik } from 'formik';
import React, { ReactElement, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CheckCircle, Cross } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import RadioButton from '@components/radiobutton/radioButton';
import { whiteSpaceRemover } from '@utils/helpers';
import { Loader } from '@components/index';
import { CreateQrCode } from '@type/qrcode';
import { GET_SINGLE_QR_CODE } from '@framework/graphql/queries/qrCode';
import { CREATE_QR, UPDATE_QR } from '@framework/graphql/mutations/qrCode';
const AddEditQrCode = (): ReactElement => {
	const { t } = useTranslation();
	const [createQr, { loading: createLoader }] = useMutation(CREATE_QR);
	const [updateQr, { loading: updateLoader }] = useMutation(UPDATE_QR);
	const navigate = useNavigate();
	const params = useParams();
	const { data: qrByIdData } = useQuery(GET_SINGLE_QR_CODE, {
		variables: { uuid: params.id },
		skip: !params.id,
		fetchPolicy: 'network-only',
	});
	const { qrCodeValidationSchema } = useValidation();
	useEffect(() => {
		if (qrByIdData && params.id) {
			const data = qrByIdData?.getQrcode?.data;
			formik
				.setValues({
					url: data?.url,
					status: data?.status,
				})
				.catch((e) => toast.error(e));
		}
	}, [qrByIdData]);
	const initialValues = {
		url: '',
		status: STATUS.active,
	};

	const formik = useFormik({
		initialValues,
		validationSchema: qrCodeValidationSchema,
		onSubmit: (values) => {
			const commonValues = {
				url: values.url,
				status: +values.status,
			};
			if (params.id) {
				updateQr({
					variables: {
						uuid: params.id,
						...commonValues,
					},
				})
					.then((res) => {
						const data = res.data;
						if (data?.updateQrcode.meta.statusCode === 200) {
							toast.success(data.updateQrcode.meta.message);
							formik.resetForm();
							onCancelQr();
						}
					})
					.catch(() => {
						return;
					});
			} else {
				createQr({
					variables: {
						...commonValues,
					},
				})
					.then((res) => {
						const data = res.data;
						if (data.createQrcode.meta.statusCode === 201) {
							toast.success(data.createQrcode.meta.message);
							formik.resetForm();
							onCancelQr();
						}
					})
					.catch(() => {
						return;
					});
			}
		},
	});
	/**
	 * On cancle redirect to list view
	 */
	const onCancelQr = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.qrcode}/list`);
	}, []);
	/**
	 * Handle blur that removes white space's
	 */
	const onBlurQr = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
	/**
	 * Error message handler
	 * @param fieldName
	 * @returns
	 */
	const getErrorQr = (fieldName: keyof CreateQrCode) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	return (
		<div className='card'>
			{(createLoader || updateLoader) && <Loader />}
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-title-container'>
						<p>
							{t('Fields marked with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
						</p>
					</div>
					<div className='card-grid-addedit-page'>
						<div>
							<TextInput id={'url'} required={true} placeholder={t('Url')} name='url' onChange={formik.handleChange} label={t('Url')} value={formik.values.url} error={getErrorQr('url')} onBlur={onBlurQr} />
						</div>

						<RadioButton id={'statusQr'} required={true} checked={formik.values.status} onChange={formik.handleChange} name={'status'} radioOptions={STATUS_RADIO} label={t('Status')} />
					</div>
				</div>
				<hr />
				<div className='card-footer btn-group'>
					<Button className='btn-primary ' type='submit' label={params.id ? t('Update') : t('Save')}>
						<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
							<CheckCircle />
						</span>
					</Button>
					<Button className='btn-warning ' label={t('Cancel')} onClick={onCancelQr}>
						<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
							<Cross />
						</span>
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AddEditQrCode;
