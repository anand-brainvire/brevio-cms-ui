import { FormikErrors, FormikTouched, FormikValues } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useTranslateFormErrors = (errors: FormikErrors<FormikValues>, touched: FormikTouched<FormikValues>, setFieldTouched: (field: string, touched?: boolean, shouldValidate?: boolean) => Promise<FormikErrors<FormikValues>> | Promise<void>) => {
	const { i18n } = useTranslation();
	useEffect(() => {
		i18n.on('languageChanged', () => {
			Object.keys(errors).forEach((fieldName) => {
				if (Object.keys(touched).includes(fieldName)) {
					setFieldTouched(fieldName);
				}
			});
		});
		return () => {
			i18n.off('languageChanged', () => {
				return;
			});
		};
	}, [errors]);
};

const WithTranslateFormErrors = ({ errors, touched, setFieldTouched, children }: { errors: FormikErrors<FormikValues>; touched: FormikTouched<FormikValues>; setFieldTouched: (field: string, touched?: boolean, shouldValidate?: boolean) => Promise<FormikErrors<FormikValues>> | Promise<void>; children: React.ReactNode }) => {
	useTranslateFormErrors(errors, touched, setFieldTouched);
	return <>{children}</>;
};

export default WithTranslateFormErrors;
