import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { AcceptedFileSize, AcceptedImageFileType, IMAGE_BASE_URL, ROUTES, SETTINGS_RADIO_SIDEBAR_OPTIONS } from '@config/constant';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@components/button/button';
import { GET_SETTINGS_BY_ID, UPDATE_SETTINGS } from '@framework/graphql/mutations/settings';
import { CreateSettings } from '@type/settings';
import { CountryDataArr, SettingsDataArr } from '@framework/graphql/graphql';
import { CheckCircle, Cross } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import TextInput from '@components/textinput/TextInput';
import { translationFun, uploadFile, whiteSpaceRemover } from '@utils/helpers';
import TextArea from '@components/textarea/TextArea';
import RadioButton from '@components/radiobutton/radioButton';
import EncryptionFunction from '@services/encryption';
import DecryptionFunction from '@services/decryption';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import { Loader } from '@components/index';
import DropDown from '@components/dropdown/dropDown';
import { FETCH_COUNTRY_CODE } from '@framework/graphql/queries/country';
import DeleteFoldersComponent from '@components/deleteFolders/deleteFolders';

const Settings = (): ReactElement => {
	const { t } = useTranslation();
	const [logoPreview, setLogoPreview] = useState<string>('');
	const [faviconPreview, setFaviconPreview] = useState<string>('');
	const { data, refetch } = useQuery(GET_SETTINGS_BY_ID, { fetchPolicy: 'network-only' });
	const [updateSettings, { loading: updateLoader }] = useMutation(UPDATE_SETTINGS);
	const navigate = useNavigate();
	const { addSettingValidationSchema } = useValidation();
	const [showChangeProfileTextLogo, setShowChangeProfileTextLogo] = useState<boolean>(false); // Add state to control the visibility of the "Change Profile" text
	const [showChangeProfileTextFavicon, setShowChangeProfileTextFavicon] = useState<boolean>(false);
	const initialValues: CreateSettings = {
		siteName: '',
		tagLine: '',
		supportEmail: '',
		contactEmail: '',
		contactNo: '',
		appLanguage: '',
		address: '',
		logo: '',
		favicon: '',
		sidebarShowType: '0',
		contactNoContryId: '',
		allowMultipleLogin: 'true',
		abuseThreshold: '',
	};

	const { refetch: fetchCountryCode } = useQuery(FETCH_COUNTRY_CODE, { skip: true });
	const [countryCode, setCountryCode] = useState<string[]>([]);
	/**
	 * Method thatfetchs the settings data on first rendering
	 */
	useEffect(() => {
		fetchCountryCode({ isAll: true, status: 1 })
			.then((res) => {
				if (res?.data?.fetchCountries?.meta?.statusCode === 200) {
					setCountryCode(
						res?.data?.fetchCountries?.data?.Countrydata?.map((mappedSelectedCountryCode: CountryDataArr) => {
							return { name: mappedSelectedCountryCode?.phone_code, key: mappedSelectedCountryCode?.id };
						})
					);
				}
			})
			.catch(() => {
				return;
			});
	}, []);
	/**
	 * Method that sets fav icon and logo after gfetting data from api call
	 */
	useEffect(() => {
		const idLocal = localStorage.getItem('sidebarShowType') as string;
		const id = idLocal && DecryptionFunction(idLocal);
		if (data?.getSettingDetails?.data) {
			id && formik.setFieldValue('sidebarShowType', id);
			data?.getSettingDetails?.data.forEach((mappedSettingsData: SettingsDataArr) => {
				if (mappedSettingsData.key != 'logo' || 'favicon') {
					formik.setFieldValue(
						mappedSettingsData.key.toLowerCase().replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', '')),
						mappedSettingsData.value
					);
				}
				if (mappedSettingsData.key == 'logo') {
					setLogoPreview(`${IMAGE_BASE_URL}/${mappedSettingsData.filePath.original_file}`);
				}
				if (mappedSettingsData.key == 'favicon') {
					setFaviconPreview(`${IMAGE_BASE_URL}/${mappedSettingsData.filePath.original_file}`);
				}
			});
		}
	}, [data?.getSettingDetails]);

	const formik = useFormik({
		initialValues,
		validationSchema: addSettingValidationSchema,
		onSubmit: async (values) => {
			localStorage.removeItem('sidebarShowType');
			if (typeof values.logo !== 'string') {
				uploadFile([{ name: 'logo', content: values?.logo }], '/settings/upload/logo');
			}
			if (typeof values.favicon !== 'string') {
				uploadFile([{ name: 'favicon', content: values?.favicon }], '/upload/favicon');
			}
			localStorage.setItem('sidebarShowType', EncryptionFunction(values.sidebarShowType as string));
			updateSettings({
				variables: {
					siteName: values.siteName,
					tagLine: values.tagLine,
					supportEmail: values.contactEmail,
					contactEmail: values.contactEmail,
					contactNoContryId: +values.contactNoContryId,
					contactNo: values.contactNo,
					appLanguage: values.appLanguage,
					address: values.address,
					allowMultipleLogin: JSON.parse(values.allowMultipleLogin),
					abuseThreshold: +values.abuseThreshold,
				},
			}).then((res) => {
				const data = res?.data?.updateSetting;
				if (data?.meta?.statusCode === 200) {
					toast.success(data?.meta?.message);
					refetch().catch(() => {
						toast.error('Error while fetching');
					});
					onCancel();
				}
			});
		},
	});
	/**
	 * Method that redirects to dashboard
	 */
	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
	}, []);
	/**
	 * Handle'd image validation
	 */
	const handleLogo = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && file.size <= AcceptedFileSize['fileSize'] && (file.type === AcceptedImageFileType['image/jpeg'] || file.type === AcceptedImageFileType['image/jpg'] || file.type === AcceptedImageFileType['image/png'])) {
			formik.setFieldValue('logo', file);
			setLogoPreview(URL.createObjectURL(file));
		} else {
			formik.setFieldError('logo', 'File must be (jpeg/jpg/png) and File size must be 2MB or below');
			toast.error('File must be (jpeg/jpg/png) and File size must be 2MB or below');
		}
	}, []);
	/**
	 * Handle'd image validation
	 */
	const handleFavicon = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && file.size <= AcceptedFileSize['fileSize'] && (file.type === AcceptedImageFileType['image/jpeg'] || file.type === AcceptedImageFileType['image/jpg'] || file.type === AcceptedImageFileType['image/png'])) {
			formik.setFieldValue('favicon', file);
			setFaviconPreview(URL.createObjectURL(file));
		} else {
			formik.setFieldError('favicon', 'File must be (jpeg/jpg/png) and File size must be 2MB or below');
			toast.error('File must be (jpeg/jpg/png) and File size must be 2MB or below');
		}
	}, []);
	//Hover effect on the files

	const handleMouseEnterLogo = () => {
		setShowChangeProfileTextLogo(true);
	};
	const handleMouseEnterFavicon = () => {
		setShowChangeProfileTextFavicon(true);
	};

	const handleMouseLeaveLogo = () => {
		setShowChangeProfileTextLogo(false);
	};
	const handleMouseLeaveFavicon = () => {
		setShowChangeProfileTextFavicon(false);
	};

	function handleContactNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
		// Remove all non-digit characters from the input
		const input = event.target.value;
		const digitsOnly = input.replace(/\D/g, '');
		const trimmedNumericValue = digitsOnly.slice(0, 10);
		formik.setFieldValue('contactNo', trimmedNumericValue);
	}
	/**
	 * Handle blur that removes white space's
	 */
	const OnBlurSetting = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
	/**
	 * Handle multiple login switch
	 */
	const toggleAllowMultipleLogin = () => {
		switch (formik.values.allowMultipleLogin) {
			case 'true':
				formik.setFieldValue('allowMultipleLogin', 'false'); // Update formik value
				break;
			case 'false':
				formik.setFieldValue('allowMultipleLogin', 'true'); // Update formik value
				break;
			default:
				break;
		}
	};
	/**
	 * Error message handler
	 * @param fieldName
	 * @returns
	 */
	const getErrorSettingsPage = (fieldName: keyof CreateSettings) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	return (
		<div className='card'>
			{updateLoader && <Loader />}
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='flex flex-col sm:flex-row mb-4 md:justify-between sm:items-center'>
						<h4 className='font-medium text-h3 text-dark-gary-1 mb-2 sm:mb-0'>{t('General Settings')}</h4>
						<p className='text-gray-700 sm:pl-4'>
							{t('Fields marked with')} <span className='text-red-500'>*</span> {t('are mandatory.')}
						</p>
					</div>

					<div className=' card-grid-addedit-page md:grid-cols-2 border-t border-gray-200 pt-4'>
						<div>
							<TextInput id={'siteName'} required={true} placeholder={t('Site Name')} name='siteName' onChange={formik.handleChange} label={t('Site Name')} value={formik.values.siteName} error={getErrorSettingsPage('siteName')} onBlur={OnBlurSetting} />
						</div>
						<div>
							<TextInput id={'tagLine'} required={true} placeholder={t('Tag Line')} name='tagLine' onChange={formik.handleChange} label={t('Tag Line')} value={formik.values.tagLine} error={getErrorSettingsPage('tagLine')} onBlur={OnBlurSetting} />
						</div>
						<div>
							<TextInput id={'supportEmail'} required={true} placeholder={t('Support Email')} name='supportEmail' onChange={formik.handleChange} label={t('Support Email')} value={formik.values.supportEmail} error={getErrorSettingsPage('supportEmail')} onBlur={OnBlurSetting} />
						</div>
						<div>
							<TextInput id={'contactEmail'} required={true} placeholder={t('Contact Email')} name='contactEmail' onChange={formik.handleChange} label={t('Contact Email')} value={formik.values.contactEmail} error={getErrorSettingsPage('contactEmail')} onBlur={OnBlurSetting} />
						</div>
						<div className='relative settings-phonecode-dropdown'>
							<TextInput id={'contactNo'} required={true} placeholder={t('Contact Number')} name='contactNo' onChange={handleContactNumberChange} label={t('Contact Number')} value={formik.values.contactNo} error={getErrorSettingsPage('contactNo')} onBlur={OnBlurSetting} />

							<DropDown ariaLabel='Country Code' className='absolute top-7 w-16  ' placeholder={t('+')} name='contactNoContryId' onChange={formik.handleChange} value={formik.values.contactNoContryId} options={countryCode} id='contactNoContryId' />
						</div>
						<TextInput id={'appLanguage'} required={true} placeholder={t('Default Language')} name='appLanguage' onChange={formik.handleChange} label={t('Default Language')} value={formik.values.appLanguage} error={getErrorSettingsPage('appLanguage')} onBlur={OnBlurSetting} />

						<div className='flex flex-col space-y-2 '>
							<TextArea id={'address'} label={t('Address')} placeholder={translationFun('Address')} name='address' aria-label='Address' onChange={formik.handleChange} value={formik.values.address} />
						</div>
						<div className=' flex  space-x-2 md:flex-row'>
							<RoleBaseGuard permissions={['REMOVE_SETTINGS_LOGO']}>
								<div className='flex flex-col w-1/2'>
									<div className='flex justify-start'>
										<label htmlFor='logo' className='block text-gray-700 text-sm font-normal mb-2'>
											{translationFun('Logo')}
										</label>
									</div>
									<div aria-label='logo' aria-hidden='true'
										className='flex items-center justify-center w-wide-5 h-rise-5 box-border'
										onMouseEnter={handleMouseEnterLogo} // Add mouse enter event handler
										onMouseLeave={handleMouseLeaveLogo} // Add mouse leave event handler
									>
										<label
											htmlFor='logo'
											className='flex flex-col items-center justify-center w-wide-5 h-rise-5 border border-gray-300 border-dashed rounded-sm cursor-pointer bg-gray-50   hover:bg-gray-100    relative' // Added 'relative' class here
										>
											<div className='flex flex-col items-center justify-center w-full h-full'>
												<img src={logoPreview} alt='Logo' className='object-fill w-full' />
											</div>
											<input id='logo' type='file' onChange={handleLogo} className='hidden' accept='image/jpg,image/png,image/jpeg' />
											{showChangeProfileTextLogo && ( // Show the text when showChangeProfileText is true
												<div className='text-white absolute bottom-0 left-0 w-full bg-primary  text-center p-2'>{t('Change ')}</div>
											)}
										</label>
									</div>
								</div>
							</RoleBaseGuard>
							<RoleBaseGuard permissions={['REMOVE_SETTINGS_FAVICON']}>
								<div className='flex flex-col w-1/2'>
									<div className='flex justify-start'>
										<label htmlFor='favicon' className='block text-gray-700 text-sm font-normal mb-2'>
											{translationFun('Favicon')}
										</label>
									</div>
									<div aria-label='fav-icon' aria-hidden='true'
										className='flex items-center justify-center w-wide-5 h-rise-5 box-border'
										onMouseEnter={handleMouseEnterFavicon} // Add mouse enter event handler
										onMouseLeave={handleMouseLeaveFavicon} // Add mouse leave event handler
									>
										<label
											htmlFor='favicon'
											className='flex flex-col items-center justify-center w-wide-5 h-rise-5 border border-gray-300 border-dashed rounded-sm cursor-pointer bg-gray-50   hover:bg-gray-100    relative' // Added 'relative' class here
										>
											<div className='flex flex-col items-center justify-center w-full h-full'>
												<img src={faviconPreview} alt='Favicon' className='object-fill w-full ' />
											</div>
											<input id='favicon' type='file' onChange={handleFavicon} accept='image/jpg,image/png,image/jpeg' className='hidden' />

											{showChangeProfileTextFavicon && ( // Show the text when showChangeProfileText is true
												<div className='text-white absolute bottom-0 left-0 w-full bg-primary  text-center p-2'>{t(' Change ')}</div>
											)}
										</label>
									</div>
								</div>
							</RoleBaseGuard>
						</div>
						<div className='flex items-center'>
							<div className='flex flex-col md:flex-row'>
								<span className=' text-gray-700 text-sm font-normal mb-2 md:mb-0'>{t('Allow Multiple Login')}</span>
								<label htmlFor='multipleLogin' className='relative inline-flex cursor-pointer md:ml-6'>
									<input id='multipleLogin' type='checkbox' onChange={toggleAllowMultipleLogin} className='sr-only peer' value={`${formik.values.allowMultipleLogin}`} checked={formik.values.allowMultipleLogin === 'true'} aria-label='Toggle multiple login' />
									<div className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-primary  rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-primary"></div>
								</label>
							</div>
						</div>

						<div className='relative'>
							<TextInput id='abuseThreshold' required={true} type='number' placeholder={t('Abuse Threshold')} name='abuseThreshold' onChange={formik.handleChange} label={t('Abuse Threshold')} value={formik.values.abuseThreshold} error={formik.errors.abuseThreshold && formik.touched.abuseThreshold ? formik.errors.abuseThreshold : ''} onBlur={OnBlurSetting} />
						</div>

						<RadioButton id='sidebarShowHide' required={true} checked={formik.values.sidebarShowType} onChange={formik.handleChange} name={'sidebarShowType'} radioOptions={SETTINGS_RADIO_SIDEBAR_OPTIONS} label={t('Sidebar Show Type')} />
						<DeleteFoldersComponent />
					</div>
				</div>
				<RoleBaseGuard permissions={[PERMISSION_LIST.Settings.EditAccess]}>
					<div className='card-footer btn-group '>
						<Button type='submit' className='btn-primary ' label={t('Update')}>
							<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
								<CheckCircle />
							</span>
						</Button>
						<Button label={t('Cancel')} className='btn-warning ' onClick={onCancel}>
							<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
								<Cross />
							</span>
						</Button>
					</div>
				</RoleBaseGuard>
			</form>
		</div>
	);
};
export default Settings;
