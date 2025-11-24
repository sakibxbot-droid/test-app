
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const loggedInUser = await getCurrentUser();
      setUser(loggedInUser);
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (loggedInUser: User) => {
    setUser(loggedInUser);
    sessionStorage.setItem('loggedInUserId', loggedInUser.id.toString());
    sessionStorage.setItem('loggedInUserRole', loggedInUser.role);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('loggedInUserId');
    sessionStorage.removeItem('loggedInUserRole');
  };
  
  const updateUser = (updatedUser: Partial<User>) => {
      setUser(prevUser => prevUser ? { ...prevUser, ...updatedUser } : null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
