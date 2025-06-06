import * as Yup from 'yup';
import { NAMEVALIDATION, PASSWORD_REGEX, PHONEREGEX, SPACE_REGEX } from '@config/regex';
import { translationFun } from '@utils/helpers';

const useCommanValidationFields = () => {
	const password = Yup.string().required(translationFun('Please enter password')).matches(PASSWORD_REGEX, translationFun('Password must contain 1 lower case, 1 upper case, 1 number, 1 special character ( @  $ % ^ & #) & minimum 8 characters')).min(8, translationFun('Password should not be less than 8 characters')).max(20, translationFun('Password should not be greater than 20 characters'));
	const confirmPasswordcomman = Yup.string()
		.required(translationFun('Please enter confirm password'))
		.oneOf([Yup.ref('password'), null], translationFun('Confirm Password should match with password'))
		.min(8, translationFun('Confirm password should not be less than 8 characters'))
		.max(20, translationFun('Confirm password should not be greater than 20 characters'));
	const firstName = Yup.string().required(translationFun('Please enter first name')).min(3, translationFun('First Name should not be less than 3 characters')).max(50, translationFun('First Name should not be greater than 50 characters')).matches(NAMEVALIDATION, translationFun('Please enter valid first name (only character allow)'));
	const lastName = Yup.string().required(translationFun('Please enter last name')).min(3, translationFun('Last Name should not be less than 3 characters')).max(50, translationFun('Last Name should not be greater than 50 characters')).matches(NAMEVALIDATION, translationFun('Please enter valid last name (only character allow)'));
	const email = Yup.string().email(translationFun('Please enter valid email')).required(translationFun('Please enter email'));
	const status = Yup.string().required(translationFun('Please enter status'));
	const address = Yup.string().matches(SPACE_REGEX, translationFun('Please enter address')).required(translationFun('Please enter address'));
	const startDate = Yup.date().typeError('Invalid Date').required(translationFun('Please select the start date'));
	const endDate = Yup.date().typeError('Invalid Date').min(Yup.ref('startDate'), translationFun('End date cannot be earlier than start date')).required(translationFun('Please select the end date'));
	const image = Yup.mixed()
		.required(translationFun('Image is required'))
		.test('fileFormat', 'Unsupported file format', (value) => value && ['image/jpeg', 'image/png'].includes(value.type))
		.test('fileSize', 'File size is too large Accept Only 2 Mb or lessthen 2 Mb Image', (value) => value && value.size <= 2000000);
	const title = Yup.string().required(translationFun('Please enter title'));
	const contactNo = Yup.string().matches(PHONEREGEX, translationFun('Please enter valid phone number with atleast 10 digits')).required(translationFun('Please enter phone number'));

	return {
		password,
		email,
		firstName,
		lastName,
		status,
		startDate,
		endDate,
		address,
		image,
		title,
		contactNo,
		confirmPasswordcomman,
	};
};

export default useCommanValidationFields;
