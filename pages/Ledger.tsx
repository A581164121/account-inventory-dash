
import React from 'react';

const Ledger: React.FC = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Ledger</h1>
            </div>
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                <p>Ledger view UI would go here. Users would select an account to see its detailed transaction history.</p>
            </div>
        </div>
    );
};

export default Ledger;
