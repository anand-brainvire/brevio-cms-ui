import { useMutation, useQuery } from '@apollo/client';
import { Loader } from '@components/index';
import { useTranslation } from 'react-i18next';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextInput from '@components/textinput/TextInput';
import { editBookInfo } from '@type/bookManagement';
import { uploadFile, whiteSpaceRemover } from '@utils/helpers';
import { useFormik } from 'formik';
// import useValidation from '@src/hooks/validations';
import {
  REFINE_ABOUT_AUTHOR,
  REFINE_ABOUT_BOOK,
  REFINE_LEARNING_POINTS,
  TOGGLE_FREE_BOOK,
  UPDATE_BOOK_INFO,
  PUBLISH_BOOK,
} from '@framework/graphql/mutations/bookManagement';
import Button from '@components/button/button';
import { CheckCircle, Cross } from '@components/icons/icons';
import { IS_ALL, ROUTES } from '@config/constant';
import { FETCH_BOOK_BY_ID } from '@framework/graphql/queries/bookManagement';
import { FETCH_CATEGORY } from '@framework/graphql/queries/category';
import { MultiSelect } from 'primereact/multiselect';
import i18n from '@src/i18n';
import TextArea from '@components/textarea/TextArea';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import RefineText from '@components/popup/refineText';
import { GET_AUTHOR } from '@framework/graphql/queries/author';

const editBooks = (): ReactElement => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const [updateBookInfo, { loading: updateLoader }] =
    useMutation(UPDATE_BOOK_INFO);
  const [publishBook, { loading: publishBookLoading }] =
    useMutation(PUBLISH_BOOK);
  const [refineAboutBook, { loading: refineAboutBookLoader }] =
    useMutation(REFINE_ABOUT_BOOK);
  const [refineAboutAuthor, { loading: refineAboutAuthorLoader }] =
    useMutation(REFINE_ABOUT_AUTHOR);
  const [refineLearningPoints, { loading: refineLearningPointsLoader }] =
    useMutation(REFINE_LEARNING_POINTS);
  const [freeBookStatus, { loading: freeBookLoader }] =
    useMutation(TOGGLE_FREE_BOOK);
  const { data, refetch: fetchAllCategories } = useQuery(FETCH_CATEGORY, {
    variables: { isAll: IS_ALL },
  });
  const [categoryDroData, setCategoryDroData] = useState([]);
  const [showRefinePopup, setShowRefinePopup] = useState(false);
  const [refineData, setRefineData] = useState('');
  const [refineFieldKey, setRefineFieldKey] = useState('');
  const [isFreeBook, setIsFreeBook] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File>();
  const [selectedTab, setSelectedTab] = useState<'draft' | 'published'>(
    'draft'
  );
  const isEditable = selectedTab === 'draft';

  const {
    data: bookByIdData,
    loading: loader,
    refetch,
  } = useQuery(FETCH_BOOK_BY_ID, {
    variables: { uuid: params.id },
    skip: !params.id,
    fetchPolicy: 'network-only',
  });
  const [hasMoreAuthors, setHasMoreAuthors] = useState(true);
  type RawAuthor = {
    uuid: string;
    author_translations: {
      lang_code: string;
      name: string;
    }[];
  };

  type TransformedAuthor = {
    id: string;
    name: string;
  };

  const [authors, setAuthors] = useState<TransformedAuthor[]>([]);
  const { loading: authorLoading, fetchMore } = useQuery(GET_AUTHOR, {
    fetchPolicy: 'network-only',
    variables: {
      limit: 75,
      offset: 0,
    },
    onCompleted: (res) => {
      const rawAuthors = res?.getAllAuthors?.data?.authors || [];
      const newAuthors = transformAuthors(rawAuthors);
      setAuthors(newAuthors);
      setHasMoreAuthors(newAuthors.length === 75);
    },
  });
  // const { addBookInfoValidationSchema } = useValidation();
  const initialValues: editBookInfo = {
    title: '',
    categoryId: [],
    authorId: [],
    whatsInside: '',
    aboutAuthor: '',
    coverImage: null,
    learningPoints: [],
  };

  const transformAuthors = (rawAuthors: RawAuthor[]): TransformedAuthor[] => {
    return rawAuthors.map((author) => {
      const name =
        author.author_translations.find((t) => t.lang_code === 'en')?.name ??
        'Unknown';
      return {
        id: author.uuid,
        name,
      };
    });
  };

  useEffect(() => {
    if(!bookByIdData?.getBookById?.data || !params.id) {
     return;
    }
    const data = bookByIdData.getBookById.data;

    setIsFreeBook(!!data.is_free);

    // Get the matching version (draft or published)
    const version = data.versions?.find((v: any) => v.status === selectedTab);

    if (!version) {
      // If the version doesn't exist (e.g., no published version), clear form
      formik.setValues({
        title: '',
        authorId: [],
        categoryId: [],
        whatsInside: '',
        aboutAuthor: '',
        coverImage: '',
        learningPoints: [],
      });
      remove();
      formik.resetForm();
      reset({ learningPoints: [] }); // clear hook form fields (learning points)
      return;
    }

    // Get translation based on language preference
    const translation =
      version.translations?.find((t: any) => t.lang_code === i18n.language) ||
      version.translations?.find((t: any) => t.lang_code === 'en') ||
      version.translations?.[0];

    const authorId = version.authors?.map((a: any) => a.uuid) || [];
    const categoryId = version.categories?.map((c: any) => c.uuid) || [];

    const learningPoints =
      translation?.learning_points?.map((point: string) => ({
        value: point,
      })) || [];

    // Set the values in formik
    formik.setValues({
      title: translation?.title || '',
      authorId,
      categoryId,
      whatsInside: translation?.about_book || '',
      aboutAuthor: translation?.about_author || '',
      coverImage: version.cover_image_url || '',
      learningPoints,
    });
    remove();
    learningPoints.forEach((lp) => append(lp));
  }, [bookByIdData, selectedTab, params.id, i18n.language]);

  const { register, control, reset, getValues } = useForm({
    defaultValues: {
      learningPoints: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'learningPoints',
  });

  const UpdateBookInfoFunction = (values: editBookInfo) => {
    // const langCode = i18n.language || 'en';
    updateBookInfo({
      variables: {
        bookUuid: params?.id,
        categoryUuids: values.categoryId,
        authorsUuids: values.authorId,
        bookData: [
          {
            title: values.title,
            ['lang_code']: 'en',
            ['about_book']: values.whatsInside,
            ['about_author']: values.aboutAuthor,
            ['learning_points']: values.learningPoints.map((lp) => lp.value),
          },
        ],
      },
    })
      .then((res) => {
        const data = res.data;
        if (data.updateBookInfo?.meta?.statusCode === 200) {
          toast.success(t('Book updated successfully'));
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
    // validationSchema: addBookInfoValidationSchema,
    onSubmit: (values) => {
      UpdateBookInfoFunction(values);
    },
  });

  /*
  Method to publish the book
  */
  const handlePublishBook = async () => {
    // Get latest values from Formik and RHF
    const values = formik.values;
    const rhfLearningPoints = getValues('learningPoints');
    // Sync RHF learning points to Formik
    const learningPoints = rhfLearningPoints.map((lp) => lp.value);

    try {
      const bookDataObj = {};
      Object.assign(bookDataObj, {
        title: values.title,
        ['learning_points']: learningPoints,
        ['lang_code']: 'en', // or i18n.language if needed
        ['about_book']: values.whatsInside,
        ['about_author']: values.aboutAuthor,
      });
      const { data } = await publishBook({
        variables: {
          input: {
            ['book_uuid']: params.id,
            ['category_uuids']: values.categoryId,
            ['authors_uuids']: values.authorId,
            ['book_data']: [{ ...bookDataObj }],
          },
        },
      });

      if (data?.publishBook?.meta?.statusCode === 200) {
        toast.success(t('Book published successfully'));
        refetch(); // Optionally refetch book data
      } else {
        toast.error(
          data?.publishBook?.meta?.message || t('Failed to publish book')
        );
      }
    } catch {
      return;
    }
  };

  /*
  method to validate cover image
  */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file){
      return;
    } 
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const ratio = width / height;
      const isRatioValid = Math.abs(ratio - 2 / 3) < 0.01;

      if (!isRatioValid) {
        toast.error('Image must be in 2:3 aspect ratio (e.g. 600x900)');
        formik.setFieldError('coverImage', 'Invalid aspect ratio');
        formik.setFieldValue('coverImage', null);
      } else {
        setCoverImageFile(file);
        formik.setFieldValue('coverImage', file);
      }

      URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      toast.error('Invalid image file');
      formik.setFieldValue('coverImage', null);
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };

  /*
  method to upload cover image
  */
  const handleUploadCoverImage = async () => {
    // const file = formik.values.coverImage;
    const bookUuid = params.id;
    if (!bookUuid || !coverImageFile){
      return;
    } 
    try {
      await uploadFile(
        [
          {
            name: 'coverImage',
            content: coverImageFile,
          },
        ],
        `cover-image?bookUuid=${bookUuid}`
      );

      toast.success('Cover image uploaded successfully');
    } catch {
      toast.error('Failed to upload cover image');
    }
  };

  /**
   * Method to change the free book status
   */
  const handleFreeBookStatus = async () => {
    try {
      const { data } = await freeBookStatus({
        variables: {
          uuid: params.id,
        },
      });

      if (data?.toggleFreeBook?.meta?.statusCode === 200) {
        toast.success(data.toggleFreeBook.meta.message);
        await refetch();
      } else {
        toast.error(
          data?.toggleFreeBook?.meta?.message || t('Failed to update status')
        );
      }
    } catch {
      return;
    }
  };

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
    } else if (key === 'learningPoints') {
      refineLearningPoints({
        variables: { uuid: params.id },
      }).then((res) => {
        const data = res.data;
        if (data.refineLearningPoints.meta.statusCode === 200) {
          setRefineData(data.refineLearningPoints.data.refinedData);
          setRefineFieldKey(key);
          setShowRefinePopup(true);
        }
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

  const handleSave = () => {
    const rhfLearningPoints = getValues('learningPoints');
    formik.setFieldValue('learningPoints', rhfLearningPoints, false); // false = don't validate immediately
    formik.handleSubmit();
  };

  return (
    <div className='card'>
      {(loader ||
        updateLoader ||
        refineAboutAuthorLoader ||
        refineAboutBookLoader ||
        refineLearningPointsLoader ||
        freeBookLoader ||
        publishBookLoading) && <Loader />}
      <form onSubmit={formik.handleSubmit}>
        <div className='card-body'>
          <div className='flex items-center justify-between w-full mb-4'>
            <h2 className='text-xl font-semibold'>Book Information</h2>
            <button
              type='button'
              className='btn btn-primary'
              onClick={handlePublishBook}
            >
              {t('Publish')}
            </button>
          </div>
          <div className='flex items-center justify-between w-full mb-4'>
            {/* Left side: Draft | Publish buttons */}
            <div className='flex border border-gray-300 rounded-tl-lg rounded-tr-lg overflow-hidden w-fit'>
              <button
                type='button'
                onClick={() => setSelectedTab('draft')}
                className={`px-8 py-4 text-sm font-medium rounded-none ${
                  selectedTab === 'draft'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                Draft
              </button>

              {/* {isPublished && ( */}
              <button
                type='button'
                onClick={() => setSelectedTab('published')}
                className={`px-8 py-4 text-sm font-medium rounded-none ${
                  selectedTab === 'published'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                Published
              </button>
              {/* )} */}
            </div>

            {/* Right side: Status badge + Free Book checkbox */}
            <div className='flex items-center gap-6'>
              {/* Status display */}
              <div className='flex items-center text-sm'>
                <span className='text-gray-700 mr-1'>{t('Status')}:</span>
                {selectedTab === 'published' ? (
                  <span className='bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded'>
                    {t('Published')}
                  </span>
                ) : (
                  // ) : selectedTab === 'unpublished' ? (
                  //   <span className='bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded'>
                  //     {t('Unpublished')}
                  //   </span>
                  <span className='bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded'>
                    {t('Draft')}
                  </span>
                )}
              </div>

              {/* Free Book Checkbox */}
              <label className='flex items-center gap-2 text-sm text-gray-700'>
                <input
                  type='checkbox'
                  checked={isFreeBook}
                  onChange={handleFreeBookStatus}
                  className='form-checkbox h-5 w-5 text-primary'
                />
                {t('Mark as free')}
              </label>
            </div>
          </div>

          <div className='border p-4 mt-[-1px]'>
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
                />
              </div>
              <div>
                <label htmlFor='authorId' className='block mb-2 font-medium'>
                  {t('Select Author')} <span className='error'>*</span>
                </label>
                <MultiSelect
                  id='authorId'
                  value={formik.values.authorId || []}
                  onChange={(e) => formik.setFieldValue('authorId', e.value)}
                  options={authors}
                  optionLabel='name'
                  optionValue='id'
                  filter
                  display='chip'
                  className='w-full'
                  maxSelectedLabels={6}
                  disabled={!isEditable}
                  virtualScrollerOptions={{
                    itemSize: 40,
                    lazy: true,
                    showLoader: true,
                    loading: authorLoading,
                    items: authors,
                    onLazyLoad: async () => {
                      if (!hasMoreAuthors || authorLoading) {
                        return;
                      } 
                      const { data } = await fetchMore({
                        variables: {
                          offset: authors.length,
                          limit: 75,
                        },
                      });
                      const newFetched = transformAuthors(
                        data?.getAllAuthors?.data?.authors || []
                      );
                      setAuthors((prev) => [...prev, ...newFetched]);
                      if (newFetched.length < 75){
                        setHasMoreAuthors(false);
                      } 
                    },
                  }}
                />
              </div>
              <div>
                <label htmlFor='whatsInside' className='block mb-2 font-medium'>
                  {t('Whats Inside (About)')} <span className='error'>*</span>
                </label>
                <div className='flex gap-2 items'>
                  <div className='w-full'>
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
                      disabled={!isEditable}
                    />
                  </div>
                  {isEditable && (
                    <button
                      type='button'
                      className='btn btn-secondary h-fit mt-1'
                      onClick={() => handleRefineClick('whatsInside')}
                    >
                      Refine
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor='aboutAuthor' className='block mb-2 font-medium'>
                  {t('About Author')} <span className='error'>*</span>
                </label>
                <div className='flex gap-2 items-center'>
                  <div className='w-full'>
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
                      disabled={!isEditable}
                    />
                  </div>
                  {isEditable && (
                    <button
                      type='button'
                      className='btn btn-secondary whitespace-nowrap'
                      onClick={() => handleRefineClick('aboutAuthor')}
                    >
                      Refine
                    </button>
                  )}
                </div>
              </div>
              <div className='flex items-end gap-4 mb-4'>
                {/* Cover Image File Input */}
                <div className='w-2/3'>
                  <TextInput
                    type='file'
                    id='coverImage'
                    onBlur={OnBlur}
                    placeholder={t('Cover')}
                    name='coverImage'
                    label={t('Cover')}
                    error={getErrorSubAdmin('coverImage')}
                    className='w-full' // fill the 2/3 parent width
                    disabled={!isEditable}
                    onChange={handleImageChange}
                  />
                </div>

                {/* Buttons aligned to input bottom */}
                {isEditable && (
                  <div className='flex gap-2'>
                    <button
                      type='button'
                      className='btn btn-secondary whitespace-nowrap'
                      onClick={handleUploadCoverImage}
                    >
                      Submit
                    </button>
                    <button
                      type='button'
                      className='btn btn-secondary whitespace-nowrap'
                      // onClick={...}
                    >
                      Generate
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className='block mb-2 font-medium'>
                  {t('Learning Points')} <span className='error'>*</span>
                </label>

                {fields.map((field, index) => (
                  <div
                    key={field.id || index}
                    className='flex items-center gap-2 mb-2'
                  >
                    <input
                      {...register(`learningPoints.${index}.value`)}
                      defaultValue={field.value}
                      placeholder={`Point ${index + 1}`}
                      className='form-input w-full border border-gray-300 rounded-md px-3 py-2'
                      disabled={!isEditable}
                    />
                    {isEditable && (
                      <button
                        type='button'
                        onClick={() => remove(index)}
                        className='btn btn-secondary'
                      >
                        <span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
                          <Cross />
                        </span>
                      </button>
                    )}
                  </div>
                ))}

                {isEditable && (
                  <div className='flex gap-4 mt-2'>
                    <button
                      type='button'
                      onClick={() => append({ value: '' })}
                      className='btn btn-secondary'
                    >
                      + Add Learning Point
                    </button>
                    <button
                      type='button'
                      className='btn btn-secondary'
                      onClick={() => handleRefineClick('learningPoints')}
                    >
                      Refine
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='card-footer btn-group'>
          {isEditable && (
            <Button
              className='btn-primary '
              type='button'
              label={t('Save')}
              onClick={handleSave}
            >
              <span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
                <CheckCircle />
              </span>
            </Button>
          )}

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
            refineFieldKey === 'whatsInside'
              ? 'About Book'
              : refineFieldKey === 'aboutAuthor'
              ? 'About Author'
              : 'Learning Points'
          )}`}
          onAccept={() => {
            if (refineFieldKey === 'learningPoints') {
              // Assuming you want to set it as one learning point
              // If it's multiple, you'll need to parse and append
              formik.setFieldValue('learningPoints', [{ value: refineData }]);
            } else {
              formik.setFieldValue(refineFieldKey, refineData);
            }
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
