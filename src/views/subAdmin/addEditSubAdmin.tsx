import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import Dropdown from '@components/dropdown/dropDown';
import { CreateSubAdmin } from '@type/subAdmin';
import { GET_ROLES_DATALIST } from '@framework/graphql/queries/role';
import { useMutation, useQuery } from '@apollo/client';
import { DropdownOptionType } from '@type/component';
import { CreateSubAdminRes, RoleDataArr, UpdateSubAdmin } from '@framework/graphql/graphql';
import { CREATE_SUBADMIN, UPDATE_SUBADMIN } from '@framework/graphql/mutations/subAdmin';
import { useNavigate, useParams } from 'react-router-dom';
import { IS_ALL, ROUTES } from '@config/constant';
import { GET_SUBADMIN_BY_ID } from '@framework/graphql/queries/subAdmin';
import { CheckCircle, Cross } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import { Loader } from '@components/index';

const AddEditSubdmin = (): ReactElement => {
	const { t } = useTranslation();
	const { refetch: fetchRolesList, loading } = useQuery(GET_ROLES_DATALIST, { variables: { isAll: IS_ALL }, fetchPolicy: 'network-only' });
	const [roleDrpData, setRoleDrpData] = useState<DropdownOptionType[]>([]);
	const [createSubAdmin, { loading: createLoader }] = useMutation(CREATE_SUBADMIN);
	const [updateSubAdmin, { loading: updateLoader }] = useMutation(UPDATE_SUBADMIN);
	const navigate = useNavigate();
	const params = useParams();
	const { data: subAdminData, loading: loader } = useQuery(GET_SUBADMIN_BY_ID, {
		variables: { getSubAdminId: params.id },
		skip: !params.id,
		fetchPolicy: 'network-only',
	});
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
	const { subAdminValidationSchema } = useValidation();

	/**
	 * Method used for set rol data array for dropdown
	 */
	useEffect(() => {
		fetchRolesList().then((res) => {
			const data = res.data;

			if (data?.fetchRoles?.data?.Roledata) {
				const tempDataArr = [] as DropdownOptionType[];
				data?.fetchRoles?.data?.Roledata.map((data: RoleDataArr) => {
					tempDataArr.push({ name: data.role_name, key: data.id });
				});
				setRoleDrpData(tempDataArr);
			}
		});
	}, []);

	/**
	 * Method used for setvalue from subadmin data by id
	 */
	useEffect(() => {
		if (subAdminData && params.id) {
			const data = subAdminData?.getSubAdmin?.data;
			formik
				.setValues({
					userName: data?.user_name,
					firstName: data?.first_name,
					lastName: data?.last_name,
					email: data?.email,
					password: data?.password,
					confirmPassword: data?.password,
					role: data?.role?.toString(),
				})
				.catch((err) => {
					toast.error(err);
				});
		}
	}, [subAdminData]);

	const initialValues: CreateSubAdmin = {
		userName: '',
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		role: '',
	};
	const UpdateSubAdminFunction = (values: CreateSubAdmin) => {
		updateSubAdmin({
			variables: {
				updateSubAdminId: params?.id,
				firstName: values?.firstName,
				lastName: values?.lastName,
				email: values?.email.toLowerCase(),
				role: parseInt(values?.role),
				userName: values?.userName,
			},
		})
			.then((res) => {
				const data = res.data as UpdateSubAdmin;
				if (data.updateSubAdmin.meta.statusCode === 200) {
					toast.success(data.updateSubAdmin.meta.message);
					formik.resetForm();
					onCancelSubAdmin();
				}
			})
			.catch(() => {
				return;
			});
	}
	const createSubadminFunction = (values: CreateSubAdmin) => {
		createSubAdmin({
			variables: { ...values, role: parseInt(values.role), email: values?.email.toLowerCase() },
		})
			.then((res) => {
				const data = res.data as CreateSubAdminRes;
				if (data.createSubAdmin.meta.statusCode === 200) {
					toast.success(data.createSubAdmin.meta.message);
					formik.resetForm();
					onCancelSubAdmin();
				}
			})
			.catch(() => {
				return;
			});
	}
	const formik = useFormik({
		initialValues,
		validationSchema: subAdminValidationSchema({ params: params.id }),
		onSubmit: (values) => {
			if (params.id) {
				UpdateSubAdminFunction(values);
			} else {
				createSubadminFunction(values);
			}
		},
	});
	/**
	 * Method that redirect to list page
	 */
	const onCancelSubAdmin = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.subAdmin}/${ROUTES.list}`);
	}, []);
	/**
	 * method that handle's password view
	 */
	const handleToggleConfirmPassword = useCallback(() => {
		setShowConfirmPassword((prevState) => !prevState);
	}, []);
	/**
	 * method that handle's password view
	 */
	const handleToggleShowPassword = useCallback(() => {
		setShowPassword((prevState) => !prevState);
	}, []);
	/**
	 * error message handler
	 * @param fieldName
	 * @returns
	 */
	const getErrorSubAdmin = (fieldName: keyof CreateSubAdmin) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};
	/**
	 * Handle blur that removes white space's
	 */
	const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
	return (
		<div className='card'>
			{(updateLoader || createLoader || loader || loading) && <Loader />}
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-title-container'>
						<p>
							{t('Fields marked with')} <span className='error'>*</span> {t('are mandatory.')}
						</p>
					</div>
					<div className='card-grid-addedit-page md:grid-cols-2'>
						<div>
							<TextInput id={'firstName'} onBlur={OnBlur} required={true} placeholder={t('First Name')} name='firstName' onChange={formik.handleChange} label={t('First Name')} value={formik.values.firstName} error={getErrorSubAdmin('firstName')} />
						</div>
						<div>
							<TextInput id={'lastName'} onBlur={OnBlur} required={true} placeholder={t('Last Name')} name='lastName' onChange={formik.handleChange} label={t('Last Name')} value={formik.values.lastName} error={getErrorSubAdmin('lastName')} />
						</div>
						<div>
							<TextInput id={'userName'} onBlur={OnBlur} required={true} disabled={params.id !== undefined} placeholder={t('Username')} name='userName' onChange={formik.handleChange} label={t('Username')} value={formik.values.userName} error={getErrorSubAdmin('userName')} />
						</div>
						<div>
							<TextInput id={'email'} onBlur={OnBlur} required={true} disabled={params.id !== undefined} placeholder={t('Email')} name='email' onChange={formik.handleChange} label={t('Email')} value={formik.values.email} error={getErrorSubAdmin('email')} />
						</div>
						{!params.id && <TextInput btnShowHide={showPassword} btnShowHideFun={handleToggleShowPassword} id={'password'} password={true} onBlur={OnBlur} required={true} placeholder={t('Password')} name='password' type={showPassword ? 'text' : 'password'} onChange={formik.handleChange} label={t('Password')} value={formik.values.password} error={formik.errors.password && formik.touched.password ? formik.errors.password : ''} />}
						{!params.id && <TextInput btnShowHide={showConfirmPassword} btnShowHideFun={handleToggleConfirmPassword} password={true} id={'confirmPassword'} onBlur={OnBlur} required={true} placeholder={t('Confirm Password')} type={showConfirmPassword ? 'text' : 'password'} name='confirmPassword' onChange={formik.handleChange} label={t('Confirm Password')} value={formik.values.confirmPassword} error={formik.errors.confirmPassword && formik.touched.confirmPassword ? formik.errors.confirmPassword : ''} />}

						<Dropdown placeholder={t('-- Select Role --')} required={true} name='role' onChange={formik.handleChange} value={formik.values.role} options={roleDrpData} id='role' label={t('Role')} error={formik.errors.role && formik.touched.role ? formik.errors.role : ''} />
					</div>
				</div>
				<div className='card-footer btn-group'>
					<Button className='btn-primary ' type='submit' label={t('Save')}>
						<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
							<CheckCircle />
						</span>
					</Button>
					<Button className='btn-warning ' label={t('Cancel')} onClick={onCancelSubAdmin}>
						<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
							<Cross />
						</span>
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AddEditSubdmin;
