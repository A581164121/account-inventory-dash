
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { JournalEntry, Permission, JournalEntryLine } from '../types';
import { Plus, Trash2, CheckSquare, Clock, FileDown, FileWarning } from 'lucide-react';
import Modal from '../components/ui/Modal';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { useAuth } from '../context/auth';
import { exportToCsv } from '../services/exportService';

const JournalEntryForm: React.FC<{
    onSave: (entry: Omit<JournalEntry, 'id' | 'status' | 'isDeleted'| 'createdAt' | 'createdBy' | 'editHistory'>) => void;
    onCancel: () => void;
}> = ({ onSave, onCancel }) => {
    const { accounts } = useAppContext();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [lines, setLines] = useState<Omit<JournalEntryLine, 'balance'>[]>([
        { accountId: '', debit: 0, credit: 0 },
        { accountId: '', debit: 0, credit: 0 },
    ]);
    const [error, setError] = useState('');

    // Fix: Narrow down the type of `field` to only include the keys being modified by this form.
    // This resolves the error where a `number` was being assigned to a property that could be a `string`.
    const handleLineChange = (index: number, field: 'accountId' | 'debit' | 'credit', value: string) => {
        const newLines = [...lines];
        const line = newLines[index];

        if (field === 'accountId') {
            line.accountId = value;
        } else {
            const numValue = parseFloat(value) || 0;
            line[field] = numValue;
            if (field === 'debit' && numValue > 0) line.credit = 0;
            if (field === 'credit' && numValue > 0) line.debit = 0;
        }
        setLines(newLines);
        setError('');
    };

    const addLine = () => setLines([...lines, { accountId: '', debit: 0, credit: 0 }]);
    const removeLine = (index: number) => {
        if (lines.length > 2) {
            setLines(lines.filter((_, i) => i !== index));
        }
    };

    const totalDebits = useMemo(() => lines.reduce((sum, line) => sum + line.debit, 0), [lines]);
    const totalCredits = useMemo(() => lines.reduce((sum, line) => sum + line.credit, 0), [lines]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const validLines = lines.filter(l => l.accountId && (l.debit > 0 || l.credit > 0));

        if (validLines.length < 2) {
            setError('A journal entry must have at least two lines with values.');
            return;
        }
        if (validLines.some(l => !l.accountId)) {
            setError('Please select an account for all lines.');
            return;
        }
        if (totalDebits === 0 || totalCredits === 0) {
            setError('Debits and Credits cannot be zero.');
            return;
        }
        if (totalDebits.toFixed(5) !== totalCredits.toFixed(5)) {
            setError('Total debits must equal total credits.');
            return;
        }
        
        onSave({
            date,
            description,
            lines: validLines,
        });
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
            </div>
            
            <div className="space-y-2">
                {lines.map((line, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-12 sm:col-span-5">
                            <select value={line.accountId} onChange={(e) => handleLineChange(index, 'accountId', e.target.value)} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                                <option value="">Select Account</option>
                                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.id} - {acc.name}</option>)}
                            </select>
                        </div>
                        <div className="col-span-5 sm:col-span-3">
                             <input type="number" placeholder="Debit" value={line.debit || ''} onChange={(e) => handleLineChange(index, 'debit', e.target.value)} min="0" step="0.01" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div className="col-span-5 sm:col-span-3">
                            <input type="number" placeholder="Credit" value={line.credit || ''} onChange={(e) => handleLineChange(index, 'credit', e.target.value)} min="0" step="0.01" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div className="col-span-2 sm:col-span-1 text-right">
                            {lines.length > 2 && <button type="button" onClick={() => removeLine(index)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>}
                        </div>
                    </div>
                ))}
            </div>
            
            <button type="button" onClick={addLine} className="mt-4 text-sm text-primary hover:underline flex items-center space-x-1"><Plus size={16} /><span>Add Line</span></button>

            <div className="mt-4 border-t dark:border-gray-700 pt-4">
                <div className="flex justify-end space-x-8 font-mono">
                    <div className="text-right">
                        <p className="text-sm">Total Debits</p>
                        <p>{formatCurrency(totalDebits)}</p>
                    </div>
                     <div className="text-right">
                        <p className="text-sm">Total Credits</p>
                        <p>{formatCurrency(totalCredits)}</p>
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm text-right mt-2">{error}</p>}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Save Entry</button>
            </div>
        </form>
    );
};

const JournalEntries: React.FC = () => {
    const { journalEntries, accounts, postJournalEntry, approveJournalEntry, requestDelete } = useAppContext();
    const { currentUser, hasPermission } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    
    const getAccountName = (id: string) => accounts.find(a => a.id === id)?.name || 'N/A';
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const activeJournalEntries = useMemo(() => journalEntries.filter(je => !je.isDeleted).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [journalEntries]);

    const handleSave = (entry: Omit<JournalEntry, 'id' | 'status' | 'isDeleted' | 'createdAt' | 'createdBy' | 'editHistory'>) => {
        if (!currentUser) return;
        
        const newEntryWithStatus = {
            ...entry,
            status: 'pending_approval' as const
        };
        postJournalEntry(newEntryWithStatus);
        setIsModalOpen(false);
    };

    const handleApprove = (entryId: string) => {
        if(currentUser) {
            approveJournalEntry(entryId);
        }
    };

    const handleDeleteClick = (entryId: string) => {
        setDeleteId(entryId);
    };

    const handleConfirmDelete = () => {
        if (currentUser && deleteId) {
            requestDelete('journal_entry', deleteId);
        }
        setDeleteId(null);
    };

    const handleExport = () => {
        const dataToExport = activeJournalEntries.flatMap(je => 
            je.lines.map(line => ({
                journalEntryId: je.id,
                date: je.date,
                description: je.description,
                account: getAccountName(line.accountId),
                debit: line.debit,
                credit: line.credit,
                status: je.status,
            }))
        );
        exportToCsv(dataToExport, `journal_entries_${new Date().toISOString().split('T')[0]}`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6 no-print">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Journal Entries</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={handleExport} className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-emerald-600">
                        <FileDown size={20} />
                        <span>Export CSV</span>
                    </button>
                    {hasPermission(Permission.CREATE_JOURNAL_ENTRY) && (
                        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700">
                            <Plus size={20} />
                            <span>Add Entry</span>
                        </button>
                    )}
                </div>
            </div>
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md printable-content">
                {activeJournalEntries.map(entry => (
                    <div key={entry.id} className="mb-6 border-b dark:border-gray-700 pb-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-semibold">{entry.description}</p>
                                <p className="text-sm text-gray-500">{entry.date}</p>
                            </div>
                            <div className="flex items-center space-x-4 no-print">
                                {entry.status === 'pending_approval' && <span className="flex items-center text-sm text-orange-500"><Clock size={16} className="mr-1"/>Pending Approval</span>}
                                {entry.status === 'approved' && <span className="flex items-center text-sm text-green-500"><CheckSquare size={16} className="mr-1"/>Approved</span>}
                                {entry.status === 'pending_deletion' && <span className="flex items-center text-sm text-yellow-500"><FileWarning size={16} className="mr-1"/>Pending Deletion</span>}

                                {hasPermission(Permission.APPROVE_JOURNAL_ENTRY) && entry.status === 'pending_approval' && (
                                    <button onClick={() => handleApprove(entry.id)} className="bg-green-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-green-600">Approve</button>
                                )}
                                {hasPermission(Permission.REQUEST_DELETE_JOURNAL_ENTRY) && entry.status === 'approved' && (
                                    <button onClick={() => handleDeleteClick(entry.id)} className="text-red-500 hover:text-red-700" title="Request Deletion"><Trash2 size={18} /></button>
                                )}
                            </div>
                        </div>
                        <table className="w-full text-left text-sm">
                             <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="p-2 font-semibold">Account</th>
                                    <th className="p-2 font-semibold text-right">Debit</th>
                                    <th className="p-2 font-semibold text-right">Credit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entry.lines.map((line, index) => (
                                    <tr key={index}>
                                        <td className="p-2">{getAccountName(line.accountId)}</td>
                                        <td className="p-2 text-right">{line.debit > 0 ? formatCurrency(line.debit) : null}</td>
                                        <td className="p-2 text-right">{line.credit > 0 ? formatCurrency(line.credit) : null}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Journal Entry">
                 <JournalEntryForm onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>

            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion Request"
                message="Are you sure you want to request deletion for this journal entry? An administrator will need to approve it."
                confirmText="Request Deletion"
            />
        </div>
    );
};

export default JournalEntries;
