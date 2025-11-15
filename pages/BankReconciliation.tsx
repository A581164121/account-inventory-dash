
import React from 'react';

const BankReconciliation: React.FC = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Bank Reconciliation</h1>
            </div>
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                <p>Bank Reconciliation UI would go here. It would allow users to upload bank statements and match transactions with entries in the system.</p>
            </div>
        </div>
    );
};

export default BankReconciliation;
