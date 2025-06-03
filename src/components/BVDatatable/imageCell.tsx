import React from 'react';
import { IImageCell } from './DataTable';
import { IMAGE_BASE_URL } from '@config/constant';

const ImageCell: React.FC<IImageCell> = ({ column, row, openImageModel }) => {
    const imageUrl = column?.isBase64ImageUrl
        ? row?.[column.fieldName]
        : `${IMAGE_BASE_URL}${row?.[column.fieldName]?.original_file}`;

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
