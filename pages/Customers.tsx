
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Customer, Permission } from '../types';
import { Plus, Search, Edit, Trash2, FileWarning, CheckCircle, FileDown } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/auth';
import { exportToCsv } from '../services/exportService';

const CustomerForm: React.FC<{ customer?: Customer; onSave: (customer: Omit<Customer, 'id'> | Customer) => void; onCancel: () => void; }> = ({ customer, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: customer?.name || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
        address: customer?.address || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...customer, ...formData });
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
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Save Customer</button>
            </div>
        </form>
    );
};


const Customers: React.FC = () => {
    const { customers, addCustomer, updateCustomer, requestDelete } = useAppContext();
    const { currentUser, hasPermission } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSave = (customer: Omit<Customer, 'id'> | Customer) => {
        if (!currentUser) return;
        if ('id' in customer) {
            updateCustomer(customer, currentUser.id);
        } else {
            addCustomer(customer, currentUser.id);
        }
        setIsModalOpen(false);
        setEditingCustomer(undefined);
    };

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleDeleteRequest = (id: string) => {
        if (currentUser && window.confirm('Are you sure you want to request deletion for this customer? An administrator will need to approve it.')) {
            requestDelete('customer', id, currentUser.id);
        }
    };
    
    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleExport = () => {
        exportToCsv(filteredCustomers, `customers_${new Date().toISOString().split('T')[0]}`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6 no-print">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Customers</h1>
                {hasPermission(Permission.CREATE_CUSTOMER) && (
                    <button onClick={() => { setEditingCustomer(undefined); setIsModalOpen(true); }} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700">
                        <Plus size={20} />
                        <span>Add Customer</span>
                    </button>
                )}
            </div>
            
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md printable-content">
                <div className="flex justify-between items-center mb-4 no-print">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search customers..." 
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
                            {filteredCustomers.map(customer => (
                                <tr key={customer.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-4">{customer.name}</td>
                                    <td className="p-4">{customer.email}</td>
                                    <td className="p-4">{customer.phone}</td>
                                    <td className="p-4">{customer.address}</td>
                                    <td className="p-4">
                                        {customer.status === 'pending_deletion' ? <span className="flex items-center text-yellow-500"><FileWarning size={16} className="mr-1"/>Pending Deletion</span> : <span className="flex items-center text-green-500"><CheckCircle size={16} className="mr-1"/>Active</span>}
                                    </td>
                                    <td className="p-4 text-right no-print space-x-2">
                                        {hasPermission(Permission.EDIT_CUSTOMER) && <button onClick={() => handleEdit(customer)} className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>}
                                        {hasPermission(Permission.REQUEST_DELETE_CUSTOMER) && customer.status !== 'pending_deletion' && (
                                          <button onClick={() => handleDeleteRequest(customer.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCustomer ? "Edit Customer" : "Add Customer"}>
                <CustomerForm 
                    customer={editingCustomer}
                    onSave={handleSave}
                    onCancel={() => { setIsModalOpen(false); setEditingCustomer(undefined); }}
                />
            </Modal>
        </div>
    );
};

export default Customers;
