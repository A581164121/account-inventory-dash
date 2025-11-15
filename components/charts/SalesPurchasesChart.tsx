
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
    name: string;
    sales: number;
    purchases: number;
}

interface SalesPurchasesChartProps {
    data: ChartData[];
}

const SalesPurchasesChart: React.FC<SalesPurchasesChartProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md h-96">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Sales vs Purchases</h3>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
                <Bar dataKey="sales" fill="#4f46e5" />
                <Bar dataKey="purchases" fill="#10b981" />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default SalesPurchasesChart;
