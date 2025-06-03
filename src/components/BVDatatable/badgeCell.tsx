import React from 'react';
import { IBadgeCell } from './DataTable';

const BadgeCell: React.FC<IBadgeCell> = ({ BadgesColor, BadgesCode, conversationValue }) => (
    <div className='flex justify-center'>
        <span
            className={`badge ${BadgesColor || ''} rounded`}
        >
            {conversationValue ?? BadgesCode}
        </span>
    </div>
);

export default BadgeCell;
