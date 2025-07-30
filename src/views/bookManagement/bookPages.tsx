import React, { useEffect, useRef, useState } from 'react';
import PageForm, { PageFormRef } from './pageForm';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_BOOK_PAGE,
  UPDATE_BOOK_PAGE,
  DELETE_BOOK_PAGE,
  REORDER_BOOK_PAGES,
  GENERATE_AUDIO,
} from '@framework/graphql/mutations/bookManagement';
import { GET_ALL_BOOK_PAGES } from '@framework/graphql/queries/bookManagement';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';

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
  onRefetch?: () => void;
};

const BookPages = ({
  bookUuid,
  status,
  generatedPages = null,
  onRefetch,
}: BookPagesProps) => {
  const [pages, setPages] = useState<{ initialData?: any; tempId?: string }[]>(
    []
  );
  const [openPages, setOpenPages] = useState<Set<number>>(new Set([0]));
  const pageRefs = useRef<PageFormRef[]>([]);
  const [createBookPage] = useMutation(CREATE_BOOK_PAGE);
  const [updateBookPage] = useMutation(UPDATE_BOOK_PAGE);
  const [deleteBookPage] = useMutation(DELETE_BOOK_PAGE);
  const [isProcessingPages, setIsProcessingPages] = useState(false);
  const [reorderBookPages] = useMutation(REORDER_BOOK_PAGES);
  const [generateAudio] = useMutation(GENERATE_AUDIO);
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
      const { tempId } = e.detail;
      RemoveUnsavedPage(tempId);
    };

    window.addEventListener('deleteSavedPage', handleDeleteSavedPage);
    window.addEventListener('removeUnsavedPage', handleRemoveUnsavedPage);

    return () => {
      window.removeEventListener('deleteSavedPage', handleDeleteSavedPage);
      window.removeEventListener('removeUnsavedPage', handleRemoveUnsavedPage);
    };
  }, []);

  // Listen for refetch trigger from parent component
  useEffect(() => {
    if (onRefetch) {
      refetch();
    }
  }, [onRefetch, refetch]);

  useEffect(() => {
    if (!generatedPages) {
      return;
    }
    const transformedPages = generatedPages.map((p) => {
      const insights = p.insights.map((i) => ({
        key: i.key,
        value: i.text,
      }));

      const initialDataObj = {
        uuid: undefined,
        pageNumber: p.page_number,
        keyPoint: p.key_point,
        richText: p.html_content,
        insights: insights,
        audioMale: null,
        audioFemale: null,
      };

      return {
        isOpen: true,
        initialData: initialDataObj,
      };
    });

    setPages(transformedPages);
    setIsProcessingPages(true);

    Promise.allSettled(
      transformedPages.map(async (page, index) => {
        try {
          const res = await handleSinglePageSave(index, page.initialData, true);
          const uuid =
            res?.data?.createBookPage?.data?.uuid ||
            res?.data?.updateBookPage?.data?.uuid;

          if (!uuid) {
            throw new Error(`Page ${index + 1} UUID not found`);
          }

          const audioRes = await generateAudio({
            variables: {
              bookPageUuid: uuid,
              type: '',
            },
          });

          if (audioRes?.data?.generatePageAudio?.meta?.statusCode === 200) {
            // Capture the generated audio URL from the response
            const generatedAudioUrl = audioRes?.data?.generatePageAudio?.data?.url;
            // Update the page state with the audio URL
            setPages((prevPages) =>
              prevPages.map((page, pageIndex) => {
                if (pageIndex === index) {
                  return {
                    ...page,
                    initialData: {
                      ...page.initialData,
                      uuid: uuid, // Set the UUID
                      audioMale: generatedAudioUrl,
                      audioFemale: generatedAudioUrl, // You can differentiate if needed
                    },
                  };
                }
                return page;
              })
            );
          } else {
            toast.error(`Audio generation failed for Page ${index + 1}`);
          }
        } catch {
          return;
        }
      })
    ).finally(() => {
      setIsProcessingPages(false);
      toast.success('Book details saved successfully');
    });
  }, [generatedPages]);

  useEffect(() => {
    if (!data?.getAllBookPages?.data) {
      return;
    }

    let version;

    if (status === 'draft') {
      version = data.getAllBookPages.data.find(
        (v: any) => v.version_status === 'draft'
      );
    } else if (status === 'published') {
      version =
        data.getAllBookPages.data.find(
          (v: any) => v.version_status === 'published'
        ) ||
        data.getAllBookPages.data.find(
          (v: any) => v.version_status === 'unpublished'
        );
    }
    if (!version?.pages?.length) {
      setPages([{}]);
      setOpenPages(new Set([0])); // open first page
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
        ['regenerateAudio']: translation?.regenerate_audio,
        ['insights']: insightsArray,
      });

      return {
        initialData: initialDataObj,
      };
    });

    setPages(transformedPages);
    setOpenPages(new Set([0]));
  }, [data, status]);

  const handleAddPage = () => {
    setPages((prev) => {
      const newPage = { tempId: `${Date.now()}-${Math.random()}` };
      const newPages = [...prev, newPage];
      setOpenPages(new Set([newPages.length - 1]));
      return newPages;
    });
  };

  const togglePage = (index: number) => {
    setOpenPages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index); // close the page
      } else {
        newSet.add(index); // open the page
      }
      return newSet;
    });
  };

  const RemoveUnsavedPage = (tempId: string) => {
    setPages((prev) => prev.filter((page) => page.tempId !== tempId));
    // Remove the corresponding ref
    const idx = pageRefs.current.findIndex(
      (_ref, i) => pages[i]?.tempId === tempId
    );
    if (idx !== -1) {
      pageRefs.current.splice(idx, 1);
    }
  };

  const DeleteSavedPage = async (uuid: string, index: number) => {
    try {
      const response = await deleteBookPage({
        variables: { uuid: uuid },
      });

      const message =
        response?.data?.deleteDraftBookPages?.meta?.message ||
        'Page deleted successfully';

      toast.success(message);
      // Remove page from state
      setPages((prev) => {
        const updatedPages = prev.filter((_, i) => i !== index);
        pageRefs.current.splice(index, 1);

        // 🧠 Reorder after setting state (on next tick)
        setTimeout(() => {
          const savedPageUuids = updatedPages
            .map((p) => p.initialData?.uuid)
            .filter((uuid): uuid is string => !!uuid);

          if (savedPageUuids.length > 0) {
            reorderBookPages({
              variables: { pageUuids: savedPageUuids },
            })
          }
        });
        return updatedPages;
      });
    } catch {
      toast.error('Failed to delete page');
    }
  };

  const handleSinglePageSave = async (_index: number, data: any, silent = false) => {
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

      // --- Determine the next page number ---
      const nextPageNumber = _index + 1;
      const variables = {
        ['bookId']: bookUuid,
        ['translations']: [translationObj],
        ['insights']: insightObjs,
        ['pageNumber']: nextPageNumber,
      };
      const response = await createBookPage({ variables });
      if (response?.data?.createBookPage?.meta?.statusCode !== 201) {
        const uuid = response?.data?.createBookPage.data.uuid;
        setPages((prev) =>
          prev.map((page, i) => {
            if (i === _index) {
              return {
                ...page,
                initialData: {
                  ...(page.initialData || {}),
                  uuid, // ✅ add the saved uuid
                  keyPoint: data.keyPoint, // ✅ preserve the form data
                  richText: data.richText, // ✅ preserve the form data
                  insights: data.insights, // ✅ preserve the form data
                  pageNumber: nextPageNumber, // ✅ add page number
                },
              };
            }
            return page;
          })
        );

        if (!silent) {
          toast.success(response?.data?.createBookPage?.meta?.message);
        }
        return response;
      } else {
        if (!silent) {
          toast.error(
            response?.data?.createBookPage?.meta?.message || 'Failed to save page'
          );
        }
        return response;
      }
      // await refetch();
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
        {(isProcessingPages) && <Loader/>}
        {pages.map((page, index) => (
          <div
            key={page.initialData?.uuid || page.tempId || index}
            className='relative mb-6 rounded shadow'
          >
            <PageForm
              index={index}
              isOpen={openPages.has(index)}
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
              isSaved={!!page.initialData?.uuid}
              tempId={page.tempId}
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
