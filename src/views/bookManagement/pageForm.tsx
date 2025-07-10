// PageForm.tsx
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useEffect,
  useState,
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
  };
  onPageSave: (data: any) => void;
  onPageUpdate?: (uuid: string, data: any) => void;
  isEditable: boolean;
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
    },
    ref
  ) => {
    const params = useParams();
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [showRefinePopup, setShowRefinePopup] = useState(false);
    const [refineData, setRefineData] = useState('');
    const [refineFieldKey, setRefineFieldKey] = useState('');
    const { savePageValidationSchema } = useValidation();
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

      setAudioFile(file);
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

    const handleAudioSubmit = async () => {
      if (!audioFile) {
        return toast.error('No file selected');
      }
      try {
        const path = `page-audio?bookUuid=${params.id}&bookPagePageUuid=${initialData?.uuid}&langCode=en`;
        const audioUrl = await uploadFile(
          [{ name: 'pageAudio', content: audioFile }],
          path
        );
        setUploadedAudioUrl(audioUrl);
        setIsUploaded(true);
        setLastSyncedContentForAudio(formik.values.richText);
        setAudioError(null);
      } catch {
        return;
      }
    };

    const handleAudioRemove = () => {
      setAudioFile(null);
      setUploadedAudioUrl(null);
      setIsUploaded(false);
    };
    return (
      <div className='border mb-6 rounded shadow-sm'>
        <div
          className='flex justify-between items-center px-4 py-2 bg-gray-100 cursor-pointer'
          onClick={toggle}
        >
          <h3 className='text-lg font-semibold'>Page {index + 1}</h3>
          <div>{isOpen ? <AngleUp /> : <AngleDown />}</div>
        </div>

        {isOpen && (
          <>
            {refineKeyPointsLoader ||
              refineInsightLoader ||
              refinePageContentLoader ||
              (generateAudioLoader && Loader)}
            <form className='p-4 space-y-6'>
              <CKEditorComponent
                id={`rich-text-editor-${index}`}
                label='Rich Text Editor with Preview'
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
              {isEditable && (
                <button
                  type='button'
                  className='btn btn-secondary h-fit mt-1'
                  onClick={() => handleRefineClick('richText')}
                >
                  Refine
                </button>
              )}
              <TextInput
                id={`keyPoint-${index}`}
                onBlur={handleBlur}
                required
                placeholder={t('Key Point')}
                name='keyPoint'
                onChange={formik.handleChange}
                label={t('keyPoint')}
                value={formik.values.keyPoint}
                error={
                  formik.errors.keyPoint && formik.touched.keyPoint
                    ? formik.errors.keyPoint
                    : ''
                }
              />
              {isEditable && (
                <button
                  type='button'
                  className='btn btn-secondary h-fit mt-1'
                  onClick={() => handleRefineClick('keyPoint')}
                >
                  Refine
                </button>
              )}
              <div>
                <label className='block mb-2 font-medium'>
                  {t('Insights')} <span className='error'>*</span>
                </label>
                <div className='space-y-2'>
                  {fields.map((field, i) => (
                    <div key={field.id} className='flex items-center gap-2'>
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
                      <input
                        {...register(`insights.${i}.value`, {
                          required: 'Insight is required',
                        })}
                        placeholder={`Point ${i + 1}`}
                        className='form-input w-3/4 border border-gray-300 rounded-md px-3 py-2'
                      />
                      {isEditable && (
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
                      {isEditable && (
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
                      {errors?.insights?.[i]?.value && (
                        <p className='text-red-500 text-sm mt-1'>
                          {errors?.insights?.[i]?.value?.message}
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
                      <TextInput
                        type='file'
                        accept='audio/*'
                        id={`audio-${index}`}
                        onBlur={handleBlur}
                        required
                        placeholder={t('Audio')}
                        name='audio'
                        onChange={handleAudioChange}
                        // label={t('Audio')}
                      />
                    </div>

                    {/* {audioFile && ( */}
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
                          onClick={handleAudioSubmit}
                          className='btn btn-secondary'
                        >
                          Submit
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

                      const hasUnsyncedAudio =
                        isUploaded &&
                        formik.values.richText.trim() !==
                          lastSyncedContentForAudio.trim();

                      if (hasUnsyncedAudio && !isAudioErrorAcknowledged) {
                        setAudioError(
                          'Page content has changed. Please regenerate or upload audio.'
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
                    {initialData?.uuid
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
                          detail: { index },
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
