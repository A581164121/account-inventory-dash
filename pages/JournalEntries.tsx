
import React from 'react';
import { Plus } from 'lucide-react';

const JournalEntries: React.FC = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Journal Entries</h1>
                <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700">
                    <Plus size={20} />
                    <span>Add Journal Entry</span>
                </button>
            </div>
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                <p>Journal Entry list and management UI would go here. The form would require that total debits equal total credits.</p>
            </div>
        </div>
    );
};

export default JournalEntries;
