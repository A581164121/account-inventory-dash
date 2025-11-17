
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import Logo from '../layout/Logo';
import { UserRole } from '../../types';
import { getRedirectPathForRole } from '../../utils/auth';

const LoginModal: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const user = await login(email, password);
            if (user) {
                if (user.role === UserRole.CUSTOM) {
                    alert('Custom Role — Please fetch the allowed modules and permissions assigned to this user.');
                }
                const redirectPath = getRedirectPathForRole(user.role);
                navigate(redirectPath, { replace: true });
            } else {
                setError('Invalid email or password.');
            }
        } catch (err: any) {
             setError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-light dark:bg-dark bg-opacity-90 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-2xl w-full max-w-sm">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <Logo />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">Welcome Back</h2>
                    <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Sign in to continue to the ERP.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary"
                                placeholder="e.g., alice@example.com"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                             <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                        
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                         <div className="text-center mt-4">
                            <a href="#" className="text-sm text-primary hover:underline">Forgot Password?</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
