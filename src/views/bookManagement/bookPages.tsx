import React, { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import { whiteSpaceRemover } from '@utils/helpers';
import { useFieldArray, useForm } from 'react-hook-form';
// import { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, UseFormRegister } from 'react-hook-form';
import PageForm from './pageForm'
import { FormValues } from '@type/bookManagement';

const BookPages = () => {
  const [pages, setPages] = useState([
    { isOpen: true, richText: '', formikValues: { keyPoint: '' } },
  ]);

  const handleAddPage = () => {
    setPages((prevPages) => [
      ...prevPages,
      { isOpen: true, richText: '', formikValues: { keyPoint: '' } },
    ]);
  };

  const togglePage = (index: number) => {
    setPages((prevPages) =>
      prevPages.map((page, i) =>
        i === index ? { ...page, isOpen: !page.isOpen } : page
      )
    );
  };

  const { register, control } = useForm<FormValues>({
    defaultValues: {
      insights: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'insights',
  });

  const formik = useFormik({
    initialValues: { keyPoint: '',richText: '', audio:''},
    onSubmit: () => {
    //   console.log('Submitted Pages:', pages);
    //   console.log('Formik Values:', values);
    },
  });

  const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
  }, [formik]);

  return (
    <div className='card'>
      <div className='card-body'>
        <h2 className='text-xl font-semibold mb-4'>Pages</h2>

        <form onSubmit={formik.handleSubmit}>
          {pages.map((page, index) => (
            <PageForm
              key={index}
              index={index}
              isOpen={page.isOpen}
              toggle={() => togglePage(index)}
              richText={page.richText}
              setRichText={(text: string) => {
                const newPages = [...pages];
                newPages[index].richText = text;
                setPages(newPages);
              }}
              formik={formik}
              fields={fields}
              append={append}
              remove={remove}
              register={register}
              OnBlur={OnBlur}
            />
          ))}

          <div className='flex items-center justify-between mt-6'>
            <button
              type='button'
              className='btn btn-outline-primary'
              onClick={handleAddPage}
            >
              + Add Page
            </button>
            <p className='text-sm font-semibold'>Total Pages: {pages.length}</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookPages;
