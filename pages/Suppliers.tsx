
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

const Suppliers: React.FC = () => {
    const { suppliers } = useAppContext();
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Suppliers</h1>
                <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700">
                    <Plus size={20} />
                    <span>Add Supplier</span>
                </button>
            </div>
            
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search suppliers..." 
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
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Phone</th>
                                <th className="p-4 font-semibold">Address</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map(supplier => (
                                <tr key={supplier.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-4">{supplier.name}</td>
                                    <td className="p-4">{supplier.email}</td>
                                    <td className="p-4">{supplier.phone}</td>
                                    <td className="p-4">{supplier.address}</td>
                                    <td className="p-4 text-right">
                                        <button className="text-blue-500 hover:text-blue-700 mr-2"><Edit size={18} /></button>
                                        <button className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Suppliers;
