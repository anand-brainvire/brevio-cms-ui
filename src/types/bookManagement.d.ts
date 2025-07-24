export type PaginationParamsCoupon = {
	filter?: {
		// Wherever you define PaginationParamsCoupon['filter']:
		statusFilter?: Array<{ status: string; isContentModified?: boolean }>;
		search?: string | null;
		categories?: string[] | null;
	};
	limit: number;
	offset: number;
	sortBy: string;
	sortOrder: string;	
	page?: number;
};

export type BookInputType = {
	title: string;
}
export type Insight = {
  value: string;
};

export type FormValues = {
  keyPoint: string;
  insights: Insight[];
};

export type PageFormProps = {
  index: number;
  isOpen: boolean;
  toggle: () => void;
  richText: string;
  setRichText: (val: string) => void;
  formik: {
    values: {
      richText: string | undefined;
      audio: string | number | undefined;
      keyPoint: string;
    };
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setFieldValue: (field: string, value: unknown) => void;
  };
  fields: FieldArrayWithId<FormValues, 'insights', 'id'>[];
  append: UseFieldArrayAppend<FormValues, 'insights'>;
  remove: UseFieldArrayRemove;
  register: UseFormRegister<FormValues>;
  OnBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export type CategoryOption = {
  key: string;
  name: string;
}

export type Category = {
  uuid: string;
  slug: string;
  category_translations: {
    lang_code: string;
    name: string;
    description: string;
  }[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number | null;
};

export type editBookInfo = {
	title: string;
	categoryId: string[];
	authorId: string[];
	whatsInside: string;
	aboutAuthor: string;
	coverImage: string | null;
	learningPoints: string[];
}
export type CouponColArrType = {
	name: string;
	sortable: boolean;
	fildName: string;
};
export type CouponsManagementProps = {
	defaultCategoryId?: string | null;
	onSearchCoupon: (values: FilterCouponsProps) => void;
	filterData: PaginationParamsCoupon;
	onLimitChange: (newLimit: number) => void;
};
export type FilterCouponsProps = {
	search: string;
	status?: string;
	categoryId?: string[];
};
export type CreateUpdateCouponProps = {
	offerName: string;
	offerCode: string;
	startDate?: Date | string;
	endDate?: Date | string;
	value?: number | string;
	offerType: string | number;
	offerUsage: string | number;
	applicable: string | number;
};

export type UsersDataStructureType = {
	name: string;
	code: string;
};
export type GetCouponRes = {
	id: string;
	uuid: string;
	offer_name: string;
	offer_code: string;
	offer_type: number;
	offer_usage: number;
	applicable: number;
	total_usage: number;
	status: number;
	start_date: string;
	end_date: string;
	selected_users: string[];
	value: number;
};

export type RefineCoverImageData = {
  data: Array<{
    base64: string;
    mimeType: string;
    extension: string;
  }>;
  meta: {
    message: string;
    statusCode: number;
  };
};
