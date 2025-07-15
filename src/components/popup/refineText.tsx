import React, { useEffect } from 'react';
import { RefineTextProps } from '@type/component';
import { Cross } from '@components/icons/icons';
import Button from '@components/button/button';

const RefineText = ({
  refinedText,
  onAccept,
  onCancel,
  fieldLabel = 'Refined Text',
}: RefineTextProps) => {
  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target?.id === 'refine-text-model' ||
        target?.id === 'refine-text-model-child'
      ) {
        onCancel();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onCancel]);

  return (
    <div
      id='refine-text-model'
      tabIndex={-1}
      data-modal-show={true}
      aria-hidden='false'
      className={'model-container'}
    >
      <div
        id='refine-text-model-child'
        tabIndex={-1}
        data-modal-show={true}
        aria-hidden='false'
        className='model animate-fade-in'
      >
        <div className='model-content'>
          <div className='model-header'>
            <p className='text-lg font-medium text-white'>{fieldLabel}</p>
            <Button onClick={onCancel} title='Close'>
              <span className='mr-1 text-white w-2.5 h-2.5 inline-block svg-icon'>
                <Cross />
              </span>
            </Button>
          </div>

          <div className='model-body'>
            <div
              className='mb-4 max-h-[200px] overflow-auto text-sm whitespace-pre-line border p-3 rounded bg-gray-100'
              dangerouslySetInnerHTML={{ __html: refinedText }}
            />
          </div>

          <div className='model-footer'>
            <Button className='btn-primary' onClick={onAccept} label='Accept' />
            <Button
              className='btn-secondary'
              onClick={onCancel}
              label='Cancel'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefineText;
