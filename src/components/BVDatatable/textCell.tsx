import React from 'react';
import { ITextCell } from './DataTable';

const TextCell: React.FC<ITextCell> = ({ text, descriptionHandler }) => (
    <>
        {text?.length <= 30
            ? text
            : <>
                {text.slice(0, 30)}
                <button
                    title="Show more"
                    className='text-red-500 hover:underline hover:cursor-pointer ml-1'
                    onClick={() => descriptionHandler(text)}
                >
                    Show more...
                </button>
            </>
        }
    </>
);

export default TextCell;