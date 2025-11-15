
import React from 'react';

const Reports: React.FC = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Reports</h1>
            </div>
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                <p>A hub for various reports would go here, such as Sales Report, Purchase Report, Inventory Stock Report, etc., with filtering and export options.</p>
            </div>
        </div>
    );
};

export default Reports;
