import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { GetDefaultIcon, CheckCircle, Refresh, Search, Cross, AngleUp, AngleDown } from '@components/icons/icons';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { createAnnouncementRes, UserData, UserDataType } from '@framework/graphql/graphql';
import { useNavigate, useParams } from 'react-router-dom';
import { ACCEPTED_FILETYPE_IN_ANNOUNCMENT, ANNOUCEMENTTYPE, ANNOUNCEMENT_RADIO_PLATFORM_LIST, ANNOUNCEMENT_RADIO_TYPE_LIST, ANNOUNCEMENT_RADIO_USER_FILTER_OPTIONS, ANNOUNCEMENT_RADIO_USER_TYPE_LIST, ANNOUNCEMENT_TYPE_LIST, AccesibilityNames, DATE_FORMAT, DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, SHOW_PAGE_COUNT_ARR, USERFILTERTYPE, sortBy, sortOrder } from '@config/constant';
import { CREATE_ANNOUNCEMENT } from '@framework/graphql/mutations/announcement';
import { CreateAnnouncement, PaginationParams } from 'src/types/announcement';
import { GET_USER } from '@framework/graphql/queries/announcement';
import Button from '@components/button/button';
import TextInput from '@components/textinput/TextInput';
import CkEditor from '@components/ckEditor/ckEditor';
import useValidation from '@src/hooks/validations';
import RadioButton from '@components/radiobutton/radioButton';
import { getDateFromat, whiteSpaceRemover, uploadFile } from '@utils/helpers';
import Pagination from '@components/Pagination/Pagination';
import WithTranslateFormErrors from '@components/customHooks/useTranslationFormErrors';
import DatePicker from '@components/datapicker/datePicker';
import TextArea from '@components/textarea/TextArea';
import { Loader } from '@components/index';
import { IColumnsProps } from '@components/BVDatatable/DataTable';

const Addannouncement = (): ReactElement => {
	const { t } = useTranslation();
	const [createAnnouncement, { loading }] = useMutation(CREATE_ANNOUNCEMENT);
	const [userData, setUserData] = useState({} as UserDataType);
	const [usertoexcludestate, setUsertoexcludestate] = useState<number[]>([]);
	const [onlysend, setOnlysend] = useState<number[]>([]);
	const [selectAllUserToExclude, setSelectAllUserToExclude] = useState<boolean>(false);
	const [selectAllOnlySendTo, setSelectAllOnlySendTo] = useState<boolean>(false);
	const { addAnnouncementValidationSchema } = useValidation();
	const navigate = useNavigate();
	const params = useParams();
	const [imagePreview, setImagePreview] = useState<string>('');
	const [filterData, setFilterData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: sortBy,
		sortOrder: sortOrder,
		fullName: '',
	});
	const COL_ARR = [
		{ name: t('First Name'), sortable: true, fieldName: 'first_name' },
		{ name: t('Email'), sortable: true, fieldName: 'email' },
		{ name: t('Registration At'), sortable: true, fieldName: 'created_at' },
	] as IColumnsProps[];
	const [searchWord, setSearchWord] = useState('');
	const initialValues: CreateAnnouncement = {
		title: '',
		announcementType: ANNOUCEMENTTYPE.zero,
		status: '',
		description: '',
		pushImage: '',
		platform: 'all',
		userType: 'all',
		userFilter: 'all',
		startDate: '',
		endDate: '',
		userToExclude: [],
		onlySendTo: [],
	};

	const handleSelectAlllist = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setSelectAllOnlySendTo(e.target.checked);
			setOnlysend(() => {
				return userData?.userList?.map((data: UserData) => data?.id) || [];
			});
		} else {
			setSelectAllOnlySendTo(false);
			setOnlysend([]);
		}
	};

	const handleSelectAllAnnounce = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setSelectAllUserToExclude(e.target.checked);
			setUsertoexcludestate(() => {
				return userData?.userList?.map((data: UserData) => data?.id) || [];
			});
		} else {
			setSelectAllUserToExclude(false);
			setUsertoexcludestate([]);
		}
	};

	const uploadFileAnnouncement = async (announcementId: string, value: File) => {
		await uploadFile(
			[
				{ name: 'announcement', content: value },
				{ name: 'announcementId', content: announcementId },
			],
			'/announcement/announcement-img'
		);
		formik.resetForm();
		onCancel();
	};
	const formik = useFormik({
		initialValues,
		validationSchema: addAnnouncementValidationSchema,
		onSubmit: async (values) => {
			createAnnouncement({
				variables: {
					title: values?.title,
					annoucemntType: ANNOUNCEMENT_TYPE_LIST[values?.announcementType],
					description: values?.description,
					platform: values?.platform,
					userType: values?.userType,
					userFilter: values?.userFilter,
					startDate: getDateFromat(values.startDate?.toString(), DATE_FORMAT.simpleDateFormat),
					endDate: getDateFromat(values.endDate?.toString(), DATE_FORMAT.simpleDateFormat),
					userToExclude: usertoexcludestate,
					onlySendTo: onlysend,
				},
			})
				.then((res) => {
					const data = res.data as createAnnouncementRes;
					if (data.createAnnouncement.meta.statusCode === 200) {
						toast.success(data.createAnnouncement.meta.message);
						if (values.pushImage && values.pushImage instanceof File) {
							uploadFileAnnouncement(data?.createAnnouncement?.data?.uuid, values?.pushImage as File);
						}
						onCancel();
					}
				})
				.catch(() => {
					return;
				});
		},
	});

	const { refetch: getUserData } = useQuery(GET_USER, {
		variables: {
			...filterData,
		},
		skip: true,
		fetchPolicy: 'network-only',
	});

	const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
	const totalRuleSets = userData?.count;
	const totalPages = Math.ceil(totalRuleSets / recordsPerPage);
	/**
	 * Handle's page chnage
	 */
	const handlePageChangeAddAnnouncement = useCallback(
		(newPage: number): void => {
			const updatedFilterData = {
				...filterData,
				page: newPage,
			};
			setSelectAllOnlySendTo(false);
			setSelectAllUserToExclude(false);
			setFilterData(updatedFilterData);
			setOnlysend([]);
			setUsertoexcludestate([]);
			getUserData(updatedFilterData)
				.then((res) => {
					if (res?.data?.fetchUsers?.meta?.statusCode === 200) {
						setUserData(res?.data?.fetchUsers?.data);
					}
				})
				.catch(() => {
					return;
				});
		},
		[filterData]
	);

	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.announcement}/list`);
	}, []);

	/**
	 * Used for refetch listing of user data after filter
	 */
	useEffect(() => {
		if (formik.values.userFilter === USERFILTERTYPE.userToExclude || formik.values.userFilter === USERFILTERTYPE.onlySendTo) {
			setSelectAllOnlySendTo(false);
			setSelectAllUserToExclude(false);
			setUsertoexcludestate([]);
			setOnlysend([]);
			getUserData(filterData)
				.then((res) => {
					if (res?.data?.fetchUsers?.meta?.statusCode === 200) {
						setUserData(res?.data?.fetchUsers?.data);
					}
				})
				.catch(() => {
					return;
				});
		}
	}, [formik.values.userFilter]);
	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSortAnnouncement = useCallback(
		(sortFieldName: string) => {
			setOnlysend([]);
			setSelectAllOnlySendTo(false);
			setSelectAllUserToExclude(false);
			setUsertoexcludestate([]);
			setFilterData({
				...filterData,
				sortBy: sortFieldName,
				sortOrder: filterData.sortOrder === 'asc' ? 'desc' : 'asc',
			});
		},
		[filterData]
	);

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */
	const onPageDrpSelectAnnouncement = (e: string) => {
		setRecordsPerPage(Number(e));
		setSelectAllOnlySendTo(false);
		setSelectAllUserToExclude(false);
		setOnlysend([]);
		setUsertoexcludestate([]);
		const updatedFilterData = {
			...filterData,
			limit: parseInt(e),
			page: 1,
		};
		setFilterData(updatedFilterData);
	};
	useEffect(() => {
		if (filterData) {
			getUserData(filterData)
				.then((res) => {
					if (res?.data?.fetchUsers?.meta?.statusCode === 200) {
						setUserData(res?.data?.fetchUsers?.data);
					}
				})
				.catch(() => {
					return;
				});
		}
	}, [filterData]);

	const handleUserTo = (data: { id: number }) => {
		setSelectAllUserToExclude(true);
		if (usertoexcludestate.includes(data.id)) {
			const userData = usertoexcludestate.filter((i) => i !== data.id);
			setUsertoexcludestate(userData);
		} else {
			setUsertoexcludestate((prev) => [...prev, data.id]);
		}
	};
	const handleOnlySendTo = (data: { id: number }) => {
		setSelectAllOnlySendTo(true);
		if (onlysend.includes(data.id)) {
			const userData = onlysend.filter((i) => i !== data.id);
			setOnlysend(userData);
		} else {
			setOnlysend((prev) => [...prev, data.id]);
		}
	};
	useEffect(() => {
		handleResetImage();
	}, [formik.values.announcementType]);

	const handleChangeBannerImage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] as File;
		if (file && file.size <= 2000000 && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
			formik.setFieldValue('pushImage', file);
			setImagePreview(URL.createObjectURL(file));
		} else {
			toast.error(`${!['image/jpeg', 'image/jpg', 'image/png'].includes(file?.type) ? 'Please select jpg/jpeg/png file.' : ''} ${file?.size > 2000000 ? 'File size must be 2MB or below' : ''}`);
		}
	}, []);

	const [selectedImage, setSelectedImage] = useState<string>('');

	const handleResetImage = useCallback(() => {
		setImagePreview('');
		setSelectedImage('');
		formik.setFieldValue('pushImage.name', ''); // Reset pushImage.name to an empty string
		const fileInput = document.getElementById('image') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	}, [imagePreview, selectedImage]);

	const onSearch = useCallback(() => {
		const updateFilterData = {
			...filterData,
			fullName: searchWord.toLowerCase(),
		};
		setFilterData(updateFilterData);
		getUserData(updateFilterData)
			.then((res) => {
				if (res?.data?.fetchUsers?.meta?.statusCode === 200) {
					setUserData(res?.data?.fetchUsers?.data);
				}
			})
			.catch(() => {
				return;
			});
	}, [filterData, searchWord]);

	const onReset = useCallback(() => {
		// Clear the search term and reset the search results
		setSearchWord('');
		setFilterData({ ...filterData, fullName: '' });
		getUserData({ ...filterData, fullName: '' })
			.then((res) => {
				if (res?.data?.fetchUsers?.meta?.statusCode === 200) {
					setUserData(res?.data?.fetchUsers?.data);
				}
			})
			.catch(() => {
				return;
			});
	}, [filterData]);

	useEffect(() => {
		if (usertoexcludestate.length === userData?.userList?.length) {
			setSelectAllUserToExclude(false);
		}
		if (onlysend.length === userData?.userList?.length) {
			setSelectAllOnlySendTo(false);
		}
	}, [usertoexcludestate, onlysend]);

	const OnBlurAnn = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
	//CkEditor onChange Function
	const onChange = useCallback((e: string) => {
		formik.setFieldValue('description', e);
	}, []);
	/**
	 * Method that sets total number of records to show
	 */
	useEffect(() => {
		setRecordsPerPage(filterData.limit);
	}, [filterData.limit]);
	const onSearchTerm = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchWord(e.target.value);
	}, []);
	const getErrorAnnouncement = (fieldName: keyof CreateAnnouncement) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	const LABEL_BASED_ON_ANNOUNCEMENT_TYPE: { [key: string]: string } = {
		'0': 'Email Attachment',
		'1': 'Push Image',
	};
	const HTML_BASED_ON_ANNOUNCEMENT_TYPE: { [key: string]: ReactElement } = {
		'0': <CkEditor value={formik.values.description} onChange={onChange} label={t('Description')} id='ckDescription' error={formik.errors.description && formik.touched.description ? formik.errors.description : ''} required={true} />,
		'1': <TextArea required={true} label={t('Description')} id='Description' placeholder={`${t('Description')}`} name='description' onChange={formik.handleChange} value={formik.values.description} onBlur={OnBlurAnn} error={getErrorAnnouncement('description')}></TextArea>,
		'2': <TextArea required={true} label={t('Description')} id='Description' placeholder={`${t('Description')}`} name='description' onChange={formik.handleChange} value={formik.values.description} onBlur={OnBlurAnn} error={getErrorAnnouncement('description')}></TextArea>,
	};
	useEffect(() => {
		formik.setFieldValue('description', '');
	}, [formik.values.announcementType]);

	return (
		<div className='card'>
			{loading && <Loader />}
			<WithTranslateFormErrors errors={formik.errors} touched={formik.touched} setFieldTouched={formik.setFieldTouched}>
				<form onSubmit={formik.handleSubmit}>
					<div className='card-body'>
						<div className='card-title-container'>
							<p>
								{t('Fields marked with')} <span className='text-red-500'>*</span> {t('are mandatory.')}
							</p>
						</div>
						<div className='card-grid-addedit-page md:grid-cols-2 '>
							<div>
								<TextInput id='title' placeholder={t('Title')} name='title' onChange={formik.handleChange} onBlur={OnBlurAnn} label={t('Title')} value={formik.values.title} error={getErrorAnnouncement('title')} required={true} />
							</div>

							<RadioButton id='announcementType' required={true} checked={formik.values.announcementType} onChange={formik.handleChange} name={'announcementType'} radioOptions={ANNOUNCEMENT_RADIO_TYPE_LIST} label={t('Type')} error={getErrorAnnouncement('announcementType')} />

							<div className='col-span-1 md:col-span-2'>{HTML_BASED_ON_ANNOUNCEMENT_TYPE[formik.values.announcementType]}</div>
							<div className='col-span-1 md:col-span-2'>
								{formik.values.announcementType !== ANNOUCEMENTTYPE.two && (
									<>
										<label htmlFor='image' className='inline-block font-normal text-sm  mb-3 text-gray-700'>
											{t(LABEL_BASED_ON_ANNOUNCEMENT_TYPE[formik.values.announcementType])}
										</label>
										<div className='flex flex-wrap'>
											<div className='flex flex-wrap justify-start mb-4  '>
												<div className='sm:min-w-96 mr-3.5 max-w-full mb-4'>
													<label htmlFor='image' className="after:content-['Browse'] after:text-black-500  after:bg-slate-200 block text-sm font-normal p-2 border border-solid h-9 w-full relative after:top-3px after:right-0 rounded after:bottom-0 mr-28 after:absolute after:ml-2  after:border after:h-9  after:inline-flex after:items-center after:p-2 ">
														{t('Choose file')}
													</label>
													<input type='file' id='image' name='image' accept={ACCEPTED_FILETYPE_IN_ANNOUNCMENT[formik.values.announcementType]} value={selectedImage} onChange={handleChangeBannerImage} hidden />
												</div>
												<div className='px-3.5'>
													<Button className='btn-pink ' onClick={handleResetImage} label={t('Reset')}>
														<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
															<Refresh />
														</span>
													</Button>
												</div>
												{formik.values.announcementType === ANNOUCEMENTTYPE.zero && formik.values.pushImage && <div className={`flex items-center text-center ${formik.touched.pushImage ? 'px-8' : ''}`}> {(formik.values.pushImage as File).name} </div>}
											</div>
											{formik.values.announcementType === ANNOUCEMENTTYPE.one && imagePreview && !formik.errors.pushImage && (
												<div className='flex h-rise-6 w-wide-8 mb-4 px-3.5'>
													<img src={imagePreview} alt='Preview' className='object-fill  w-full aspect-auto rounded-md ' />
												</div>
											)}
										</div>
									</>
								)}
							</div>
						</div>

						<div className=' w-full md:w-auto bg-white  rounded-sm mb-5 border border-b-color-4'>
							<div className='bg-bg-1 py-3 px-5 flex items-center justify-between border-b border-b-color-4'>
								<div className='flex items-center'>
									<span className='text-sm font-normal'>{t('Filter')}</span>
								</div>
							</div>

							<div className='w-full grid grid-cols-1 lg:grid-cols-2  gap-y-4 p-5 '>
								<RadioButton label={t('Platform')} id='platform' name='platform' checked={formik.values.platform} radioOptions={ANNOUNCEMENT_RADIO_PLATFORM_LIST} onChange={formik.handleChange} />

								<RadioButton label={t('User Type')} id='userType' name='userType' checked={formik.values.userType} radioOptions={ANNOUNCEMENT_RADIO_USER_TYPE_LIST} onChange={formik.handleChange} />

								<RadioButton label={t('Advanced Filters')} id='advancedFilter' name='userFilter' checked={formik.values.userFilter} radioOptions={ANNOUNCEMENT_RADIO_USER_FILTER_OPTIONS} onChange={formik.handleChange} />

								<div>
									<div className='mt-3 flex gap-4 flex-row [&>div]:w-full [&>div]:sm:w-12/12 flex-wrap sm:flex-nowrap'>
										<DatePicker required={true} id='startDate' placeholder={t('Start Date') ?? ''} name='startDate' onChange={formik.handleChange} label={t('Start Date')} value={formik.values.startDate} />

										<DatePicker required={true} id='endDate' placeholder={t('End Date') ?? ''} name='endDate' onChange={formik.handleChange} label={t('End Date')} value={formik.values.endDate} />
									</div>
								</div>
							</div>

							{(formik.values.userFilter === USERFILTERTYPE.userToExclude || formik.values.userFilter === USERFILTERTYPE.onlySendTo) && (
								<>
									<div className='grid grid-cols-1 md:grid-cols-2 l:grid-cols-4 gap-6 p-5 pt-0 '>
										<TextInput type='text' id='table-search' value={searchWord} placeholder={t('Search...')} onChange={onSearchTerm} />
										<div className='btn-group  '>
											<Button className='btn-primary ' type='button' label={t('Search')} onClick={onSearch}>
												<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
													<Search />
												</span>
											</Button>
											<Button className='btn-warning ' label={t('Reset')} onClick={onReset}>
												<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
													<Refresh />
												</span>
											</Button>
										</div>
									</div>

									<p className='mb-4 px-5 text-gray-700'>
										<span className='text-red-500'> *</span>
										{formik.values.userFilter === USERFILTERTYPE.userToExclude ? t('notification will be sent to users excepted selected') : t('notification will be sent to selected users only')}
									</p>

									<div className='card-body'>
										<div className='flex items-center justify-between'>
											<div className='table-select-dropdown-container justify-start'>
												<span className='table-select-dropdown-label'>{t('Show')}</span>

												<select aria-label={AccesibilityNames.Entries} className='table-select-dropdown' onChange={(e) => onPageDrpSelectAnnouncement(e.target.value)} value={filterData.limit}>
													{SHOW_PAGE_COUNT_ARR?.map((item: number, index: number) => {
														return <option key={`${index + 1}`}>{item}</option>;
													})}
												</select>
												<span className='table-select-dropdown-label'>{t('entries')}</span>
											</div>
										</div>
										<div className=' overflow-auto custom-datatable '>
											<table>
												<thead>
													<tr>
														<th scope='col' className='text-center'>
															{formik.values.userFilter === USERFILTERTYPE.onlySendTo ? <input type='checkbox' checked={onlysend.length === userData?.userList?.length && !selectAllOnlySendTo} onChange={handleSelectAlllist} disabled={!userData} /> : <input type='checkbox' checked={usertoexcludestate?.length === userData?.userList?.length && !selectAllUserToExclude} onChange={handleSelectAllAnnounce} disabled={!userData} />}
														</th>
														{COL_ARR?.map((ColValAnnouncement) => {
															return (
																<th scope='col' key={ColValAnnouncement.fieldName}>
																	<div className='flex items-center'>
																		{ColValAnnouncement.name}
																		{ColValAnnouncement.sortable && (
																			<button title='sort' onClick={() => onHandleSortAnnouncement(ColValAnnouncement.fieldName)}>
																				{(filterData.sortOrder === '' || filterData.sortBy !== ColValAnnouncement.fieldName) && (
																					<span className='svg-icon inline-block ml-1 w-3 h-3'>
																						<GetDefaultIcon />
																					</span>
																				)}
																				{filterData.sortOrder === 'asc' && filterData.sortBy === ColValAnnouncement.fieldName && <AngleUp />}
																				{filterData.sortOrder === 'desc' && filterData.sortBy === ColValAnnouncement.fieldName && <AngleDown />}
																			</button>
																		)}
																	</div>
																</th>
															);
														})}
													</tr>
												</thead>

												<tbody>
													{userData?.userList?.map((announcementData) => {
														return (
															<tr key={announcementData.id}>
																{formik.values.userFilter === USERFILTERTYPE.userToExclude && (
																	<td className='text-center'>
																		<input type='checkbox' checked={!!usertoexcludestate.includes(announcementData.id)} onClick={() => handleUserTo(announcementData)} />{' '}
																	</td>
																)}

																{formik.values.userFilter === USERFILTERTYPE.onlySendTo && (
																	<td className='text-center'>
																		<input type='checkbox' checked={!!onlysend.includes(announcementData.id)} onClick={() => handleOnlySendTo(announcementData)} />
																	</td>
																)}

																<td>{announcementData.first_name + ' ' + announcementData.last_name}</td>

																<td>{announcementData.email}</td>
																<td>{`${getDateFromat(announcementData.created_at, DATE_FORMAT.momentDateTime24Format)} `}</td>
															</tr>
														);
													})}
												</tbody>
											</table>
											{!userData?.userList && (
												<div className='no-data'>
													<div>{t('No Data')}</div>
												</div>
											)}
										</div>

										<div className='datatable-footer'>
											<div className='datatable-total-records'>
												{userData ? `${userData?.count}` : 0}
												<span className='ml-1'>{t(' Total Records')}</span>
											</div>
											<Pagination currentPage={filterData.page} totalPages={totalPages} onPageChange={handlePageChangeAddAnnouncement} recordsPerPage={recordsPerPage} />
										</div>
									</div>
								</>
							)}
						</div>
					</div>
					<div className='card-footer btn-group'>
						<Button type='submit' className='btn-primary ' label={params.id ? t('Update') : t('Save')}>
							<span className='text-white mr-1 w-3.5 h-3.5 inline-block'>
								<CheckCircle />
							</span>
						</Button>
						<Button className='btn-warning ' label={t('Cancel')} onClick={onCancel}>
							<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
								<Cross />
							</span>
						</Button>
					</div>
				</form>
			</WithTranslateFormErrors>
		</div>
	);
};

export default Addannouncement;
