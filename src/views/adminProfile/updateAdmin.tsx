import React, { ReactElement, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_ADMIN_PROFILE } from '@framework/graphql/mutations/admin';
import { GET_ADMIN } from '@framework/graphql/queries/admin';
import { useFormik } from 'formik';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { ROUTES } from '@config/constant';
import { useNavigate } from 'react-router-dom';
import UserProfilePasswordChange from '@views/adminProfile/changeProfilePassword';
import { toast } from 'react-toastify';
import { updateUserProfile } from '@framework/graphql/graphql';
import { CheckCircle, Cross } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import { useTranslation } from 'react-i18next';
import EncryptionFunction from '@services/encryption';
import { Loader } from '@components/index';
const UpdateProfileForm = (): ReactElement => {
	const { t } = useTranslation();
	const { data: adminData } = useQuery(GET_ADMIN, { fetchPolicy: 'network-only' });
	const navigate = useNavigate();
	const [updateUserProfile, { loading }] = useMutation(UPDATE_ADMIN_PROFILE, {
		refetchQueries: [{ query: GET_ADMIN }],
	});
	const { updateAdminValidationSchema } = useValidation();
	useEffect(() => {
		if (adminData) {
			const data = adminData?.getProfileInformation?.data;
			formik.setValues({
				firstName: data?.first_name,
				lastName: data?.last_name,
				userName: data?.user_name,
				email: data?.email,
			});
		}
	}, [adminData]);

	const initialValues = {
		firstName: '',
		lastName: '',
		userName: '',
		email: '',
	};
	/**
	 * handles errorin put input fields
	 * @param values
	 */
	const errorFunction = (values: { firstName: string; lastName: string }) => {
		if (values.firstName.length > 20 || values.firstName.includes(' ')) {
			toast.error(`${values.firstName.length > 20 ? t('The first name may not be greater than 20 characters.') : ''}${values.firstName.includes(' ') ? t('The first name may only contain letters.') : ''}`);
		}
		if (values.lastName.length > 20 || values.lastName.includes(' ')) {
			toast.error(`${values.lastName.length > 20 ? t('The last name may not be greater than 20 characters.') : ''}${values.lastName.includes(' ') ? t('The last name may only contain letters.') : ''}`);
		}
	};
	const formik = useFormik({
		initialValues,
		validationSchema: updateAdminValidationSchema,

		onSubmit: async (values) => {
			errorFunction(values);
			if (values.firstName.length <= 20 && !values.firstName.includes(' ') && values.lastName.length <= 20 && !values.lastName.includes(' ')) {
				updateUserProfile({
					variables: {
						firstName: values.firstName,
						lastName: values.lastName,
						email: values.email,
						userName: values.userName,
					},
				})
					.then((res) => {
						const data = res.data as updateUserProfile;
						if (data?.updateUserProfile.meta?.statusCode === 200) {
							toast.success(data?.updateUserProfile.meta.message);
						}
					})
					.catch(() => {
						return;
					});

				localStorage.setItem('valueslist', EncryptionFunction(values.firstName));
				localStorage.setItem('valueslistlastname', EncryptionFunction(values.lastName));
			}
		},
	});
	/**
	 * on cancle redirect to dashborad page
	 */
	const cancelUpdateHandler = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
	}, []);
	/**
	 * handle blur
	 */
	const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
	return (
		<div>
			<div className='card'>
				{loading && <Loader />}
				<form onSubmit={formik.handleSubmit}>
					<div className='card-body'>
						<div className='card-title-container'>
							<p>
								{t('Fields marked with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
							</p>
						</div>
						<h4 className='mb-3 text-l leading-6 text-h3 font-medium '>{t('Profile Information')}</h4>
						<div className='pt-4 bg-white border-t border-gray-300'>
							<div className='card-grid-addedit-page md:grid-cols-2'>
								<div>
									<TextInput required={true} onBlur={OnBlur} placeholder={t('First Name')} type='text' label={t('First Name')} id='firstName' name='firstName' value={formik.values.firstName} onChange={formik.handleChange} error={formik.errors.firstName && formik.touched.firstName ? formik.errors.firstName : ''} />
								</div>
								<div>
									<TextInput required={true} onBlur={OnBlur} placeholder={t('Last Name')} type='text' id='lastName' name='lastName' label={t('Last Name')} value={formik.values.lastName} onChange={formik.handleChange} error={formik.errors.lastName && formik.touched.lastName ? formik.errors.lastName : ''} />
								</div>
								<div>
									<TextInput placeholder='' type='text' id='userName' name='userName' label={t('Username')} disabled value={formik.values.userName} />
								</div>
								<div>
									<TextInput placeholder='' disabled type='text' id='email' name='email' label={t('Email')} value={formik.values.email} />
								</div>
							</div>
						</div>
					</div>
					<div className='card-footer '>
						<div className='flex btn-group'>
							<Button className='btn-primary ' label={t('Update Profile')} type='submit'>
								<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
									<CheckCircle />
								</span>
							</Button>
							<Button className='btn-warning   ' label={t('Cancel')} onClick={cancelUpdateHandler}>
								<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
									<Cross />
								</span>
							</Button>
						</div>
					</div>
				</form>
			</div>
			<UserProfilePasswordChange />
		</div>
	);
};

export default UpdateProfileForm;
