import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useRef } from 'react';
import { User, Permission, UserRole } from '../types';
import { ROLE_PERMISSIONS } from '../permissions';
import { fakeCompare } from '../utils/auth';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string, users: User[]) => Promise<User | null>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  authInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  // Fix: Explicitly provide `undefined` as the initial value to `useRef`.
  // This resolves a potential ambiguity with `useRef` overloads when a generic type is provided without an initial value,
  // which can cause the "Expected 1 arguments, but got 0" error.
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  
  useEffect(() => {
    setAuthInitialized(true);
  }, []);

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


  const login = async (email: string, password: string, users: User[]): Promise<User | null> => {
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

  const value = {
    currentUser,
    login,
    logout,
    hasPermission,
    authInitialized,
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
