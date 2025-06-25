import React from 'react';
import { RefineTextProps } from '@type/component';

const RefineText = ({
  refinedText,
  onAccept,
  onCancel,
  fieldLabel = 'Refined Text',
}: RefineTextProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 w-[500px] shadow-lg">
        <h3 className="text-lg font-semibold mb-4">{fieldLabel}</h3>
        <div className="mb-4 max-h-[200px] overflow-auto text-sm whitespace-pre-line border p-3 rounded bg-gray-100">
          {refinedText}
        </div>
        <div className="flex justify-end gap-4">
          <button className="btn btn-primary" onClick={onAccept}>
            Accept
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefineText;
