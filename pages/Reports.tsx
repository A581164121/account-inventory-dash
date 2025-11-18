
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Sale, Expense, JournalEntry, Account } from '../types';
import { generateProfitAndLoss } from '../services/accountingService';
import Card from '../components/ui/Card';
import { DollarSign, TrendingUp, BarChart, FileDown } from 'lucide-react';
import { exportToCsv } from '../services/exportService';

const Reports: React.FC = () => {
    const appState = useAppContext();
    
    // Default to current month
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const currentDay = today.toISOString().split('T')[0];

    const [startDate, setStartDate] = useState<string>(firstDayOfMonth);
    const [endDate, setEndDate] = useState<string>(currentDay);

    const filteredState = useMemo(() => {
        if (!startDate || !endDate) return appState;

        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        const filterByDate = <T extends { date: string }>(items: T[]): T[] => {
            return items.filter(item => {
                const itemDate = new Date(item.date).getTime();
                // Simple date comparison. Note: Date input value is YYYY-MM-DD.
                // Creating date from string assumes UTC if YYYY-MM-DD. 
                // To be safe with timezones, we can compare string values if format is ISO YYYY-MM-DD
                return item.date >= startDate && item.date <= endDate;
            });
        };

        return {
            ...appState,
            sales: filterByDate(appState.sales),
            purchases: filterByDate(appState.purchases),
            expenses: filterByDate(appState.expenses),
            journalEntries: filterByDate(appState.journalEntries),
        };
    }, [startDate, endDate, appState]);

    const reportData = useMemo(() => {
        const { netProfit, grossProfit, totalExpenses, revenue } = generateProfitAndLoss(filteredState);
        return {
            totalSales: revenue,
            totalExpenses,
            grossProfit,
            netProfit,
        };
    }, [filteredState]);

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const handleExport = () => {
        const dataToExport = [{
            period: `${startDate || 'Start'} to ${endDate}`,
            totalSales: reportData.totalSales,
            totalExpenses: reportData.totalExpenses,
            grossProfit: reportData.grossProfit,
            netProfit: reportData.netProfit,
        }];
        exportToCsv(dataToExport, `financial_summary_${startDate}_to_${endDate}`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Financial Summary</h1>
            </div>

            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium mb-1">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium mb-1">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <button onClick={handleExport} disabled={!startDate || !endDate} className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-emerald-600 disabled:opacity-50">
                        <FileDown size={20} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <Card title="Total Sales" value={formatCurrency(reportData.totalSales)} icon={<DollarSign size={24} className="text-white"/>} colorClass="bg-blue-500" />
                <Card title="Total Expenses" value={formatCurrency(reportData.totalExpenses)} icon={<DollarSign size={24} className="text-white"/>} colorClass="bg-red-500" />
                <Card title="Gross Profit" value={formatCurrency(reportData.grossProfit)} icon={<TrendingUp size={24} className="text-white"/>} colorClass="bg-yellow-500" />
                <Card title="Net Profit" value={formatCurrency(reportData.netProfit)} icon={<BarChart size={24} className="text-white"/>} colorClass="bg-purple-500" />
            </div>
        </div>
    );
};

export default Reports;
