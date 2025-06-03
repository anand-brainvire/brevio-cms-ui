import { useMutation, useQuery } from '@apollo/client';
import Button from '@components/button/button';
import Dropdown from '@components/dropdown/dropDown';
import { CheckCircle, Cross } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import { ROUTES } from '@config/constant';
import { CreateRulesSetRes, UpdateRuleSetRes } from '@framework/graphql/graphql';
import { CREATE_RULES_SET, UPDATE_MANAGE_RULES_SET } from '@framework/graphql/mutations/manageRulesSets';
import { FETCH_RULES_SET_BY_ID } from '@framework/graphql/queries/manageRulesSets';
import { useFormik } from 'formik';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreateRulesSet } from '@type/manageRulesSets';
import useValidation from '@src/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import WithTranslateFormErrors from '@components/customHooks/useTranslationFormErrors';
import TextArea from '@components/textarea/TextArea';

const AddEditRulesSets = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const updateRuleSetId = useParams();
	const { data: ruleData, refetch } = useQuery(FETCH_RULES_SET_BY_ID, { fetchPolicy: 'network-only' });
	const [createRulesSet] = useMutation(CREATE_RULES_SET);
	const [updateRulesSet] = useMutation(UPDATE_MANAGE_RULES_SET);
	const { manageRuleSetValidationsSchema } = useValidation();
	const initialValues: CreateRulesSet = {
		ruleName: '',
		description: '',
		priority: '1',
		onAction: '',
	};
	const PriorityDrp = [
		{ name: t('Low'), key: 'low' },
		{ name: t('High'), key: 'high' },
		{ name: t('Medium'), key: 'medium' },
	];
	const onActionDrp = [
		{ name: t('Both'), key: 'both' },
		{ name: t('Signup'), key: 'signup' },
		{ name: t('Signin'), key: 'signin' },
	];
	/**
	 *fetchs the data based on rules sets id
	 */
	useEffect(() => {
		if (updateRuleSetId?.id) {
			refetch({
				fetchSingleSetRuleId: updateRuleSetId?.id,
			}).catch((err) => toast.error(err));
		}
	}, [updateRuleSetId?.id]);
	/**
	 * Method used for setvalue from rules sets data by id
	 */

	useEffect(() => {
		if (ruleData?.fetchSingleSetRule && updateRuleSetId?.id) {
			const data = ruleData?.fetchSingleSetRule?.data;

			formik
				.setValues({
					ruleName: data?.rule_name,
					description: data?.description,
					priority: data?.priority,
					onAction: data?.on_action,
				})
				.catch((err) => {
					toast.error(err);
				});
		}
	}, [ruleData?.fetchSingleSetRule]);

	const validationSchema = manageRuleSetValidationsSchema;
	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			if (updateRuleSetId.id) {
				updateRulesSet({
					variables: {
						updateSetRuleId: parseInt(updateRuleSetId.id),
						ruleName: values.ruleName,
						description: values.description,
						priority: values.priority,
						onAction: values.onAction,
					},
				})
					.then((res) => {
						const data = res.data as UpdateRuleSetRes;

						if (data?.updateSetRule.meta.statusCode === 200) {
							toast.success(data?.updateSetRule.meta.message);
							formik.resetForm();
							onCancel();
						}
					})
					.catch(() => {
						return;
					});
			} else {
				createRulesSet({
					variables: {
						ruleName: values.ruleName,
						description: values.description,
						priority: values.priority,
						onAction: values.onAction,
						createdBy: 2,
					},
				})
					.then((res) => {
						const data = res.data as CreateRulesSetRes;

						if (data.createSetRule.meta.statusCode === 200) {
							toast.success(data.createSetRule.meta.message);
							navigate(`/${ROUTES.app}/${ROUTES.manageRulesSets}/${ROUTES.list}`);
							formik.resetForm();
						}
					})
					.catch(() => {
						return;
					});
			}
		},
	});
	/**
	 * on clicking cancel it will redirect to main rules page
	 */

	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.manageRulesSets}/${ROUTES.list}`);
	}, []);
	const OnBlurRules = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
	return (
		<div>
			<div className='card'>
				<WithTranslateFormErrors errors={formik.errors} touched={formik.touched} setFieldTouched={formik.setFieldTouched}>
					<form onSubmit={formik.handleSubmit}>
						<div className='card-body'>
							<div className='card-title-container'>
								<p>
									{t('Fields marked with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
								</p>
							</div>
							<div className='card-grid-addedit-page md:grid-cols-2 '>
								<div>
									<TextInput required={true} type='text' id='ruleName' placeholder={t('Rule Name')} name='ruleName' onChange={formik.handleChange} onBlur={OnBlurRules} label={t('Rule Name')} value={formik.values.ruleName} error={formik.errors.ruleName && formik.touched.ruleName ? formik.errors.ruleName : ''} />
								</div>
								<div>
									<TextArea id='description' label={t('Description')} placeholder={`${t('Description')}`} name='description' onChange={formik.handleChange} onBlur={OnBlurRules} value={formik.values.description} error={formik.errors.description && formik.touched.description ? formik.errors.description : ''} rows={2}></TextArea>
								</div>

								<Dropdown required={true} name='priority' onChange={formik.handleChange} value={formik.values.priority} options={PriorityDrp} id='priority' label={t('Priority')} error={formik.errors.priority && formik.touched.priority ? formik.errors.priority : ''} />

								<Dropdown required={true} placeholder={t('Select Action')} name='onAction' onChange={formik.handleChange} value={formik.values.onAction} options={onActionDrp} id='onAction' label={t('On Action')} error={formik.errors.onAction && formik.touched.onAction ? formik.errors.onAction : ''} />
							</div>
						</div>
						<div className='btn-group  card-footer'>
							<Button className='btn-primary ' type='submit' label={updateRuleSetId.id ? t('Update') : t('Save')}>
								<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
									<CheckCircle />
								</span>
							</Button>
							<Button className='btn-warning  ' label={t('Cancel')} onClick={onCancel}>
								<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
									<Cross />
								</span>
							</Button>
						</div>
					</form>
				</WithTranslateFormErrors>
			</div>
		</div>
	);
};
export default AddEditRulesSets;
