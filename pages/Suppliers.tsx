
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Supplier, Permission } from '../types';
import { Plus, Search, Edit, Trash2, FileWarning, CheckCircle, FileDown, History } from 'lucide-react';
import Modal from '../components/ui/Modal';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { useAuth } from '../context/auth';
import { exportToCsv } from '../services/exportService';
import RecordHistoryModal from '../components/ui/RecordHistoryModal';

const SupplierForm: React.FC<{ supplier?: Supplier; onSave: (supplier: Omit<Supplier, 'id'> | Supplier) => void; onCancel: () => void; }> = ({ supplier, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: supplier?.name || '',
        email: supplier?.email || '',
        phone: supplier?.phone || '',
        address: supplier?.address || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...supplier, ...formData });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Save Supplier</button>
            </div>
        </form>
    );
};

const Suppliers: React.FC = () => {
    const { suppliers, addSupplier, updateSupplier, requestDelete } = useAppContext();
    const { currentUser, hasPermission } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleSave = (supplier: Omit<Supplier, 'id'> | Supplier) => {
        if (!currentUser) return;
        if ('id' in supplier) {
            updateSupplier(supplier);
        } else {
            addSupplier(supplier as Omit<Supplier, 'id' | 'status' | 'isDeleted' | 'createdAt' | 'createdBy' | 'editHistory'>);
        }
        setIsModalOpen(false);
        setEditingSupplier(undefined);
    };

    const handleEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };

     const handleViewHistory = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setIsHistoryModalOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = () => {
        if (currentUser && deleteId) {
            requestDelete('supplier', deleteId);
        }
        setDeleteId(null);
    };
    
    const filteredSuppliers = suppliers.filter(s => 
        !s.isDeleted &&
        (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    const handleExport = () => {
        exportToCsv(filteredSuppliers.map(s => ({id: s.id, name: s.name, email: s.email, phone: s.phone, address: s.address, status: s.status})), `suppliers_${new Date().toISOString().split('T')[0]}`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6 no-print">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Suppliers</h1>
                {hasPermission(Permission.CREATE_PURCHASE) && (
                    <button onClick={() => { setEditingSupplier(undefined); setIsModalOpen(true); }} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700">
                        <Plus size={20} />
                        <span>Add Supplier</span>
                    </button>
                )}
            </div>
            
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md printable-content">
                <div className="flex justify-between items-center mb-4 no-print">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search suppliers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={20} className="text-gray-400" />
                        </div>
                    </div>
                     <button onClick={handleExport} className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-emerald-600">
                        <FileDown size={20} />
                        <span>Export CSV</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Phone</th>
                                <th className="p-4 font-semibold">Address</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right no-print">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSuppliers.map(supplier => (
                                <tr key={supplier.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-4">{supplier.name}</td>
                                    <td className="p-4">{supplier.email}</td>
                                    <td className="p-4">{supplier.phone}</td>
                                    <td className="p-4">{supplier.address}</td>
                                    <td className="p-4">
                                        {supplier.status === 'pending_deletion' ? <span className="flex items-center text-yellow-500"><FileWarning size={16} className="mr-1"/>Pending Deletion</span> : <span className="flex items-center text-green-500"><CheckCircle size={16} className="mr-1"/>Active</span>}
                                    </td>
                                    <td className="p-4 text-right no-print space-x-2">
                                        {hasPermission(Permission.VIEW_AUDIT_TRAIL) && <button onClick={() => handleViewHistory(supplier)} className="text-gray-500 hover:text-gray-700" title="View History"><History size={18} /></button>}
                                        {hasPermission(Permission.EDIT_PURCHASE) && <button onClick={() => handleEdit(supplier)} className="text-blue-500 hover:text-blue-700" title="Edit"><Edit size={18} /></button>}
                                        {hasPermission(Permission.REQUEST_DELETE_PURCHASE) && supplier.status !== 'pending_deletion' && (
                                            <button onClick={() => handleDeleteClick(supplier.id)} className="text-red-500 hover:text-red-700" title="Request Deletion"><Trash2 size={18} /></button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSupplier ? "Edit Supplier" : "Add Supplier"}>
                <SupplierForm 
                    supplier={editingSupplier}
                    onSave={handleSave}
                    onCancel={() => { setIsModalOpen(false); setEditingSupplier(undefined); }}
                />
            </Modal>

            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion Request"
                message="Are you sure you want to request deletion for this supplier? An administrator will need to approve it."
                confirmText="Request Deletion"
            />

            {editingSupplier && (
              <RecordHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                recordName={editingSupplier.name}
                history={editingSupplier.editHistory}
              />
            )}
        </div>
    );
};

export default Suppliers;
