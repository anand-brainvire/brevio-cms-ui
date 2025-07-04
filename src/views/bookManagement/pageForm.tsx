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

interface PageFormProps {
  index: number;
  isOpen: boolean;
  toggle: () => void;
  initialData?: {
    uuid?: string;
    page_number?: number;
    keyPoint: string;
    richText: string;
    audioMale?: string;
    audioFemale?: string;
    insights: { key: string; value: string }[];
  };
  onPageSave: (data: any) => void;
  onPageUpdate?: (uuid: string, data: any) => void;
}

export interface PageFormRef {
  getData: () => any;
  validate: () => boolean;
}

const PageForm = forwardRef<PageFormRef, PageFormProps>(
  ({ index, isOpen, toggle, onPageSave, onPageUpdate, initialData }, ref) => {
    const params = useParams();
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [showAudioPlayer, setShowAudioPlayer] = useState(false);
    const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(
      initialData?.audioMale || null
    );
    const [isUploaded, setIsUploaded] = useState<boolean>(
      !!initialData?.audioMale
    );

    const {
      register,
      control,
      getValues: getFieldValues,
      reset: resetFieldArray,
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

    const handleAudioSubmit = async () => {
      if (!audioFile) {
        return toast.error('No file selected');
      }

      try {
        const path = `page-audio?bookUuid=${params.id}&bookPagePageUuid=${initialData?.uuid}&langCode=en`;
        await uploadFile([{ name: 'pageAudio', content: audioFile }], path);
        const generatedUrl = `book/${params.id}/draft/pages/${initialData?.uuid}/en_male.mp3`;
        setUploadedAudioUrl(generatedUrl);
        setIsUploaded(true);
        // toast.success('Audio uploaded successfully');
      } catch {
        return;
      }
    };

    const handleAudioRemove = () => {
      setAudioFile(null);
      setUploadedAudioUrl(null);
      setIsUploaded(false);
      setShowAudioPlayer(false);
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
          <form className='p-4 space-y-6'>
            <CKEditorComponent
              id={`rich-text-editor-${index}`}
              label='Rich Text Editor with Preview'
              required
              value={formik.values.richText}
              onChange={(val: string) => formik.setFieldValue('richText', val)}
            />

            <TextInput
              id={`keyPoint-${index}`}
              onBlur={handleBlur}
              required
              placeholder={t('Key Point')}
              name='keyPoint'
              onChange={formik.handleChange}
              label={t('keyPoint')}
              value={formik.values.keyPoint}
            />

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
                      {...register(`insights.${i}.value`, { required: true })}
                      placeholder={`Point ${i + 1}`}
                      className='form-input w-full border border-gray-300 rounded-md px-3 py-2'
                    />
                    <button
                      type='button'
                      onClick={() => remove(i)}
                      className='btn btn-secondary'
                    >
                      <span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
                        <Cross />
                      </span>
                    </button>
                  </div>
                ))}
              </div>
              <div className='flex gap-4 mt-3'>
                <button
                  type='button'
                  onClick={() => append({ value: '' })}
                  className='btn btn-secondary'
                >
                  + Add Insight
                </button>
              </div>
            </div>

            <div className='flex items-center gap-4 mb-4 flex-wrap'>
              {isUploaded && uploadedAudioUrl ? (
                <>
                  <audio controls className='w-[250px]'>
                    <source
                      src={
                        uploadedAudioUrl.startsWith('http')
                          ? uploadedAudioUrl
                          : `https://leadtechadminapi.node.brainvire.dev/${uploadedAudioUrl}`
                      }
                      type='audio/mpeg'
                    />
                    Your browser does not support the audio element.
                  </audio>

                  <span className='text-sm truncate max-w-[200px]'>
                    {audioFile?.name || 'Uploaded audio file'}
                  </span>

                  <button
                    type='button'
                    onClick={handleAudioRemove}
                    className='btn btn-secondary'
                  >
                    <span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
                      <Cross />
                    </span>
                  </button>

                  <button
                    type='button'
                    onClick={() => setShowAudioPlayer((prev) => !prev)}
                    className='btn btn-secondary'
                  >
                    {showAudioPlayer ? 'Pause Audio' : 'Play Audio'}
                  </button>

                  <button type='button' className='btn btn-secondary'>
                    Generate
                  </button>
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
                      label={t('Audio')}
                    />
                  </div>

                  {/* {audioFile && ( */}
                  <button
                    type='button'
                    onClick={handleAudioSubmit}
                    className='btn btn-secondary'
                  >
                    Submit
                  </button>
                  {/* )} */}

                  <button type='button' className='btn btn-secondary'>
                    Generate
                  </button>
                </>
              )}
            </div>

            <div className='flex justify-between items-center pt-4'>
              <button
                type='button'
                className='btn btn-primary'
                onClick={() => {
                  const pageData = {
                    ...formik.values,
                    insights: getFieldValues().insights,
                  };
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

              {initialData?.uuid ? (
                <button
                  type='button'
                  className='btn btn-danger'
                  onClick={() => {
                    // You can call this from parent via props if needed
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
              )}
            </div>
          </form>
        )}
      </div>
    );
  }
);
PageForm.displayName = 'PageForm';
export default PageForm;
