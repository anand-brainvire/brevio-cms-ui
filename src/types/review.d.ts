export type ReviewEditProps = {
	isReviewModelShow: boolean;
	onHandleChange?: React.ChangeEventHandler<HTMLInputElement>;
	onSubmitReview: () => void;
	onClose: () => void;
	reviewVal: string;
	isReviewEditable: boolean;
};

export type reviewData = {
	id: string;
	uuid: string;
	from_user_id: number;
	to_user_id: number;
	review: string;
	rating: string;
	status: boolean;
	created_at: number;
	updated_at: number;
};
export type ReviewChangeProps = {
	onClose: () => void;
	changeReviewStatus: () => void;
};

export type ReviewInput = {
	fromUserId: string;
	toUserId: string;
	review: string;
	rating: string;
};
export type FilterDataArrReviewProps = {
	search: string;
};
export type ReviewProps = {
	onSearchReview: (values: FilterDataArrReviewProps) => void;
	clearSelectionReviews: () => void;
	filterData: PaginationParams;
};
