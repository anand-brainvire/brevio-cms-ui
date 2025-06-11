import * as Yup from 'yup';
import { NAMEVALIDATION, ONLY_DIGIT, PASSWORD_REGEX, PHONECODE_REGEX, PHONEREGEX, SPECIAL_ALPHABET, VALID_NAME } from '@config/regex';
import { translationFun } from '@utils/helpers';
import moment from 'moment';

const useValidationFields = () => {
	const oldPassword = Yup.string().required(translationFun('Please enter old password'));
	const currentPassword = Yup.string().required(translationFun('Please enter current password'));
	const newPassword = Yup.string().required(translationFun('Please enter new password')).matches(PASSWORD_REGEX, translationFun('Password must contain 1 lower case, 1 upper case, 1 number, 1 special character ( @  $ % ^ & #) & minimum 8 characters')).max(20, translationFun('Enter less than or equal to 20 characters'));
	const confirmPassword = Yup.string()
		.required(translationFun('Please enter confirm password'))
		.max(20, translationFun('Enter less than or equal to 20 characters'))
		.oneOf([Yup.ref('newPassword'), null], translationFun('Confirm Password should match with new password'));
	const descriptionEnglish = Yup.string().required(translationFun('Please enter description'));
	const metaTitleEnglish = Yup.string().required(translationFun('Please enter meta title'));
	const metaDescriptionEnglish = Yup.string().required(translationFun('Please enter meta description'));
	const categoryId = Yup.string().required(translationFun('Please enter category')).min(3, 'category should not be less than 3 characters Please enter valid subject(only character allow)').matches(NAMEVALIDATION, 'Please enter category(only character allow)');
	const suggestion = Yup.string().required(translationFun('Please enter suggestion'));
	const suggestionstatus = Yup.string().required(translationFun('Please select status'));
	const fromUserId = Yup.string().required(translationFun('Please enter from name'));
	const toUserId = Yup.string().required(translationFun('Please enter to name'));
	const review = Yup.string().required(translationFun('Please enter review'));
	const rating = Yup.number().required(translationFun('Please enter rating')).min(0, translationFun('Rating should not be less than 0')).max(5, 'Rating should not be greater than 5');
	const name = Yup.string().required(translationFun('Please enter country name')).matches(NAMEVALIDATION, translationFun('Please enter valid first name(only character allow)'));
	const geoLocationName = Yup.string().required(translationFun('Please enter name')).min(3, translationFun('location Name should not be less than 3 characters Please enter valid Location name'));
	const geoLocationAddress = Yup.string().required(translationFun('Please enter address'));
	const countryCode = Yup.string().required(translationFun('Please enter country code')).matches(SPECIAL_ALPHABET, translationFun('Please enter valid country code (only character and special character allowed)')).max(8, translationFun('The country code may not be greater than 8 characters.'));
	const stateName = Yup.string().required(translationFun('Please enter stateName')).min(3, translationFun('State Name should not be less than 3 characters Please enter valid state name(only character allow)')).matches(NAMEVALIDATION, translationFun('Please enter valid state name(only character allow)')).max(20, translationFun('The state name may not be greater than 20 characters.'));
	const countryName = Yup.string().required(translationFun('Please enter countryname')).min(3, translationFun('Country Name should not be less than 3 characters Please enter valid country name(only character allow)')).matches(NAMEVALIDATION, translationFun('Please enter valid state name(only character allow)')).max(20, translationFun('The country name may not be greater than 20 characters.'));
	const stateCode = Yup.string().required(translationFun('Please enter state code')).matches(ONLY_DIGIT, translationFun('State code must be numeric')).max(3, translationFun('The state code may not be greater than 3 characters.'));
	const countryId = Yup.string().required(translationFun('Please select country'));
	const cityName = Yup.string().required(translationFun('Please enter city name')).min(3, translationFun('City Name should not be less than 3 characters Please enter valid city name(only character allow)')).max(20, translationFun('City Name should not be greater than 20 characters Please enter valid city name(only character allow)')).matches(NAMEVALIDATION, translationFun('Please enter valid city name(only character allow)'));
	const cityCountryId = Yup.string().required(translationFun('Please select country'));
	const stateId = Yup.string().required(translationFun('Please select state'));
	const topicId = Yup.string().required(translationFun('Please select FAQ topic'));
	const questionEnglish = Yup.string().required(translationFun('Please enter question')).min(3, translationFun('Question should not be less than 3')).max(50, 'Question should not be greater than 50');

	const answerEnglish = Yup.string().required(translationFun('Please enter answer')).min(3, translationFun('Answer should not be less than 3')).max(50, 'Answer should not be greater than 50');

	const enquirename = Yup.string().required(translationFun('Please enter name')).min(3, translationFun('Name should not be less than 3 characters Please enter vaild name')).max(20, translationFun('Name should not be greater than 20 characters')).matches(NAMEVALIDATION, 'Please enter vaild name');

	const message = Yup.string().min(3, translationFun('Message should not be less than 3 characters')).max(50, translationFun('Message should not be greater than 50 characters')).required(translationFun('Please enter message'));
	const subject = Yup.string().required(translationFun('Please enter subject')).min(3, translationFun('Subject should not be less than 3 characters Please enter valid subject')).max(50, translationFun('Subject should not be greater than 50 characters')).matches(NAMEVALIDATION, translationFun('Please enter valid subject(only character allow)'));
	const siteName = Yup.string().required(translationFun('Please enter site name')).min(3, translationFun('Site name should not be less than 3 characters Please enter valid site name(only character allow)')).matches(NAMEVALIDATION, translationFun('Please enter valid site name(only character allow)'));
	const tagLine = Yup.string().required(translationFun('Please enter tag line')).min(3, translationFun('Tag line should not be less than 3 characters Please enter valid tag line(only character allow)')).matches(NAMEVALIDATION, translationFun('Please enter valid tag line(only character allow)'));
	const supportEmail = Yup.string().email(translationFun('Please enter valid support email')).required(translationFun('Please enter valid support email'));
	const contactEmail = Yup.string().email(translationFun('Please enter contact email')).required(translationFun('Please enter contact email'));

	const contactNumber = Yup.string().matches(PHONEREGEX, translationFun('Please enter valid phone number with atleast 10 digits')).required(translationFun('Please enter contact number'));

	const appLanguage = Yup.string().required(translationFun('Please enter default language'));
	const logo = Yup.mixed().notRequired();
	const eventName = Yup.string().required(translationFun('Please enter event name'));
	const announcementType = Yup.string().required(translationFun('Please select type'));
	const description = Yup.string().required(translationFun('Please enter description'));
	const categoryName = Yup.string().required(translationFun('Please enter category name'));
	const template = Yup.string().required(translationFun('Please enter template'));
	const BannerTitleArabic = Yup.string().required(translationFun('Please enter banner title')).min(3, 'Banner title should not be less than 3 characters Please enter valid Banner Title').max(50, translationFun('Enter less than or equal to 50 characters'));
	const BannerTitle = Yup.string().required(translationFun('Please enter banner title')).min(3, 'Banner title should not be less than 3 characters Please enter valid Banner Title').max(50, translationFun('Enter less than or equal to 50 characters'));
	const BannerImage = Yup.string().required(translationFun('Please upload banner image'));
	const ruleName = Yup.string().required(translationFun('Please enter rule name'));
	const descriptionenter = Yup.string().required(translationFun('Please enter description'));
	const priority = Yup.string().required(translationFun('Please select priority'));
	const onAction = Yup.string().required(translationFun('Please select on action'));
	const role = Yup.string().min(3, translationFun('Role should not be less than 3 characters Please enter valid role')).max(50, translationFun('Enter less than or equal to 50 characters')).required(translationFun('Please enter role name'));
	const offerName = Yup.string().min(3, translationFun('Offer Name should not be less than 3 characters Please enter valid offer name')).max(20, translationFun('Enter less than or equal to 20 characters')).required(translationFun('Please enter offer name'));
	const offerCode = Yup.string().uppercase().length(6, translationFun('Offer code must 6 characters length')).required(translationFun('Please select offer code'));
	const percentage = Yup.number()
		.when('offerType', {
			is: (value: string) => value && value === '0',
			then: Yup.number().typeError(translationFun('Value must be a number')).positive().min(0.1, translationFun('Value cannot be zero. Please enter valid value')).max(100, translationFun('Should be less than 100')),
			otherwise: Yup.number().typeError(translationFun('Value must be a number')).positive().min(0.1, translationFun('Value cannot be zero. Please enter valid value')),
		})
		.required(translationFun('Please enter value'));

	const startTime = Yup.date().typeError('Invalid Date').required(translationFun('Please select the start date'));
	const expireTime = Yup.string()
		.required(translationFun('End time cannot be empty'))
		.test('is-greater', translationFun('End date cannot be earlier than start date'), function (value) {
			const { startDate } = this.parent;
			return moment.utc(value).isSameOrAfter(moment.utc(startDate));
		});
	const selectedUsers = Yup.array().of(Yup.number());
	const offerType = Yup.string().required(translationFun('Offer Type is required'));
	const offerUsage = Yup.string().required(translationFun('Please select offer usage'));
	const applicable = Yup.string().required(translationFun('Please select applicable users'));
	const gender = Yup.string().required(translationFun('Please select your gender'));

	const dateOfBirth = Yup.date().max(new Date(), 'Date of birth cannot be in the future').required(translationFun('Please select date of birth'));
	const userName = Yup.string().required(translationFun('Please enter username')).matches(VALID_NAME, translationFun('Please enter valid username')).max(50, translationFun('User name may not be greater than 50 characters.'));
	const contentpagetitle = Yup.string().required(translationFun('Please enter content page title'));
	const oldPasswordsubadmin = Yup.string().required(translationFun('Please enter new password')).matches(PASSWORD_REGEX, translationFun('New Password must contain 1 lower case, 1 upper case, 1 number, 1 special character ( @  $ % ^ & #) & minimum 8 characters')).max(20, translationFun('Enter less than or equal to 20 characters'));
	const newPasswordsubadmin = Yup.string()
		.required(translationFun('Please enter confirm password'))
		.matches(PASSWORD_REGEX, translationFun('Confirm Password must contain 1 lower case, 1 upper case, 1 number, 1 special character ( @  $ % ^ & #) & minimum 8 characters'))
		.max(20, translationFun('Enter less than or equal to 20 characters'))
		.oneOf([Yup.ref('oldPasswordsubadmin'), null], translationFun('Confirm Password should match with new password'));
	const categorSuggestion = Yup.string().required(translationFun('Please select category'));
	const abuseThreshold = Yup.string().required(translationFun('Please enter threshold value'));
	const imageUploadServer = Yup.string().required(translationFun(' Please select image upload server'));
	const subjectEmailTemplate = Yup.string().min(3, translationFun('Subject should not be less than 3 characters Please enter valid subject')).max(50, translationFun('Subject should not be greater than 50 characters')).required(translationFun('Please enter subject'));
	const emailTemplateContent = Yup.string().min(10, translationFun('Content should not be less than 10 characters Please enter valid content')).required(translationFun('Please enter description'));
	const templateFor = Yup.string().required(translationFun('Please enter template for'));
	const templateType = Yup.string().required(translationFun('Template type is required'));
	const roleDropDown = Yup.string().required(translationFun('Please select role'));
	const folderName = Yup.string().max(50, translationFun('Folder Name is less than or equal to 50 characters')).required(translationFun('Folder Name is required'));

	const currencyCode = Yup.string().required(translationFun('Please enter currency symbol')).max(4, translationFun('The currency code may not be greater than 4 characters.'));
	const phoneCode = Yup.string().required(translationFun('Please enter phone code')).matches(PHONECODE_REGEX, 'Phone code must start with a + sign and contain only digits').max(4, 'The phone code may not be greater than 4 digits.');

	const url = Yup.string().url().required('Please enter url');
	const planName = Yup.string().required(translationFun('Please enter plan name')).min(3, translationFun('Plan Name should not be less than 3 characters Please enter valid Plan Name(only character allow)')).matches(NAMEVALIDATION, translationFun('Please enter valid Plan name(only character allow)')).max(20, translationFun('The Plan name may not be greater than 20 characters.'));

	const planDescription = Yup.string().required(translationFun('Please enter plan description'));
	const planType = Yup.string().required(translationFun('Please select Plan Type'));
	const isRecommendedPlan = Yup.string().required(translationFun('Please select isRecommended plan'));
	const planStatus = Yup.string().required(translationFun('Please select Plan Status'));
	const planPrice = Yup.string().required(translationFun('Please enter plan price')).matches(ONLY_DIGIT, translationFun('Plan Price must be numeric'));

	return {
		announcementType,
		oldPassword,
		geoLocationAddress,
		geoLocationName,
		currentPassword,
		newPassword,
		confirmPassword,
		descriptionEnglish,
		metaTitleEnglish,
		metaDescriptionEnglish,
		categoryId,
		suggestion,
		fromUserId,
		toUserId,
		review,
		rating,
		name,
		countryCode,
		stateName,
		stateCode,
		countryId,
		cityName,
		cityCountryId,
		stateId,
		topicId,
		questionEnglish,
		answerEnglish,
		enquirename,
		message,
		subject,
		siteName,
		tagLine,
		appLanguage,
		logo,
		eventName,
		description,
		categoryName,
		template,
		BannerTitle,
		ruleName,
		descriptionenter,
		priority,
		onAction,
		role,
		offerName,
		offerCode,
		percentage,
		startTime,
		expireTime,
		selectedUsers,
		offerType,
		offerUsage,
		applicable,
		gender,
		dateOfBirth,
		userName,
		contentpagetitle,
		BannerImage,
		supportEmail,
		contactEmail,
		contactNumber,
		suggestionstatus,
		oldPasswordsubadmin,
		newPasswordsubadmin,
		categorSuggestion,
		imageUploadServer,
		abuseThreshold,
		subjectEmailTemplate,
		emailTemplateContent,
		templateFor,
		templateType,
		roleDropDown,
		folderName,
		BannerTitleArabic,
		currencyCode,
		phoneCode,
		countryName,
		url,
		planDescription,
		planType,
		planName,
		isRecommendedPlan,
		planStatus,
		planPrice,
	};
};

export default useValidationFields;
