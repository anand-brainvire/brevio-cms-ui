import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { DEFAULT_STATUS, IMAGE_BASE_URL, ROUTES, STATUS_RADIO } from '@config/constant';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { GET_BANNER_BY_ID } from '@framework/graphql/queries/banner';
import { ADD_BANNER, UPDATE_BANNER } from '@framework/graphql/mutations/banner';
import { CheckCircle, Cross, CrossCircled } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import RadioButton from '@components/radiobutton/radioButton';
import { whiteSpaceRemover, uploadFile } from '@utils/helpers';
import { BannerUpdateProps } from '@type/banner';

const AddEditBanner = () => {
	const { t } = useTranslation();
	const [addBanner] = useMutation(ADD_BANNER);
	const [editBanner] = useMutation(UPDATE_BANNER);
	const navigate = useNavigate();
	const params = useParams();
	const { data: bannerByIdData } = useQuery(GET_BANNER_BY_ID, {
		variables: { getBannerDetailId: params.id },
		skip: !params.id,
		fetchPolicy: 'network-only',
	});
	const [imagePreview, setImagePreview] = useState<string>('');
	const { BannerValidationSchema } = useValidation();
	/**
	 * Method that fetchs the data by using uuid and sets data to form fields
	 */
	useEffect(() => {
		if (bannerByIdData && params.id) {
			const data = bannerByIdData?.getBannerDetail.data;
			formik.setValues({
				BannerTitle: data?.banner_title,
				bannerImage: data?.banner_image,
				status: data?.status,
				bannerTitleArabic: data?.banner_title_arabic,
			});
			setImagePreview(`${IMAGE_BASE_URL}/${data?.filePath?.original_file}`);
		}
	}, [bannerByIdData]);

	const initialValues = {
		BannerTitle: '',
		bannerImage: '',
		status: DEFAULT_STATUS,
		bannerTitleArabic: '',
	};
	/**
	 * On cancle redirect to list view
	 */
	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.banner}/${ROUTES.list}`);
	}, []);

	const updateBannerFunction = (values: BannerUpdateProps) => {
		const imageUrl = formik.values.bannerImage;
		addBanner({
			variables: {
				bannerTitle: values.BannerTitle,
				bannerImage: imageUrl,
				status: parseInt(values.status),
				createdBy: 1,
				bannerTitleArabic: values.bannerTitleArabic,
			},
		})
			.then((res) => {
				const data = res.data;
				if (data.createBanner.meta.statusCode === 201) {
					toast.success(data.createBanner.meta.message);
					if (!params?.id) {
						uploadFile(
							[
								{ name: 'banner', content: values?.bannerImage ? values?.bannerImage : '' },
								{ name: 'bannerId', content: data.createBanner.data.uuid },
							],
							'/banner/banner-img'
						)
							.then(() => {
								// Call onCancel only after uploadFile is done
								formik.resetForm();
								onCancel();
							})
							.catch(() => {
								// Handle uploadFile error
								toast.error(t('Failed to upload file'));
							});
					} else {
						formik.resetForm();
						onCancel();
					}
				}
			})
			.catch(() => {
				toast.error(t('Failed to create'));
			});
	};
	const formik = useFormik({
		initialValues,
		validationSchema: BannerValidationSchema(),
		onSubmit: async (values) => {
			try {
				const imageUrl = formik.values.bannerImage;
				const isFile = typeof imageUrl !== 'string';
				if (params.id) {
					if (isFile) {
						uploadFile(
							[
								{ name: 'banner', content: values?.bannerImage ? values?.bannerImage : '' },
								{ name: 'bannerId', content: params?.id },
							],
							'/banner/banner-img'
						);
					}

					editBanner({
						variables: {
							updateBannerId: params.id,
							bannerTitle: values.BannerTitle,
							bannerImage: imageUrl,
							status: parseInt(values.status),
							bannerTitleArabic: values.bannerTitleArabic,
						},
					})
						.then((res) => {
							const data = res.data;
							if (data?.updateBanner.meta.statusCode === 200) {
								toast.success(data.updateBanner.meta.message);
								formik.resetForm();
								onCancel();
							}
						})
						.catch(() => {
							return;
						});
				} else {
					updateBannerFunction(values);
				}
			} catch (error) {
				if (error) {
					toast.error(t('Something went wrong'));
				}
			}
		},
	});

	const handleImageChange: (file: File) => void = (file: File) => {
		//Check's the file size and file type
		if (file && file.size <= 2000000 && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
			formik.setFieldValue('bannerImage', file);
			setImagePreview(URL.createObjectURL(file));
		} else {
			toast.error(`${!['image/jpeg', 'image/jpg', 'image/png'].includes(file?.type) ? 'Please select jpg/jpeg/png file.' : ''} ${file?.size > 2000000 ? 'File size must be 2MB or below' : ''}`);
		}
	};

	const handleChangeBannerImage = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.currentTarget.files?.[0];
			file && handleImageChange(file);
		},
		[handleImageChange]
	);
	/**
	 * Removes image perview
	 */
	const removeHandler = useCallback(() => {
		setImagePreview('');
		formik.setFieldValue('bannerImage', '');
		formik.setFieldError('bannerImage', 'Please upload banner image');
	}, [imagePreview]);
	/**
	 * Handle blur that removes white space's
	 */
	const OnBlurBanner = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
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
						<div className='flex flex-col'>
							<div>
								<label className='block text-gray-700 text-sm font-normal mb-4' htmlFor='bannerImage'>
									{t('Banner Image')} <span className='text-error'>*</span>
								</label>

								<div className='flex flex-col items-center justify-center relative border-[2px] border-dashed border-color-[#92b0b3;]'>
									{imagePreview && (
										<div aria-label='cancel' aria-hidden='true' className='cursor-pointer text-yellow-500 absolute -top-1 -right-1 bg-white rounded-full leading-0' onClick={removeHandler}>
											<span className='svg-icon inline-block h-6 w-6 text-warning'>
												<CrossCircled />
											</span>
										</div>
									)}
									<div className='flex flex-col items-center justify-center w-full h-64 b-color-2 border-b-color-2 border-dashed cursor-pointer bg-white overflow-hidden'>
										<div className='w-full m-auto transition-all'>
											{imagePreview && <img src={imagePreview} className='object-cover w-full h-full' alt='Banner Preview' />}
											{!imagePreview && (
												<div className='text-center  '>
													<label className=' cursor-pointer block p-5 font-medium text-h2 leading-lg text-base-font-3 m-auto'>
														<span className='font-bold text-base-font-5 text-h2'>{t('Browse')}</span>
														<br />
														{t('for a banner image to upload.')}
														<input id='bannerImage' tabIndex={0} type='file' onChange={handleChangeBannerImage} className='hidden w-full ' />
													</label>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
							{formik.errors.bannerImage && formik.touched.bannerImage && <p className='error'> {t(formik.errors.bannerImage)}</p>}
						</div>
						<div className='hidden md:block'></div>
						<div>
							<TextInput id={'BannerTitle'} required={true} placeholder={t('Banner Title')} name='BannerTitle' onChange={formik.handleChange} label={t('Banner Title')} value={formik.values.BannerTitle} error={formik.errors.BannerTitle && formik.touched.BannerTitle ? formik.errors.BannerTitle : ''} onBlur={OnBlurBanner} />
						</div>
						<div>
							<TextInput id={'BannerTitleArabic'} className={'text-right'} required={true} placeholder={t('Banner Title (Arabic)')} name='bannerTitleArabic' onChange={formik.handleChange} label={t('Banner Title (Arabic)')} value={formik.values.bannerTitleArabic} error={formik.errors.bannerTitleArabic && formik.touched.bannerTitleArabic ? formik.errors.bannerTitleArabic : ''} onBlur={OnBlurBanner} />
						</div>

						<RadioButton id='status' required={true} checked={formik.values.status} onChange={formik.handleChange} name={'status'} radioOptions={STATUS_RADIO} label={t('Status')} />
					</div>
				</div>
				<div className='card-footer btn-group'>
					<Button className='btn-primary ' type='submit' label={params.id ? t('Update') : t('Save')}>
						<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
							<CheckCircle />
						</span>
					</Button>
					<Button className='btn-warning ' type='button' label={t('Cancel')} onClick={onCancel}>
						<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
							<Cross />
						</span>
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AddEditBanner;
