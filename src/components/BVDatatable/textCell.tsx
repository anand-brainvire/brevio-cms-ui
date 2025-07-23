import React from 'react';
import { ITextCell } from './DataTable';

interface ITextCellWithLabel extends ITextCell {
  descriptionLabel?: string;
}

const TextCell: React.FC<ITextCellWithLabel> = ({ text, descriptionHandler, field, descriptionLabel }) => {
  const maxLength = field === 'email' ? 64 : 30;
  return (
    <>
      {text?.length <= maxLength ? (
        text
      ) : (
        <>
          {text.slice(0, maxLength)}
          <button
            title="Show more"
            className="text-red-500 hover:underline hover:cursor-pointer ml-1"
            onClick={() => descriptionHandler(text, descriptionLabel || field || 'Description')}
          >
            Show more...
          </button>
        </>
      )}
    </>
  );
};

export default TextCell;