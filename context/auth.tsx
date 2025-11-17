
import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { User, Permission, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { ROLE_PERMISSIONS } from '../permissions';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (userId: string) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(MOCK_USERS);
  const [currentUserId, setCurrentUserId] = useState<string | null>(users[0]?.id || null);

  const currentUser = useMemo(() => {
    return users.find(u => u.id === currentUserId) || null;
  }, [currentUserId, users]);

  const login = (userId: string) => {
    setCurrentUserId(userId);
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === UserRole.SUPER_ADMIN) return true;
    
    const userPermissions = ROLE_PERMISSIONS[currentUser.role] || [];
    return userPermissions.includes(permission);
  };

  const value = {
    currentUser,
    users,
    login,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
