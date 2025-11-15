
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { generateTrialBalance } from '../services/accountingService';
import { Printer, FileDown } from 'lucide-react';

const TrialBalance: React.FC = () => {
    const appState = useAppContext();
    const trialBalanceData = generateTrialBalance(appState);
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const totalDebits = trialBalanceData.reduce((sum, item) => sum + item.debit, 0);
    const totalCredits = trialBalanceData.reduce((sum, item) => sum + item.credit, 0);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Trial Balance</h1>
                <div className="flex space-x-2">
                    <button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-600">
                        <Printer size={20} />
                        <span>Print</span>
                    </button>
                    <button className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-emerald-600">
                        <FileDown size={20} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="p-4 font-semibold">Account</th>
                                <th className="p-4 font-semibold text-right">Debit</th>
                                <th className="p-4 font-semibold text-right">Credit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trialBalanceData.map(item => (
                                <tr key={item.accountId} className="border-b dark:border-gray-700">
                                    <td className="p-4">{item.accountName}</td>
                                    <td className="p-4 text-right">{item.debit > 0 ? formatCurrency(item.debit) : '-'}</td>
                                    <td className="p-4 text-right">{item.credit > 0 ? formatCurrency(item.credit) : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                             <tr className="bg-gray-200 dark:bg-gray-800 font-bold">
                                <td className="p-4">Total</td>
                                <td className="p-4 text-right">{formatCurrency(totalDebits)}</td>
                                <td className="p-4 text-right">{formatCurrency(totalCredits)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TrialBalance;
