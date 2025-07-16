import React, { useEffect, useState } from 'react';
import { Cross } from '@components/icons/icons';
import Button from '@components/button/button';
import PreviewPageForm from './PreviewPageForm';
import ImageModel from '@views/imageModel';

interface Insight {
  key: string;
  text: string;
}

interface Page {
  page_number: number;
  key_point: string;
  html_content: string;
  insights: Insight[];
  audio_url?: string;
}

interface Author {
  name: string;
}

interface Category {
  name: string;
}

interface GeneratedBookPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: any;
  bookContent: {
    title: string;
    pages: Page[];
    cover_image_url: string;
    learning_points: string[];
    about_book: string;
    about_authors: string;
    author_names: string;
    authors: Author[];
    categories: Category[];
  };
}

const GeneratedBookPreviewModal = ({
  isOpen,
  onClose,
  onAccept,
  bookContent,
}: GeneratedBookPreviewModalProps) => {
  const [openPages, setOpenPages] = useState<Set<number>>(new Set([0]));
  const [showImageModal, setShowImageModal] = useState(false);

  const togglePage = (index: number) => {
    setOpenPages((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  useEffect(() => {
    if (isOpen) {
      setOpenPages(new Set([0]));
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  } 

  const authorNames = bookContent.authors?.map((a) => a.name).join(', ') || '';
  const categoryNames = bookContent.categories?.map((c) => c.name).join(', ') || '';

  return (
    <>
      <div
        id='generated-book-modal'
        tabIndex={-1}
        className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto'
      >
        <div className='bg-white w-full max-w-4xl rounded-lg shadow-lg overflow-y-auto max-h-[90vh] animate-fade-in'>
          <div className='flex justify-between items-center px-6 py-4 border-b border-gray-300 bg-gray-100 rounded-t-lg'>
            <h2 className='text-xl font-semibold'>
              Generated Preview - {bookContent.title}
            </h2>
            <button onClick={onClose}>
              <span className='w-4 h-4 text-black inline-block svg-icon'>
                <Cross />
              </span>
            </button>
          </div>

          <div className='p-6 space-y-4'>
            {/* Cover Image */}
            {bookContent.cover_image_url && (
              <div>
                <label className='block font-bold text-gray-700 mb-1'>Cover Image:</label>
                <img
                  src={bookContent.cover_image_url}
                  alt='Cover Thumbnail'
                  onClick={() => setShowImageModal(true)}
                  className='w-[50px] h-[75.03px] object-cover cursor-pointer border border-gray-300 rounded-sm'
                  title='Click to preview'
                />
              </div>
            )}

            {/* Meta Info */}
              <div className='space-y-2'>
                <p><strong>What’s Inside:</strong> {bookContent.about_book}</p>
                <p><strong>About Author:</strong> {bookContent.about_authors}</p>
                <p><strong>Authors:</strong> {authorNames}</p>
                <p><strong>Categories:</strong> {categoryNames}</p>
              </div>
            {/* Learning Points */}
            {bookContent.learning_points?.length > 0 && (
              <div>
                <label className='block font-medium text-gray-700 mb-1'>Learning Points:</label>
                <ul className='list-disc list-inside pl-4'>
                  {bookContent.learning_points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pages */}
            {bookContent.pages.map((page, index) => (
              <div key={index} className='mb-6'>
                <PreviewPageForm
                  index={index}
                  isOpen={openPages.has(index)}
                  toggle={() => togglePage(index)}
                  initialData={{
                    pageNumber: page.page_number,
                    keyPoint: page.key_point,
                    richText: page.html_content,
                    insights: page.insights.map((insight) => ({
                      key: insight.key,
                      value: insight.text,
                    })),
                  }}
                />
              </div>
            ))}
          </div>

          <div className='flex justify-end items-center gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg'>
            <Button className='btn-secondary' onClick={onClose} label='Close' />
            <Button className='btn-primary' onClick={onAccept} label='Accept & Replace Pages' />
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <ImageModel
        onClose={() => setShowImageModal(false)}
        data={bookContent.cover_image_url}
        show={showImageModal}
        showAccept={false}
      />
    </>
  );
};

export default GeneratedBookPreviewModal;
