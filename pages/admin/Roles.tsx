
import React from 'react';
import { UserRole, Permission } from '../../types';
import { ROLE_PERMISSIONS } from '../../permissions';
import { Check } from 'lucide-react';

const Roles: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Roles & Permissions</h1>
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                    This page displays the permissions for each role. In a full application, an administrator could modify these permissions for custom roles.
                </p>
                <div className="space-y-6">
                    {Object.values(UserRole).map(role => (
                        <div key={role} className="border dark:border-gray-700 rounded-lg p-4">
                            <h2 className="text-xl font-semibold text-primary">{role}</h2>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {(ROLE_PERMISSIONS[role] || []).map(permission => (
                                    <div key={permission} className="flex items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                                        <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                                        <span className="text-sm">{permission.replace(/_/g, ' ').toLowerCase()}</span>
                                    </div>
                                ))}
                                {role === UserRole.SUPER_ADMIN && (
                                    <div className="flex items-center bg-blue-100 dark:bg-blue-900 p-2 rounded-md col-span-full">
                                        <Check size={16} className="text-blue-500 mr-2" />
                                        <span className="text-sm font-semibold">All Permissions Granted</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Roles;
