import React, { ReactElement, useEffect } from 'react';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import DropDown from '@components/dropdown/dropDown';
import { ENQUIRYSTATUSDRP } from '@config/constant';
import { UPDATE_ENQUIRY_STATUS } from '@framework/graphql/mutations/enquiry';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { Info, Cross } from '@components/icons/icons';
import { ChangeEnquiryStatus } from '@type/enquiry';
import * as Yup from 'yup';
import { Loader } from '@components/index';
const ChangeEnquiryStatusModal = ({ onClose: onCloseEnquiryStatus, subAdminObj, show, setStatusModel }: ChangeEnquiryStatus): ReactElement => {
	const { t } = useTranslation();
	const [updateEnquiryStatus, { loading }] = useMutation(UPDATE_ENQUIRY_STATUS);
	const initialValues = {
		status: subAdminObj?.status != 4 ? subAdminObj.status : '',
	};

	const validation = Yup.object({
		status: Yup.string().required('Please select status'),
	});
	const formik = useFormik({
		validationSchema: validation,
		initialValues,
		onSubmit: (values) => {
			updateEnquiryStatus({
				variables: {
					uuid: subAdminObj?.uuid,
					status: +values.status,
				},
			})
				.then((res) => {
					const data = res?.data;
					if (data?.updateEnquiryStatus?.meta?.statusCode === 200) {
						toast.success(data?.updateEnquiryStatus?.meta?.message);
						setStatusModel(false);
					}
				})
				.catch(() => {
					return;
				});
		},
	});
	/**
	 * Method that closes pop on outeside click
	 */
	useEffect(() => {
		document.addEventListener('click', (event: globalThis.MouseEvent) => {
			if ((event.target as HTMLElement)?.id === 'sub-admin-changepassword-model' || (event.target as HTMLElement)?.id === 'sub-admin-changepassword-model-child') {
				onCloseEnquiryStatus();
			}
			const handleKeyDown = (event: KeyboardEvent) => {
				if (event.key === 'Escape' && show) {
					onCloseEnquiryStatus();
				}
			};

			if (show) {
				document.addEventListener('keydown', handleKeyDown);
			}
		});
	}, [show]);
	return (
		<div className={`${show ? '' : 'hidden'} model-container`} id='sub-admin-changepassword-model'>
			{loading && <Loader />}
			<div id='sub-admin-changepassword-model-child' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={' model animate-fade-in'}>
				<div className='model-content'>
					<div className='model-header'>
						<div className='flex items-center'>
							<span className='mr-2 text-white inline-block text-xl svg-icon w-5 h-5'>
								<Info />
							</span>
							<span className='model-title'>{t('Change Status')}</span>
						</div>
						<Button onClick={onCloseEnquiryStatus} title={t('Close') ?? ''}>
							<span className='my-1 text-white w-2.5 h-2.5 inline-block svg-icon'>
								<Cross />
							</span>
						</Button>
					</div>
					<form onSubmit={formik.handleSubmit}>
						<div className='model-body'>
							<DropDown ariaLabel={'Select Status'} name='status' onChange={formik.handleChange} value={formik.values.status} options={ENQUIRYSTATUSDRP} id='enquiryStatus' required={true} error={formik.errors.status && formik.touched.status ? formik.errors.status : ''} />
						</div>
						<div className='model-footer'>
							<Button className='btn-primary' type='submit' label={t('Submit')} />
							<Button className='btn-warning' onClick={onCloseEnquiryStatus} label={t('Close')} />
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ChangeEnquiryStatusModal;
