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
  colorClass = ''
}) => (
  /* aspect-square forces equal width & height; w-24 ≈ 96 px */
  <div
    className={`bg-white p-4 flex flex-col gap-4 rounded-lg shadow justify-items-start items-start ${colorClass}`}
  >
    <div className="flex items-center gap-2 text-gray-600">
      {icon}
      <span className="font-bold text-[18px]">{label}</span>
    </div>
    <h2 className="text-3xl font-bold d-inline-block border-b-2 border-red-900">{value}</h2>
  </div>
);

export default TopCard;
