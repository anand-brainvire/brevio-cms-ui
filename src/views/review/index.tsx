import React, { useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import { UPDATE_REVIEW_STATUS, DELETE_REVIEW, GROUP_DELETE_REVIEW } from '@framework/graphql/mutations/review';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { PaginationParams } from '@type/common';
import { DEFAULT_LIMIT, DEFAULT_PAGE, sortOrder } from '@config/constant';
import AddEditReview from '@views/review/addEditReview';
import { GET_REVIEW_DATA } from '@framework/graphql/queries/review';
import Button from '@components/button/button';
import { PlusCircle, Star } from '@components/icons/icons';
import FilterManageRulesSets from '@views/review/filterReview';
import { FilterDataArrReviewProps } from '@type/review';
import filterServiceProps from '@components/filter/filter';
import { PERMISSION_LIST } from '@config/permission';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { IColumnsProps } from '@components/BVDatatable/DataTable';
const ReviewPermission = () => {
	const [isReviewModelShow, setIsReviewModelShow] = useState<boolean>(false);
	const [reviewVal, setReviewVal] = useState<string>('');
	const { t } = useTranslation();
	const [isReviewEditable, setIsReviewEditable] = useState<boolean>(false);
	const { localFilterData } = useSaveFilterData();

	const [filterDataReview, setFilterDataReview] = useState<PaginationParams>(
		localFilterData('filterreview') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: 'created_at',
			sortOrder: sortOrder,
			search: '',
		}
	);
	const { refetch } = useQuery(GET_REVIEW_DATA, { variables: { ...filterDataReview }, fetchPolicy: 'network-only' });
	const COL_ARR_REVIEW = [
		{ name: t('To Name'), sortable: false, fieldName: 'user_details.first_name', type: 'text', headerCenter: false },
		{ name: t('Rating'), sortable: true, fieldName: 'rating', type: 'ratings', headerCenter: false },
		{ name: t('Review'), sortable: false, fieldName: 'review', type: 'text', headerCenter: true },
		{ name: t('Created At'), sortable: true, fieldName: 'created_at', type: 'date', headerCenter: false },
		{ name: t('Status'), sortable: true, fieldName: 'status', type: 'status', headerCenter: true },
	] as IColumnsProps[];
	const [selectedReviews, setSelectedReviews] = useState<string[]>([]);

	/**
	 * Method used for close model
	 */
	const onCloseReview = useCallback(() => {
		setIsReviewModelShow(false);
	}, []);

	const onSubmitReview = useCallback(() => {
		setIsReviewModelShow(false);
		refetch(filterDataReview).catch((e) => toast.error(e));
	}, []);

	/**
	 * Method used for add new rwview
	 */
	const createNewReview = useCallback(() => {
		setIsReviewModelShow(true);
		setIsReviewEditable(false);
		setReviewVal('');
	}, []);

	/**
	 *
	 * @param e Method used for store search value
	 */
	const onSearchReview = useCallback(
		(values: FilterDataArrReviewProps) => {
			const updatedFilterData = {
				...filterDataReview,
				search: values.search,
				page: DEFAULT_PAGE,
			};
			setFilterDataReview(updatedFilterData);
			filterServiceProps.saveState('filterreview', JSON.stringify(updatedFilterData));
		},
		[filterDataReview]
	);
	/**
	 * Method that clears the selcted data
	 */
	const clearSelectionReviews = useCallback(() => {
		setSelectedReviews([]);
	}, [selectedReviews]);

	return (
		<div>
			<FilterManageRulesSets filterData={filterDataReview} onSearchReview={onSearchReview} clearSelectionReviews={clearSelectionReviews} />
			<div className='card-table'>
				<div className='card-header'>
					<div className='flex items-center'>
						<span className='svg-icon inline-block h-3.5 w-3.5 mr-2 text-md'>
							<Star />
						</span>
						{t('Reviews List')}
					</div>

					<div>
						<Button className='btn-primary   ' onClick={createNewReview} type='button' label={t('Add New')}>
							<span className='inline-block w-4 h-4 mr-1 svg-icon'>
								<PlusCircle />
							</span>
						</Button>
					</div>
				</div>
				<div className='card-body'>
					<BVDataTable
						defaultActions={['delete', 'change_status', 'multiple_delete']}
						columns={COL_ARR_REVIEW}
						queryName={GET_REVIEW_DATA}
						sessionFilterName='filterBanner'
						singleDeleteMutation={DELETE_REVIEW}
						multipleDeleteMutation={GROUP_DELETE_REVIEW}
						updateStatusMutation={UPDATE_REVIEW_STATUS}
						actionWisePermissions={{
							delete: PERMISSION_LIST.Review.DeleteAccess,
							changeStatus: PERMISSION_LIST.Review.ChangeStatusAccess,
							multipleDelete: PERMISSION_LIST.Review.GroupDeleteAcsess,
						}}
						updatedFilterData={filterDataReview}
						statusKey={'status'}
						idKey={'uuid'}
						multipleDeleteApiId={'groupDeleteReviewsId'}
						singleDeleteApiId={'deleteReviewId'}
						statusChangeApiId={'uuid'}
						statusChangeApiKeyTitle={'status'}
					/>
				</div>
			</div>

			{isReviewModelShow && <AddEditReview isReviewModelShow={isReviewModelShow} isReviewEditable={isReviewEditable} onSubmitReview={onSubmitReview} onClose={onCloseReview} reviewVal={reviewVal} />}
		</div>
	);
};
export default ReviewPermission;
