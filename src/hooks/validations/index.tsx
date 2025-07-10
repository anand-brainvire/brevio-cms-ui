import * as Yup from 'yup';
import useCommanValidationFields from '@src/hooks/validations/common';
import useValidationFields from '@src/hooks/validations/fields';
import { validationProps } from '@src/types/common';

const useValidation = () => {
	const { email, password, firstName, lastName, status, endDate, startDate, address, title, contactNo, confirmPasswordcomman } = useCommanValidationFields();
	const {
		abuseThreshold,
		categorSuggestion,
		newPassword,
		confirmPassword,
		metaTitleEnglish,
		descriptionEnglish,
		metaDescriptionEnglish,
		categoryId,
		categoryName,
		suggestion,
		rating,
		review,
		countryCode,
		stateName,
		stateCode,
		countryId,
		cityName,
		cityCountryId,
		stateId,
		// topicId,
		categorySlug,
		// questionEnglish,
		// answerEnglish,
		enquirename,
		message,
		subject,
		siteName,
		tagLine,
		appLanguage,
		logo,
		description,
		eventName,
		template,
		authorName,
		// langCode,
		ruleName,
		descriptionenter,
		geoLocationName,
		geoLocationAddress,
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
		dateOfBirth,
		gender,
		userName,
		contentpagetitle,
		supportEmail,
		contactEmail,
		contactNumber,
		announcementType,
		subjectEmailTemplate,
		emailTemplateContent,
		templateFor,
		templateType,
		roleDropDown,
		folderName,
		currencyCode,
		phoneCode,
		countryName,
		toUserId,
		url,
		planDescription,
		planType,
		planName,
		isRecommendedPlan,
		planStatus,
		planPrice,
		bookName,
		addCategories,
		AddAuthors,
		keyPoint,
		richText,
	} = useValidationFields();

	const loginValidationSchema = Yup.object({
		email: email,
		password: password,
	});
	const suadminpasswordValidationSchema = Yup.object({
		newPassword: newPassword,
		confirmPassword: confirmPassword,
	});
	const geoLocationValidationSchema = Yup.object({
		name: geoLocationName,
		address: geoLocationAddress
	})
	const changeProfileValidationSchema = Yup.object({
		newPassword: newPassword,
		confirmPassword: confirmPassword,
	});

	const updateAdminValidationSchema = Yup.object({
		firstName: firstName,
		lastName: lastName,
	});

	const addEditCmsValidationSchema = Yup.object({
		titleEnglish: contentpagetitle,
		metaTitleEnglish: metaTitleEnglish,
		descriptionEnglish: descriptionEnglish,
		metaDescriptionEnglish: metaDescriptionEnglish,
	});

	const addSuggestionValidationSchema = Yup.object({
		categoryId: categorSuggestion,
		suggestion: suggestion,
	});

	const addReviewValidationsSchema = Yup.object({
		fromUserId: toUserId,
		rating: rating,
		review: review,
	});

	const addcountryValidationSchema = Yup.object({
		name: countryName,
		countryCode: countryCode,
		status: status,
		currencyCode: currencyCode,
		phoneCode: phoneCode,
	});

	const addstateValidationSchema = Yup.object({
		name: stateName,
		stateCode: stateCode,
		status: status,
		countryId: countryId,
	});

	const addcityValidationSchema = Yup.object({
		cityName: cityName,
		countryId: cityCountryId,
		stateId: stateId,
	});

	const addCategoryValidationSchema = Yup.object({
		// goalId: topicId,
		categoryName: categoryName,
		categorySlug: categorySlug,
		description: description,
		status: status,
	});
	const addEnquireValidationSchema = Yup.object({
		name: enquirename,
		message: message,
		subject: subject,
		email: email,
	});
	const addSettingValidationSchema = Yup.object({
		siteName: siteName,
		tagLine: tagLine,
		supportEmail: supportEmail,
		contactEmail: contactEmail,
		contactNo: contactNumber,
		appLanguage: appLanguage,
		address: address,
		abuseThreshold: abuseThreshold,
	});

	const addEventValidationSchema = Yup.object({
		eventName: eventName,
		description: description,
		startDate: startDate,
		endDate: endDate,
		address: address,
	});
	const addManageCategoryValidationSchema = Yup.object({
		categoryName: categoryId,
		status: status,
	});

	const addNotificationValidationSchema = Yup.object({
		template: template,
	});

	const manageRuleSetValidationsSchema = Yup.object({
		ruleName: ruleName,
		description: descriptionenter,
		priority: priority,
		onAction: onAction,
	});

	const addAnnouncementValidationSchema = Yup.object({
		announcementType: announcementType,
		title: title,
		description: description,
	});

	const addRoleValidationSchema = Yup.object({
		role: role,
	});

	const addCoupenValidationSchema = Yup.object({
		offerName: offerName,
		offerCode: offerCode,
		value: percentage,
		startDate: startTime,
		endDate: expireTime,
		selectedUsers: selectedUsers,
		offerType: offerType,
		offerUsage: offerUsage,
		applicable: applicable,
	});

	const addBookValidationSchema = Yup.object({
		bookName: bookName
	});

	const addBookInfoValidationSchema = Yup.object({
		title: bookName,
		categoryId: addCategories,
		authorId: AddAuthors
	});
	
	const forgotPasswordValidationSchema = Yup.object({
		email: email,
	});

	const resetPasswordValidationSchema = Yup.object({
		newPassword: newPassword,
		confirmPassword: confirmPassword,
	});

	const usermValidationSchema = ({ params }: validationProps) => {
		return Yup.object({
			firstName: firstName,
			lastName: lastName,
			phoneNo: contactNo,
			gender: gender,
			dateOfBirth: dateOfBirth,
			userName: userName,
			email: email,
			profileImg: logo,
			...(params !== undefined
				? {}
				: {
					password: password,
					confirmPassword: confirmPasswordcomman,
				}),
		});
	};

	const AuthorValidationSchema = () => {
		return Yup.object({
			authorName: authorName,
			status: status,
			// langCode: langCode,
		});
	};
	const subAdminValidationSchema = ({ params }: validationProps) => {
		return Yup.object({
			roleId: roleDropDown,
			firstName: firstName,
			lastName: lastName,
			...(params !== undefined
				? {}
				: {
					email: email,
					password: password,
					// confirmPassword: confirmPasswordcomman,
				}),
		});
	};
	const addEditEmailTemplateSchema = Yup.object({
		subject: subjectEmailTemplate,
		content: emailTemplateContent,
		templateFor: templateFor,
		templateType: templateType,
		status: status,
	});
	const addNewFolderSchema = Yup.object({
		folderName: folderName,
	});

	const qrCodeValidationSchema = Yup.object({
		url: url,
		status: status,
	});

	const planManagementValidationSchema = Yup.object({
		name: planName,
		description: planDescription,
		type: planType,
		price: planPrice,
		isRecommended: isRecommendedPlan,
		status: planStatus,
	});

	const savePageValidationSchema = Yup.object({
		keyPoint: keyPoint,
		richText: richText,
	});

	return {
		loginValidationSchema,
		changeProfileValidationSchema,
		updateAdminValidationSchema,
		addEditCmsValidationSchema,
		addSuggestionValidationSchema,
		addReviewValidationsSchema,
		addcountryValidationSchema,
		addstateValidationSchema,
		geoLocationValidationSchema,
		addcityValidationSchema,
		addCategoryValidationSchema,
		addEnquireValidationSchema,
		addSettingValidationSchema,
		addEventValidationSchema,
		addManageCategoryValidationSchema,
		addNotificationValidationSchema,
		manageRuleSetValidationsSchema,
		addAnnouncementValidationSchema,
		addRoleValidationSchema,
		addCoupenValidationSchema,
		addBookValidationSchema,
		addBookInfoValidationSchema,
		forgotPasswordValidationSchema,
		resetPasswordValidationSchema,
		usermValidationSchema,
		AuthorValidationSchema,
		subAdminValidationSchema,
		suadminpasswordValidationSchema,
		addEditEmailTemplateSchema,
		addNewFolderSchema,
		qrCodeValidationSchema,
		planManagementValidationSchema,
		savePageValidationSchema,
	};
};

export default useValidation;
