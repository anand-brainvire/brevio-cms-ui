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
import { DEFAULT_STATUS, IS_ALL, ROUTES, STATUS, STATUS_RADIO } from '@config/constant';
import { GET_SUBADMIN_BY_ID } from '@framework/graphql/queries/subAdmin';
import { CheckCircle, Cross } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import { Loader } from '@components/index';
import RadioButton from '@components/radiobutton/radioButton';

const AddEditSubdmin = (): ReactElement => {
	const { t } = useTranslation();
	const { refetch: roles, loading } = useQuery(GET_ROLES_DATALIST, { variables: { isAll: IS_ALL, isActive: true, sortOrder: 'asc', sortBy: 'role_name'}, fetchPolicy: 'network-only' });
	const [roleDrpData, setRoleDrpData] = useState<DropdownOptionType[]>([]);
	const [createSubAdmin, { loading: createLoader }] = useMutation(CREATE_SUBADMIN);
	const [updateSubAdmin, { loading: updateLoader }] = useMutation(UPDATE_SUBADMIN);
	const navigate = useNavigate();
	const params = useParams();
	const { data: subAdminData, loading: loader } = useQuery(GET_SUBADMIN_BY_ID, {
		variables: { uuid: params.id },
		skip: !params.id,
		fetchPolicy: 'network-only',
	});
	const [showPassword, setShowPassword] = useState<boolean>(false);
	// const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
	const { subAdminValidationSchema } = useValidation();

	/**
	 * Method used for set rol data array for dropdown
	 */
	useEffect(() => {
		roles().then((res) => {
			const data = res.data;
			if (data?.roles?.data?.rolesData) {
				const tempDataArr = data.roles.data.rolesData.map((role: RoleDataArr) => ({
					name: role.role_name,
					key: role.uuid,
				}));
				setRoleDrpData(tempDataArr);
			}
		});
	}, []);

	/**
	 * Method used for setvalue from subadmin data by id
	 */
	useEffect(() => {
		if (subAdminData && params.id) {
			const data = subAdminData?.getSubAdminById?.data;
			if (data) {
				formik.setValues({
					firstName: data.first_name || '',
					lastName: data.last_name || '',
					email: data.email || '',
					password: '',
					roleId: data.role_uuid || '',
					status: data?.is_active ? STATUS.active : STATUS.inactive,
				});
			}
		}
	}, [subAdminData, params.id]);

	const initialValues: CreateSubAdmin = {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		roleId: '',
		status: DEFAULT_STATUS
	};
	const UpdateSubAdminFunction = (values: CreateSubAdmin) => {
		updateSubAdmin({
			variables: {
				uuid: params?.id,
				firstName: values?.firstName,
				lastName: values?.lastName,
				roleId: values?.roleId,
				isActive: Number(values.status) === STATUS.active,
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
		const { status, ...rest } = values;
		const payload = {
			...rest,
			email: values?.email.toLowerCase(),
			isActive: Number(values.status) === STATUS.active,
		};
		createSubAdmin({
			variables: payload,
		})
			.then((res) => {
				const data = res.data as CreateSubAdminRes;
				if (data.createSubAdmin.meta.statusCode === 201) {
					toast.success(data.createSubAdmin.meta.message);
					formik.resetForm();
					onCancelSubAdmin();
				}
			})
			.catch(() => {
				return;
			});
	};
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
	// const handleToggleConfirmPassword = useCallback(() => {
	// 	setShowConfirmPassword((prevState) => !prevState);
	// }, []);
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
						{/* <div>
							<TextInput id={'middleName'} onBlur={OnBlur} required={false} placeholder={t('Middle Name')} name='middleName' onChange={formik.handleChange} label={t('Middle Name')} value={formik.values.middleName} error={getErrorSubAdmin('middleName')} />
						</div> */}
						<div>
							<TextInput id={'lastName'} onBlur={OnBlur} required={true} placeholder={t('Last Name')} name='lastName' onChange={formik.handleChange} label={t('Last Name')} value={formik.values.lastName} error={getErrorSubAdmin('lastName')} />
						</div>
						<div>
							<TextInput id={'email'} onBlur={OnBlur} required={true} disabled={params.id !== undefined} placeholder={t('Email')} name='email' onChange={formik.handleChange} label={t('Email')} value={formik.values.email} error={getErrorSubAdmin('email')} />
						</div>
						<div>
							<RadioButton id={'status'} required={true} checked={formik.values.status} onChange={formik.handleChange} name={'status'} radioOptions={STATUS_RADIO} label={t('Status')} />
						</div>
						{!params.id && <TextInput btnShowHide={showPassword} btnShowHideFun={handleToggleShowPassword} id={'password'} password={true} onBlur={OnBlur} required={true} placeholder={t('Password')} name='password' type={showPassword ? 'text' : 'password'} onChange={formik.handleChange} label={t('Password')} value={formik.values.password} error={formik.errors.password && formik.touched.password ? formik.errors.password : ''} />}
						{/* {!params.id && <TextInput btnShowHide={showConfirmPassword} btnShowHideFun={handleToggleConfirmPassword} password={true} id={'confirmPassword'} onBlur={OnBlur} required={true} placeholder={t('Confirm Password')} type={showConfirmPassword ? 'text' : 'password'} name='confirmPassword' onChange={formik.handleChange} label={t('Confirm Password')} value={formik.values.confirmPassword} error={formik.errors.confirmPassword && formik.touched.confirmPassword ? formik.errors.confirmPassword : ''} />} */}

						<Dropdown placeholder={t('-- Select Role --')} required={true} name='roleId' onChange={formik.handleChange} value={formik.values.roleId} options={roleDrpData} id='roleId' label={t('Role')} error={formik.errors.roleId && formik.touched.roleId ? formik.errors.roleId : ''} />
					</div>
				</div>
				<div className='card-footer btn-group'>
					<Button className='btn-primary ' type='submit' label={t('Save')}>
						<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
							<CheckCircle />
						</span>
					</Button>
					<Button className='btn-secondary' label={t('Cancel')} onClick={onCancelSubAdmin}>
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
