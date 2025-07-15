import React from 'react';

interface TopCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined;
  colorClass?: string;
}

const TopCard: React.FC<TopCardProps> = ({
  icon,
  label,
  value,
  colorClass = '',
}) => (
  <div
    className={`bg-white p-4 flex flex-col justify-between h-36 rounded-lg shadow ${colorClass}`}
  >
    <div className='flex items-center gap-2 text-gray-600'>
      {icon}
      <span className='font-bold text-[18px]'>{label}</span>
    </div>
    <h2 className='text-3xl font-bold'>
      {value}
    </h2>
  </div>
);

export default TopCard;
