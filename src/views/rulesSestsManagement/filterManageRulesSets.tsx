import React, { useCallback } from 'react';
import { RulesSetsProps, FilterDataArrRulesProps } from '@type/manageRulesSets';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textinput/TextInput';
import Dropdown from '@components/dropdown/dropDown';
import { AccesibilityNames, STATUS_DRP } from '@config/constant';
import Button from '@components/button/button';
import { Refresh, Search } from '@components/icons/icons';

const FilterManageRulesSets = ({ onSearchManageRulesSets, clearSelectionRuleSets }: RulesSetsProps) => {
	const { t } = useTranslation();

	const initialValues: FilterDataArrRulesProps = {
		ruleName: '',
		RulesStatus: '',
	};

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			clearSelectionRuleSets();
			onSearchManageRulesSets(values);
		},
	});
	/**
	 * method that reset filter data
	 */
	const onResetRules = useCallback(() => {
		formik.resetForm();
		onSearchManageRulesSets(initialValues);
	}, []);
	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter'>
						<div>
							<TextInput id={'ruleName'} placeholder={t('Rule Name')} name='ruleName' type='text' onChange={formik.handleChange} value={formik.values.ruleName} />
						</div>

						<Dropdown ariaLabel={AccesibilityNames.Status} placeholder={t('')} name='RulesStatus' onChange={formik.handleChange} value={formik.values.RulesStatus ?? ''} options={STATUS_DRP} id='status' />

						<div className='col-span-1 sm:col-span-2 md:col-span-1 [.show-menu~div_&]:col-span-1 [.show-menu~div_&]:md:col-span-2 [.show-menu~div_&]:lg:col-span-1'>
							<div className='btn-group  flex items-start justify-end '>
								<Button className='btn-primary ' type='submit' label={t('Search')}>
									{' '}
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Search />
									</span>
								</Button>
								<Button className='btn-warning ' onClick={onResetRules} label={t('Reset')}>
									{' '}
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
export default FilterManageRulesSets;
