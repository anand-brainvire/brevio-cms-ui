import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { DEFAULT_STATUS, ROUTES, STATUS_RADIO, STATUS} from '@config/constant';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { GET_AUTHOR_BY_ID } from '@framework/graphql/queries/author';
import { ADD_AUTHOR, UPDATE_AUTHOR } from '@framework/graphql/mutations/author';
import { CheckCircle, Cross } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import RadioButton from '@components/radiobutton/radioButton';
import { whiteSpaceRemover } from '@utils/helpers';
import { BannerUpdateProps } from '@type/banner';

const AddEditAuthor = () => {
	const { t } = useTranslation();
	const [addAuthor] = useMutation(ADD_AUTHOR);
	const [editAuthor] = useMutation(UPDATE_AUTHOR);
	const navigate = useNavigate();
		const params = useParams();

	const { data: authorByIdData } = useQuery(GET_AUTHOR_BY_ID, {
		variables: { uuid: params.id },
		skip: !params.id,
		fetchPolicy: 'network-only',
	});

	const { AuthorValidationSchema } = useValidation();

	useEffect(() => {
		if (authorByIdData && params.id) {
			const data = authorByIdData?.getAuthorById?.data;
			const translation = Array.isArray(data?.author_translations)
				? data.author_translations.find((tr: any) => tr.lang_code === 'en') || data.author_translations[0]
				: {};

			formik.setValues({
				authorName: translation?.name || '',
				status: data?.is_active,
			});
		}
	}, [authorByIdData, params.id]);

	const initialValues = {
		authorName: '',
		status: DEFAULT_STATUS,
	};

	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.author}/${ROUTES.list}`);
	}, [navigate]);

	const handleAddAuthor = async (values: BannerUpdateProps) => {
		try {
			const { data } = await addAuthor({
				variables: {
					authorData: [
						{
							name: values.authorName,
							langCode: 'en',
						},
					],
					isActive: values.status === STATUS.active,
				},
			});

			if (data?.createAuthor?.meta?.statusCode === 200) {
				toast.success(data.createAuthor.meta.message);
				formik.resetForm();
				onCancel();
			} else {
				toast.error(data?.createAuthor?.meta?.message || t('Failed to create author'));
			}
		} catch {
			return;
		}
	};

	const handleEditAuthor = async (values: BannerUpdateProps) => {
		try {
			const { data } = await editAuthor({
				variables: {
					uuid: params.id,
					authorData: [
						{
							name: values.authorName,
							langCode: 'en',
						},
					],
					isActive: Number(values.status) === STATUS.active,
				},
			});
			if (data?.updateAuthor?.meta?.statusCode === 200) {
				toast.success(data.updateAuthor.meta.message);
				formik.resetForm();
				onCancel();
			} else {
				toast.error(data?.updateAuthor?.meta?.message || t('Failed to update author'));
			}
		} catch  {
			return;
		}
	};

	const formik = useFormik({
		initialValues,
		validationSchema: AuthorValidationSchema(),
		onSubmit: async (values) => {
			if (params.id) {
				await handleEditAuthor(values);
			} else {
				await handleAddAuthor(values);
			}
		},
	});

	const OnBlurAuthor = useCallback(
		(e: React.FocusEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
			formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
		},
		[formik]
	);
	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-title-container'>
						<p>
							{t('Fields marked with')} <span className='text-red-500'>*</span> {t('are mandatory.')}
						</p>
					</div>
					<div className='card-grid-addedit-page md:grid-cols-2'>
						<div>
							<TextInput
								id='authorName'
								required
								placeholder={t('Author Name')}
								name='authorName'
								onChange={formik.handleChange}
								label={t('Author Name')}
								value={formik.values.authorName}
								error={formik.errors.authorName && formik.touched.authorName ? formik.errors.authorName : ''}
								onBlur={OnBlurAuthor}
							/>
						</div>
						<RadioButton
							id='status'
							required
							checked={formik.values.status}
							onChange={formik.handleChange}
							name='status'
							radioOptions={STATUS_RADIO}
							label={t('Status')}
						/>
					</div>
				</div>
				<div className='card-footer btn-group'>
					<Button className='btn-primary ' type='submit' label={params.id ? t('Update') : t('Save')}>
						<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
							<CheckCircle />
						</span>
					</Button>
					<Button className='btn-secondary ' type='button' label={t('Cancel')} onClick={onCancel}>
						<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
							<Cross />
						</span>
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AddEditAuthor;
