
import React, { ReactNode } from 'react';
import { useAuth } from '../../context/auth';
import { Permission } from '../../types';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  permission: Permission;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, permission }) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white dark:bg-dark-secondary rounded-lg shadow-md">
        <ShieldAlert size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">You do not have the required permissions to access this module.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
