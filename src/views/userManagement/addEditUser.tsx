import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { useMutation, useQuery } from '@apollo/client';
import { CreateUser, UpdateUser } from '@framework/graphql/graphql';
import { useNavigate, useParams } from 'react-router-dom';
import { DATE_FORMAT, GENDER_DRP1, IMAGE_BASE_URL, ROUTES } from '@config/constant';
import { UserForm } from '@type/user';
import { CREATE_USER, UPDATE_USER } from '@framework/graphql/mutations/user';
import { GET_USER_BY_ID } from '@framework/graphql/queries/user';
import { CheckCircle, Cross, CrossCircle, DateCalendar } from '@components/icons/icons';
import profile from '@assets/images/default-user-image.png';
import RadioButton from '@components/radiobutton/radioButton';
import TextInput from '@components/textinput/TextInput';
import useValidation from '@src/hooks/validations';
import { getDateFromat, whiteSpaceRemover, uploadFile } from '@utils/helpers';
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop, { Crop } from 'react-image-crop';
import DatePicker from '@components/datapicker/datePicker';
import { NUMERIC_VALUE } from '@config/regex';
import { Loader } from '@components/index';

const AddEditUser = (): ReactElement => {
	const { t } = useTranslation();
	const [createUser, { loading: createLoader }] = useMutation(CREATE_USER);
	const [updateUserData, { loading: updateLoader }] = useMutation(UPDATE_USER);
	const navigate = useNavigate();
	const params = useParams();
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
	const [showChangeProfileText, setShowChangeProfileText] = useState<boolean>(false); // Add state to control the visibility of the "Change Profile" text
	const [isHovering, setIsHovering] = useState<boolean>(false);
	const [isSelected, setIsSelected] = useState<boolean>(false);
	const { usermValidationSchema } = useValidation();
	const [src, setSrc] = useState<string | null>(null);
	const [crop, setCrop] = useState<Crop>({
		unit: 'px',
		aspect: 1,
		width: 354.20703125,
		height: 354.20703125,
		x: 145,
		y: 0,
	});
	const { data: userData, loading } = useQuery(GET_USER_BY_ID, {
		variables: { uuid: params.id },
		skip: !params.id,
		fetchPolicy: 'network-only',
	});
	const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
	const inititalIMage = useRef('');
	const imageRef = useRef<HTMLImageElement | null>(null);
	/**
	 * Method used for set rol data array for dropdown
	 */

	const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] as File;
		if (file && file.size <= 2000000 && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
			const reader = new FileReader();
			reader.addEventListener('load', () => setSrc(reader.result as string));
			reader.readAsDataURL(file);
			setIsSelected(true);
		} else {
			toast.error(`${!['image/jpeg', 'image/jpg', 'image/png'].includes(file?.type) ? 'Please select jpg/jpeg/png file.' : ''} ${file?.size > 2000000 ? 'File size should be not be greater than 2mb' : ''}`);
		}
	};
	/**
	 * Handle's current image
	 */
	const onImageLoaded = useCallback((image: HTMLImageElement) => {
		imageRef.current = image;
	}, []);
	/**
	 * Handle's crop image
	 */
	const onCropComplete = useCallback((crop: Crop) => {
		makeClientCrop(crop);
	}, []);
	/**
	 * set crop image
	 */
	const onCropChange = useCallback((newCrop: Crop) => {
		setCrop(newCrop);
	}, []);
	/**
	 * Handle's croped image
	 */
	const getCroppedFile = (image: HTMLImageElement, crop: Crop): Promise<File> => {
		return new Promise((resolve) => {
			const canvas = document.createElement('canvas');
			const pixelRatio = window.devicePixelRatio;
			const scaleX = image.naturalWidth / image.width;
			const scaleY = image.naturalHeight / image.height;
			const ctx = canvas.getContext('2d');
			canvas.width = crop.width * pixelRatio * scaleX;
			canvas.height = crop.height * pixelRatio * scaleY;

			if (ctx) {
				ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
				ctx.imageSmoothingQuality = 'high';
				ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width * scaleX, crop.height * scaleY);
			}

			canvas.toBlob(
				(blob: Blob | null) => {
					if (!blob) {
						toast.error('Canvas is empty');
						resolve(new File([], '')); // Return an empty File in case of an error
						return;
					}

					// Creating a File from the Blob
					const croppedFile = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
					resolve(croppedFile);
				},
				'image/jpeg',
				1
			);
		});
	};

	const makeClientCrop = async (crop: Crop) => {
		if (imageRef.current && crop.width && crop.height) {
			const croppedFile = await getCroppedFile(imageRef.current, crop);
			formik.setFieldValue('profileImg', croppedFile);
			setCroppedImageUrl(URL.createObjectURL(croppedFile));
		}
	};
	/**
	 * Method that sets form data while edit
	 */
	useEffect(() => {
		if (userData && params.id) {
			const data = userData?.getUser?.data;
			if (params.id) {
				setCroppedImageUrl(`${IMAGE_BASE_URL}/${data?.profile_img}`);
				inititalIMage.current = `${IMAGE_BASE_URL}/${data?.profile_img}`;
			}
			formik.setValues({
				profileImg: `${IMAGE_BASE_URL}/${data?.profile_img}`,
				firstName: data?.first_name,
				lastName: data?.last_name,
				userName: data?.user_name,
				email: data?.email,
				password: '',
				confirmPassword: '',
				dateOfBirth: new Date(getDateFromat(data?.date_of_birth, DATE_FORMAT.momentDateFormat)),
				phoneNo: data?.phone_no,
				gender: data?.gender,
			});
		}
	}, [userData]);

	const initialValues: UserForm = {
		profileImg: '',
		firstName: '',
		lastName: '',
		userName: '',
		email: '',
		password: '',
		confirmPassword: '',
		dateOfBirth: undefined,
		phoneNo: '',
		gender: '',
	};
	/**
	 * Handles update
	 * @param values
	 */
	const updateUserFunction = (values: UserForm) => {
		const profileImageChanged = formik.values.profileImg !== inititalIMage.current;
		updateUserData({
			variables: {
				updateUserId: params.id,
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				gender: +values.gender,
				userName: values.userName,
				phoneNo: values.phoneNo,
				dateOfBirth: values.dateOfBirth,
				profileImg: '',
			},
		})
			.then((res) => {
				const data = res.data as UpdateUser;

				if (profileImageChanged) {
					uploadFile(
						[
							{ name: 'profile', content: values?.profileImg ? values?.profileImg : '' },
							{ name: 'uuid', content: params?.id ? params.id : '' },
						],
						'/profile/upload/profile-img'
					);
				}

				if (data.updateUser.meta.statusCode === 200 || data.updateUser.meta.statusCode === 201) {
					toast.success(data.updateUser.meta.message);
					formik.resetForm();
					onCancelUser();
				}
			})
			.catch(() => {
				return;
			});
	};
	const formik = useFormik({
		initialValues,
		validationSchema: params.id ? usermValidationSchema({ params: params.id }) : usermValidationSchema({ params: undefined }),
		onSubmit: async (values) => {
			const profileImageChanged = formik.values.profileImg !== inititalIMage.current;
			if (params.id) {
				updateUserFunction(values);
			} else {
				createUser({
					variables: {
						firstName: values.firstName,
						lastName: values.lastName,
						email: values.email,
						gender: +values.gender,
						userName: values.userName,
						password: values.password,
						phoneNo: values.phoneNo,
						dateOfBirth: values.dateOfBirth,
						profileImg: '',
					},
				})
					.then((res) => {
						const data = res.data as CreateUser;

						if (profileImageChanged) {
							uploadFile(
								[
									{ name: 'profile', content: values?.profileImg ? values?.profileImg : '' },
									{ name: 'uuid', content: data.createUser.data.uuid },
								],
								'/profile/upload/profile-img'
							);
						}

						if (data.createUser.meta.statusCode === 200 || data.createUser.meta.statusCode === 201) {
							toast.success(data.createUser.meta.message);
							formik.resetForm();
							onCancelUser();
						}
					})
					.catch(() => {
						return;
					});
			}
		},
	});
	/**
	 * Method that redirect to list page
	 */
	const onCancelUser = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.user}/${ROUTES.list}`);
	}, []);
	/**
	 * Handle mouse enter
	 */
	const handleMouseEnter = () => {
		setShowChangeProfileText(true);
		setIsHovering(true);
	};
	/**
	 * Handle mouse enter
	 */
	const handleMouseLeave = () => {
		setShowChangeProfileText(false);
		setIsHovering(false);
	};
	/**
	 * Handle remove image
	 */
	const removeHandler = useCallback(() => {
		setCroppedImageUrl('');
		setSrc('');
		setIsSelected(false);
		imageRef.current = null;
		formik.setFieldValue('profileImg', null);
		params.id && setCroppedImageUrl(inititalIMage.current);
	}, [croppedImageUrl]);
	/**
	 * error message handler
	 * @param fieldName
	 * @returns
	 */
	const getErrorUserMng = (fieldName: keyof UserForm) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};
	/**
	 * Method that chnages contact number
	 */
	const handleContactNumberChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const input = event.target.value;
		const numericValue = input.replace(NUMERIC_VALUE, '');
		const trimmedNumericValue = numericValue.slice(0, 10);
		formik.setFieldValue('phoneNo', trimmedNumericValue);
	}, []);
	/**
	 * Handle blur that removes white space's
	 */
	const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
	/**
	 * hide and show password
	 */
	const passwordToggler = useCallback(() => {
		setShowPassword(!showPassword);
	}, [showPassword]);
	/**
	 * hide and show password
	 */
	const confirmPasswordToggler = useCallback(() => {
		setShowConfirmPassword(!showConfirmPassword);
	}, [showConfirmPassword]);
	return (
		<div className='card'>
			{(createLoader || updateLoader || loading) && <Loader />}
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-title-container'>
						<p>
							{t('Fields marked with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
						</p>
					</div>

					<div className='card-grid-addedit-page md:grid-cols-2'>
						<div>
							<label className='mb-2 text-gray-700 inline-block' htmlFor='dropzone-file'>
								{t('Profile Photo')}
							</label>
							<div aria-label='profile-photo' aria-hidden='true' className='flex items-center justify-center w-wide-8' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
								<label
									htmlFor='dropzone-file'
									className='flex flex-col items-center justify-center w-wide-8 h-rise-7 box-border border border-gray-300 border-dashed rounded-sm cursor-pointer bg-gray-50   hover:bg-gray-100 relative' // Added 'relative' class here
								>
									<div className={'w-full flex flex-col items-center justify-center h-full transition-all'}>
										{croppedImageUrl && <img src={croppedImageUrl} className='object-cover w-full h-full' alt='Preview' />}
										{!croppedImageUrl && (
											<div className='w-full'>
												<img src={profile} alt='Preview Profile' className='max-h-full max-w-full' />
											</div>
										)}
									</div>

									<input id='dropzone-file' type='file' onChange={onSelectFile} className='hidden' />
									{isHovering && (
										<div className='absolute -right-2 -top-2'>
											{formik.values.profileImg && isSelected ? (
												<button
													className='text-white cursor-pointer leading-0 rounded-full bg-primary p-2 text-xs'
													onClick={(event) => {
														event.preventDefault();
														removeHandler();
													}}
												>
													<span className='svg-icon inline-block h-3.5 w-3.5'>
														<CrossCircle />
													</span>
												</button>
											) : (
												''
											)}
										</div>
									)}

									{showChangeProfileText && <div className='absolute -bottom-px -left-px -right-px bg-primary  text-center p-2 text-white'>{'Change Profile Photo'}</div>}
								</label>
							</div>
						</div>

						<div>
							{src && (
								<div className='flex flex-col'>
									<label className='mb-2'>{t('Crop Image')} </label>
									<ReactCrop src={src} crop={crop} ruleOfThirds onImageLoaded={onImageLoaded} onComplete={onCropComplete} onChange={onCropChange} className='w-wide-10 max-w-full max-h-auto' />
								</div>
							)}
						</div>
						<div>
							<TextInput id={'firstName'} onBlur={OnBlur} required={true} placeholder={t('First Name')} name='firstName' onChange={formik.handleChange} label={t('First Name')} value={formik.values.firstName} error={getErrorUserMng('firstName')} />
						</div>
						<div>
							<TextInput id={'lastName'} onBlur={OnBlur} required={true} placeholder={t('Last Name')} name='lastName' onChange={formik.handleChange} label={t('Last Name')} value={formik.values.lastName} error={getErrorUserMng('lastName')} />
						</div>
						<div>
							<TextInput autoComplete='nofill' id={'userName'} onBlur={OnBlur} required={true} placeholder={t('Username')} name='userName' onChange={formik.handleChange} label={t('Username')} value={formik.values.userName} error={getErrorUserMng('userName')} />
						</div>
						<div>
							<TextInput id={'email'} onBlur={OnBlur} required={true} placeholder={t('Email')} name='email' onChange={formik.handleChange} label={t('Email')} value={formik.values.email} error={getErrorUserMng('email')} disabled={!!params.id} />
						</div>

						{!params.id && (
							<>
								<TextInput autoComplete='nofill' password={true} btnShowHide={showPassword} btnShowHideFun={passwordToggler} id={'password'} onBlur={OnBlur} required={true} placeholder={t('Password')} name='password' onChange={formik.handleChange} label={t('Password')} value={formik.values.password} error={getErrorUserMng('password')} type={showPassword ? 'text' : 'password'} />
								<TextInput btnShowHide={showConfirmPassword} btnShowHideFun={confirmPasswordToggler} password={true} id={'confirmPassword'} onBlur={OnBlur} required={true} placeholder={t('Confirm Password')} name='confirmPassword' onChange={formik.handleChange} label={t('Confirm Password')} value={formik.values.confirmPassword} error={getErrorUserMng('confirmPassword')} type={showConfirmPassword ? 'text' : 'password'} />
							</>
						)}
						<DatePicker
							id={'dateOfBirth'}
							name='dateOfBirth'
							value={formik.values.dateOfBirth}
							onChange={formik.handleChange}
							label={t('Date Of Birth')}
							placeholder={'MM//DD/YYYY'}
							dateFormat='mm/dd/yy'
							required={true}
							max={new Date()}
							error={getErrorUserMng('dateOfBirth')}
							showIcon={true}
							inputIcon={
								<span className='text-black w-4 h-4 inline-block svg-icon'>
									<DateCalendar />
								</span>
							}
						/>
						<div>
							<TextInput id={'phoneNo'} onBlur={OnBlur} type='text' required={true} placeholder={t('Phone Number')} name='phoneNo' onChange={handleContactNumberChange} label={t('Phone Number')} value={formik.values.phoneNo} error={getErrorUserMng('phoneNo')} />
						</div>

						<RadioButton id={'gender'} required={true} checked={formik.values.gender} onChange={formik.handleChange} error={getErrorUserMng('gender')} name={'gender'} radioOptions={GENDER_DRP1} label={t('Gender')} />
					</div>
				</div>
				<div className='btn-group card-footer'>
					<Button className='btn-primary ' type='submit' label={t('Save')}>
						<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
							<CheckCircle />
						</span>
					</Button>
					<Button className='btn-warning ' onClick={onCancelUser} label={t('Cancel')}>
						<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
							<Cross />
						</span>
					</Button>
				</div>
			</form>
		</div>
	);
};
export default AddEditUser;
