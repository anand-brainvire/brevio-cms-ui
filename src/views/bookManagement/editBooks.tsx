import { useMutation, useQuery } from '@apollo/client';
import { Loader } from '@components/index';
import { useTranslation } from 'react-i18next';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextInput from '@components/textinput/TextInput';
import {
  Category,
  editBookInfo,
  RefineCoverImageData,
} from '@type/bookManagement';
import { uploadFile, whiteSpaceRemover } from '@utils/helpers';
import { useFormik } from 'formik';
import BookPages from './bookPages';
import { ValidationError } from 'yup';
import ImageModel from '@views/imageModel';
import {
  REFINE_ABOUT_AUTHOR,
  REFINE_ABOUT_BOOK,
  REFINE_LEARNING_POINTS,
  TOGGLE_FREE_BOOK,
  UPDATE_BOOK_INFO,
  PUBLISH_BOOK,
  REFINE_COVER_IMAGE,
  GENERATE_NEW_BOOK,
  DELETE_DRAFT_BOOK_PAGE,
  RESTORE_TO_DRAFT,
  BOOK_PUBLISH_STATUS,
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
import GenerateBookConfirmPopup from '@components/popup/generateBook';
import useValidation from '@src/hooks/validations';
import GeneratedBookPreviewModal from './generatedBookPreviewModal';

const editBooks = (): ReactElement => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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
  const [refineCoverImage, { loading: refineCoverImageLoader }] =
    useMutation(REFINE_COVER_IMAGE);
  const [generateNewBook, { loading: generateNewBookLoader }] =
    useMutation(GENERATE_NEW_BOOK);
  const [deleteDraftBookPages, { loading: deleteDraftBookPagesLoader }] =
    useMutation(DELETE_DRAFT_BOOK_PAGE);
  const [restoreToDraf, { loading: restoreToDraftLoader }] =
    useMutation(RESTORE_TO_DRAFT);
  const [unpublishBook, { loading: unpublishBookLoader }] =
    useMutation(BOOK_PUBLISH_STATUS);

  const { data, refetch: fetchAllCategories } = useQuery(FETCH_CATEGORY, {
    variables: { isAll: IS_ALL, isActive: true },
  });
  const [categoryDroData, setCategoryDroData] = useState<Category[]>([]);
  const [showRefinePopup, setShowRefinePopup] = useState(false);
  const [refineData, setRefineData] = useState('');
  const [refineFieldKey, setRefineFieldKey] = useState('');
  const [isFreeBook, setIsFreeBook] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File>();
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showBookGeneratePopup, setShowBookGeneratePopup] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isImageUploded, setIsImageUploded] = useState(false);
  const [isImageFromRefine, setIsImageFromRefine] = useState(false);
  const [base64Url, setBase64Url] = useState<RefineCoverImageData>();
  const [uplodedImageUrl, setUplodedImageUrl] = useState<string>();
  const [originalCoverImageUrl, setOriginalCoverImageUrl] = useState<string>();
  const [isImageModelShow, setIsImageModelShow] = useState<boolean>(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [replacePages,setReplacePages] = useState(false);
  const [generatedBookContent, setGeneratedBookContent] = useState<any>();
  const [showGeneratedPreviewModal, setShowGeneratedPreviewModal] =
    useState(false);
  const [bookVersionStatus, setBookVersionStatus] = useState('');
  const [selectedTab, setSelectedTab] = useState<'draft' | 'published'>(
    'draft'
  );
  const [hasOnlyOneDraftVersion, setHasOnlyOneDraftVersion] = useState(false);
  const isEditable = selectedTab === 'draft';

  const { loading: loader, refetch } = useQuery(FETCH_BOOK_BY_ID, {
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
      isActive: true,
    },
    onCompleted: (res) => {
      const rawAuthors = res?.getAllAuthors?.data?.authors || [];
      const newAuthors = transformAuthors(rawAuthors);
      setAuthors(newAuthors);
      setHasMoreAuthors(newAuthors.length === 75);
    },
  });
  const { addBookInfoValidationSchema } = useValidation();
  const { publishBookValidationSchema } = useValidation();
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
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        'If you have unsaved changes, please save your progress before refreshing this page.';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    const fetchAndSetData = async () => {
      if (!params.id) {
        return;
      }
      // Refetch latest data
      const { data } = await refetch();
      const book = data?.getBookById?.data;
      if (!book) {
        return;
      }
      setIsPublished(book.is_published);
      setIsFreeBook(!!book.is_free);

      // const version = book.versions?.find((v: any) => v.status === selectedTab);
      let version;
      if (selectedTab === 'draft') {
        version = book.versions?.find((v: any) => v.status === 'draft');
      } else if (selectedTab === 'published') {
        version =
          book.versions?.find((v: any) => v.status === 'published') ||
          book.versions?.find((v: any) => v.status === 'unpublished');
      }

      const hasOnlyOneDraftVersion =
        book?.versions?.length === 1 && book.versions[0]?.status === 'draft';
      const otherVersion = book.versions?.find(
        (v: any) => v.status === 'published' || v.status === 'unpublished'
      );
      if (otherVersion?.status) {
        setBookVersionStatus(otherVersion.status);
      } else {
        setBookVersionStatus('draft');
      }
      if (hasOnlyOneDraftVersion) {
        setHasOnlyOneDraftVersion(true);
      }
      if (!version) {
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
        reset({ learningPoints: [] });
        return;
      }

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
      if (version.cover_image_url) {
        setIsImageUploded(true);
        setUplodedImageUrl(version.cover_image_url);
      }
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
      learningPoints.forEach((lp: { value: string }) => append(lp));
    };

    fetchAndSetData();
  }, [selectedTab, params.id, i18n.language]);

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
            ['learning_points']: values.learningPoints.map(
              (lp: any) => lp.value
            ),
          },
        ],
      },
    })
      .then((res) => {
        const data = res.data;
        if (data.updateBook?.meta?.statusCode === 201) {
          toast.success(t('Book updated successfully'));
          // formik.resetForm();
          // onCancelEditBookInfo();
        }
      })
      .catch(() => {
        return;
      });
  };

  const formik = useFormik({
    initialValues,
    validationSchema: addBookInfoValidationSchema,
    onSubmit: async (values) => {
      await UpdateBookInfoFunction(values);
    },
  });

  const getCategoryNames = () => {
    return categoryDroData
      .filter((cat) => formik.values.categoryId.includes(cat.uuid))
      .map((cat) => {
        const enTranslation = cat.category_translations.find(
          (t) => t.lang_code === 'en'
        );
        return enTranslation?.name || 'Unnamed Category';
      });
  };

  const getAuthorNames = () => {
    return authors
      .filter((auth) => formik.values.authorId.includes(auth.id))
      .map((auth) => auth.name);
  };

  /*
  Method to generating new book
  */

  const handleGenerateNewBookApi = async (pageCount?: number) => {
    setShowBookGeneratePopup(false);
    try {
      const generateRes = await generateNewBook({
        variables: {
          input: {
            bookUuid: params.id,
            pageCount,
            categoryUuids: formik.values.categoryId,
            authorUuids: formik.values.authorId,
          },
        },
      });

      if (generateRes?.data?.generateBookContent?.meta?.statusCode === 200) {
        toast.success(generateRes.data.generateBookContent.meta.message);
        const d = generateRes.data.generateBookContent.data;
        const pages = generateRes.data.generateBookContent.data.pages;
        setGeneratedBookContent(d);
        setShowGeneratedPreviewModal(true);
        setGeneratedContent(pages);
        // formik.setValues({
        //   title: d.title,
        //   categoryId: d.categories.map((c: any) => c.uuid),
        //   authorId: d.authors.map((a: any) => a.uuid),
        //   whatsInside: d.about_book,
        //   aboutAuthor: d.about_authors,
        //   coverImage: d.cover_image_url,
        //   learningPoints: d.learning_points.map((pt: string) => ({
        //     value: pt,
        //   })),
        // });
        // remove();
        // d.learning_points.forEach((pt: string) => append({ value: pt }));
      } else {
        toast.error(t('Failed to generate new book'));
      }
    } catch {
      return;
    }
  };

  /*
  Method to delete draft pages before generating new book
  */

  const deleteDraftPages = async () => {
    try {
      const res = await deleteDraftBookPages({
        variables: {
          bookUuid: params.id,
        },
      });
      const statusCode = res?.data?.deleteDraftBookPages?.meta?.statusCode;
      if (statusCode === 200) {
        toast.success(t('Draft pages deleted successfully'));
        setShowConfirmPopup(false);
        setReplacePages(true);
          const d = generatedBookContent
          formik.setValues({
            title: d.title,
            categoryId: d.categories.map((c: any) => c.uuid),
            authorId: d.authors.map((a: any) => a.uuid),
            whatsInside: d.about_book,
            aboutAuthor: d.about_authors,
            coverImage: d.cover_image_url,
            learningPoints: d.learning_points.map((pt: string) => ({
              value: pt,
            })),
          });
          remove();
          d.learning_points.forEach((pt: string) => append({ value: pt }));
      } else {
        toast.error(t('Failed to delete draft pages'));
      }
    } catch {
      toast.error(t('Something went wrong'));
    }
  };

  /*
  Method to unpublish the book
  */
  const handleUnpublishBook = () => {
    setIsPublished(!isPublished);
    unpublishBook({
      variables: {
        uuid: params.id,
      },
    })
      .then((res) => {
        const data = res.data;
        if (data?.togglePublishBook?.meta?.statusCode === 200) {
          toast.success(data.togglePublishBook.meta.message);
        }
      })
      .catch(() => {
        return;
      });
  };

  /*
  Method to clone the published pages into the draft
  */
  const handleRestoreToDraft = () => {
    restoreToDraf({
      variables: {
        uuid: params.id,
      },
    })
      .then((res) => {
        const data = res.data;
        if (data?.clonePublishToDraft?.meta?.statusCode === 200) {
          toast.success(data.clonePublishToDraft.meta.message);
        }
      })
      .catch(() => {
        return;
      });
  };
  /*
  Method to Generate new the new book
  */
  const handleGenerateNewBook = async () => {
    try {
      // Only validate title, categoryId, authorId
      const partial = addBookInfoValidationSchema.pick([
        'title',
        'whatsInside',
        'aboutAuthor',
      ]);
      await partial.validate(formik.values, { abortEarly: false });
      setShowBookGeneratePopup(true);
    } catch (err: any) {
      if (err instanceof ValidationError) {
        const fieldErrors: Record<string, string> = {};
        err.inner.forEach((e: ValidationError) => {
          if (e.path) {
            fieldErrors[e.path] = e.message;
            toast.error(e.message);
          }
        });
        formik.setErrors(fieldErrors);
      }
    }
  };

  /*
  Method to publish the book
  */
  const handlePublishBook = async () => {
    const values = formik.values;
    const rhfLearningPoints = getValues('learningPoints');
    // Sync RHF learning points to Formik
    const learningPoints = rhfLearningPoints.map((lp) => lp.value);

    const payloadToValidate = {
      title: values.title,
      categoryId: values.categoryId,
      authorId: values.authorId,
      whatsInside: values.whatsInside,
      aboutAuthor: values.aboutAuthor,
      coverImage: values.coverImage,
    };

    try {
      await publishBookValidationSchema.validate(payloadToValidate, {
        abortEarly: false,
      });

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

      if (data?.publishBook?.meta?.statusCode === 201) {
        toast.success(t('Book published successfully'));
        setHasOnlyOneDraftVersion(false);
        refetch();
      } else {
        toast.error(
          data?.publishBook?.meta?.message || t('Failed to publish book')
        );
      }
    } catch (error: any) {
      if (error?.name === 'ValidationError' && error?.inner?.length) {
        const formikErrors: any = {};

        error.inner.forEach((err: any) => {
          if (err.path) {
            formikErrors[err.path] = err.message;
            formik.setFieldTouched(err.path, true, false); // still call this
          }
        });

        formik.setErrors(formikErrors);
      }

      toast.error(t('Please fix validation errors before publishing.'));
      return;
    }
  };

  /*
  method to validate cover image
  */
  // const handleImageChange = () => {
  //   const file = fileInputRef.current?.files?.[0];
  //   if (!file) {
  //     return;
  //   }
  //   const img = new Image();
  //   const objectUrl = URL.createObjectURL(file);

  //   img.onload = () => {
  //     const width = img.width;
  //     const height = img.height;
  //     const ratio = width / height;
  //     const isRatioValid = Math.abs(ratio - 2 / 3) < 0.01;

  //     if (!isRatioValid) {
  //       toast.error('Image must be in 2:3 aspect ratio (e.g. 600x900)');
  //       formik.setFieldError('coverImage', 'Invalid aspect ratio');
  //       formik.setFieldValue('coverImage', null);
  //     } else {
  //       setCoverImageFile(file);
  //       formik.setFieldValue('coverImage', file);
  //       handleUploadCoverImage(file);
  //     }

  //     URL.revokeObjectURL(objectUrl);
  //   };

  //   img.onerror = () => {
  //     toast.error('Invalid image file');
  //     formik.setFieldValue('coverImage', null);
  //     URL.revokeObjectURL(objectUrl);
  //   };

  //   img.src = objectUrl;
  // };

  const handleImageChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      return;
    }

    const isPng =
      file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');

    if (!isPng) {
      toast.error('Only PNG images are allowed');
      formik.setFieldError('coverImage', 'Only PNG images are allowed');
      formik.setFieldValue('coverImage', null);
      return;
    }

    setCoverImageFile(file);
    formik.setFieldValue('coverImage', file);
    handleUploadCoverImage(file);
  };

  /*
  method to upload cover image
  */
  const handleUploadCoverImage = async (file?: File) => {
    const bookUuid = params.id;
    const fileToUpload = file || coverImageFile;

    if (!bookUuid || !fileToUpload) {
      return;
    }

    try {
      setIsUploading(true);
      const response = await uploadFile(
        [
          {
            name: 'coverImage',
            content: fileToUpload,
          },
        ],
        `cover-image?bookUuid=${bookUuid}`
      );

      const statusCode = response?.meta?.statusCode;
      if (statusCode === 200 || statusCode === 201) {
        const uploadedImageUrl = response?.data?.images?.[0]?.url;
        setOriginalCoverImageUrl(uploadedImageUrl);
        setUplodedImageUrl(uploadedImageUrl);
        setIsUploading(false);
      }
      setIsUploading(false);
    } catch {
      setIsUploading(false);
      toast.error('Something went wrong while uploading cover image');
    }
  };

  /**
   * Method to generate the cover image
   */
  const handlGenerateImage = async () => {
    try {
      const res = await refineCoverImage({
        variables: {
          uuid: params.id,
        },
      });

      const data = res.data;
      if (data.refineCoverImage.meta.statusCode === 200) {
        let imageUrl = data.refineCoverImage.data[0].base64;
        setBase64Url(data.refineCoverImage);
        imageUrl = `data:${data.refineCoverImage.data[0].mimeType};base64,${imageUrl}`;
        setIsImageFromRefine(true);
        setIsImageModelShow(true);
        setUplodedImageUrl(imageUrl);
        toast.success(data.refineCoverImage.meta.message);
      }
    } catch {
      return;
    }
  };

  const handleAcceptImage = () => {
    if (base64Url) {
      const file = base64ToFile(
        base64Url.data[0].base64,
        base64Url.data[0].mimeType,
        `cover-image.${base64Url.data[0].extension}`
      );
      setCoverImageFile(file);
      handleUploadCoverImage(file);
    }
    setIsImageModelShow(false);
    setIsImageFromRefine(false);
  };

  const base64ToFile = (
    base64: string,
    mimeType: string,
    filename: string
  ): File => {
    const byteString = atob(base64); // decode base64 string
    const byteArray = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }
    return new File([byteArray], filename, { type: mimeType });
  };

  /**
   * Method to change the free book status
   */
  const handleFreeBookStatus = async () => {
    setIsFreeBook(!isFreeBook);
    try {
      const { data } = await freeBookStatus({
        variables: {
          uuid: params.id,
        },
      });

      if (data?.toggleFreeBook?.meta?.statusCode === 200) {
        toast.success(data.toggleFreeBook.meta.message);
        // await refetch();
      } else {
        toast.error(
          data?.toggleFreeBook?.meta?.message || t('Failed to update status')
        );
      }
    } catch {
      return;
    }
  };

  const openImageModel = useCallback(() => {
    setIsImageModelShow(true);
  }, []);

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
    formik.setFieldValue('learningPoints', rhfLearningPoints, true);
    formik.handleSubmit();
  };

  return (
    <>
      <div className='card'>
        {(loader ||
          updateLoader ||
          refineAboutAuthorLoader ||
          refineAboutBookLoader ||
          refineLearningPointsLoader ||
          freeBookLoader ||
          publishBookLoading ||
          refineCoverImageLoader ||
          generateNewBookLoader ||
          deleteDraftBookPagesLoader ||
          restoreToDraftLoader ||
          unpublishBookLoader ||
          isUploading) && <Loader />}
        <form onSubmit={formik.handleSubmit}>
          <div className='card-body'>
            <div className='flex items-center justify-between w-full mb-4'>
              <h2 className='text-xl font-semibold'>Book Information</h2>
              {/* Right side: Status badge + Free Book checkbox */}
              <div className='flex items-center gap-6'>
                {/* Status display */}
                <div className='flex items-center text-sm'>
                  <span className='text-gray-700 mr-1'>{t('Status')}:</span>
                  {bookVersionStatus === 'draft' && (
                    <span className='bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded'>
                      {t('Draft')}
                    </span>
                  )}
                  {bookVersionStatus === 'published' && (
                    <span className='bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded'>
                      {t('Published')}
                    </span>
                  )}
                  {bookVersionStatus === 'unpublished' && (
                    <span className='bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded'>
                      {t('Unpublished')}
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

                {!hasOnlyOneDraftVersion && (
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
                )}
              </div>
              <div className='flex gap-2'>
                {isEditable ? (
                  <>
                    <button
                      type='button'
                      className='btn btn-primary'
                      onClick={handleGenerateNewBook}
                    >
                      {t('Generate New Book')}
                    </button>
                    <button
                      type='button'
                      className='btn btn-primary'
                      onClick={handlePublishBook}
                    >
                      {t('Publish')}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type='button'
                      className='btn btn-primary'
                      onClick={handleRestoreToDraft}
                    >
                      {t('Restore to Draft')}
                    </button>
                    {bookVersionStatus?.toLowerCase() === 'published' && (
                      <button
                        type='button'
                        className='btn btn-primary'
                        onClick={handleUnpublishBook}
                      >
                        {t('Unpublish')}
                      </button>
                    )}

                    {bookVersionStatus?.toLowerCase() === 'unpublished' && (
                      <button
                        type='button'
                        className='btn btn-primary'
                        onClick={handleUnpublishBook}
                      >
                        {t('Republish')}
                      </button>
                    )}
                  </>
                )}
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
                  <label
                    htmlFor='categoryId'
                    className='block mb-2 font-medium'
                  >
                    {t('Select Categories')}
                  </label>
                  <MultiSelect
                    id={'categoryId'}
                    value={formik.values.categoryId || []}
                    onChange={(e) =>
                      formik.setFieldValue('categoryId', e.value)
                    }
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
                    {t('Select Author')}
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
                    placeholder={t('Select Author') ?? 'Select Author'}
                    maxSelectedLabels={6}
                    disabled={!isEditable}
                    virtualScrollerOptions={{
                      itemSize: 75,
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
                        if (newFetched.length < 75) {
                          setHasMoreAuthors(false);
                        }
                      },
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor='whatsInside'
                    className='block mb-2 font-medium'
                  >
                    {t('Whas\'s Inside (About)')}
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
                  <label
                    htmlFor='aboutAuthor'
                    className='block mb-2 font-medium'
                  >
                    {t('About Author')}
                  </label>
                  <div className='flex gap-2 items'>
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
                        className='btn btn-secondary h-fit mt-1'
                        onClick={() => handleRefineClick('aboutAuthor')}
                      >
                        Refine
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className='block mb-2 font-medium'>{t('Cover')}</label>
                  <div className='flex items-end space-x-4 mb-4 ml-0'>
                    {isImageUploded && uplodedImageUrl ? (
                      <>
                        <img
                          src={uplodedImageUrl}
                          alt='Cover Thumbnail'
                          onClick={openImageModel}
                          className='w-[50px] h-[75.03px] object-cover cursor-pointer border border-gray-300 rounded-sm'
                          title='Click to preview'
                        />
                      {isEditable && (
                        <button
                          type='button'
                          onClick={() => setIsImageUploded(false)}
                          className='btn btn-secondary'
                        >
                          Upload new image
                        </button>
                      )}
                        {isEditable && (
                          <button
                            type='button'
                            className='btn btn-secondary whitespace-nowrap'
                            onClick={handlGenerateImage}
                          >
                            Generate
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <div className='w-2/3'>
                          <TextInput
                            type='file'
                            id='coverImage'
                            onBlur={OnBlur}
                            inputRef={fileInputRef}
                            placeholder={t('Cover')}
                            name='coverImage'
                            error={getErrorSubAdmin('coverImage')}
                            className='w-full'
                            disabled={!isEditable}
                            onChange={() => handleImageChange()}
                          />
                        </div>

                        {isEditable && (
                          <div className='flex gap-2'>
                            {/* <button
                              type='button'
                              className='btn btn-secondary whitespace-nowrap'
                              onClick={() => handleImageChange()}
                            >
                              Submit
                            </button> */}
                            <button
                              type='button'
                              className='btn btn-secondary whitespace-nowrap'
                              onClick={handlGenerateImage}
                            >
                              Generate
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label className='block mb-2 font-medium'>
                    {t('Learning Points')}
                  </label>

                  {fields.map((field, index) => (
                    <div key={field.id || index} className='flex flex-col mb-2'>
                      <div className='flex items-center gap-2'>
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
                            className=''
                          >
                            <span className='mr-1 w-2.5 h-2.5 text-black inline-block svg-icon'>
                              <Cross />
                            </span>
                          </button>
                        )}
                      </div>

                      {formik.errors.learningPoints &&
                        Array.isArray(formik.errors.learningPoints) &&
                        (
                          formik.errors.learningPoints as Array<{
                            value?: string;
                          }>
                        )[index]?.value && (
                          <div className='text-danger text-sm mt-1 ml-1'>
                            {
                              (
                                formik.errors.learningPoints as Array<{
                                  value?: string;
                                }>
                              )[index]?.value
                            }
                          </div>
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
              {isEditable && (
                <Button className='btn-secondary' onClick={onCancelEditBookInfo}>
                  <span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
                    <Cross />
                  </span>
                  {t('Cancel')}
                </Button>
              )}
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
                // Split the refinedData string into lines (if it's a single multiline string)
                const refinedPoints = Array.isArray(refineData)
                  ? refineData
                  : refineData.split('\n').filter(Boolean); // handles '- point' or line-based text

                // Clear existing values first
                remove();

                // Append each point to useFieldArray
                refinedPoints.forEach((point: string) => {
                  append({ value: point.trim().replace(/^[-•\s]+/, '') });
                });

                // Set Formik values too
                formik.setFieldValue(
                  'learningPoints',
                  refinedPoints.map((point: string) => ({
                    value: point.trim().replace(/^[-•\s]+/, ''),
                  }))
                );
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
        {showConfirmPopup && (
          <RefineText
            refinedText={t(
              'All the current pages in the draft mode of this book will be deleted. Are you sure you want to proceed?'
            )}
            fieldLabel={t('Confirm Book Regeneration').toString()}
            onAccept={deleteDraftPages}
            onCancel={() => setShowConfirmPopup(false)}
          />
        )}
        {showBookGeneratePopup && (
          <GenerateBookConfirmPopup
            show={showBookGeneratePopup}
            onClose={() => setShowBookGeneratePopup(false)}
            onConfirm={handleGenerateNewBookApi}
            bookTitle={formik.values.title}
            categoryNames={getCategoryNames()}
            authorNames={getAuthorNames()}
          />
        )}
        {isImageModelShow && uplodedImageUrl && (
          <ImageModel
            onClose={() => {
              setIsImageModelShow(false);
              setIsImageFromRefine(false);
              if (isImageFromRefine) {
                setUplodedImageUrl(originalCoverImageUrl);
              }
            }}
            data={uplodedImageUrl}
            show={isImageModelShow}
            {...(isImageFromRefine && {
              showAccept: true,
              onAccept: handleAcceptImage,
            })}
          />
        )}
        {showGeneratedPreviewModal && (
        <GeneratedBookPreviewModal
          isOpen={showGeneratedPreviewModal}
          onClose={() => setShowGeneratedPreviewModal(false)}
          onAccept={() => {
            setShowGeneratedPreviewModal(false);
            setShowConfirmPopup(true);
          }}
          bookContent={generatedBookContent}
        />
        )}
      </div>
      {params.id && (
        <BookPages
          bookUuid={params.id}
          status={selectedTab}
          generatedPages={replacePages ? generatedContent : undefined}
        />
      )}
    </>
  );
};

export default editBooks;
