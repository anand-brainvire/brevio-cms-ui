import { useMutation, useQuery } from '@apollo/client';
import Button from '@components/button/button';
import { CheckCircle, Cross } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import { ROUTES, STATUS } from '@config/constant';
import { CreateNotificationRes, UpdateNotificationRes } from '@framework/graphql/graphql';
import { CREATE_NOTIFICATION, UPDATE_NOTIFICATION } from '@framework/graphql/mutations/notifications';
import { GET_NOTIFICATION_BY_ID } from '@framework/graphql/queries/notifications';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreateNotification } from '@type/notifications';
import { whiteSpaceRemover } from '@utils/helpers';
import WithTranslateFormErrors from '@components/customHooks/useTranslationFormErrors';
import useValidation from '@src/hooks/validations';

const AddEditNotification = () => {
	const { t } = useTranslation();
	const notificationId = useParams();
	const [toggle, setToggle] = useState<boolean>(false);
	const navigate = useNavigate();
	const { data: notificationData, refetch: getNotificationById } = useQuery(GET_NOTIFICATION_BY_ID);
	const [createNOtification] = useMutation(CREATE_NOTIFICATION);
	const [updateNotification] = useMutation(UPDATE_NOTIFICATION);
	const { addNotificationValidationSchema } = useValidation();
	const initialValues: CreateNotification = notificationId.id
		? {
			template: '',
			status: 0,
		}
		: {
			template: '',
		};
	/**
	 * Method used for get event api with id
	 */
	useEffect(() => {
		if (notificationId.id) {
			getNotificationById({
				getNotificationTemplateId: notificationId.id,
			}).catch((err) => {
				toast.error(err);
			});
		}
	}, [notificationId.id]);
	/**
	 * Method used for setvalue from event data by id
	 */
	useEffect(() => {
		if (notificationData && notificationId.id) {
			const data = notificationData.getNotificationTemplate?.data;
			setToggle(data?.status);

			formik
				.setValues({
					template: data?.template,
				})
				.catch((err) => {
					toast.error(err);
				});
		}
	}, [notificationData]);

	const formik = useFormik({
		initialValues,
		validationSchema: addNotificationValidationSchema,
		onSubmit: (values) => {
			if (notificationId.id) {
				updateNotification({
					variables: {
						updateNotificationTemplateId: notificationId.id,
						template: values.template,
						status: toggle === true ? 1 : 0,
					},
				})
					.then((res) => {
						const data = res.data as UpdateNotificationRes;
						if (data.updateNotificationTemplate.meta.statusCode === 200) {
							toast.success(data.updateNotificationTemplate.meta.message);
							formik.resetForm();
							onCancelNotif();
						}
					})
					.catch(() => {
						return;
					});
			} else {
				createNOtification({
					variables: {
						template: values.template,
					},
				})
					.then((res) => {
						const data = res.data as CreateNotificationRes;

						if (data.createNotificationTemplate.meta.statusCode === 200) {
							toast.success(data.createNotificationTemplate.meta.message);
							navigate(`/${ROUTES.app}/${ROUTES.notifications}/${ROUTES.list}`);
							formik.resetForm();
						}
					})
					.catch(() => {
						return;
					});
			}
		},
	});
	/**
	 * on clicking cancel it will redirect to main notification page
	 */
	const onCancelNotif = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.notifications}/${ROUTES.list}`);
	}, []);
	/**
	 * Handle blur that removes white space's
	 */
	const OnBlurNtf = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
	return (
		<div>
			<div className='card'>
				<WithTranslateFormErrors errors={formik.errors} touched={formik.touched} setFieldTouched={formik.setFieldTouched}>
					<form onSubmit={formik.handleSubmit}>
						<div className='card-body'>
							<div className='card-title-container'>
								<p>
									{t('Fields marked with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
								</p>
							</div>
							<div className='card-grid-addedit-page md:grid-cols-2 '>
								<div>
									<TextInput id={'template'} required={true} placeholder={t('Template')} name='template' onChange={formik.handleChange} onBlur={OnBlurNtf} label={t('Template')} value={formik.values.template} error={formik.errors.template && formik.touched.template ? formik.errors.template : ''} />
								</div>
								{notificationId && notificationData && (
									<div>
										<label htmlFor='status'>{t('Send Notifications')}</label>
										<div>
											<span
												aria-label='toggle-status'
												aria-hidden='true'
												onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
													e.preventDefault();
													setToggle((prev) => !prev);
												}}
												className='font-medium text-blue-600 mt-2  hover:underline'
											>
												<label aria-label='toggle' aria-hidden='true' className='relative inline-flex items-center cursor-pointer'>
													<input type='checkbox' value={toggle === true ? STATUS.active : STATUS.inactive} className='sr-only peer' name='sendNotification' checked={toggle} readOnly />
													<div className={'w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300   peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-0.5 after:left-0.5 after:bg-white border-primary after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-primary'}></div>
												</label>
											</span>
										</div>
									</div>
								)}
							</div>
						</div>
						<div className='btn-group card-footer'>
							<Button className='btn-primary ' type='submit' label={notificationId.id ? t('Update') : t('Save')}>
								<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
									<CheckCircle />
								</span>
							</Button>
							<Button className='btn-warning ' label={t('Cancel')} onClick={onCancelNotif}>
								<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
									<Cross />
								</span>
							</Button>
						</div>
					</form>
				</WithTranslateFormErrors>
			</div>
		</div>
	);
};
export default AddEditNotification;
