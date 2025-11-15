import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Search, Eye, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';

const Sales: React.FC = () => {
    const { sales, customers, products, addSale } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    
    const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || 'N/A';
    
    // Form State
    const [customerId, setCustomerId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState<Array<{productId: string, quantity: number, price: number}>>([{ productId: '', quantity: 1, price: 0 }]);

    const handleAddItem = () => {
        setItems([...items, { productId: '', quantity: 1, price: 0 }]);
    };

    const handleItemChange = (index: number, field: string, value: string | number) => {
        const newItems = [...items];
        const product = products.find(p => p.id === (field === 'productId' ? value : newItems[index].productId));
        
        if (field === 'productId') {
            newItems[index].productId = value as string;
            if (product) {
                newItems[index].price = product.salePrice;
            }
        } else if (field === 'quantity') {
            newItems[index].quantity = Math.max(0, Number(value));
        } else if (field === 'price') {
            newItems[index].price = Math.max(0, Number(value));
        }
        setItems(newItems);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };
    
    const total = useMemo(() => {
        return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    }, [items]);
    
    const resetForm = () => {
        setCustomerId('');
        setDate(new Date().toISOString().split('T')[0]);
        setItems([{ productId: '', quantity: 1, price: 0 }]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerId || items.some(item => !item.productId || item.quantity <= 0)) {
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

        addSale({
            customerId,
            date,
            items,
            total,
        });
        setIsModalOpen(false);
        resetForm();
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Sales</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700">
                    <Plus size={20} />
                    <span>Add Sale</span>
                </button>
            </div>
            
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                     <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search sales..." 
                            className="pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={20} className="text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="p-4 font-semibold">Sale ID</th>
                                <th className="p-4 font-semibold">Customer</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Total</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(sale => (
                                <tr key={sale.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-4">{sale.id}</td>
                                    <td className="p-4">{getCustomerName(sale.customerId)}</td>
                                    <td className="p-4">{sale.date}</td>
                                    <td className="p-4">{formatCurrency(sale.total)}</td>
                                    <td className="p-4 text-right">
                                        <button className="text-blue-500 hover:text-blue-700"><Eye size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Sale">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <label className="text-sm sm:hidden">Product</label>
                                    <select value={item.productId} onChange={(e) => handleItemChange(index, 'productId', e.target.value)} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                                        <option value="">Select Product</option>
                                        {products.map(p => <option key={p.id} value={p.id} disabled={p.stock <= 0}>{p.name} ({p.stock} in stock)</option>)}
                                    </select>
                                </div>
                                <div className="col-span-4 sm:col-span-2">
                                    <label className="text-sm sm:hidden">Qty</label>
                                     <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} min="1" required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div className="col-span-4 sm:col-span-2">
                                     <label className="text-sm sm:hidden">Price</label>
                                     <input type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} min="0" step="0.01" required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div className="col-span-3 sm:col-span-2 text-right">
                                    <label className="text-sm sm:hidden">&nbsp;</label>
                                    <p className="p-2">{formatCurrency(item.quantity * item.price)}</p>
                                </div>
                                <div className="col-span-1 text-right">
                                     <label className="text-sm sm:hidden">&nbsp;</label>
                                    <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                         <button type="button" onClick={handleAddItem} className="mt-2 text-sm text-primary hover:underline flex items-center space-x-1">
                            <Plus size={16} />
                            <span>Add Item</span>
                        </button>
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
