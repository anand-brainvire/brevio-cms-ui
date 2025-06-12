import { roleData } from '@type/role';

export type LoginResponse = {
	login: {
		data: {
			accessToken: string;
			user: {
				email: string;
				uuid: string;
				first_name: string;
				last_name: string;
				profile_img: string;
				id: string;
			};
			expiresIn: string;
			permissions: string[];
			refreshToken: string;
			expiresAt: string;
		};
		meta: MetaRes;
	};
};

export type ForgotPasswordResponse = {
	forgotPassword: {
		meta: MetaRes;
	};
};

export type ResetPasswordResponse = {
	resetPassword: {
		meta: MetaRes;
	};
};

export type RoleResponse = {
	fetchRoles: {
		data: {
			Roledata: roleDataArr[];
		};
		meta: MetaRes;
	};
};

export type DeleteRoleRes = {
	deleteRole: {
		data: roleData;
		meta: MetaRes;
	};
};

export type MetaRes = {
	message: string;
	messageCode: string;
	status: string;
	statusCode: number;
	status: string;
	type: string;
	errors: { errorField: string; error: string; __typename: string }[];
	errorType: string;
};

export type RoleCreateRes = {
	createRole: {
		data: roleData;
		meta: MetaRes;
	};
};

export type RoleData = {
	Roledata: roleDataArr;
	count: number;
};

export type SubAdminData = {
	subAdminData: SubAdminDataArr;
	count: number;
};

export type UserDataType = {
	userList: UserData[];
	count: number;
};

export type SubAdminDataArr = {
	id: number;
	first_name: string;
	last_name: string;
	user_name: string;
	email: string;
	password: string;
	role: number;
	status: number;
	created_at: string;
	updated_at: string;
	uuid: string;
	serialNo: number;
	Role: {
		role_name: string;
	};
};

export type UserData = {
	created_at: string;
	date_of_birth: string;
	email: string;
	first_name: string;
	gender: number;
	id: number;
	last_name: string;
	middle_name: string;
	phone_country_id: string;
	phone_no: string;
	profile_img: string;
	role: number;
	status: number;
	updated_at: string;
	user_name: string;
	user_role_id: number;
	uuid: string;
};

export type CMSdata = {
	cmsData: CmsDataArr;
	count: number;
};

export type CmsDataArr = {
	description_english: string;
	language: string;
	meta_title_english: string;
	meta_keywords: string;
	meta_description_english: string;
	title_english: string;
	status: number;
	id: string;
	uuid: string;
};

export type UpdateRoleStatusType = {
	updateRoleStatus: {
		data: roleData;
		meta: MetaRes;
	};
};

export type UpdateSubAdminStatusType = {
	changeSubAdminStatus: {
		data: SubAdminData;
		meta: MetaRes;
	};
};

export type UpdateUserStatusType = {
	changeUserStatus: {
		meta: MetaRes;
	};
};

export type DeleteUserType = {
	deleteUser: {
		data: UserData;
		meta: MetaRes;
	};
};

export type DeletGroupBanner = {
	groupDeleteBanner: {
		data: UserData;
		meta: MetaRes;
	};
};
export type DeleteGroupCity = {
	groupDeleteCities: {
		data: CityData;
		meta: MetaRes;
	};
};
export type DeleteGroupCountry = {
	groupDeleteCountries: {
		data: CountryData;
		meta: MetaRes;
	};
};
export type DeleteGroupState = {
	groupDeleteStates: {
		data: StateData;
		meta: MetaRes;
	};
};
export type DeleteGroupCategory = {
	groupDeleteCategories: {
		data: CategoryData;
		meta: MetaRes;
	};
};
export type DeleteGroupEnq = {
	groupDeleteEnquiries: {
		data: EnquiryData;
		meta: MetaRes;
	};
};
export type DeleteGroupFaq = {
	groupDeleteFaqs: {
		data: FaqData;
		meta: MetaRes;
	};
};
export type DeleteGroupBanner = {
	groupDeleteBanner: {
		data: BannerData;
		meta: MetaRes;
	};
};
export type DeleteGroupSugg = {
	groupDeleteSuggestions: {
		data: SuggestionData;
		meta: MetaRes;
	};
};
export type DeleteGroupRole = {
	groupDeleteRoles: {
		data: roleData;
		meta: MetaRes;
	};
};
export type GroupDeleteUser = {
	groupDeleteUsers: {
		data: UserData;
		meta: MetaRes;
	};
};
export type DeleteSubAdminType = {
	deleteSubAdmin: {
		data: SubAdminData;
		meta: MetaRes;
	};
};

export type UpdateRoleDataType = {
	updateRole: {
		data: roleData;
		meta: MetaRes;
	};
};

export type RoleDataArr = {
	created_at: string;
	key: string;
	role_name: string;
	status: number;
	updated_at: string;
	uuid: string;
	id: string;
	uuid: string;
	serialNo: number;
};

export type ChangeSubAdminPasswordRes = {
	changeSubAdminPassword: {
		meta: MetaRes;
	};
};

export type CreateSubAdminRes = {
	createSubAdmin: {
		data: SubAdminData;
		meta: MetaRes;
	};
};

export type UpdateSubAdmin = {
	updateSubAdmin: {
		data: SubAdminData;
		meta: MetaRes;
	};
};

export type StateDataArr = {
	id: number;
	uuid: string;
	name: string;
	state_code: string;
	country_id: number;
	status: number;
	created_at: string;
	updated_at: string;
	Country: countryArrList;
	state_id: number;
	uuid: string;
};

export type StateDataArrList = {
	id: number;
	uuid: string;
	name: string;
	country_code: string;
	status: string;
	created_at: string;
	updated_at: string;
};

export type countryArrList = {
	country_code: string;
	name: string;
	status: number;
};
export type CreateStateRes = {
	createState: {
		data: StateData;
		meta: MetaRes;
	};
};
export type DeleteCmsType = {
	deleteCMS: {
		data: CMSdata;
		meta: MetaRes;
	};
};

export type DeleteReviewRes = {
	deleteReview: {
		meta: ReviewMeta;
	};
};

export type ReviewMeta = {
	message: string;
	status: string;
	statusCode: number;
};

export type ReviewCreateRes = {
	createReview: {
		data: reviewData;
		meta: MetaRes;
	};
};

export type ReviewData = {
	Reviewdata: ReviewDataArr;
	count: number;
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

export type UpdateReviewStatusType = {
	updateReviewStatus: {
		meta: MetaRes;
	};
};

export type ReviewDataArr = {
	id: string;
	uuid: string;
	from_user_id: number;
	to_user_id: number;
	review: string;
	rating: string;
	status: number;
	created_at: string;
	updated_at: string;
	user_details: ReviewUserDataArr;
	to_user: ReviewUserDataArr;
	count: number;
	uuid: string;
};
export type ReviewUserDataArr = {
	id: string;
	uuid: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	email: string;
	phone_no: number;
	phone_country_id: number;
	role: number;
	profile_img: string;
	status: boolean;
	user_role_id: number;
	deleted_at: string;
};

export type UserReviewDetail = {
	id: string;
	uuid: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	email: string;
	phone_no: number;
	phone_country_id: number;
	role: string;
	profile_img: string;
	status: boolean;
	user_role_id: number;
};
export type CountryDataArr = {
	id: number;
	country_code: string;
	status: number;
	created_at: string;
	updated_at: string;
	name: string;
	uuid: string;
	phone_code: string;
	currency_code: string;
};

export type CreateCountryRes = {
	createCountry: {
		data: CountryData;
		meta: MetaRes;
	};
};

export type createCms = {
	createCMS: {
		data: CMSdata;
		meta: MetaRes;
	};
};

export type CreateUser = {
	createUser: {
		data: UserData;
		meta: MetaRes;
	};
};

export type UpdateUser = {
	updateUser: {
		data: UserData;
		meta: MetaRes;
	};
};
export type updateUserProfile = {
	updateProfile: {
		data: UserData;
		meta: MetaRes;
	};
};
export type ChangeUserPasswordRes = {
	changeUserPassword: {
		meta: MetaRes;
	};
};

export type createPage = {
	data: CMSdata;
	meta: MetaRes;
};

export type StateData = {
	Statedata: StateDataArr[];
	count: number;
};

export type DeleteStateType = {
	deleteState: {
		data: StateData;
		meta: MetaRes;
	};
};

export type CountryData = {
	Countrydata: CountryDataArr[];
	count: number;
};

export type DeleteCountryType = {
	deleteCountry: {
		data: CountryData;
		meta: MetaRes;
	};
};

export type UpdateCms = {
	updateCMS: {
		data: CMSdata;
		meta: MetaRes;
	};
};

export type UpdateState = {
	updateState: {
		data: StateData;
		meta: MetaRes;
	};
};

export type UpdateCountry = {
	updateCountry: {
		data: CountryData;
		meta: MetaRes;
	};
};

export type UpdateStateStatusType = {
	changeStateStatus: {
		data: StateData;
		meta: MetaRes;
	};
};

export type UpdateCountryStatusType = {
	changeCountryStatus: {
		data: CountryData;
		meta: MetaRes;
	};
};
export type FaqDataArr = {
	updatedAt: string;

	topic_id: number;

	status: number;

	question_hindi: string;

	question_english: string;

	question_arabic: string;

	id: number;

	createdAt: string;

	answer_hindi: string;

	answer_english: string;

	answer_arabic: string;
	uuid: string;
	serialNo?: number;
};

export type FaqData = {
	FaqData: FaqDataArr;
	count: number;
};

export type SettingsDataArr = {
	id: string;
	uuid: string;
	key: string;
	value: string;
	filePath: { original_file: string; image_200: string };
	is_active: boolean;
	is_deleted: boolean;
	is_for_admin: boolean;
	is_for_front: boolean;
	sidebarShowType?: string;
	logo?: string;
	favicon?: string;
};

export type EnquiryDataArr = {
	id: number;
	name: string;
	email: string;
	subject: string;
	message: string;
	status: number;
	sendAt: string;
	uuid: string;
};
export type EnquiryStatusData = {
	status: string;
	id: number;
};

export type EnquiryData = {
	EnquiryData: EnquiryDataArr;
	count: number;
};

export type AnnouncementDataArr = {
	id: number;
	title: string;
	status: number;
	created_at: string;
	annoucemnt_type: string;
	uuid: string;
	platform: string;
	uuid: string;
	discription: string;
	userType: string;
	userFilter: string;
	userToExclude: number[];
	onlySendTo: number[];
};

export type AnnouncementData = {
	announcementData: AnnouncementDataArr;
	count: number;
};
export type ExculdeDataArr = {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	device_type: string;
	role: number;
	created_at: string;
};

export type createAnnouncementRes = {
	createAnnouncement: {
		data: AnnouncementDataArr;
		meta: MetaRes;
	};
};
export type UserDataannounce = {
	created_at: string;
	date_of_birth: string;
	email: string;
	first_name: string;
	gender: number;
	id: number;
	last_name: string;
	middle_name: string;
	phone_country_id: string;
	phone_no: string;
	profile_img: string;
	role: number;
	status: number;
	updated_at: string;
	user_name: string;
	user_role_id: number;
	uuid: string;
	profile_img: string;
	device_type: string;
};
export type EventsDataArr = {
	id: number;
	event_name: string;
	description: string;
	is_reccuring: string;
	start_date: string;
	end_date: string;
	status: number;
	uuid: string;
	User: {
		user_name: string;
	};
};
export type EventsData = {
	FetchEventData: EventsDataArr;
	count: number;
};
export type UpdateEventRes = {
	updateEvent: {
		meta: MetaRes;
	};
};

export type BannerDataArr = {
	id: number;
	banner_title: string;
	banner_image: string;
	created_at: string;
	created_by: string;
	status: number;
	uuid: string;
	filePath: {
		original_file: string;
		image_200: string;
	};
	User: {
		first_name: string;
		last_name: string;
	};
};
export type BannerData = {
	BannerData: BannerDataArr;
	count: number;
};

export type createBannerData = {
	createBanner: {
		data: BannerData;
		meta: MetaRes;
	};
};

export type DeleteEventType = {
	meta: MetaRes;
};
export type CreateEventRes = {
	createEvent: {
		meta: MetaRes;
	};
};
export type SingleEventDataArr = {
	id: number;
	address: string;
	event_name: string;
	send_notification: boolean;
	description: string;
	is_reccuring: string;
	start_date: string;
	end_date: string;
	status: number;
	reccurance_date: string;
	participant_mail_ids: string[];
};
export type CityDataArr = {
	id: number;
	city_name: string;
	status: number;
	created_at: string;
	updated_at: string;
	State: StateDataName;
	state_id: number;
	uuid: string;
};
export type StateDataName = {
	id: string;
	uuid: string;
	name: srtring;
	country_id: number;
	state_code: string;
	status: number;
};
export type CityDataArrwithId = {
	id: number;
	uuid: string;
	name: string;
	country_id: number;
};
export type UpdateCity = {
	updateCity: {
		data: CityData;
		meta: MetaRes;
	};
};

export type CityData = {
	CityData: CityDataArr;
	count: number;
};
export type CreateCityRes = {
	createCity: {
		data: CityData;
		meta: MetaRes;
	};
};
export type DeleteCityType = {
	deleteCity: {
		data: CityData;
		meta: MetaRes;
	};
};
export type UpdateCityStatusType = {
	changeCityStatus: {
		data: CityData;
		meta: MetaRes;
	};
};
export type SuggestionData = {
	Suggestiondata: SuggestionDataArr[];
	count: number;
};
export type SuggestionDataArr = {
	id: number;
	category_id: number;
	suggestion: string;
	status: number;
	created_by: number;
	created_at: string;
	updated_at: string;
	uuid: string;
	Category: {
		category_name: string;
	};
	User: {
		first_name: string;
		last_name: string;
		middle_name: string;
	};
};

export type CategoryDataArr = {
	id: number;
	uuid: string;
	category_name: string;
	parent_category: number;
	description: string;
	status: number;
	created_by: number;
	created_at: string;
	updated_at: string;
	parentData: {
		id: number;
		uuid: string;
		category_name: string;
		parent_category: number;
		description: string;
		status: number;
		created_by: number;
		created_at: string;
		updated_at: string;
	};
};

export type CategoryData = {
	Categorydata: CategoryDataArr;
	count: number;
};
export type NotificationDataArr = {
	id: string;
	uuid: string;
	template: stirng;
	status: number;
	created_at: string;
	updated_at: string;
	uuid: string;
};
export type NotificationData = {
	notificationdata: NotificationDataArr;
	count: number;
};
export type DeleteNotificationType = {
	deleteNotificationTemplate: {
		meta: MetaRes;
	};
};
export type UpdateNotificationStatusType = {
	updateNotificationTemplate: {
		data: NotificationDataArr;
		meta: MetaRes;
	};
};
export type CreateNotificationRes = {
	createNotificationTemplate: {
		data: NotificationDataArr;
		meta: MetaRes;
	};
};
export type UpdateNotificationRes = {
	updateNotificationTemplate: {
		data: NotificationDataArr;
		meta: MetaRes;
	};
};
export type ManageRulesSetsDataArr = {
	id: number;
	rule_name: string;
	description: string;
	priority: string;
	on_action: string;
	times_triggered: number | null;
	status: number;
	uuid: string;
};
export type ManageRulesSetsData = {
	ruleData: ManageRulesSetsDataArr[];
	count: number;
};
export type UpdateManageRulesSetsStatusType = {
	updateRuleStatus: {
		data: ManageRulesSetsDataArr;
		meta: MetaRes;
	};
};
export type DeleteManageRulesSetsType = {
	deleteSetRule: {
		meta: MetaRes;
	};
};
export type CreateRulesSetRes = {
	createSetRule: {
		meta: MetaRes;
	};
};
export type UpdateRuleSetRes = {
	updateSetRule: {
		meta: MetaRes;
	};
};
export type GroupDeleteRulesSetsRes = {
	groupDeleteSetRules: {
		meta: MetaRes;
	};
};
export type RolePermissionsDataArr = {
	id: string;
	module_id: number;
	permission_name: string;
	key: string;
	status: number;
	created_by: int;
	createdAt: string;
	updatedAt: string;
	uuid: string;
};
export type RolePermissionsData = {
	permissondata: RolePermissionsDataArr[];
	count: number;
};

export type CreateAndRolePermissionsData = {
	meta: MetaRes;
};
export type FetchCouponsDataArr = {
	id: number;
	offer_name: string;
	offer_code: string;
	offer_type: number;
	value: number;
	start_date: string;
	end_date: string;
	applicable: number;
	offer_usage: number;
	status: number;
	total_usage: number;
	uuid: string;
};
export type FetchCouponsData = {
	Offerdata: FetchCouponsDataArr[];
	count: number;
};
export type DeleteCouponType = {
	deleteOffer: {
		meta: MetaRes;
	};
};
export type UpdateCouponStatusType = {
	updateOfferStatus: {
		meta: MetaRes;
	};
};
export type UpdateCoupon = {
	updateOffer: {
		meta: MetaRes;
	};
};
export type CreateCoupon = {
	createOffer: {
		meta: MetaRes;
	};
};
export type GetSingleCoupon = {
	coupon: FetchCouponsDataArr;
	userList: UserData[];
};
export type CoponUserData = {
	userList: UserData[];
	count: number;
};
export type GroupDeleteCouponsRes = {
	groupDeleteOffers: {
		meta: MetaRes;
	};
};

export type GroupDeleteEventsRes = {
	groupDeleteEvents: {
		meta: MetaRes;
	};
};
export type GroupDeleteNotificationsRes = {
	groupDeletenotificationTemplate: {
		meta: MetaRes;
	};
};
export type GroupDeleteSubAdmins = {
	groupDeleteSubAdmins: {
		meta: MetaRes;
	};
};

export type GroupDeleteStateRes = {
	groupDeleteStates: {
		meta: MetaRes;
	};
};
export type UpdateCmsStatusType = {
	changeCmsStatus: {
		data: CMSdata;
		meta: MetaRes;
	};
};
export type EmailNotificationTemplateDataArr = {
	id: string;
	uuid: string;
	subject: string;
	content: string;
	template_for: string;
	template_type: number;
	status: number;
	created_by: number;
	createdAt: string;
	updatedAt: string;
};
export type CreateEmailTemplateRes = {
	createEmailTemplate: {
		data: EmailNotificationTemplateDataArr;
		meta: MetaRes;
	};
};
export type UpdateEmailTemplateRes = {
	updateEmailTemplate: {
		data: EmailNotificationTemplateDataArr;
		meta: MetaRes;
	};
};

export type DeleteEmailTemplateRes = {
	deleteEmailTemplate: {
		meta: MetaRes;
	};
};
export type UpdateEmailTemplateStatusRes = {
	emailTemplateStatusUpdate: {
		data: EmailNotificationTemplateDataArr;
		meta: MetaRes;
	};
};
export type GroupDeleteEmailTemplateRes = {
	groupDeleteEmailtemplates: {
		meta: MetaRes;
	};
};

export type BsMediadataArr = {
	id: string;
	uuid: string;
	name: string;
	is_folder: boolean;
	parent_id: number;
	mime_type: string;
	extensions: string;
	media_url: string;
	media_url_200: string;
	media_url_300: string;
	status: number;
	created_by: number;
	created_at: string;
	updated_at: string;
	original_name: string;
	size: string;
};

export type CreateBsMediaRes = {
	data: BsMediadataArr;
	meta: MetaRes;
};

export type DeleteBsMediaRes = {
	meta: MetaRes;
};
export type RenameBsMediaRes = {
	data: BsMediadataArr;
	meta: MetaRes;
};

export type MappingData = {
	userToExclude: string;
	all: string;
	email: string;
	onlySendTo: string;
	customer: string;
	subAdmin: string;
	admin: string;
	android: string;
	ios: string;
	web: string;
};
export type DataMapping = {
	userToExclude: string;
	all: string;
	email: string;
	onlySendTo: string;
	customer: string;
	subAdmin: string;
	admin: string;
	android: string;
	ios: string;
	web: string;
};

export type ThirdPartyLoginData = {
	family_name: string;
	given_name: string;
	name: string;
	email: string;
};

export type ThirdPartyLoginDataProps = {
	thirdPartyLogin: {
		data: {
			expiresAt: string;
			refreshToken: string;
			expiresIn: string;
			token: string;
			permissions: string[];
			user: {
				first_name: string;
				last_name: string;
				uuid: string;
				profile_img: string;
			};
		};
	};
};
