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
  const [error, setError] = useState('');

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
    if (pageCount === '' || pageCount <= 0) {
      setError('Page count is required and must be greater than 0.');
      return;
    }
    if (pageCount > 25) {
      setError('You cannot generate more than 25 pages of book details using AI');
      return;
    }
    setError('');
    onConfirm(pageCount);
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
                className={`form-input w-15 border rounded px-3 py-2 ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                value={pageCount}
                onChange={(e) => {
                  const val =
                    e.target.value === '' ? '' : parseInt(e.target.value);
                  setPageCount(val);
                  if (val !== '' && val > 0 && val <= 20) {
                    setError('');
                  }
                }}
              />
              {error && <p className='text-sm text-red-500 mt-1'>{error}</p>}
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
