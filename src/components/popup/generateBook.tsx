import React, { useEffect, useState } from 'react';
import Button from '@components/button/button';
import { Cross } from '@components/icons/icons';

type Props = {
  show: boolean;
  onClose: () => void;
  onConfirm: (pageCount: number) => void;
  bookTitle: string;
  categoryNames: string[];
  authorNames: string[];
};

const GenerateBookConfirmPopup = ({
  show,
  onClose,
  onConfirm,
  bookTitle,
  categoryNames,
  authorNames,
}: Props) => {
  const [pageCount, setPageCount] = useState<number | ''>('');

  // Handle outside click to close popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target?.id === 'generate-book-popup' ||
        target?.id === 'generate-book-popup-child'
      ) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  const handleConfirm = () => {
    if (pageCount && Number(pageCount) > 0) {
      onConfirm(Number(pageCount));
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div
      id='generate-book-popup'
      tabIndex={-1}
      data-modal-show={true}
      aria-hidden='false'
      className='model-container'
    >
      <div
        id='generate-book-popup-child'
        tabIndex={-1}
        data-modal-show={true}
        aria-hidden='false'
        className='model animate-fade-in'
      >
        <div className='model-content'>
          {/* Header */}
          <div className='model-header'>
            <p className='text-lg font-medium text-white'>Generate New Book</p>
            <Button onClick={onClose} title='Close'>
              <span className='mr-1 text-white w-2.5 h-2.5 inline-block svg-icon'>
                <Cross />
              </span>
            </Button>
          </div>

          {/* Body */}
          <div className='model-body'>
            <div className='mb-4'>
              <label className='font-medium block mb-1 text-sm'>
                Page Count <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                min={1}
                className='form-input w-full border border-gray-300 rounded px-3 py-2'
                value={pageCount}
                onChange={(e) =>
                  setPageCount(
                    e.target.value === '' ? '' : parseInt(e.target.value)
                  )
                }
              />
            </div>

            <div className='text-sm text-gray-700 bg-gray-50 border p-3 rounded space-y-2'>
              <div>
                <strong>Book Title:</strong> {bookTitle || '-'}
              </div>
              <div>
                <strong>Categories:</strong>{' '}
                {categoryNames.length ? categoryNames.join(', ') : '-'}
              </div>
              <div>
                <strong>Authors:</strong>{' '}
                {authorNames.length ? authorNames.join(', ') : '-'}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='model-footer'>
            <Button
              className='btn-primary'
              onClick={handleConfirm}
              label='Confirm'
            />
            <Button
              className='btn-secondary'
              onClick={onClose}
              label='Cancel'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateBookConfirmPopup;
