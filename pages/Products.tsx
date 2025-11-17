
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Product, Permission } from '../types';
import { Plus, Search, Edit, Trash2, FileWarning, CheckCircle, FileDown } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/auth';
import { exportToCsv } from '../services/exportService';

const ProductForm: React.FC<{ product?: Product; onSave: (product: Omit<Product, 'id'> | Product) => void; onCancel: () => void; }> = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        sku: product?.sku || '',
        category: product?.category || '',
        unit: product?.unit || '',
        description: product?.description || '',
        purchasePrice: product?.purchasePrice || 0,
        salePrice: product?.salePrice || 0,
        stock: product?.stock || 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'purchasePrice' || name === 'salePrice' || name === 'stock' ? Number(value) : value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...product, ...formData });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">SKU</label>
                    <input type="text" name="sku" value={formData.sku} onChange={handleChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Unit (e.g., pcs, kg)</label>
                    <input type="text" name="unit" value={formData.unit} onChange={handleChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Purchase Price</label>
                    <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} required min="0" step="0.01" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Sale Price</label>
                    <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} required min="0" step="0.01" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Save Product</button>
            </div>
        </form>
    );
}

const Products: React.FC = () => {
    const { products, addProduct, updateProduct, requestDelete } = useAppContext();
    const { currentUser, hasPermission } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const handleSave = (product: Omit<Product, 'id'> | Product) => {
        if (!currentUser) return;
        if ('id' in product) {
            updateProduct(product, currentUser.id);
        } else {
            addProduct(product, currentUser.id);
        }
        setIsModalOpen(false);
        setEditingProduct(undefined);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteRequest = (id: string) => {
        if (currentUser && window.confirm('Are you sure you want to request deletion for this product? An administrator will need to approve it.')) {
            requestDelete('product', id, currentUser.id);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleExport = () => {
        exportToCsv(filteredProducts, `products_${new Date().toISOString().split('T')[0]}`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6 no-print">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Products / Inventory</h1>
                {hasPermission(Permission.CREATE_SALE) && ( // Assuming sales/purchase staff can add products
                    <button onClick={() => { setEditingProduct(undefined); setIsModalOpen(true); }} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700">
                        <Plus size={20} />
                        <span>Add Product</span>
                    </button>
                )}
            </div>
            
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md printable-content">
                <div className="flex justify-between items-center mb-4 no-print">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
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
                                <th className="p-4 font-semibold">SKU</th>
                                <th className="p-4 font-semibold">Category</th>
                                <th className="p-4 font-semibold">Purchase Price</th>
                                <th className="p-4 font-semibold">Sale Price</th>
                                <th className="p-4 font-semibold">Stock</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right no-print">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-4">{product.name}</td>
                                    <td className="p-4">{product.sku}</td>
                                    <td className="p-4">{product.category}</td>
                                    <td className="p-4">{formatCurrency(product.purchasePrice)}</td>
                                    <td className="p-4">{formatCurrency(product.salePrice)}</td>
                                    <td className={`p-4 font-bold ${product.stock <= 10 ? 'text-red-500' : ''}`}>{product.stock} {product.unit}</td>
                                    <td className="p-4">
                                        {product.status === 'pending_deletion' ? <span className="flex items-center text-yellow-500"><FileWarning size={16} className="mr-1"/>Pending Deletion</span> : <span className="flex items-center text-green-500"><CheckCircle size={16} className="mr-1"/>Active</span>}
                                    </td>
                                    <td className="p-4 text-right no-print space-x-2">
                                        {hasPermission(Permission.EDIT_SALE) && <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>}
                                        {hasPermission(Permission.REQUEST_DELETE_SALE) && product.status !== 'pending_deletion' && (
                                            <button onClick={() => handleDeleteRequest(product.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add Product'}>
                <ProductForm 
                    product={editingProduct}
                    onSave={handleSave}
                    onCancel={() => { setIsModalOpen(false); setEditingProduct(undefined); }}
                />
            </Modal>
        </div>
    );
};

export default Products;
