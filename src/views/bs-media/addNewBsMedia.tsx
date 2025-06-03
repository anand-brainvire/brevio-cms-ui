import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import TextInput from '@components/textinput/TextInput';
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { useMutation, useQuery } from '@apollo/client';
import { BsMediadataArr, CreateBsMediaRes, RenameBsMediaRes } from '@framework/graphql/graphql';
import { toast } from 'react-toastify';
import { Cross, Info } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import WithTranslateFormErrors from '@components/customHooks/useTranslationFormErrors';
import { AddFolderProps, AddNewBsMediaProps } from '@type/bsMedia';
import { CREATE_BS_MEDIA_FOLDER, MOVE_BS_MEDIA, RENAME_BS_MEDIA } from '@framework/graphql/mutations/bsMedia';
import DropDown from '@components/dropdown/dropDown';
import { FETCH_BS_MEDIA } from '@framework/graphql/queries/bsMedia';
import { Loader } from '@components/index';
import { HeaderNamesObj, addNewBsMediaConstant } from '@config/constant';

const AddNewBsmedia = ({ isShowModel, onClose, data, modelType, onRefresh, parentAndCurrent }: AddNewBsMediaProps) => {
	const { t } = useTranslation();
	const [renameFolderOrFile, { loading: renameLoader }] = useMutation(RENAME_BS_MEDIA);
	const [createFolder, { loading: createLoader }] = useMutation(CREATE_BS_MEDIA_FOLDER);
	const [moveFileFolder, { loading: moveLoader }] = useMutation(MOVE_BS_MEDIA);
	const { refetch } = useQuery(FETCH_BS_MEDIA, { skip: true, fetchPolicy: 'network-only' });
	const [folderDropDown, setFolderDropDown] = useState<{ name: string; key: string }[]>([]);
	const initialValues: AddFolderProps = {
		folderName: '',
	};
	const { addNewFolderSchema } = useValidation();

	const formik = useFormik({
		initialValues,
		validationSchema: addNewFolderSchema,
		onSubmit: (values) => {
			switch (modelType) {
				case addNewBsMediaConstant.add:
					createFolder({ variables: { parentId: parentAndCurrent.current, ...values } })
						.then((res) => {
							const data = res?.data?.createBsMediaFolder as CreateBsMediaRes;
							if (data?.meta?.statusCode === 200) {
								toast.success(data?.meta?.message);
								onClose();
								onRefresh();
							}
						})
						.catch(() => {
							return;
						});
					break;
				case addNewBsMediaConstant.rename:
					renameFolderOrFile({ variables: { uuid: data?.uuid, name: values.folderName } })
						.then((res) => {
							const data = res?.data?.renameBsMedia as RenameBsMediaRes;
							if (data?.meta?.statusCode === 200) {
								toast.success(data?.meta?.message);
								onClose();
								onRefresh();
							}
						})
						.catch(() => {
							return;
						});
					break;
				case addNewBsMediaConstant.move:
					moveFileFolder({ variables: { uuid: data?.uuid, parentId: +values.folderName } })
						.then((res) => {
							const data = res?.data?.moveBsMedia as RenameBsMediaRes;
							if (data.meta.statusCode === 200) {
								toast.success(data.meta.message);
								onClose();
								onRefresh();
							}
						})
						.catch(() => {
							return;
						});
					break;
				default:
					break;
			}
		},
	});
	/**
	 * function that fetchs the data and set to dropdown
	 */
	const fetchingDropDownData = async () => {
		try {
			const res = await refetch({ parentId: data?.parent_id });
			const bsMedia = res?.data?.fetchBsMedia;

			if (bsMedia?.meta?.statusCode === 200) {
				const drpData: { name: string; key: string }[] = [];
				bsMedia?.data?.BsMediadata?.map((bsMediaDrpData: BsMediadataArr) => {
					if (bsMediaDrpData?.is_folder && bsMediaDrpData.id !== data?.id) {
						drpData.push({ name: bsMediaDrpData?.name, key: bsMediaDrpData?.id });
					}
				});
				parentAndCurrent.parent.length > 0 && drpData.push({ name: 'Move to one folder back ...', key: parentAndCurrent.parent[parentAndCurrent.parent.length - 1]?.toString() ?? 'null' });
				setFolderDropDown((prev) => [...prev, ...drpData]);
			}
		} catch (error) {
			if (error) {
				toast.error(t('Something went wrong'));
			}
		}
	};
	/**
	 * Fetch's the data for dropdown to move folder only if model type is  move type
	 */
	useEffect(() => {
		if (modelType === addNewBsMediaConstant.move) {
			fetchingDropDownData();
		}
	}, [modelType]);

	/**
	 * Method that close the popup on outside click
	 */
	useEffect(() => {
		document.addEventListener('click', (event: globalThis.MouseEvent) => {
			if ((event.target as HTMLElement)?.id === 'addNew-folder-model' || (event.target as HTMLElement)?.id === 'addnew-folder-model-child') {
				onClose();
			}
		});
	}, [isShowModel]);

	const OnBlurRole = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	return (
		<div id='aaddNew-folder-model' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`model-container ${isShowModel ? '' : 'hidden'}`}>
			{(createLoader || moveLoader || renameLoader) && <Loader />}
			<div id='addnew-folder-model-child' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={'model animate-fade-in'}>
				<div className=' model-content'>
					<div className='model-header'>
						<div className='flex items-center'>
							<span className='mr-2 text-white inline-block text-xl svg-icon w-5 h-5'>
								<Info />
							</span>
							<p className='text-lg font-medium text-white'>{HeaderNamesObj[modelType]}</p>
						</div>
						<Button onClick={onClose} title={t('Close') ?? ''}>
							<span className='mr-1 text-white w-2.5 h-2.5 inline-block svg-icon'>
								<Cross />
							</span>
						</Button>
					</div>
					{/* <!-- Modal body --> */}
					<WithTranslateFormErrors errors={formik.errors} touched={formik.touched} setFieldTouched={formik.setFieldTouched}>
						<form onSubmit={formik.handleSubmit}>
							<div className='model-body'>
								{modelType === addNewBsMediaConstant.rename && (
									<div>
										<TextInput id='folderName' placeholder={t('Folder or File Name')} name='folderName' value={data?.original_name} label={t('Folder or File Name')} disabled={true} />
										<TextInput id='folderName' placeholder={t('Folder or File New Name')} name='folderName' onChange={formik.handleChange} onBlur={OnBlurRole} value={formik.values.folderName} error={formik.errors.folderName && formik.touched.folderName ? formik.errors.folderName : ''} label={t('Folder or File New Name')} required={true} />
									</div>
								)}
								{modelType === addNewBsMediaConstant.add && (
									<div className='mb-4'>
										<TextInput id='folderName' placeholder={t('Folder Name')} name='folderName' onChange={formik.handleChange} onBlur={OnBlurRole} value={formik.values.folderName} error={formik.errors.folderName && formik.touched.folderName ? formik.errors.folderName : ''} label={t('Folder Name')} required={true} />
									</div>
								)}
								{modelType === addNewBsMediaConstant.move && <DropDown id='folder' options={folderDropDown} placeholder={t('Select Folder')} name='folderName' onChange={formik.handleChange} value={formik.values.folderName} error={formik.errors.folderName && formik.touched.folderName ? formik.errors.folderName : ''} label={t('Folder Name')} required={true} />}
							</div>
							<div className='model-footer'>
								<Button className='btn-primary  ' type='submit' label={t('Submit')}></Button>
								<Button className='  hover:bg-gray-400 btn-gray ' onClick={onClose} label={t('Close')}></Button>
							</div>
						</form>
					</WithTranslateFormErrors>
				</div>
			</div>
		</div>
	);
};

export default AddNewBsmedia;
