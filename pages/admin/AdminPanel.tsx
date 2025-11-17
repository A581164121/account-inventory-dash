
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/auth';
import { Check, X, Users, List, UserCheck } from 'lucide-react';

const AdminPanel: React.FC = () => {
    const { approvalRequests, approveRequest, rejectRequest, users: allUsers } = useAppContext();
    const { currentUser } = useAuth();

    const pendingRequests = approvalRequests.filter(r => r.status === 'pending');

    const handleApprove = (id: string) => {
        if(currentUser && window.confirm('Are you sure you want to approve this request? The item will be marked as deleted.')) {
            approveRequest(id);
        }
    };
    
    const handleReject = (id: string) => {
        if(currentUser && window.confirm('Are you sure you want to reject this request?')) {
            rejectRequest(id);
        }
    };

    const getUserName = (id: string) => allUsers.find(u => u.id === id)?.name || 'Unknown User';

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Admin Dashboard</h1>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <Link to="/admin/users" className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Total Users</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{allUsers.length}</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-500 text-white"><Users size={24}/></div>
                </Link>
                <Link to="/admin/roles" className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Roles</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">Management</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-500 text-white"><UserCheck size={24}/></div>
                </Link>
                <Link to="/admin/activity-log" className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Activity</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">View Log</p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-500 text-white"><List size={24}/></div>
                </Link>
            </div>
            
            <div className="mt-8 bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Pending Deletion Approvals</h2>
                {pendingRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="p-4 font-semibold">Record Type</th>
                                    <th className="p-4 font-semibold">Record ID</th>
                                    <th className="p-4 font-semibold">Requested By</th>
                                    <th className="p-4 font-semibold">Date</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingRequests.map(req => (
                                    <tr key={req.id} className="border-b dark:border-gray-700">
                                        <td className="p-4 capitalize">{req.recordType.replace('_', ' ')}</td>
                                        <td className="p-4 font-mono">{req.recordId}</td>
                                        <td className="p-4">{getUserName(req.requestedBy)}</td>
                                        <td className="p-4">{new Date(req.requestDate).toLocaleString()}</td>
                                        <td className="p-4 text-right space-x-2">
                                            <button onClick={() => handleApprove(req.id)} className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600" title="Approve">
                                                <Check size={16} />
                                            </button>
                                            <button onClick={() => handleReject(req.id)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600" title="Reject">
                                                <X size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No pending requests.</p>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
