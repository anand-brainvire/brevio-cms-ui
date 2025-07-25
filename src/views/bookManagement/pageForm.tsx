// PageForm.tsx
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { uploadFile, whiteSpaceRemover } from '@utils/helpers';
import CKEditorComponent from '@components/ckEditor/ckEditor';
import TextInput from '@components/textinput/TextInput';
import { Cross, AngleDown, AngleUp } from '@components/icons/icons';
import { t } from 'i18next';
import { useParams } from 'react-router-dom';
import { Url } from 'url';
import AudioPlayerOnHover from '@components/audio/AudioPlayerOnHoverProps';
import { useMutation } from '@apollo/client';
import {
  GENERATE_AUDIO,
  REFINE_INSIGHTS,
  REFINE_KEY_POINTS,
  REFINE_PAGE_CONTENT,
} from '@framework/graphql/mutations/bookManagement';
import RefineText from '@components/popup/refineText';
import { Loader } from '@components/index';
import useValidation from '@src/hooks/validations';
import { Tooltip } from 'primereact/tooltip';

interface PageFormProps {
  index: number;
  isOpen: boolean;
  toggle: () => void;
  initialData?: {
    uuid?: string;
    page_number?: number;
    keyPoint: string;
    richText: string;
    audioMale?: Url | string;
    audioFemale?: string;
    insights: { key: string; value: string }[];
    regenerateAudio?: boolean;
  };
  isSaved?: boolean;
  onPageSave: (data: any) => void;
  onPageUpdate?: (uuid: string, data: any) => void;
  isEditable: boolean;
  tempId?: string;
}

export interface PageFormRef {
  getData: () => any;
  validate: () => boolean;
}

const PageForm = forwardRef<PageFormRef, PageFormProps>(
  (
    {
      index,
      isOpen,
      toggle,
      onPageSave,
      onPageUpdate,
      initialData,
      isEditable,
      isSaved,
      tempId,
    },
    ref
  ) => {
    const params = useParams();
    const [showRefinePopup, setShowRefinePopup] = useState(false);
    const [refineData, setRefineData] = useState('');
    const [refineFieldKey, setRefineFieldKey] = useState('');
    const audioInputRef = useRef<HTMLInputElement>(null);
    const [shouldTriggerAudioInput, setShouldTriggerAudioInput] =
      useState(false);
    const { savePageValidationSchema } = useValidation();
    const [isUploading, setIsUploading] = useState(false);
    const [isAudioErrorAcknowledged, setIsAudioErrorAcknowledged] =
      useState(false);
    const [refinedInsightId, setRefinedInsightId] = useState<string | null>(
      null
    );
    const [lastSyncedContentForAudio, setLastSyncedContentForAudio] = useState(
      initialData?.richText || ''
    );
    const [audioError, setAudioError] = useState<string | null>(null);
    const [refineKeyPoints, { loading: refineKeyPointsLoader }] =
      useMutation(REFINE_KEY_POINTS);
    const [refinePageContent, { loading: refinePageContentLoader }] =
      useMutation(REFINE_PAGE_CONTENT);
    const [refineInsight, { loading: refineInsightLoader }] =
      useMutation(REFINE_INSIGHTS);
    const [generateAudio, { loading: generateAudioLoader }] =
      useMutation(GENERATE_AUDIO);

    const [uploadedAudioUrl, setUploadedAudioUrl] = useState<
      Url | string | null | undefined
    >(initialData?.audioMale || null);
    const [isUploaded, setIsUploaded] = useState<boolean>(
      !!initialData?.audioMale
    );
    const {
      register,
      control,
      getValues: getFieldValues,
      reset: resetFieldArray,
      setValue,
      formState: { errors },
      trigger,
    } = useForm({
      defaultValues: {
        insights: initialData?.insights?.length
          ? initialData.insights
          : [{ value: '' }],
      },
    });
    const { fields, append, remove } = useFieldArray({
      control,
      name: 'insights',
    });
    
    // Sync audio state when initialData changes (e.g., after audio generation)
    useEffect(() => {
      if (initialData?.audioMale) {
        setUploadedAudioUrl(initialData.audioMale);
        setIsUploaded(true);
      }
    }, [initialData?.audioMale]);

    useEffect(() => {
      if (initialData?.insights?.length) {
        resetFieldArray({ insights: initialData.insights });
      }
    }, [initialData?.insights, resetFieldArray]);

    const formik = useFormik({
      initialValues: {
        keyPoint: initialData?.keyPoint || '',
        richText: initialData?.richText || '',
      },
      enableReinitialize: true,
      validationSchema: savePageValidationSchema,
      onSubmit: () => {
        // No-op: form submission handled manually
      },
    });

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
      },
      [formik]
    );

    useImperativeHandle(ref, () => ({
      getData: () => ({
        ...formik.values,
        insights: getFieldValues().insights,
      }),
      validate: () => {
        const insights = getFieldValues().insights;
        return (
          !!formik.values.keyPoint &&
          insights.length > 0 &&
          insights.every((i) => i.value?.trim())
        );
      },
    }));

    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        return;
      }

      const isMP3 = file.type === 'audio/mpeg' || file.name.endsWith('.mp3');
      const isSizeValid = file.size <= 5 * 1024 * 1024;

      if (!isMP3) {
        return toast.error('Only .mp3 files are allowed');
      }
      if (!isSizeValid) {
        return toast.error('File size should not exceed 5MB');
      }

      handleAudioSubmit(file);
    };

    const handleRefineClick = (key: string, _insightUuid?: string) => {
      if (key === 'keyPoint') {
        refineKeyPoints({
          variables: { uuid: initialData?.uuid },
        })
          .then((res) => {
            const data = res.data;
            if (data.refinePageKeyPoint.meta.statusCode === 200) {
              setRefineData(data.refinePageKeyPoint.data.refinedData);
              setRefineFieldKey(key);
              setShowRefinePopup(true);
            }
          })
          .catch(() => {
            return;
          });
      } else if (key === 'richText') {
        refinePageContent({
          variables: { uuid: initialData?.uuid },
        })
          .then((res) => {
            const data = res.data;
            if (data.refinePageContent.meta.statusCode === 200) {
              setRefineData(data.refinePageContent.data.refinedData);
              setRefineFieldKey(key);
              setShowRefinePopup(true);
            }
          })
          .catch(() => {
            return;
          });
      } else if (key === 'insights') {
        refineInsight({
          variables: {
            bookPageUuid: initialData?.uuid,
            insightUuid: _insightUuid,
          },
        })
          .then((res) => {
            const data = res.data;
            if (data.refinePageInsight.meta.statusCode === 200) {
              setRefineData(data.refinePageInsight.data.refinedData);
              setRefineFieldKey(key);
              setRefinedInsightId(_insightUuid || null);
              setShowRefinePopup(true);
            }
          })
          .catch(() => {
            return;
          });
      }
    };

    const handleGenerateAudio = async () => {
      generateAudio({
        variables: {
          bookPageUuid: initialData?.uuid,
          type: '',
        },
      }).then((res) => {
        const data = res.data;
        if (data.generatePageAudio.meta.statusCode === 200) {
          const generatedUrl = data.generatePageAudio.data.url;
          setUploadedAudioUrl(generatedUrl);
          setIsUploaded(true);
          setLastSyncedContentForAudio(formik.values.richText);
          setAudioError(null);
          toast.success(data.generatePageAudio.meta.message);
        } else {
          toast.error(data.generatePageAudio.meta.message);
        }
      });
    };

    const handleAudioSubmit = async (file:File) => {
      if (!file) {
        return toast.error('No file selected');
      }
      try {
        setIsUploading(true);
        const path = `page-audio?bookUuid=${params.id}&bookPagePageUuid=${initialData?.uuid}&langCode=en`;
        const audioUrl = await uploadFile(
          [{ name: 'pageAudio', content: file }],
          path
        );
        setUploadedAudioUrl(audioUrl?.data?.url);
        setIsUploaded(true);
        setLastSyncedContentForAudio(formik.values.richText);
        setAudioError(null);
      } catch {
        return;
      } finally {
        setIsUploading(false);
      }
    };

    const handleAudioRemove = () => {
      setUploadedAudioUrl(null);
      setIsUploaded(false);
      setShouldTriggerAudioInput(true);
    };

    useEffect(() => {
      if (!isUploaded && shouldTriggerAudioInput) {
        audioInputRef?.current?.click();
        setShouldTriggerAudioInput(false); // reset
      }
    }, [isUploaded, shouldTriggerAudioInput]);

    useEffect(() => {
      if (isEditable && initialData?.regenerateAudio) {
        setAudioError('Page content has changed. Please regenerate or upload new audio.');
        setIsAudioErrorAcknowledged(true);
      }
    }, [initialData?.regenerateAudio, isEditable]);


    return (
      <div className='border mb-6 rounded shadow-sm'>
        <div
          className='flex justify-between items-center px-4 py-2 bg-gray-100 cursor-pointer'
          onClick={toggle}
        >
          <h3 className='text-lg font-semibold'>Page {index + 1}: {initialData?.keyPoint}</h3>
          <div>{isOpen ? <AngleUp /> : <AngleDown />}</div>
        </div>

        {isOpen && (
          <>
            {(refineKeyPointsLoader ||
              refineInsightLoader ||
              refinePageContentLoader ||
              generateAudioLoader ||
              isUploading) && <Loader />}
            <form className='p-4 space-y-6'>
              <label className='block mb-2 font-medium'>
                {t('Key Point')} <span className='error'>*</span>
              </label>
              <TextInput
                id={`keyPoint-${index}`}
                onBlur={handleBlur}
                required
                placeholder={t('Key Point')}
                name='keyPoint'
                onChange={formik.handleChange}
                // label={t('Key Point')}
                value={formik.values.keyPoint}
                error={
                  formik.errors.keyPoint && formik.touched.keyPoint
                    ? formik.errors.keyPoint
                    : ''
                }
                disabled={!isEditable}
              />
              {isEditable && isSaved && (
                <button
                  type='button'
                  className='btn btn-secondary h-fit mt-1'
                  onClick={() => handleRefineClick('keyPoint')}
                >
                  Refine
                </button>
              )}
              <label className='block mb-2 font-medium'>
                {t('Rich Text Editor with Preview')}{' '}
                <span className='error'>*</span>
              </label>
              <CKEditorComponent
                id={`rich-text-editor-${index}`}
                label=''
                required
                value={formik.values.richText}
                onChange={(val: string) =>
                  formik.setFieldValue('richText', val)
                }
                error={
                  formik.errors.richText && formik.touched.richText
                    ? formik.errors.richText
                    : ''
                }
              />
              {isEditable && isSaved && (
                <button
                  type='button'
                  className='btn btn-secondary h-fit mt-1'
                  onClick={() => handleRefineClick('richText')}
                >
                  Refine
                </button>
              )}
              <div>
                <label className='block mb-2 font-medium'>
                  {t('Insights')}
                </label>
                <div className='space-y-2'>
                  {fields.map((field, i) => (
                    <div key={field.id} className='flex flex-col gap-1'>
                      <div className='flex items-center gap-5'>
                        {/* Clipboard key */}
                        <span
                          className='min-w-[110px] text-gray-600 font-mono text-sm cursor-pointer hover:text-primary'
                          onClick={() => {
                            const key = `##INSIGHT_${i + 1}##`;
                            navigator.clipboard.writeText(key);
                            toast.success('Copied to clipboard');
                          }}
                        >
                          {`##INSIGHT_${i + 1}##`}
                        </span>

                        {/* Input */}
                        <input
                          {...register(`insights.${i}.value`, {
                            validate: (value) => {
                              if (!value || value.trim() === '') {
                                return 'Insight should not be empty. You should either remove the insight or add content.';
                              }
                              if (value.length > 250) {
                                return 'Insight should not be greater than 250 characters';
                              }
                              return true;
                            },
                          })}
                          placeholder={`Insight ${i + 1}`}
                          className='form-input w-3/4 border border-gray-300 rounded-md px-3 py-2'
                          disabled={!isEditable}
                        />

                        {/* Refine button */}
                        {isEditable && isSaved && (
                          <button
                            type='button'
                            className='btn btn-secondary h-fit mt-1'
                            onClick={() =>
                              handleRefineClick('insights', field.id)
                            }
                          >
                            Refine
                          </button>
                        )}

                        {/* Remove (Cross) button */}
                        {isEditable && i === fields.length - 1 && (
                          <button
                            type='button'
                            onClick={() => remove(i)}
                            className=''
                          >
                            <span className='mr-1 w-2.5 h-2.5 text-black inline-block svg-icon'>
                              <Cross />
                            </span>
                          </button>
                        )}
                      </div>

                      {/* 🔽 Validation error shown after all buttons */}
                      {errors?.insights &&
                        Array.isArray(errors.insights) &&
                        errors.insights[i]?.value && (
                          <p className='text-red-500 text-sm'>
                            {errors.insights[i]?.value?.message}
                          </p>
                        )}
                    </div>
                  ))}
                </div>
                {isEditable && (
                  <div className='flex gap-4 mt-3'>
                    <button
                      type='button'
                      onClick={() => append({ value: '' })}
                      className='btn btn-secondary h-fit mt-1'
                    >
                      + Add Insight
                    </button>
                  </div>
                )}
              </div>
              <label className='block font-medium'>
                {t('Audio')} <span className='error'>*</span>
              </label>
              <div className='flex items-center gap-4 mb-4 flex-wrap'>
                {isUploaded && uploadedAudioUrl ? (
                  <>
                    <AudioPlayerOnHover
                      audioUrl={
                        typeof uploadedAudioUrl === 'string'
                          ? uploadedAudioUrl
                          : ''
                      }
                    />
                    {isEditable && (
                      <>
                        <button
                          type='button'
                          onClick={handleAudioRemove}
                          className=''
                        >
                          <span className='mr-1 w-2.5 h-2.5 text-black inline-block svg-icon'>
                            <Cross />
                          </span>
                        </button>

                        <button
                          type='button'
                          className='btn btn-secondary'
                          onClick={handleGenerateAudio}
                        >
                          Generate
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className='w-2/3'>
                      <div
                        data-pr-tooltip={
                          !isSaved ? 'Please save the page first to add audio' : ''
                        }
                        data-pr-position='top'
                      >
                        <TextInput
                          inputRef={audioInputRef}
                          type='file'
                          accept='audio/*'
                          id={`audio-${index}`}
                          onBlur={handleBlur}
                          placeholder={t('Audio')}
                          name='audio'
                          onChange={handleAudioChange}
                          disabled={!isEditable || !isSaved}
                        />
                      </div>
                    </div>
                    <Tooltip target='[data-pr-tooltip]' />

                    {/* {audioFile && ( */}
                    {isEditable && isSaved && (
                      <>
                        <button
                          type='button'
                          className='btn btn-secondary'
                          onClick={handleGenerateAudio}
                        >
                          Generate
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
              {audioError && (
                <p className='text-red-500 text-sm mt-1'>{audioError}</p>
              )}
              <div className='flex justify-between items-center pt-4'>
                {isEditable && (
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={async () => {
                      const isValid = await formik.validateForm();
                      const isHookFormValid = await trigger();
                      if (isValid.keyPoint || isValid.richText) {
                        formik.setTouched({
                          keyPoint: true,
                          richText: true,
                        });
                      }

                      if (Object.keys(isValid).length > 0 || !isHookFormValid) {
                        formik.setTouched({ keyPoint: true, richText: true });
                        return;
                      }
                      const pageData = {
                        ...formik.values,
                        insights: getFieldValues().insights,
                      };

                      const missingInsightKeys: string[] = [];
                      pageData.insights.forEach((_, idx) => {
                        const key = `##INSIGHT_${idx + 1}##`;
                        if (!pageData.richText.includes(key)) {
                          missingInsightKeys.push(key);
                        }
                      });

                      if (missingInsightKeys.length > 0) {
                        const errorMsg = `${missingInsightKeys.join(', ')} ${
                          missingInsightKeys.length > 1 ? 'are' : 'is'
                        } missing in Page Content`;

                        toast.error(errorMsg);
                        formik.setFieldError('richText', errorMsg);
                        formik.setTouched({
                          ...formik.touched,
                          richText: true,
                        });
                        return;
                      }

                      const hasUnsyncedAudio =
                        isUploaded &&
                        formik.values.richText.trim() !==
                          lastSyncedContentForAudio.trim();

                      if (hasUnsyncedAudio && !isAudioErrorAcknowledged) {
                        setAudioError(
                          'Page content has changed. Please regenerate or upload new audio.'
                        );
                        setIsAudioErrorAcknowledged(true);
                        // return;
                      }

                      if (initialData?.uuid && onPageUpdate) {
                        onPageUpdate(initialData.uuid, pageData);
                      } else {
                        onPageSave(pageData);
                      }
                    }}
                  >
                    {isSaved
                      ? `Update Page ${index + 1}`
                      : `Save Page ${index + 1}`}
                  </button>
                )}

                {isEditable &&
                  (initialData?.uuid ? (
                    <button
                      type='button'
                      className='btn btn-danger'
                      onClick={() => {
                        const event = new CustomEvent('deleteSavedPage', {
                          detail: { uuid: initialData.uuid, index },
                        });
                        window.dispatchEvent(event);
                      }}
                    >
                      Delete Page
                    </button>
                  ) : (
                    <button
                      type='button'
                      className='btn btn-secondary'
                      onClick={() => {
                        const event = new CustomEvent('removeUnsavedPage', {
                          detail: { tempId },
                        });
                        window.dispatchEvent(event);
                      }}
                    >
                      Remove Page
                    </button>
                  ))}
              </div>
            </form>
          </>
        )}
        {showRefinePopup && refineFieldKey && (
          <RefineText
            refinedText={refineData}
            fieldLabel={`Refined ${t(
              refineFieldKey === 'keyPoints'
                ? 'Key Points'
                : refineFieldKey === 'richText'
                ? 'Page Content'
                : 'Insight'
            )}`}
            onAccept={() => {
              if (refineFieldKey === 'insights') {
                const index = fields.findIndex(
                  (f) => f.id === refinedInsightId
                );
                if (index !== -1) {
                  const refined = refineData.trim().replace(/^[-•\s]+/, '');
                  setValue(`insights.${index}.value`, refined, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }
                setRefinedInsightId(null);
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
  }
);
PageForm.displayName = 'PageForm';
export default PageForm;
