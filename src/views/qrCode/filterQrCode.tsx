import React, { useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { Refresh, Search } from '@components/icons/icons';
import filterServiceProps from '@components/filter/filter';
import { FilterQrCodeProps, QrCodeProps } from '@type/qrcode';

const FilterQrCode = ({ onSearchQrCode, clearSelectionQrCode, filterData }: QrCodeProps) => {
	const { t } = useTranslation();
	const initialValues: FilterQrCodeProps = {
		url: '',
	};
	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			clearSelectionQrCode();
			onSearchQrCode(values);
		},
	});

	useEffect(() => {
		const savedFilterDataJSONUser = filterServiceProps.getState('filterQrCode', JSON.stringify(filterData));

		// Parse the JSON data retrieved from local storage
		const savedFilterData = JSON.parse(savedFilterDataJSONUser);

		// Set the formik field values using setValues
		formik.setValues(savedFilterData || initialValues);
	}, []);
	/**
	 * method that reset filter data
	 */
	const onResetQrCode = useCallback(() => {
		formik.resetForm();
		onSearchQrCode(initialValues);
	}, []);
	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter '>
						<div className='lg:col-span-1'>
							<TextInput type='text' id='url' name='url' value={formik.values.url} placeholder={t('Url ')} onChange={formik.handleChange} />
						</div>
						<div className='md:col-span-2 [.show-menu~div_&]:md:col-span-1 [.show-menu~div_&]:lg:col-span-2'>
							<div className='btn-group  flex items-start justify-end '>
								<Button className='btn-primary ' type='submit' label={t('Search')}>
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Search />
									</span>
								</Button>
								<Button className='btn-warning ' onClick={onResetQrCode} label={t('Reset')}>
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
export default FilterQrCode;
