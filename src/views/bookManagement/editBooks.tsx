import { useMutation, useQuery } from '@apollo/client';
import { Loader } from '@components/index';
import { useTranslation } from 'react-i18next';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextInput from '@components/textinput/TextInput';
import { editBookInfo } from '@type/bookManagement';
import { whiteSpaceRemover } from '@utils/helpers';
import { useFormik } from 'formik';
import useValidation from '@src/hooks/validations';
import { UPDATE_BOOK_INFO } from '@framework/graphql/mutations/bookManagement';
import Button from '@components/button/button';
import { CheckCircle, Cross } from '@components/icons/icons';
import { IS_ALL, ROUTES } from '@config/constant';
import {
  // FETCH_BOOK_BY_ID,
  REFINE_ABOUT_AUTHOR,
  REFINE_ABOUT_BOOK,
} from '@framework/graphql/queries/bookManagement';
import { FETCH_CATEGORY } from '@framework/graphql/queries/category';
import { MultiSelect } from 'primereact/multiselect';
import i18n from '@src/i18n';
import TextArea from '@components/textarea/TextArea';
import { useForm, useFieldArray } from 'react-hook-form';
// import { toast } from 'react-toastify';
import RefineText from '@components/popup/refineText';

const editBooks = (): ReactElement => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const [updateBookInfo, { loading: updateLoader }] =
    useMutation(UPDATE_BOOK_INFO);
  const [refineAboutBook, { loading: refineAboutBookLoader }] =
    useMutation(REFINE_ABOUT_BOOK);
  const [refineAboutAuthor, { loading: refineAboutAuthorLoader }] =
    useMutation(REFINE_ABOUT_AUTHOR);
  const { data, refetch: fetchAllCategories } = useQuery(FETCH_CATEGORY, {
    variables: { isAll: IS_ALL },
  });
  const [categoryDroData, setCategoryDroData] = useState([]);
  const [showRefinePopup, setShowRefinePopup] = useState(false);
  const [refineData, setRefineData] = useState('');
  const [refineFieldKey, setRefineFieldKey] = useState('');
  // const { data: bookData, loading: loader } = useQuery(FETCH_BOOK_BY_ID, {
  //   variables: { uuid: params.id },
  //   skip: !params.id,
  //   fetchPolicy: 'network-only',
  // });
  const { addBookInfoValidationSchema } = useValidation();

  const initialValues: editBookInfo = {
    title: '',
    categoryId: [],
    authorId: [],
    whatsInside: '',
    aboutAuthor: '',
    coverImage: '',
    learningPoints: [],
  };

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      learningPoints: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'learningPoints',
  });

  const UpdateBookInfoFunction = (values: editBookInfo) => {
    updateBookInfo({
      variables: {
        uuid: params?.id,
        title: values?.title,
      },
    })
      .then((res) => {
        const data = res.data as editBookInfo;
        if (data.updateSubAdmin.meta.statusCode === 200) {
          formik.resetForm();
          onCancelEditBookInfo();
        }
      })
      .catch(() => {
        return;
      });
  };

  const formik = useFormik({
    initialValues,
    validationSchema: addBookInfoValidationSchema,
    onSubmit: (values) => {
      UpdateBookInfoFunction(values);
    },
  });

  /**
   * Method that refine the input text
   */
  const handleRefineClick = (key: string) => {
    if (key === 'whatsInside') {
      refineAboutBook({
        variables: { uuid: params.id },
      })
        .then((res) => {
          const data = res.data;
          if (data.refineAboutBook.meta.statusCode === 200) {
            setRefineData(data.refineAboutBook.data.refinedData);
            setRefineFieldKey(key);
            setShowRefinePopup(true);
          }
        })
        .catch(() => {
          return;
        });
    } else if (key === 'aboutAuthor') {
      refineAboutAuthor({
        variables: { uuid: params.id },
      })
        .then((res) => {
          const data = res.data;
          if (data.refineAboutAuthor.meta.statusCode === 200) {
            setRefineData(data.refineAboutAuthor.data.refinedData);
            setRefineFieldKey(key);
            setShowRefinePopup(true);
          }
        })
        .catch(() => {
          return;
        });
    }
  };

  useEffect(() => {
    fetchAllCategories();
    if (data?.getAllCategories?.data?.categories?.length) {
      const tempDataArr = data.getAllCategories.data.categories.map(
        (category: any) => {
          let translation;
          if (Array.isArray(category.category_translations)) {
            translation =
              category.category_translations.find(
                (tr: any) => tr.lang_code === i18n.language
              ) ||
              category.category_translations.find(
                (tr: any) => tr.lang_code === 'en'
              ) ||
              category.category_translations[0];
          }
          return {
            name: translation?.name || category.slug || '',
            key: category.uuid,
          };
        }
      );
      setCategoryDroData(tempDataArr);
    }
  }, [data]);

  /**
   * Method that redirect to list page
   */
  const onCancelEditBookInfo = useCallback(() => {
    navigate(`/${ROUTES.app}/${ROUTES.manageBooks}/${ROUTES.list}`);
  }, []);

  /**
   * error message handler
   * @param fieldName
   * @returns
   */
  const getErrorSubAdmin = (fieldName: keyof editBookInfo) => {
    return formik.errors[fieldName] && formik.touched[fieldName]
      ? formik.errors[fieldName]
      : '';
  };

  /**
   * Handle blur that removes white space's
   */

  const OnBlur = useCallback((e: any) => {
    formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
  }, []);

  return (
    <div className='card'>
      {(
        // loader ||
        updateLoader ||
        refineAboutAuthorLoader ||
        refineAboutBookLoader) && <Loader />}
      <form onSubmit={formik.handleSubmit}>
        <div className='card-body'>
          <h2 className='text-xl font-semibold mb-4'>Book Information</h2>
          <div className='card-title-container'>
            <p>
              {t('Fields marked with')} <span className='error'>*</span>{' '}
              {t('are mandatory.')}
            </p>
          </div>
          <div className='card-grid-addedit-page'>
            <div>
              <TextInput
                id={'title'}
                onBlur={OnBlur}
                required={true}
                placeholder={t('Book Title')}
                name='title'
                onChange={formik.handleChange}
                label={t('Book Title')}
                value={formik.values.title}
                error={getErrorSubAdmin('title')}
              />
            </div>
            <div>
              <label htmlFor='categoryId' className='block mb-2 font-medium'>
                {t('Select Categories')} <span className='error'>*</span>
              </label>
              <MultiSelect
                id={'categoryId'}
                value={formik.values.categoryId || []}
                onChange={(e) => formik.setFieldValue('categoryId', e.value)}
                options={categoryDroData}
                optionLabel='name'
                optionValue='key'
                filter
                placeholder={t('Select Category') ?? 'Select Category'}
                display='chip'
                className='w-full'
                maxSelectedLabels={6}
              />
            </div>
            <div>
              <label htmlFor='authorId' className='block mb-2 font-medium'>
                {t('Select Author')} <span className='error'>*</span>
              </label>
              <MultiSelect
                id={'authorId'}
                value={formik.values.authorId || []}
                onChange={(e) => formik.setFieldValue('authorId', e.value)}
                options={categoryDroData}
                optionLabel='name'
                optionValue='key'
                filter
                placeholder={t('Select Author') ?? 'Select Author'}
                display='chip'
                className='w-full'
                maxSelectedLabels={6}
              />
            </div>
            <div>
              <label htmlFor='whatsInside' className='block mb-2 font-medium'>
                {t('Whats Inside (About)')} <span className='error'>*</span>
              </label>
              <TextArea
                id='whatsInside'
                name='whatsInside'
                onChange={formik.handleChange}
                placeholder=''
                onBlur={OnBlur}
                value={formik.values.whatsInside}
                rows={4}
                className='form-input w-full border border-gray-300 rounded-md px-3 py-2'
                error={getErrorSubAdmin('whatsInside')}
              />
              <button
                type='button'
                className='btn btn-secondary h-fit mt-1'
                onClick={() => handleRefineClick('whatsInside')}
              >
                Refine
              </button>
            </div>
            <div>
              <label htmlFor='aboutAuthor' className='block mb-2 font-medium'>
                {t('About Author')} <span className='error'>*</span>
              </label>
              <TextArea
                id='aboutAuthor'
                name='aboutAuthor'
                onChange={formik.handleChange}
                placeholder=''
                onBlur={OnBlur}
                value={formik.values.aboutAuthor}
                rows={4}
                className='form-input w-full border border-gray-300 rounded-md px-3 py-2'
                error={getErrorSubAdmin('aboutAuthor')}
              />
              <button
                type='button'
                className='btn btn-secondary h-fit mt-1'
                onClick={() => handleRefineClick('aboutAuthor')}
              >
                Refine
              </button>
            </div>
            <div>
              <TextInput
                type='file'
                id={'coverImage'}
                onBlur={OnBlur}
                required={true}
                placeholder={t('Cover')}
                name='coverImage'
                onChange={formik.handleChange}
                label={t('Cover')}
                value={formik.values.coverImage}
                error={getErrorSubAdmin('coverImage')}
              />
            </div>
            <div>
              <label className='block mb-2 font-medium'>
                {t('Learning Points')} <span className='error'>*</span>
              </label>
              {fields.map((field, index) => (
                <div key={field.id} className='flex items-center gap-2 mb-2'>
                  <input
                    {...register(`learningPoints.${index}.value`)}
                    defaultValue={field.value}
                    placeholder={`Point ${index + 1}`}
                    className='form-input w-full border border-gray-300 rounded-md px-3 py-2'
                  />
                  <button
                    type='button'
                    onClick={() => remove(index)}
                    className='btn btn-secondary'
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type='button'
                onClick={() => append({ value: '' })}
                className='btn btn-secondary'
              >
                + Add Learning Point
              </button>
            </div>
          </div>
        </div>
        <div className='card-footer btn-group'>
          <Button className='btn-primary ' type='submit' label={t('Save')}>
            <span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
              <CheckCircle />
            </span>
          </Button>
          <Button
            className='btn-secondary'
            label={t('Cancel')}
            onClick={onCancelEditBookInfo}
          >
            <span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
              <Cross />
            </span>
          </Button>
        </div>
      </form>
      {showRefinePopup && refineFieldKey && (
        <RefineText
          refinedText={refineData}
          fieldLabel={`Refined ${t(
            refineFieldKey === 'whatsInside' ? 'About Book' : 'About Author'
          )}`}
          onAccept={() => {
            formik.setFieldValue(refineFieldKey, refineData);
            setShowRefinePopup(false);
            setRefineFieldKey('');
          }}
          onCancel={() => {
            setShowRefinePopup(false);
            setRefineFieldKey('');
          }}
        />
      )}
    </div>
  );
};

export default editBooks;
