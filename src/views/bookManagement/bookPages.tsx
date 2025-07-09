import React, { useEffect, useRef, useState } from 'react';
import PageForm, { PageFormRef } from './pageForm';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_BOOK_PAGE,
  UPDATE_BOOK_PAGE,
  DELETE_BOOK_PAGE,
} from '@framework/graphql/mutations/bookManagement';
import { GET_ALL_BOOK_PAGES } from '@framework/graphql/queries/bookManagement';
import { toast } from 'react-toastify';
import useValidation from '@src/hooks/validations';
import { ValidationContext } from 'graphql';

type GeneratedPage = {
  page_number: number;
  key_point: string;
  html_content: string;
  insights: { key: string; text: string }[];
};

type BookPagesProps = {
  bookUuid: string;
  status: 'draft' | 'published';
  generatedPages?: GeneratedPage[] | null;
};

const BookPages = ({
  bookUuid,
  status,
  generatedPages = null,
}: BookPagesProps) => {
  const [pages, setPages] = useState<{ isOpen: boolean; initialData?: any }[]>(
    []
  );

  const pageRefs = useRef<PageFormRef[]>([]);
  const [createBookPage] = useMutation(CREATE_BOOK_PAGE);
  const [updateBookPage] = useMutation(UPDATE_BOOK_PAGE);
  const [deleteBookPage] = useMutation(DELETE_BOOK_PAGE);
  const isEditable = status === 'draft';
  const { data, refetch } = useQuery(GET_ALL_BOOK_PAGES, {
    variables: { bookId: bookUuid },
    skip: !bookUuid || generatedPages !== null,
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    const handleDeleteSavedPage = (e: any) => {
      const { uuid, index } = e.detail;
      DeleteSavedPage(uuid, index);
    };

    const handleRemoveUnsavedPage = (e: any) => {
      const { index } = e.detail;
      RemoveUnsavedPage(index);
    };

    window.addEventListener('deleteSavedPage', handleDeleteSavedPage);
    window.addEventListener('removeUnsavedPage', handleRemoveUnsavedPage);

    return () => {
      window.removeEventListener('deleteSavedPage', handleDeleteSavedPage);
      window.removeEventListener('removeUnsavedPage', handleRemoveUnsavedPage);
    };
  }, []);

  useEffect(() => {
    if (!generatedPages) {
      return;
    }

    const transformedPages = generatedPages.map((p) => {
      const insights = p.insights.map((i) => ({
        ['key']: i.key,
        ['value']: i.text,
      }));
      const initialDataObj: any = {};
      Object.assign(initialDataObj, {
        ['uuid']: undefined,
        ['page_number']: p.page_number,
        ['keyPoint']: p.key_point,
        ['richText']: p.html_content,
        ['insights']: insights,
        ['audioMale']: null,
        ['audioFemale']: null,
      });

      return {
        isOpen: true,
        initialData: initialDataObj,
      };
    });

    setPages(transformedPages);
  }, [generatedPages]);

  useEffect(() => {
    if (!data?.getAllBookPages?.data) {
      return;
    }

    const version = data.getAllBookPages.data.find(
      (v: any) => v.version_status === status
    );

    if (!version?.pages?.length) {
      setPages([{ isOpen: true }]);
      return;
    }

    const lang = 'en';

    const transformedPages = version.pages.map((p: any) => {
      const translation = p.translations?.find(
        (t: any) => t.lang_code === lang
      );

      const insightsArray =
        p.insights?.map((insight: any) => {
          const text = insight.translations?.find(
            (t: any) => t.lang_code === lang
          )?.text;

          return {
            ['key']: insight.key,
            ['value']: text || '',
          };
        }) || [];

      const initialDataObj: any = {};
      Object.assign(initialDataObj, {
        ['uuid']: p.uuid,
        ['page_number']: p.page_number,
        ['keyPoint']: translation?.key_point || '',
        ['richText']: translation?.html_content || '',
        ['audioMale']: translation?.audio_male || null,
        ['audioFemale']: translation?.audio_female || null,
        ['insights']: insightsArray,
      });

      return {
        isOpen: true,
        initialData: initialDataObj,
      };
    });

    setPages(transformedPages);
  }, [data, status]);

  const handleAddPage = () => {
    setPages((prev) => [...prev, { isOpen: true }]);
  };

  const togglePage = (index: number) => {
    setPages((prev) =>
      prev.map((page, i) =>
        i === index ? { ...page, isOpen: !page.isOpen } : page
      )
    );
  };

  const RemoveUnsavedPage = (index: number) => {
    setPages((prev) => prev.filter((_, i) => i !== index));
    pageRefs.current.splice(index, 1);
  };

  const DeleteSavedPage = async (uuid: string, index: number) => {
    if (index) {
      RemoveUnsavedPage(index);
    }
    try {
      const response = await deleteBookPage({
        variables: { uuid: uuid },
      });

      const message =
        response?.data?.deleteDraftBookPages?.meta?.message ||
        'Page deleted successfully';

      toast.success(message);
      setPages((prev) => prev.filter((_, i) => i !== index));
      pageRefs.current.splice(index, 1);
    } catch {
      return;
    }
  };

  const handleSinglePageSave = async (_index: number, data: any) => {
    try {
      
      const lang = 'en';
      const translationObj: any = {};
      Object.assign(translationObj, {
        ['lang_code']: lang,
        ['key_point']: data.keyPoint,
        ['html_content']: data.richText,
      });

      const insightObjs = data.insights.map((item: any, i: number) => {
        const insightObj: any = {};
        Object.assign(insightObj, {
          ['key']: `##INSIGHT_${i + 1}##`,
          ['translations']: [
            {
              ['lang_code']: lang,
              ['text']: item.value,
            },
          ],
        });
        return insightObj;
      });

      const variables = {
        ['bookId']: bookUuid,
        ['translations']: [translationObj],
        ['insights']: insightObjs,
      };
      const response = await createBookPage({ variables });
        if (response?.data?.createBookPage?.meta?.statusCode !== 201) {
          toast.success(response?.data?.createBookPage?.meta?.message);
        } else {
          toast.error(
            response?.data?.createBookPage?.meta?.message ||
              'Failed to save page'
          );
        }  
      await refetch();
    } catch {
      return;
    }
  };

  const handleSinglePageUpdate = async (
    _index: number,
    data: any,
    uuid: string
  ) => {
    try {
      const lang = 'en';

      const translationObj: any = {};
      Object.assign(translationObj, {
        ['lang_code']: lang,
        ['key_point']: data.keyPoint,
        ['html_content']: data.richText,
      });

      const insightObjs = data.insights.map((item: any, i: number) => {
        const insightObj: any = {};
        Object.assign(insightObj, {
          ['key']: `##INSIGHT_${i + 1}##`,
          ['translations']: [
            {
              ['lang_code']: lang,
              ['text']: item.value,
            },
          ],
        });
        return insightObj;
      });

      const variables = {
        ['uuid']: uuid,
        ['translations']: [translationObj],
        ['insights']: insightObjs,
      };

      const response = await updateBookPage({ variables });
      if (response?.data?.updateBookPage?.meta?.statusCode !== 201) {
        toast.success(response?.data?.updateBookPage?.meta?.message);
      } else {
        toast.error(
          response?.data?.updateBookPage?.meta?.message ||
            'Failed to update page'
        );
      }
    } catch {
      return;
    }
  };

  return (
    <div className='card'>
      <div className='card-body'>
        <h2 className='text-xl font-semibold mb-4'>Pages</h2>

        {pages.map((page, index) => (
          <div key={index} className='relative border mb-6 rounded shadow'>
            <PageForm
              index={index}
              isOpen={page.isOpen}
              toggle={() => togglePage(index)}
              ref={(el) => {
                if (el) {
                  pageRefs.current[index] = el;
                }
              }}
              onPageSave={(data) =>
                page.initialData?.uuid
                  ? handleSinglePageUpdate(index, data, page.initialData.uuid)
                  : handleSinglePageSave(index, data)
              }
              initialData={page.initialData}
              isEditable={isEditable}
            />
          </div>
        ))}

        <div className='flex items-center justify-between mt-6'>
          {isEditable && (
            <button
              type='button'
              className='btn btn-outline-primary'
              onClick={handleAddPage}
            >
              + Add Page
            </button>
          )}
          <p className='text-sm font-semibold'>Total Pages: {pages.length}</p>
        </div>
      </div>
    </div>
  );
};

export default BookPages;
