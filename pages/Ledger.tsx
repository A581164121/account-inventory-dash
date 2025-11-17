import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateLedgerForAccount } from '../services/accountingService';
import { Printer, FileDown } from 'lucide-react';
import { exportToCsv, exportToPdf } from '../services/exportService';

const Ledger: React.FC = () => {
    const appState = useAppContext();
    const { accounts } = appState;
    const [selectedAccountId, setSelectedAccountId] = useState<string>('');

    const ledgerData = useMemo(() => {
        if (!selectedAccountId) return [];
        return generateLedgerForAccount(selectedAccountId, appState);
    }, [selectedAccountId, appState]);

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const selectedAccount = accounts.find(a => a.id === selectedAccountId);
    const closingBalance = ledgerData.length > 0 ? ledgerData[ledgerData.length - 1].balance : 0;

    const handlePrint = () => {
        window.print();
    };

    const handleExportCsv = () => {
        if (!selectedAccount) return;
        exportToCsv(ledgerData, `ledger_${selectedAccount.name.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}`);
    };
    
    const handleExportPdf = () => {
        if (!selectedAccount) return;
        exportToPdf('ledger-report', `ledger_${selectedAccount.name.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}`);
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6 no-print">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Ledger</h1>
                 <div className="flex space-x-2">
                    <button onClick={handlePrint} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-600">
                        <Printer size={20} />
                        <span>Print</span>
                    </button>
                    <button onClick={handleExportPdf} disabled={!selectedAccountId} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 disabled:opacity-50">
                        <FileDown size={20} />
                        <span>Export PDF</span>
                    </button>
                    <button onClick={handleExportCsv} disabled={!selectedAccountId} className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-emerald-600 disabled:opacity-50">
                        <FileDown size={20} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>
            <div id="ledger-report" className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md printable-content">
                <div className="mb-4 no-print">
                    <label className="block text-sm font-medium mb-1">Select Account</label>
                    <select 
                        value={selectedAccountId} 
                        onChange={e => setSelectedAccountId(e.target.value)}
                        className="w-full md:w-1/3 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    >
                        <option value="">-- Select an Account --</option>
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                    </select>
                </div>
                
                {selectedAccountId && (
                    <div className="overflow-x-auto mt-6">
                        <h2 className="text-xl font-semibold mb-2">
                            Ledger for: {selectedAccount?.name}
                        </h2>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="p-4 font-semibold">Date</th>
                                    <th className="p-4 font-semibold">Description</th>
                                    <th className="p-4 font-semibold text-right">Debit</th>
                                    <th className="p-4 font-semibold text-right">Credit</th>
                                    <th className="p-4 font-semibold text-right">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ledgerData.map((entry, index) => (
                                    <tr key={index} className="border-b dark:border-gray-700">
                                        <td className="p-4">{entry.date}</td>
                                        <td className="p-4">{entry.description}</td>
                                        <td className="p-4 text-right">{entry.debit > 0 ? formatCurrency(entry.debit) : '-'}</td>
                                        <td className="p-4 text-right">{entry.credit > 0 ? formatCurrency(entry.credit) : '-'}</td>
                                        <td className="p-4 text-right font-mono">{formatCurrency(entry.balance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                             <tfoot>
                                <tr className="bg-gray-200 dark:bg-gray-800 font-bold">
                                    <td colSpan={4} className="p-4 text-right">Closing Balance</td>
                                    <td className="p-4 text-right font-mono">{formatCurrency(closingBalance)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Ledger;