import { clearAuthTokens, getRefreshToken, storeAuthTokens } from "@/lib/authStorage";
import apiClient from "@/services/apiClient";
import { User } from "@/types/interfaces";
import { createContext, ReactNode, useContext, useState } from "react";
import { Alert } from "react-native";


interface GlobalContextType {
  // Auth properties
  isLoggedIn: boolean;
  user: User | null;
  isAuthLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;

  // Auth methods
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  // googleLogin: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const isLoggedIn = !!user && !!accessToken;
  const errorMessage = (error: any) => {
    return error && typeof error === 'object' && 'response' in error
      ? (error.response as any)?.data?.message
      : 'An error occurred. Please try again later.';
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await apiClient.post('/users/register', { email, password, name })
      const { user, accessToken, refreshToken } = response.data;
      await storeAuthTokens(accessToken, refreshToken);
      setUser(user);
      setIsAuthLoading(false);
      return true
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMsg = errorMessage(error);
      Alert.alert('Registration Error', errorMsg);
      return false;
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/users/login', { email, password });
      const { user, accessToken, refreshToken } = response.data;
      await storeAuthTokens(accessToken, refreshToken);
      setUser(user);
      setIsAuthLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      const errorMsg = errorMessage(error);
      Alert.alert('Login Error', errorMsg);
      return false;
    }
  }

  const logout = async () => {
    setUser(null);
    const refreshToken = getRefreshToken();
    clearAuthTokens();
    try {
      await apiClient.post('/users/logout', { refreshToken });
      Alert.alert('Logged out', 'You have been logged out successfully.');
      setIsAuthLoading(false);
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Logout Error', 'An error occurred while logging out. Please try again later.');
    }
  }

  return (
    <GlobalContext.Provider value={{
      isLoggedIn,
      user,
      isAuthLoading,
      accessToken,
      refreshToken,
      login,
      logout,
      register,
    }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
}