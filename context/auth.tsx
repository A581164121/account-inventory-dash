
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useRef } from 'react';
import { User, Permission, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { ROLE_PERMISSIONS } from '../permissions';

// IMPORTANT: This is a frontend simulation of password hashing.
// In a real application, you would use a library like bcrypt on the server.
const FAKE_SALT = 'a_very_salty_salt_string';
const fakeHash = (password: string): string => `bcrypt_sim_${password}_${FAKE_SALT}`;
const fakeCompare = (password: string, hash: string): boolean => hash === fakeHash(password);

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  addUser: (user: Omit<User, 'id' | 'passwordHash' | 'createdAt'>, password: string) => User;
  updateUser: (user: Omit<User, 'passwordHash'>) => void;
  resetUserPassword: (userId: string, newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout>>();

  const logout = useCallback(() => {
    setCurrentUser(null);
    if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
    }
  }, []);
  
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => {
        alert("You have been logged out due to inactivity.");
        logout();
    }, INACTIVITY_TIMEOUT);
  }, [logout]);


  useEffect(() => {
    if (currentUser) {
        resetInactivityTimer();
        window.addEventListener('mousemove', resetInactivityTimer);
        window.addEventListener('keydown', resetInactivityTimer);
        window.addEventListener('click', resetInactivityTimer);
    }

    return () => {
        if (inactivityTimer.current) {
            clearTimeout(inactivityTimer.current);
        }
        window.removeEventListener('mousemove', resetInactivityTimer);
        window.removeEventListener('keydown', resetInactivityTimer);
        window.removeEventListener('click', resetInactivityTimer);
    };
  }, [currentUser, resetInactivityTimer]);


  const login = async (email: string, password: string): Promise<User | null> => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (user && fakeCompare(password, user.passwordHash)) {
      if (!user.isActive) {
        throw new Error("Your account is inactive. Contact administrator.");
      }
      setCurrentUser(user);
      return user;
    }
    
    return null;
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === UserRole.SUPER_ADMIN) return true;
    
    const userPermissions = ROLE_PERMISSIONS[currentUser.role] || [];
    return userPermissions.includes(permission);
  };

  // User Management Functions
  const addUser = (userData: Omit<User, 'id' | 'passwordHash' | 'createdAt'>, password: string): User => {
    const newUser: User = {
        ...userData,
        id: `USER-${Date.now()}`,
        passwordHash: fakeHash(password),
        createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (updatedUserData: Omit<User, 'passwordHash'>) => {
    setUsers(prev => prev.map(u => u.id === updatedUserData.id ? { ...u, ...updatedUserData } : u));
  };

  const resetUserPassword = (userId: string, newPassword: string) => {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, passwordHash: fakeHash(newPassword) } : u));
  };

  const value = {
    currentUser,
    users, // Expose full user objects within auth context
    login,
    logout,
    hasPermission,
    addUser,
    updateUser,
    resetUserPassword
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
