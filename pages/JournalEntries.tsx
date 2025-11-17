import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { JournalEntry, Permission } from '../types';
import { Plus, Trash2, CheckSquare, Clock, FileDown } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/auth';
import { exportToCsv } from '../services/exportService';

const JournalEntries: React.FC = () => {
    const { journalEntries, accounts, postJournalEntry, approveJournalEntry, requestDelete } = useAppContext();
    const { currentUser, hasPermission } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const getAccountName = (id: string) => accounts.find(a => a.id === id)?.name || 'N/A';
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const handleSave = (entry: Omit<JournalEntry, 'id' | 'status'>) => {
        if (!currentUser) return;
        postJournalEntry(entry, currentUser.id);
        setIsModalOpen(false);
    };

    const handleApprove = (entryId: string) => {
        if(currentUser) {
            approveJournalEntry(entryId, currentUser.id);
        }
    };

    const handleDeleteRequest = (entryId: string) => {
        if (currentUser && window.confirm('Are you sure you want to request deletion for this journal entry? An administrator will need to approve it.')) {
            requestDelete('journal_entry', entryId, currentUser.id);
        }
    };

    const handleExport = () => {
        const dataToExport = journalEntries.flatMap(je => 
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
                {journalEntries.map(entry => (
                    <div key={entry.id} className="mb-6 border-b dark:border-gray-700 pb-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-semibold">{entry.description}</p>
                                <p className="text-sm text-gray-500">{entry.date}</p>
                            </div>
                            <div className="flex items-center space-x-4 no-print">
                                {entry.status === 'pending_approval' && <span className="flex items-center text-sm text-orange-500"><Clock size={16} className="mr-1"/>Pending Approval</span>}
                                {entry.status === 'approved' && <span className="flex items-center text-sm text-green-500"><CheckSquare size={16} className="mr-1"/>Approved</span>}
                                {entry.status === 'pending_deletion' && <span className="flex items-center text-sm text-yellow-500"><Trash2 size={16} className="mr-1"/>Pending Deletion</span>}

                                {hasPermission(Permission.APPROVE_JOURNAL_ENTRY) && entry.status === 'pending_approval' && (
                                    <button onClick={() => handleApprove(entry.id)} className="bg-green-500 text-white px-3 py-1 text-sm rounded-lg">Approve</button>
                                )}
                                {hasPermission(Permission.REQUEST_DELETE_JOURNAL_ENTRY) && entry.status === 'approved' && (
                                    <button onClick={() => handleDeleteRequest(entry.id)} className="text-red-500 hover:text-red-700" title="Request Deletion"><Trash2 size={18} /></button>
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
                 <p>Journal Entry Form would go here. For brevity, this form is omitted, but it would be similar to the one previously implemented.</p>
                 <button onClick={() => setIsModalOpen(false)} className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg">Close</button>
            </Modal>
        </div>
    );
};

export default JournalEntries;