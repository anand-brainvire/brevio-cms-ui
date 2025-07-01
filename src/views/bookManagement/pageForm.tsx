import React from 'react';
import CKEditorComponent from '@components/ckEditor/ckEditor';
import TextInput from '@components/textinput/TextInput';
import { t } from 'i18next';
import { Cross, AngleDown, AngleUp } from '@components/icons/icons';
import { PageFormProps } from '@type/bookManagement';
import { toast } from 'react-toastify';

const PageForm = ({
  index,
  isOpen,
  toggle,
  setRichText,
  formik,
  fields,
  append,
  remove,
  register,
  OnBlur,
}: PageFormProps) => {
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
        <div className='p-4 space-y-6'>
          {/* Rich Text Editor */}
          <CKEditorComponent
            id={`rich-text-editor-${index}`}
            label='Rich Text Editor with Preview'
            required
            value={formik.values.richText}
            onChange={(val: string) => setRichText(val)}
          />

          {/* Key Point */}
          <TextInput
            id={`keyPoint-${index}`}
            onBlur={OnBlur}
            required
            placeholder={t('Key Point')}
            name='keyPoint'
            onChange={formik.handleChange}
            label={t('keyPoint')}
            value={formik.values.keyPoint}
          />

          {/* Insights Field Array */}
          <div>
            <label className='block mb-2 font-medium'>
              {t('Insights')} <span className='error'>*</span>
            </label>
            <div className='space-y-2'>
              {fields.map((field, i) => (
                <div key={field.id || i} className='flex items-center gap-2'>
                  {/* Clickable copy label */}
                  <span
                    className='min-w-[110px] text-gray-600 font-mono text-sm cursor-pointer hover:text-primary'
                    onClick={() => {
                      const key = `##INSIGHT_${i + 1}##`;
                      navigator.clipboard.writeText(key);
                      toast.success('Copied to clipboard'); // ✅ Only this message
                    }}
                    title='Click to copy'
                  >
                    {`##INSIGHT_${i + 1}##`}
                  </span>

                  {/* Editable input */}
                  <input
                    {...register(`insights.${i}.value`)}
                    defaultValue={field.value}
                    placeholder={`Point ${i + 1}`}
                    className='form-input w-full border border-gray-300 rounded-md px-3 py-2'
                  />

                  {/* Remove button */}
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
              <button type='button' className='btn btn-secondary'>
                Refine
              </button>
            </div>
          </div>

          {/* Save Page Button */}
          <div className='pt-4 text-left'>
            <button type='submit' className='btn btn-primary'>
              Save Page {index + 1}
            </button>
          </div>

          <TextInput
            type='file'
            accept='audio/*'
            id={'audio'}
            onBlur={OnBlur}
            required
            placeholder={t('Audio')}
            name='audio'
            onChange={formik.handleChange}
            label={t('Audio')}
            value={formik.values.audio}
          />
        </div>
      )}
    </div>
  );
};

export default PageForm;
