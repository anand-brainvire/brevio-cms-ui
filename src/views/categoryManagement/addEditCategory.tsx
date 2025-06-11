import { useMutation, useQuery } from '@apollo/client';
import { IS_ALL, ROUTES, STATUS, STATUS_RADIO } from '@config/constant';
import { CREATE_FAQ_MUTATION, UPDATE_FAQ_DATA } from '@framework/graphql/mutations/faq';
import { GET_FAQBYID_DATA, GET_FAQ_TOPICS } from '@framework/graphql/queries/faq';
import { useFormik } from 'formik';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DropdownOptionType } from '@type/component';
import Dropdown from '@components/dropdown/dropDown';
import { CreateFaq, FaqTopicDataArr } from '@type/faq';
import { CheckCircle, Cross } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import RadioButton from '@components/radiobutton/radioButton';
import { whiteSpaceRemover } from '@utils/helpers';
import TextArea from '@components/textarea/TextArea';
import { Loader } from '@components/index';
const AddEditFaq = (): ReactElement => {
	const { t } = useTranslation();
	const { data, refetch: fetchAllFaqTopics } = useQuery(GET_FAQ_TOPICS, { variables: { isAll: IS_ALL } });
	const [faqDrpData, setFaqDrpData] = useState<DropdownOptionType[]>([]);
	const [createFaq, { loading: createLoader }] = useMutation(CREATE_FAQ_MUTATION);
	const [updateFaq, { loading: updateLoader }] = useMutation(UPDATE_FAQ_DATA);
	const navigate = useNavigate();
	const params = useParams();
	const { data: faqByIdData } = useQuery(GET_FAQBYID_DATA, {
		variables: { faqId: params.id },
		skip: !params.id,
		fetchPolicy: 'network-only',
	});
	const { addFaqValidationSchema } = useValidation();
	/**
	 * Method used for set faq data array for dropdown
	 */
	useEffect(() => {
		fetchAllFaqTopics({ isAll: IS_ALL });
		if (data?.fetchFaqTopics) {
			const tempDataArr = [] as DropdownOptionType[];
			data?.fetchFaqTopics?.data?.faqTopicData?.map((data: FaqTopicDataArr) => {
				tempDataArr.push({ name: data.name, key: data.id });
			});
			setFaqDrpData(tempDataArr);
		}
	}, [data?.fetchFaqTopics]);
	/**
	 * Sets's form data while edit time
	 */
	useEffect(() => {
		if (faqByIdData && params.id) {
			const data = faqByIdData?.getFaq?.data;
			formik
				.setValues({
					topicId: data?.topic_id,
					questionEnglish: data?.question_english,
					questionArabic: data?.question_arabic,
					questionHindi: data?.question_hindi,
					answerEnglish: data?.answer_english,
					answerArabic: data?.answer_arabic,
					answerHindi: data?.answer_hindi,
					status: data?.status,
				})
				.catch((e) => toast.error(e));
		}
	}, [faqByIdData]);
	const initialValues = {
		topicId: '',
		questionEnglish: '',
		questionArabic: '',
		questionHindi: '',
		answerEnglish: '',
		answerArabic: '',
		answerHindi: '',
		status: STATUS.active,
	};

	const formik = useFormik({
		initialValues,
		validationSchema: addFaqValidationSchema,
		onSubmit: (values) => {
			const commonValues = {
				topicId: parseInt(values.topicId),
				questionEnglish: values.questionEnglish,
				questionArabic: values.questionArabic,
				questionHindi: values.questionHindi,
				answerEnglish: values.answerEnglish,
				answerArabic: values.answerArabic,
				answerHindi: values.answerHindi,
				status: +values.status,
			};
			if (params.id) {
				updateFaq({
					variables: {
						updateFaqId: params.id,
						...commonValues,
					},
				})
					.then((res) => {
						const data = res.data;
						if (data?.updateFaq.meta.statusCode === 200) {
							toast.success(data.updateFaq.meta.message);
							formik.resetForm();
							onCancelFaq();
						}
					})
					.catch(() => {
						return;
					});
			} else {
				createFaq({
					variables: {
						...commonValues,
					},
				})
					.then((res) => {
						const data = res.data;
						if (data.createFaq.meta.statusCode === 200) {
							toast.success(data.createFaq.meta.message);
							formik.resetForm();
							onCancelFaq();
						}
					})
					.catch(() => {
						return;
					});
			}
		},
	});
	/**
	 * On cancle redirect to list view
	 */
	const onCancelFaq = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.faq}/${ROUTES.list}`);
	}, []);
	/**
	 * Handle blur that removes white space's
	 */
	const OnBlurFaq = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
	/**
	 * Error message handler
	 * @param fieldName
	 * @returns
	 */
	const getErrorFaq = (fieldName: keyof CreateFaq) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	return (
		<div className='card'>
			{(createLoader || updateLoader) && <Loader />}
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-title-container'>
						<p>
							{t('Fields marked with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
						</p>
					</div>
					<div className='card-grid-addedit-page'>
						<Dropdown required={true} placeholder={t('Select FAQ Topic')} name='topicId' onChange={formik.handleChange} value={formik.values.topicId} options={faqDrpData} id='topicId' label={t('FAQ Topic')} error={getErrorFaq('topicId')} />

						<div>
							<TextInput id={'questionEnglish'} required={true} placeholder={t('Question')} name='questionEnglish' onChange={formik.handleChange} label={t('Question (English)')} value={formik.values.questionEnglish} error={getErrorFaq('questionEnglish')} onBlur={OnBlurFaq} />
						</div>
						<div>
							<TextInput label={t('Question (Arabic)')} required={true} onBlur={OnBlurFaq} type='text' className={'text-right'} id='questionArabic' placeholder={`${t('Question')}`} name='questionArabic' onChange={formik.handleChange} value={formik.values.questionArabic} error={getErrorFaq('questionArabic')} />
						</div>

						<div>
							<TextInput id='questionHindi' required={true} placeholder={t('Question')} name='questionHindi' onChange={formik.handleChange} label={t('Question (Hindi)')} value={formik.values.questionHindi} error={getErrorFaq('questionHindi')} onBlur={OnBlurFaq} />
						</div>
						<div>
							<TextArea required={true} id='answerEnglish' placeholder={`${t('Answer')}`} name='answerEnglish' onChange={formik.handleChange} value={formik.values.answerEnglish} onBlur={OnBlurFaq} label={t('Answer (English)')} error={getErrorFaq('answerEnglish')} />
						</div>

						<div>
							<TextArea className={'text-right'} required={true} id='answerArabic' label={t('Answer (Arabic)')} placeholder={`${t('Answer')}`} name='answerArabic' onChange={formik.handleChange} value={formik.values.answerArabic} onBlur={OnBlurFaq} error={getErrorFaq('answerArabic')}></TextArea>
						</div>

						<div>
							<TextArea label={t('Answer (Hindi)')} id='answerHindi' placeholder={`${t('Answer')}`} name='answerHindi' onChange={formik.handleChange} value={formik.values.answerHindi} rows={4} cols={50} onBlur={OnBlurFaq} error={getErrorFaq('answerHindi')}></TextArea>
						</div>

						<RadioButton id={'statusFaq'} required={true} checked={formik.values.status} onChange={formik.handleChange} name={'status'} radioOptions={STATUS_RADIO} label={t('Status')} />
					</div>
				</div>
				<hr />
				<div className='card-footer btn-group'>
					<Button className='btn-primary ' type='submit' label={params.id ? t('Update') : t('Save')}>
						<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
							<CheckCircle />
						</span>
					</Button>
					<Button className='btn-warning ' label={t('Cancel')} onClick={onCancelFaq}>
						<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
							<Cross />
						</span>
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AddEditFaq;
