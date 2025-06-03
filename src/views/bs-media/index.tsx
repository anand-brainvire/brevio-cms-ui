import { useMutation, useQuery } from '@apollo/client';
import Button from '@components/button/button';
import { Audio, Back, BannerIcon, Category, ClipBoardIcon, Cross, Directory, Document, Download, EyeCrossed, FolderView, Move, PlusCircle, RecycleIcon, Refresh, SelectBoxArrowLeft, SelectBoxArrowRight, Trash, VideoRecorder } from '@components/icons/icons';
import { BsMediadataArr, DeleteBsMediaRes } from '@framework/graphql/graphql';
import { FETCH_BS_MEDIA } from '@framework/graphql/queries/bsMedia';
import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BsMediaListItem from '@views/bs-media/bsMediaListItem';

import { toast } from 'react-toastify';
import { ACTIVE_FILE_TYPE, DELETE_WARING_TEXT, FILE_TYPE, MODEL_TYPE, addNewBsMediaConstant, bsMediaNavTabs, sortBy, sortOrder } from '@config/constant';
import { PaginationParams, filterBsMediaProps } from '@type/bsMedia';
import FilterBsMediaPage from '@views/bs-media/filterBsMedia';
import { uploadFile } from '@utils/helpers';
import BsMediaViewDetails from '@views/bs-media/bsMediaViewDetails';
import AddNewBsmedia from '@views/bs-media/addNewBsMedia';
import CommonModel from '@components/common/commonModel';
import { DELETE_BS_MEDIA } from '@framework/graphql/mutations/bsMedia';
import { OptionsPropsForButton } from '@type/component';
import NavtabsBsMedia from '@views/bs-media/navTabsBsMedia';
import RoleBaseGuard from '@components/roleGuard';
import { Loader } from '@components/index';
import { PERMISSION_LIST } from '@config/permission';

const BsMedia = (): ReactElement => {
	const { t } = useTranslation();
	const [deleteBsMedia, { loading: deleteLoader }] = useMutation(DELETE_BS_MEDIA);
	const [isViewFolder, setIsViewFolder] = useState<boolean>(false);
	const [isViewDetails, setIsViewDetails] = useState<boolean>(false);
	const [filterData, setFilterData] = useState<PaginationParams>({ search: '', sortBy: sortBy, sortOrder: sortOrder, parentId: null, fileType: null });
	const { data, refetch: RefetchBsMedia, loading } = useQuery(FETCH_BS_MEDIA, { variables: { ...filterData }, fetchPolicy: 'network-only' });
	const [file, setFile] = useState<File | null>(null);
	const [isSelected, setIsSelected] = useState<boolean>(false);
	const [bsMediaSelectedDataObj, setBsMediaSelectedDataObj] = useState<BsMediadataArr | null>(null);
	const [isShowModel, setIsShowModel] = useState<boolean>(false);
	const [previousParentData, setPreviousParentData] = useState<BsMediadataArr | null>(bsMediaSelectedDataObj);
	const [modelType, setModelType] = useState<string>('');
	const [isShowDeleteModel, setIsShowDeleteModel] = useState<boolean>(false);
	const [activeItem, setActiveItem] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<string>('everything');
	const currentWorkingDirectoryPath = useRef<string>('Home');
	const [parentandCurrentManager, setParentandCurrentManager] = useState<{ parent: Array<number | null>; current: number | null }>({ parent: [], current: null });
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [bsMediaListData, setBsMediaListData] = useState([]);
	const navTabsList: { icon: ReactElement; name: string; id: string }[] = [
		{ icon: <RecycleIcon />, name: 'Everything', id: 'everything' },
		{ icon: <BannerIcon />, name: 'Images', id: 'image' },
		{ icon: <VideoRecorder />, name: 'Videos', id: 'video' },
		{ icon: <Audio />, name: 'Audio', id: 'audio' },
		{ icon: <Document />, name: 'Documents', id: 'document' },
	];
	const folderViewHandler = useCallback((): void => {
		setIsViewFolder((prev) => !prev);
	}, [isViewFolder]);

	/** Removes all the data that is saved and refetch the data  */
	const onRefresh = useCallback((): void => {
		let updatedFilterData: PaginationParams = filterData;
		if (modelType === MODEL_TYPE.add) {
			updatedFilterData = {
				...filterData,
				fileType: '',
			};
			setFilterData(updatedFilterData);
			setActiveTab('everything');
			RefetchBsMedia(updatedFilterData).catch((error) => {
				toast.error(error);
			});
		} else {
			RefetchBsMedia(updatedFilterData).catch((error) => {
				toast.error(error);
			});
			if (modelType !== MODEL_TYPE.delete) {
				setBsMediaSelectedDataObj(null);
			}
			setActiveItem(null);
			setIsSelected(false);
		}
	}, [filterData, modelType]);
	/**
	 * Method that refetchs the data if filter data is changed
	 */
	useEffect(() => {
		if (filterData) {
			RefetchBsMedia(filterData).catch((error) => {
				toast.error(error);
			});
		}
	}, [filterData]);

	useEffect(() => {
		if (data?.fetchBsMedia?.data?.BsMediadata) {
			setBsMediaSelectedDataObj(null);
			setBsMediaListData(data?.fetchBsMedia?.data?.BsMediadata);
		}
	}, [data?.fetchBsMedia]);

	/** On search fetchs the data with respective to file values */
	const onSearchBsMedia = useCallback((values: filterBsMediaProps): void => {
		const updatedFilterData = {
			...filterData,
			search: values.search,
			sortBy: values.sortBy,
			sortOrder: values.sortOrder,
		};
		setFilterData(updatedFilterData);
	}, []);

	/** Stores the selected file to upload */
	const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
		if (event?.target?.files && (activeTab === ACTIVE_FILE_TYPE['everything'] || event?.target?.files[0].type.split('/')[0] === ACTIVE_FILE_TYPE[activeTab])) {
			setFile(event?.target?.files[0]);
		} else {
			toast.error(`Please select ${activeTab} file.`);
		}
	};

	/** Upload's file or video or image */
	const upload = async (
		ParentData: {
			parent: Array<number | null>;
			current: number | null;
		},
		file: File | null
	) => {
		if (file) {
			setIsLoading(true);
			await uploadFile(
				[
					{ name: 'file', content: file },
					{ name: 'parent_id', content: ParentData.current?.toString() ?? '' },
				],
				'/bsmedia/create'
			);
			setFile(null);
			setIsLoading(false);
			await RefetchBsMedia(filterData).catch((error) => {
				toast.error(error);
			});
		}
	};

	/** functions calls the upload function */
	const onUpload = useCallback(() => {
		upload(parentandCurrentManager, file);
	}, [previousParentData, file, setIsLoading]);

	const onCancel = useCallback((): void => {
		setFile(null);
	}, []);

	/** Helps to view the details of selected file or folder */
	const onViewDetails = useCallback((): void => {
		setIsViewDetails((prev) => !prev);
	}, []);

	/** On single click it select the file or folder   */
	const handleSelect = useCallback(
		(data: BsMediadataArr): void => {
			setActiveItem(data?.uuid);
			setIsSelected(true);
			setBsMediaSelectedDataObj(data);
			setPreviousParentData(data);
		},
		[isSelected, bsMediaSelectedDataObj, activeItem]
	);

	/** Helps to add new folder */
	const handleAddNew = useCallback((): void => {
		setIsShowModel((prev) => !prev);
		setModelType('add');
	}, []);

	/** On double click and folder it redirect inside of that folder */
	const handleDoubleClick = useCallback(
		(data: number, folderName: string): void => {
			setIsSelected((prev) => !prev);
			currentWorkingDirectoryPath.current += `/${folderName}`;
			const updatedFilterData = {
				...filterData,
				search: '',
				parentId: data,
			};
			setFilterData(updatedFilterData);
			setParentandCurrentManager((prev) => {
				const parent = prev.parent;
				parent.push(prev.current);
				const current = data;
				return { parent: parent, current: current };
			});
		},
		[filterData]
	);

	/** It helps to move back to one folder */
	const handleMoveBack = useCallback(
		(e: React.MouseEvent<HTMLLIElement>) => {
			if (e.detail === 2) {
				const folderPath = currentWorkingDirectoryPath.current.split('/');
				folderPath.splice(-1, 1);
				currentWorkingDirectoryPath.current = folderPath.join('/');
				const updatedFilterData = {
					...filterData,
					parentId: parentandCurrentManager.parent[parentandCurrentManager.parent.length - 1] ?? null,
				};
				setFilterData(updatedFilterData);
				setParentandCurrentManager((prev) => {
					const parent = prev.parent;
					const current = parent.pop() ?? null;
					return { parent: parent, current: current };
				});
				setActiveItem(null);
			}
		},
		[filterData, parentandCurrentManager]
	);

	/**
	 * onClick rename or move or delete checks is selected any file or not
	 * if selecetd  it enables the model sets model type
	 */
	const onClick = useCallback(
		({ data }: OptionsPropsForButton) => {
			if (isSelected) {
				switch (data?.name) {
					case addNewBsMediaConstant.rename:
						setIsShowModel(true);
						setModelType('rename');
						break;
					case addNewBsMediaConstant.move:
						setIsShowModel(true);
						setModelType('move');
						break;
					case addNewBsMediaConstant.delete:
						setIsShowDeleteModel((prev) => !prev);
						break;
					default:
						break;
				}
			} else {
				toast.error(t('Please select file or folder'));
			}
		},
		[isSelected, isShowModel]
	);

	/** It hides the models */
	const onClose = useCallback(() => {
		setIsShowDeleteModel(false);
		setIsShowModel(false);
	}, []);

	/** Deletes the file or folder */
	const deleteFileOrFolder = useCallback(() => {
		deleteBsMedia({ variables: { uuid: [bsMediaSelectedDataObj?.uuid] } })
			.then((res) => {
				const data = res?.data?.groupDeleteBsMedia as DeleteBsMediaRes;
				if (data?.meta?.statusCode === 200) {
					toast.success(data?.meta?.message);
					onClose();
					onRefresh();
				}
			})
			.catch(() => {
				return;
			});
	}, [bsMediaSelectedDataObj]);

	/** Based on selection it filters the data in the list view */
	const navTabHandler = useCallback((tabData: string) => {
		switch (tabData) {
			case bsMediaNavTabs.everything:
				setActiveTab(tabData);
				setFilterData((prev) => {
					return { ...prev, fileType: '' };
				});
				break;
			case bsMediaNavTabs.image:
				setActiveTab(tabData);
				setFilterData((prev) => {
					return { ...prev, fileType: FILE_TYPE.image };
				});
				break;
			case bsMediaNavTabs.video:
				setActiveTab(tabData);
				setFilterData((prev) => {
					return { ...prev, fileType: FILE_TYPE.video };
				});
				break;
			case bsMediaNavTabs.audio:
				setActiveTab(tabData);
				setFilterData((prev) => {
					return { ...prev, fileType: FILE_TYPE.audio };
				});
				break;
			case bsMediaNavTabs.document:
				setActiveTab(tabData);
				setFilterData((prev) => {
					return { ...prev, fileType: FILE_TYPE.application };
				});
				break;
			default:
				break;
		}
	}, []);
	return (
		<div>
			{(deleteLoader || isLoading) && <Loader />}
			<FilterBsMediaPage onSearchBsMedia={onSearchBsMedia} />
			<div className='card-table'>
				<div className='card-header '>
					<div className='flex items-center '>
						<span className='mr-2 w-3.5 h-3.5 inline-block svg-icon'>
							<ClipBoardIcon />
						</span>
						{t('Bs Media List')}
					</div>
					<div className='btn-group flex flex-wrap gap-2'>
						<Button title={t('Refresh') ?? ''} className='btn-gray' type='button' onClick={onRefresh}>
							<span className='svg-icon inline-block h-3.5 w-3.5 '>
								<Refresh />
							</span>
						</Button>

						<Button title={t('Grid View') ?? ''} className=' btn-gray' type='button' onClick={folderViewHandler}>
							<span className='svg-icon inline-block h-3.5 w-3.5 '>{isViewFolder ? <FolderView /> : <Category />}</span>
						</Button>
						{file ? (
							<div className=' btn-group mr-2'>
								<label htmlFor='import'>{file?.name}</label>&nbsp;
								<Button className=' btn-success' id='import' type='button' onClick={onUpload}>
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Download />
									</span>
									{/*
									 */}
									{t('Import')}
								</Button>
								<Button className=' btn-warning' id='import' type='button' onClick={onCancel}>
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Cross />
									</span>
									{/*
									 */}
									{t('Cancel')}
								</Button>
							</div>
						) : (
							<div className='flex items-center mr-2'>
								<label htmlFor='upload'>{t('Upload items')}</label>&nbsp;
								<label className='btn btn-info ' id='upload'>
									<input type='file' accept={`${activeTab === 'document' ? 'application' : activeTab}/*`} onChange={handleImportFile} hidden />
									{/*
									 */}
									{t('Browse')}
								</label>
							</div>
						)}
						<RoleBaseGuard permissions={[PERMISSION_LIST.BsMedia.AddFolderAccess]}>
							<Button className='btn-primary' type='button' label={t('Add New')} onClick={handleAddNew}>
								<span className='inline-block w-4 h-4 mr-1 svg-icon'>
									<PlusCircle />
								</span>
							</Button>
						</RoleBaseGuard>
					</div>
				</div>

				<hr />
				<div className='w-full flex flex-col'>
					<ul className='flex flex-row flex-wrap  w-full border border-b '>
						{navTabsList.map((i) => (
							<NavtabsBsMedia key={i.id} data={i} onClick={navTabHandler} activeTab={activeTab} />
						))}
					</ul>
					<div className='mt-6 w-full '>
						<div className='btn-group flex sm:justify-end flex-wrap gap-2  px-5'>
							<RoleBaseGuard permissions={[PERMISSION_LIST.BsMedia.RenameAccess]}>
								<Button data={{ name: 'rename' }} id='rename' className='btn-warning' type='button' label={t('Rename Folder or File')} onClick={onClick}>
									<span className='inline-block w-4 h-4 mr-1 svg-icon'>
										<Refresh />
									</span>
								</Button>
							</RoleBaseGuard>
							<RoleBaseGuard permissions={[PERMISSION_LIST.BsMedia.MoveAccess]}>
								<Button data={{ name: 'move' }} id='move' className='btn-primary' type='button' label={t('Move')} onClick={onClick}>
									<span className='inline-block w-4 h-4 mr-1 svg-icon'>
										<Move />
									</span>
								</Button>
							</RoleBaseGuard>

							<RoleBaseGuard permissions={[PERMISSION_LIST.BsMedia.DeleteAccess]}>
								<Button data={{ name: 'delete' }} id='delete' className='btn-primary' type='button' label={t('Delete')} onClick={onClick}>
									<span className='inline-block w-4 h-4 mr-1 svg-icon'>
										<Trash />
									</span>
								</Button>
							</RoleBaseGuard>
						</div>
						<div className='card-body'>
							<div className='card-header flex-wrap gap-2 !bg-white border'>
								<div className='flex items-center '>
									<span className='mr-2 w-3.5 h-3.5 inline-block svg-icon '>
										<Directory />
									</span>
									{currentWorkingDirectoryPath.current}
								</div>
								<div className='btn-group  flex gap-y-2 flex-wrap'>
									<Button title={t('View Details') ?? ''} className='btn-gray' type='button' onClick={onViewDetails}>
										<span className='inline-block w-4 h-4 mr-1 svg-icon'>{isViewDetails ? <SelectBoxArrowRight /> : <SelectBoxArrowLeft />}</span>
									</Button>
								</div>
							</div>
							<div className={`'w-full border ${isViewDetails ? 'grid grid-cols-4' : ''} `}>
								<div className=' border before:w-full col-span-3 min-h-12  relative'>
									<ul className={isViewFolder ? 'bs-media-folder-view' : 'bs-media-list-view'} >
										{filterData.parentId && (
											<li key={data?.id} aria-hidden='true' className={`${isViewFolder ? '' : 'even:bg-default'} cursor-pointer`} onClick={handleMoveBack}>
												<div className='bs-card'>
													<div className='bs-icon-container '>
														<div>
															<span className='bs-icon '>{<Back />}</span>
															<span className='hidden-span'>Go back folder...</span>
														</div>
													</div>
													<div className='hidden-div'>Go back folder..</div>
												</div>
											</li>
										)}
										{bsMediaListData.map((i: BsMediadataArr) => {
											return <BsMediaListItem activeItem={activeItem} key={i?.uuid} data={i} isViewFolder={isViewFolder} onClick={handleSelect} onDoubleClick={handleDoubleClick} />;
										})}
									</ul>
									{loading && (
										<div className='w-full px-2.5 py-2 bg-white bg-opacity-75 flex justify-center transition-all duration-200 ease-in-out absolute top-0 '>
											<div className='text-xl'>{t('Processing...')}</div>
										</div>
									)}
									{(data?.fetchBsMedia?.data?.count === '0' || data?.fetchBsMedia?.data === null) && (
										<div className='bs-media-no-data'>
											<div>{t('No Data')}</div>
										</div>
									)}
								</div>
								{isViewDetails && (
									<div className='view col-span-1'>
										{isSelected && bsMediaSelectedDataObj ? (
											<BsMediaViewDetails data={bsMediaSelectedDataObj} />
										) : (
											<div className='p-4 text-center'>
												<span className='inline-block w-20 h-20  svg-icon'>
													<EyeCrossed />
												</span>
												<p className='text-center'>Nothing is selected.</p>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			{isShowDeleteModel && <CommonModel warningText={DELETE_WARING_TEXT} onClose={onClose} action={deleteFileOrFolder} show={isShowDeleteModel} />}
			{isShowModel && <AddNewBsmedia onRefresh={onRefresh} modelType={modelType} onClose={onClose} isShowModel={isShowModel} data={previousParentData} parentAndCurrent={parentandCurrentManager} />}
		</div>
	);
};
export default BsMedia;
