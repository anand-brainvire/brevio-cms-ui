import React from 'react';
import { IImageCell } from './DataTable';

const ImageCell: React.FC<IImageCell> = ({ column, row, openImageModel }) => {
    const imageUrl = (row?.[column.fieldName]);
    if (!imageUrl) {
        return <span>No Image</span>;
    }
    return (
        <button
            title={column?.fieldName}
            onClick={() => openImageModel(imageUrl)}
        >
            <img
                src={imageUrl}
                alt={column?.fieldName}
                className='w-wide-3 m-auto cursor-pointer'
                width='100'
                height='100'
            />
        </button>
    );
};

export default ImageCell;
