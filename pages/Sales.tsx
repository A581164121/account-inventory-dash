import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Plus, Search, Eye, FileWarning, CheckCircle, Printer, FileDown } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { Trash2 } from 'lucide-react';
import { JournalEntry, JournalEntryLine, Sale, Permission, UserRole } from '../types';
import { useAuth } from '../context/auth';
import { exportToCsv } from '../services/exportService';

const Sales: React.FC = () => {
    const { sales, setSales, customers, products, postJournalEntry, requestDelete } = useAppContext();
    const { currentUser, hasPermission } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    
    const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || 'N/A';
    
    const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now()}`);
    const [customerId, setCustomerId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState<Array<{productId: string, quantity: number, price: number}>>([{ productId: '', quantity: 1, price: 0 }]);

    const handleAddItem = () => setItems([...items, { productId: '', quantity: 1, price: 0 }]);
    const handleRemoveItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    const handleItemChange = (index: number, field: string, value: string | number) => {
        const newItems = [...items];
        const product = products.find(p => p.id === (field === 'productId' ? value : newItems[index].productId));
        
        if (field === 'productId') {
            newItems[index].productId = value as string;
            if (product) newItems[index].price = product.salePrice;
        } else if (field === 'quantity') {
            newItems[index].quantity = Math.max(0, Number(value));
        } else if (field === 'price') {
            newItems[index].price = Math.max(0, Number(value));
        }
        setItems(newItems);
    };

    const total = useMemo(() => items.reduce((sum, item) => sum + (item.quantity * item.price), 0), [items]);
    
    const resetForm = () => {
        setInvoiceNumber(`INV-${Date.now()}`);
        setCustomerId('');
        setDate(new Date().toISOString().split('T')[0]);
        setItems([{ productId: '', quantity: 1, price: 0 }]);
    };

    const handleDeleteRequest = (saleId: string) => {
        if (currentUser && window.confirm('Are you sure you want to request deletion for this sale? An administrator will need to approve it.')) {
            requestDelete('sale', saleId, currentUser.id);
        }
    };

    const handleExport = () => {
        const dataToExport = sales.map(s => ({
            invoiceNumber: s.invoiceNumber,
            customerName: getCustomerName(s.customerId),
            date: s.date,
            total: s.total,
            status: s.status,
            createdBy: s.createdBy,
        }));
        exportToCsv(dataToExport, `sales_${new Date().toISOString().split('T')[0]}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !customerId || !invoiceNumber || items.some(item => !item.productId || item.quantity <= 0)) {
            alert('Please fill all required fields and ensure quantity is greater than 0.');
            return;
        }

        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            if (!product || product.stock < item.quantity) {
                alert(`Not enough stock for ${product?.name}. Available: ${product?.stock}`);
                return;
            }
        }
        
        const saleId = `SALE-${Date.now()}`;
        const customerName = customers.find(c => c.id === customerId)?.name || 'N/A';
        let totalCogs = 0;
        const cogsAndInventoryLines: JournalEntryLine[] = [];
        
        items.forEach(item => {
            const product = products.find(p => p.id === item.productId)!;
            const itemCogs = item.quantity * product.purchasePrice;
            totalCogs += itemCogs;
            cogsAndInventoryLines.push({ accountId: '103', debit: 0, credit: itemCogs, productId: item.productId, quantity: item.quantity });
        });

        const newJournalEntry: Omit<JournalEntry, 'id' | 'status'> = {
            date,
            description: `Sale to ${customerName} - Inv #${invoiceNumber}`,
            lines: [
                { accountId: '102', debit: total, credit: 0, customerId: customerId },
                { accountId: '401', debit: 0, credit: total },
                { accountId: '501', debit: totalCogs, credit: 0 },
                ...cogsAndInventoryLines,
            ],
            // FIX: Added createdBy to satisfy the type requirement for postJournalEntry.
            createdBy: currentUser.id,
        };

        const createdJournalEntry = postJournalEntry(newJournalEntry, currentUser.id);

        const newSale: Sale = {
            id: saleId, invoiceNumber, customerId, date, items, total,
            journalEntryId: createdJournalEntry.id,
            status: 'approved', // Sales are auto-approved for simplicity, JE needs approval
            createdBy: currentUser.id,
        };
        setSales(prev => [newSale, ...prev]);

        setIsModalOpen(false);
        resetForm();
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6 no-print">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Sales</h1>
                {hasPermission(Permission.CREATE_SALE) && (
                    <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700">
                        <Plus size={20} />
                        <span>Add Sale</span>
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
                                <th className="p-4 font-semibold">Invoice #</th>
                                <th className="p-4 font-semibold">Customer</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Total</th>
                                <th className="p-4 font-semibold text-right no-print">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(sale => (
                                <tr key={sale.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-4 font-mono">{sale.invoiceNumber}</td>
                                    <td className="p-4">{getCustomerName(sale.customerId)}</td>
                                    <td className="p-4">{sale.date}</td>
                                    <td className="p-4">
                                        {sale.status === 'pending_deletion' ? <span className="flex items-center text-yellow-500"><FileWarning size={16} className="mr-1"/>Pending Deletion</span> : <span className="flex items-center text-green-500"><CheckCircle size={16} className="mr-1"/>Active</span>}
                                    </td>
                                    <td className="p-4">{formatCurrency(sale.total)}</td>
                                    <td className="p-4 text-right no-print">
                                        <Link to={`/sales/invoice/${sale.id}`} className="text-blue-500 hover:text-blue-700 inline-block mr-4" title="View Invoice">
                                            <Eye size={18} />
                                        </Link>
                                        <Link to={`/sales/invoice/${sale.id}?print=true`} target="_blank" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white inline-block mr-4" title="Print Invoice">
                                            <Printer size={18} />
                                        </Link>
                                        {hasPermission(Permission.REQUEST_DELETE_SALE) && sale.status === 'approved' && (
                                            <button onClick={() => handleDeleteRequest(sale.id)} className="text-red-500 hover:text-red-700" title="Request Deletion">
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Sale">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Invoice #</label>
                            <input type="text" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Customer</label>
                            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                                <option value="">Select Customer</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium mb-1">Date</label>
                             <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">Items</h3>
                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
                                <div className="col-span-12 sm:col-span-5">
                                    <select value={item.productId} onChange={(e) => handleItemChange(index, 'productId', e.target.value)} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                                        <option value="">Select Product</option>
                                        {products.map(p => <option key={p.id} value={p.id} disabled={p.stock <= 0}>{p.name} ({p.stock} in stock)</option>)}
                                    </select>
                                </div>
                                <div className="col-span-4 sm:col-span-2">
                                     <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} min="1" required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div className="col-span-4 sm:col-span-2">
                                     <input type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} min="0" step="0.01" required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div className="col-span-3 sm:col-span-2 text-right">
                                    <p className="p-2">{formatCurrency(item.quantity * item.price)}</p>
                                </div>
                                <div className="col-span-1 text-right self-end">
                                    <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                         <button type="button" onClick={handleAddItem} className="mt-2 text-sm text-primary hover:underline flex items-center space-x-1"><Plus size={16} /><span>Add Item</span></button>
                    </div>
                    <div className="mt-6 border-t dark:border-gray-700 pt-4 flex justify-end items-center">
                        <div className="text-xl font-bold">Total: {formatCurrency(total)}</div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Save Sale</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Sales;