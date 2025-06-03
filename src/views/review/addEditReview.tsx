import React, { useCallback, useEffect, useState } from 'react';
import { ReviewEditProps, ReviewInput } from '@type/review';
import { useFormik } from 'formik';
import TextInput from '@components/textinput/TextInput';
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { CREATE_REVIEW } from '@framework/graphql/mutations/review';
import { useMutation, useQuery } from '@apollo/client';
import { ReviewCreateRes, UserReviewDetail } from '@framework/graphql/graphql';
import { toast } from 'react-toastify';
import Dropdown from '@components/dropdown/dropDown';
import { DropdownOptionType } from '@type/component';
import { CheckCircle, Cross, PlusCircle } from '@components/icons/icons';
import { Rating } from 'primereact/rating';
import useValidation from '@src/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import { GET_USER } from '@framework/graphql/queries/user';
import { Loader } from '@components/index';
const AddEditReview = ({ isReviewModelShow, onSubmitReview, onClose }: ReviewEditProps) => {
	const { t } = useTranslation();
	const [createReviewData, { loading: createLoader }] = useMutation(CREATE_REVIEW);
	const { data, loading } = useQuery(GET_USER, {
		variables: {
			isAll: true,
		},
	});
	const [reviewDrpData, setReviewDrpData] = useState<DropdownOptionType[]>([]);
	const initialValues: ReviewInput = {
		fromUserId: '',
		toUserId: '',
		review: '',
		rating: '',
	};
	const { addReviewValidationsSchema } = useValidation();
	const formik = useFormik({
		initialValues,
		validationSchema: addReviewValidationsSchema,
		onSubmit: (values) => {
			createReview(values);
		},
	});

	/**
	 * Method used for create review API
	 * @param values Review input values
	 */
	const createReview = (values: ReviewInput) => {
		createReviewData({
			variables: {
				fromUserId: parseInt(values.fromUserId),
				toUserId: parseInt(values.toUserId),
				review: values.review,
				rating: parseInt(values.rating),
			},
		})
			.then((res) => {
				const data = res.data as ReviewCreateRes;
				if (data.createReview.meta.statusCode === 200) {
					toast.success(data.createReview.meta.message);
				}
				onSubmitReview();
			})
			.catch(() => {
				return;
			});
	};

	/**
	 * Set review data array for dropdown
	 */
	useEffect(() => {
		if (data?.fetchUsers) {
			const tempDataArr: DropdownOptionType[] = [];
			data?.fetchUsers?.data?.userList?.map((data: UserReviewDetail) => {
				tempDataArr.push({ name: data.first_name, key: data.id });
			});
			setReviewDrpData(tempDataArr);
		}
	}, [data]);
	/**
	 * Methos handles out side click
	 */
	useEffect(() => {
		document.addEventListener('click', (event: globalThis.MouseEvent) => {
			if ((event.target as HTMLElement)?.id === 'addedit-review-model' || (event.target as HTMLElement)?.id === 'addedit-review-model-child') {
				onClose();
			}
		});
	}, [isReviewModelShow]);
	/**
	 * Handle blur that removes white space's
	 */
	const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
	return (
		<div className={`${isReviewModelShow ? '' : 'hidden'} model-container`} id='addedit-review-model'>
			{(loading || createLoader) && <Loader />}
			<div id='addedit-review-model-child' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={'model animate-fade-in'}>
				<div className='model-content'>
					<div className='model-header'>
						<div className='flex items-center '>
							<span className='inline-block w-5 h-5 mr-1 text-white text-lg svg-icon'>
								<PlusCircle />
							</span>
							<span className='model-title ml-1'>{t('Add New Review')}</span>
						</div>
						<Button onClick={onClose} title={t('Close') ?? ''}>
							<span className='my-1 text-white w-2.5 h-2.5 inline-block svg-icon'>
								<Cross />
							</span>
						</Button>
					</div>
					{/* Modal body */}
					<form className=' bg-white rounded shadow-md' onSubmit={formik.handleSubmit}>
						<div className='model-body grid grid-cols-1  '>
							<div className='mb-4'>
								<Dropdown required={true} placeholder={t('Select To Name')} name='fromUserId' onChange={formik.handleChange} value={formik.values.fromUserId} options={reviewDrpData} id='fromUserId' label={t('To Name')} error={formik.errors.fromUserId && formik.touched.fromUserId ? formik.errors.fromUserId : ''} />
							</div>
							<div className='mb-4'>
								<div>
									<label className='text-gray-700' htmlFor='rating'>
										{t('Rating')} <span className='text-red-500 '>*</span>
									</label>
								</div>
								<Rating id='rating' name='rating' onChange={formik.handleChange} value={+formik.values.rating} cancel={false} className='flex mt-2 mb-1' />
								{!formik.values.rating ? <span className='text-red-500'>{formik.errors.rating && formik.touched.rating ? t(`${formik.errors.rating}`) : ''}</span> : ''}
							</div>
							<div className='mb-4'>
								<TextInput id={'review'} onBlur={OnBlur} required={true} placeholder={t('Review')} name='review' label={t('Review')} onChange={formik.handleChange} value={formik.values.review} error={formik.errors.review && formik.touched.review ? formik.errors.review : ''} />
							</div>
						</div>
						<div className='model-footer'>
							<Button className='btn-primary ' type='submit' label={t('Save')}>
								<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
									<CheckCircle />
								</span>
							</Button>
							<Button className='btn-warning ' onClick={onClose} label={t('Cancel')}>
								<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
									<Cross />
								</span>
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddEditReview;
