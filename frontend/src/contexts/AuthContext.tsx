import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/auth';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    if (response.success) {
      const { user, accessToken, refreshToken } = response.data;
      const userWithImage = {
        ...user,
        image: `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name}`,
      };
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userWithImage));
      setUser(userWithImage);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const response = await authService.signup(name, email, password);
    if (response.success) {
      const { user, accessToken, refreshToken } = response.data;
      const userWithImage = {
        ...user,
        image: `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name}`,
      };
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userWithImage));
      setUser(userWithImage);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
