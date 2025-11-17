
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import { ArrowLeft, Save } from 'lucide-react';

const AddUser: React.FC = () => {
    const { departments, users, addUser } = useAppContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: UserRole.SALES_STAFF,
        departmentId: '',
        isActive: true,
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setError('');
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
            setError('A user with this email already exists.');
            return;
        }

        setIsLoading(true);
        try {
            const { password, confirmPassword, ...userData } = formData;
            addUser(userData, password);
            alert('User created successfully!');
            navigate('/admin/users');
        } catch (err: any) {
            setError(err.message || 'Failed to create user.');
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center mb-6">
                <Link to="/admin/users" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-4">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Add New User</h1>
            </div>
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                 <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Confirm Password</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
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
                     {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
                    <div className="mt-8 flex justify-end">
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-primary text-white rounded-lg flex items-center space-x-2 hover:bg-indigo-700 disabled:opacity-50">
                            <Save size={20} />
                            <span>{isLoading ? 'Saving...' : 'Create User'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
