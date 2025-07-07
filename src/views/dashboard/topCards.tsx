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
    className={`aspect-square flex flex-col items-center justify-center rounded shadow ${colorClass}`}
  >
    <div className="mb-1 text-lg">{icon}</div>
    <div className="text-[30px] font-medium text-gray-500">{label}</div>
    <div className="text-[30px] font-bold">{value}</div>
  </div>
);

export default TopCard;
