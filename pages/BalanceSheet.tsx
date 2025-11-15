
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { generateBalanceSheet } from '../services/accountingService';
import { Printer, FileDown } from 'lucide-react';

const BalanceSheet: React.FC = () => {
    const appState = useAppContext();
    const bsData = generateBalanceSheet(appState);
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Balance Sheet</h1>
                <div className="flex space-x-2">
                    <button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-600">
                        <Printer size={20} />
                        <span>Print</span>
                    </button>
                    <button className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-emerald-600">
                        <FileDown size={20} />
                        <span>Export PDF</span>
                    </button>
                </div>
            </div>
            
            <div className="bg-white dark:bg-dark-secondary p-8 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Assets */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 border-b-2 pb-2 dark:border-gray-600">Assets</h2>
                        {bsData.assets.map(asset => (
                            <div key={asset.name} className="flex justify-between py-2">
                                <span>{asset.name}</span>
                                <span>{formatCurrency(asset.value)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between py-2 mt-4 font-bold border-t-2 pt-2 dark:border-gray-600">
                            <span>Total Assets</span>
                            <span>{formatCurrency(bsData.totalAssets)}</span>
                        </div>
                    </div>

                    {/* Liabilities & Equity */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 border-b-2 pb-2 dark:border-gray-600">Liabilities & Equity</h2>
                        <h3 className="text-xl font-semibold my-2">Liabilities</h3>
                        {bsData.liabilities.map(liability => (
                             <div key={liability.name} className="flex justify-between py-2">
                                <span>{liability.name}</span>
                                <span>{formatCurrency(liability.value)}</span>
                            </div>
                        ))}
                        <h3 className="text-xl font-semibold my-2 mt-6">Equity</h3>
                        {bsData.equity.map(eq => (
                             <div key={eq.name} className="flex justify-between py-2">
                                <span>{eq.name}</span>
                                <span>{formatCurrency(eq.value)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between py-2 mt-4 font-bold border-t-2 pt-2 dark:border-gray-600">
                            <span>Total Liabilities & Equity</span>
                            <span>{formatCurrency(bsData.totalLiabilitiesAndEquity)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BalanceSheet;
