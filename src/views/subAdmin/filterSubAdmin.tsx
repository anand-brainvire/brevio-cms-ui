import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useQuery } from '@apollo/client';
import Button from '@components/button/button';
import { Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import { AccesibilityNames, IS_ALL, STATUS_DRP } from '@config/constant';
import { RoleDataArr } from '@framework/graphql/graphql';
import { GET_ROLES_DATALIST } from '@framework/graphql/queries/role';
import { useTranslation } from 'react-i18next';
import { DropdownOptionType } from '@type/component';
import { SubAdminProps, FilterSubadminProps } from '@type/subAdmin';
import DropDown from '@components/dropdown/dropDown';
import filterServiceProps from '@components/filter/filter';

const FilterSubAdmin = ({ onSearchSubAdmin, filterData }: SubAdminProps): ReactElement => {
	const { t } = useTranslation();
	const { data } = useQuery(GET_ROLES_DATALIST, { variables: { isAll: IS_ALL }, fetchPolicy: 'network-only' });
	const [roleDrpData, setRoleDrpData] = useState<DropdownOptionType[]>([]);
	const initialValues: FilterSubadminProps = {
		firstName: '',
		lastName: '',
		email: '',
		status: '',
		role: '',
	};
	/**
	 * Method that fetch's role data and set to dropdown
	 */
	useEffect(() => {
		if (data?.fetchRoles?.data?.Roledata) {
			const tempDataArr = [] as DropdownOptionType[];
			data?.fetchRoles?.data?.Roledata.map((data: RoleDataArr) => {
				tempDataArr.push({ name: data.role_name, key: data.id });
			});
			setRoleDrpData(tempDataArr);
		}
	}, [data]);
	/**
	 * Method that sets filterdata in local storage
	 */
	useEffect(() => {
		const savedFilterDataJSONUser = filterServiceProps.getState('filtersubadmin', JSON.stringify(filterData));

		// Parse the JSON data retrieved from local storage
		const savedFilterData = JSON.parse(savedFilterDataJSONUser);

		// Set the formik field values using setValues
		formik.setValues(savedFilterData || initialValues);
	}, [filterData]);
	const formik = useFormik({
		initialValues,

		onSubmit: (values) => {
			onSearchSubAdmin(values);
		},
	});
	/**
	 * method that reset filter data
	 */
	const onReset = useCallback(() => {
		formik.resetForm();
		onSearchSubAdmin(initialValues);
	}, []);

	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter'>
						<TextInput id={'firstName'} placeholder={t('First Name')} name='firstName' type='text' onChange={formik.handleChange} value={formik.values.firstName} />

						<TextInput id={'lastName'} placeholder={t('Last Name')} name='lastName' type='text' onChange={formik.handleChange} value={formik.values.lastName} />

						<TextInput id={'email'} placeholder={t('Email')} name='email' onChange={formik.handleChange} value={formik.values.email} />

						<DropDown ariaLabel={AccesibilityNames.Status} placeholder={''} name='status' onChange={formik.handleChange} value={formik.values.status ?? ''} options={STATUS_DRP} id='status' />

						<DropDown ariaLabel={AccesibilityNames.role} placeholder={t('Select Role')} name='role' onChange={formik.handleChange} value={formik.values.role ?? ''} options={roleDrpData} id='role' />

						<div>
							<div className='btn-group flex items-start justify-end'>
								<Button type='submit' className='btn-primary ' label={t('Search')}>
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Search />
									</span>
								</Button>
								<Button onClick={onReset} className='btn-warning ' label={t('Reset')}>
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Refresh />
									</span>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};
export default FilterSubAdmin;
