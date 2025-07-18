'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface BarChartCardProps {
  title: string;
  data: Array<Record<string, any>> | undefined;
  xKey: string;
  yKey: string;
  barColors?: string[];
  height?: number;
  responsive?: boolean;
}

// ✅ Custom Tick Renderer to adjust label position
const CustomXAxisTick = ({ x, y, payload }: any) => {
  const adjustedX = x + 15; // shift to right slightly

  return (
    <text
      x={adjustedX}
      y={y}
      textAnchor='end'
      transform={`rotate(-15, ${adjustedX}, ${y})`}
      fontSize={12}
      fill='#666'
    >
      <tspan x={adjustedX} dy='0.71em'>
        {payload.value}
      </tspan>
    </text>
  );
};

const BarChartCard: React.FC<BarChartCardProps> = ({
  title,
  data,
  xKey,
  yKey,
  height = 300,
  responsive = false,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className='w-full bg-white rounded-xl shadow p-4 text-center text-gray-500'>
        <h2 className='text-xl font-semibold text-gray-800 mb-2'>{title}</h2>
        <p className='py-4 text-lg'>No data available</p>
      </div>
    );
  }

  const chartWidth = responsive ? Math.max(data.length * 80, 600) : undefined;

  return (
    <div className='bg-white rounded-xl shadow p-4'>
      <h2 className='text-xl font-semibold text-gray-800 text-center mb-4'>
        {title}
      </h2>
      <div className={`${responsive ? 'overflow-x-auto' : ''}`}>
        <div
          className='w-full'
          style={{
            height: `${height}px`,
            width: responsive ? chartWidth : '100%',
            margin: responsive ? '0 auto' : undefined,
          }}
        >
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey={xKey}
                tick={CustomXAxisTick} // ✅ custom tick
                interval={0}
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey={yKey} radius={[6, 6, 0, 0]}>
                {(data ?? []).map((_, index) => (
                  <Cell key={index} fill='#6200FF' />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BarChartCard;
