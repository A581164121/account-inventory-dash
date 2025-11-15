
import React from 'react';
import { Plus } from 'lucide-react';

const Expenses: React.FC = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Expenses</h1>
                <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700">
                    <Plus size={20} />
                    <span>Add Expense</span>
                </button>
            </div>
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                <p>Expense list and management UI would go here.</p>
            </div>
        </div>
    );
};

export default Expenses;
