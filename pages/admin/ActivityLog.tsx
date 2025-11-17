import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { FileDown } from 'lucide-react';
import { exportToCsv } from '../../services/exportService';

const ActivityLog: React.FC = () => {
    const { activityLog, users } = useAppContext();
    const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'System';

    const handleExport = () => {
        const dataToExport = activityLog.map(log => ({
            timestamp: log.timestamp,
            user: getUserName(log.userId),
            action: log.action,
            details: log.details,
        }));
        exportToCsv(dataToExport, `activity_log_${new Date().toISOString().split('T')[0]}`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6 no-print">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Activity Log</h1>
                <button onClick={handleExport} className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-emerald-600">
                    <FileDown size={20} />
                    <span>Export CSV</span>
                </button>
            </div>
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md printable-content">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="p-4 font-semibold">Timestamp</th>
                                <th className="p-4 font-semibold">User</th>
                                <th className="p-4 font-semibold">Action</th>
                                <th className="p-4 font-semibold">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activityLog.map(log => (
                                <tr key={log.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-4 text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="p-4">{getUserName(log.userId)}</td>
                                    <td className="p-4 font-semibold">{log.action}</td>
                                    <td className="p-4 text-sm">{log.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ActivityLog;