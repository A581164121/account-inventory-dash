import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Expense, Permission } from '../types';
import { Plus, Edit, Trash2, FileWarning, CheckCircle, FileDown, History } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/auth';
import { exportToCsv } from '../services/exportService';
import RecordHistoryModal from '../components/ui/RecordHistoryModal';

const ExpenseForm: React.FC<{ expense?: Expense; onSave: (expense: Omit<Expense, 'id' | 'status' | 'createdBy' | 'departmentId' > | Expense) => void; onCancel: () => void; }> = ({ expense, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        date: expense?.date || new Date().toISOString().split('T')[0],
        category: expense?.category || '',
        amount: expense?.amount || 0,
        description: expense?.description || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'amount' ? Number(value) : value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...expense, ...formData });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="e.g., Rent, Utilities" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} required min="0" step="0.01" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Save Expense</button>
            </div>
        </form>
    );
};


const Expenses: React.FC = () => {
    const { expenses, addExpense, updateExpense, requestDelete } = useAppContext();
    const { currentUser, hasPermission } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    const activeExpenses = useMemo(() => expenses.filter(e => !e.isDeleted), [expenses]);

    const handleSave = async (expense: Omit<Expense, 'id' | 'status' | 'createdBy' | 'departmentId'> | Expense) => {
        if (!currentUser) return;
        if ('id' in expense) {
            await updateExpense(expense);
        } else {
            const newExpenseData = expense as Omit<Expense, 'id' | 'status' | 'createdBy' | 'isDeleted' | 'createdAt'|'createdBy' | 'editHistory' | 'departmentId'>;
            
            await addExpense({ ...newExpenseData, departmentId: currentUser.departmentId });
        }

        setIsModalOpen(false);
        setEditingExpense(undefined);
    };

    const handleEdit = (expense: Expense) => {
        setEditingExpense(expense);
        setIsModalOpen(true);
    };

    const handleViewHistory = (expense: Expense) => {
        setEditingExpense(expense);
        setIsHistoryModalOpen(true);
    };

    const handleDeleteRequest = (expenseId: string) => {
        if (currentUser && window.confirm('Are you sure you want to request deletion for this expense? An administrator will need to approve it.')) {
            requestDelete('expense', expenseId);
        }
    };

    const handleExport = () => {
        exportToCsv(activeExpenses.map(e => ({id: e.id, date: e.date, category: e.category, description: e.description, amount: e.amount, status: e.status})), `expenses_${new Date().toISOString().split('T')[0]}`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6 no-print">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Expenses</h1>
                {hasPermission(Permission.CREATE_EXPENSE) && (
                    <button onClick={() => { setEditingExpense(undefined); setIsModalOpen(true); }} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700">
                        <Plus size={20} />
                        <span>Add Expense</span>
                    </button>
                )}
            </div>
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md printable-content">
                 <div className="flex justify-end mb-4 no-print">
                    <button onClick={handleExport} className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-emerald-600">
                        <FileDown size={20} />
                        <span>Export CSV</span>
                    </button>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Category</th>
                                <th className="p-4 font-semibold">Description</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Amount</th>
                                <th className="p-4 font-semibold text-right no-print">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeExpenses.map(expense => (
                                <tr key={expense.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-4">{expense.date}</td>
                                    <td className="p-4">{expense.category}</td>
                                    <td className="p-4">{expense.description}</td>
                                    <td className="p-4">
                                         {expense.status === 'pending_deletion' ? <span className="flex items-center text-yellow-500"><FileWarning size={16} className="mr-1"/>Pending Deletion</span> : <span className="flex items-center text-green-500"><CheckCircle size={16} className="mr-1"/>Active</span>}
                                    </td>
                                    <td className="p-4 text-right">{formatCurrency(expense.amount)}</td>
                                    <td className="p-4 text-right no-print space-x-2">
                                        {hasPermission(Permission.VIEW_AUDIT_TRAIL) && <button onClick={() => handleViewHistory(expense)} className="text-gray-500 hover:text-gray-700" title="View History"><History size={18} /></button>}
                                        {hasPermission(Permission.EDIT_EXPENSE) && <button onClick={() => handleEdit(expense)} className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>}
                                        {hasPermission(Permission.REQUEST_DELETE_EXPENSE) && expense.status !== 'pending_deletion' && <button onClick={() => handleDeleteRequest(expense.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExpense ? "Edit Expense" : "Add Expense"}>
                <ExpenseForm 
                    expense={editingExpense}
                    onSave={handleSave}
                    onCancel={() => { setIsModalOpen(false); setEditingExpense(undefined); }}
                />
            </Modal>
            
            {editingExpense && (
              <RecordHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                recordName={`Expense on ${editingExpense.date}`}
                history={editingExpense.editHistory}
              />
            )}
        </div>
    );
};

export default Expenses;