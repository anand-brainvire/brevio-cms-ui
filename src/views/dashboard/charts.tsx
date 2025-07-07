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
}

const defaultColors = ['#60A5FA', '#34D399', '#FBBF24', '#F472B6', '#A78BFA'];

const BarChartCard: React.FC<BarChartCardProps> = ({
  title,
  data,
  xKey,
  yKey,
  barColors = defaultColors,
  height = 300,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow p-4 text-center text-gray-500">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xKey}
            angle={-15}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey={yKey} radius={[6, 6, 0, 0]}>
            {(data ?? []).map((_, index) => (
              <Cell key={index} fill={barColors[index % barColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartCard;
