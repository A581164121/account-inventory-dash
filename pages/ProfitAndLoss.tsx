
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateProfitAndLoss } from '../services/accountingService';
import { Printer, FileDown, RefreshCw } from 'lucide-react';
import { exportToPdf } from '../services/exportService';

const ProfitAndLoss: React.FC = () => {
    const appState = useAppContext();
    const { refreshData } = appState;
    const [isRefreshing, setIsRefreshing] = useState(false);
    const plData = generateProfitAndLoss(appState);
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const handlePrint = () => {
        window.print();
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshData();
        setIsRefreshing(false);
    };

    const handleExportPdf = () => {
        exportToPdf('pl-report', `profit_and_loss_${new Date().toISOString().split('T')[0]}`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6 no-print">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Profit & Loss Statement</h1>
                 <div className="flex space-x-2">
                    <button onClick={handleRefresh} disabled={isRefreshing} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-600">
                        <RefreshCw size={20} className={`${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                    <button onClick={handlePrint} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-600">
                        <Printer size={20} />
                        <span>Print</span>
                    </button>
                    <button onClick={handleExportPdf} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700">
                        <FileDown size={20} />
                        <span>Export PDF</span>
                    </button>
                </div>
            </div>
             <div id="pl-report" className="bg-white dark:bg-dark-secondary p-8 rounded-lg shadow-md printable-content">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Revenue</h2>
                    <div className="flex justify-between py-2 border-b dark:border-gray-700">
                        <span>Sales Revenue</span>
                        <span>{formatCurrency(plData.revenue)}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between py-2 font-bold">
                        <span>Total Revenue</span>
                        <span>{formatCurrency(plData.revenue)}</span>
                    </div>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Cost of Goods Sold</h2>
                    <div className="flex justify-between py-2 border-b dark:border-gray-700">
                        <span>COGS</span>
                        <span>{formatCurrency(plData.cogs)}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between py-2 text-lg font-bold text-green-600 dark:text-green-400">
                        <span>Gross Profit</span>
                        <span>{formatCurrency(plData.grossProfit)}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Operating Expenses</h2>
                    {plData.expenses.map(exp => (
                        <div key={exp.id} className="flex justify-between py-2 border-b dark:border-gray-700">
                            <span>{exp.category}</span>
                            <span>{formatCurrency(exp.amount)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between py-2 mt-2 font-bold">
                        <span>Total Operating Expenses</span>
                        <span>{formatCurrency(plData.totalExpenses)}</span>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t-2 dark:border-gray-600">
                    <div className={`flex justify-between py-2 text-2xl font-bold ${plData.netProfit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                        <span>Net Profit</span>
                        <span>{formatCurrency(plData.netProfit)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfitAndLoss;
