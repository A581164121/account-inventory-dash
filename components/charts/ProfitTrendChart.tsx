
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
    name: string;
    profit: number;
}

interface ProfitTrendChartProps {
    data: ChartData[];
}

const ProfitTrendChart: React.FC<ProfitTrendChartProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md h-96">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Profit Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 20,
                    left: -10,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" stroke="rgb(156 163 175)" />
                <YAxis stroke="rgb(156 163 175)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                    borderColor: 'rgb(75 85 99)'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="profit" stroke="#fb923c" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
};

export default ProfitTrendChart;
