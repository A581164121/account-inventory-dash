
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/auth';
import { User, UserRole, Permission } from '../../types';
import { Plus, Edit, KeyRound } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import ResetPasswordModal from '../../components/admin/ResetPasswordModal';

const EditUserForm: React.FC<{ user: User; onSave: (user: Omit<User, 'passwordHash'>) => void; onCancel: () => void; }> = ({ user, onSave, onCancel }) => {
    const { departments } = useAppContext();
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
        isActive: user.isActive,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...user, ...formData });
    };

    return (
        <form onSubmit={handleSubmit}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} disabled className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 cursor-not-allowed" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                        {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Department</label>
                    <select name="departmentId" value={formData.departmentId} onChange={handleChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                        <option value="">Select Department</option>
                        {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                    </select>
                </div>
                <div className="flex items-center">
                    <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <label htmlFor="isActive" className="ml-2 block text-sm">Active</label>
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Save Changes</button>
            </div>
        </form>
    );
};

const Users: React.FC = () => {
    const { users, updateUser, departments } = useAppContext();
    const { hasPermission } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
    
    const getDepartmentName = (id: string) => departments.find(d => d.id === id)?.name || 'N/A';
    
    const handleUpdate = (user: Omit<User, 'passwordHash'>) => {
        updateUser(user);
        setIsEditModalOpen(false);
        setSelectedUser(undefined);
    };

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };
    
    const handleResetPasswordClick = (user: User) => {
        setSelectedUser(user);
        setIsResetPasswordModalOpen(true);
    };

    const closeModal = () => {
        setIsEditModalOpen(false);
        setIsResetPasswordModalOpen(false);
        setSelectedUser(undefined);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">User Management</h1>
                {hasPermission(Permission.MANAGE_USERS) && (
                    <Link to="/admin/users/add" className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700">
                        <Plus size={20} />
                        <span>Add User</span>
                    </Link>
                )}
            </div>
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold">Department</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-4">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">{user.role}</td>
                                    <td className="p-4">{getDepartmentName(user.departmentId)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-4">
                                        {hasPermission(Permission.MANAGE_USERS) && (
                                            <>
                                                <button onClick={() => handleEditClick(user)} className="text-blue-500 hover:text-blue-700" title="Edit User">
                                                  <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleResetPasswordClick(user)} className="text-yellow-500 hover:text-yellow-700" title="Reset Password">
                                                  <KeyRound size={18} />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedUser && (
                <>
                    <Modal isOpen={isEditModalOpen} onClose={closeModal} title={`Edit User: ${selectedUser.name}`}>
                        <EditUserForm 
                            user={selectedUser}
                            onSave={handleUpdate}
                            onCancel={closeModal}
                        />
                    </Modal>
                    <ResetPasswordModal
                        isOpen={isResetPasswordModalOpen}
                        onClose={closeModal}
                        user={selectedUser}
                    />
                </>
            )}
        </div>
    );
};

export default Users;
