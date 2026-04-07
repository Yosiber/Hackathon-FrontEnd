import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AxiosError } from "axios";

import {
    loginRequest,
    getAuthUserProfile,
    verifyToken,
    logout as logoutRequest
} from "../api/requests/auth.request";

import type { LoginDto, AuthUserDto } from '../api/types/auth.type';

interface AuthContextType {
  loading: boolean,
  setLoading: (loading: boolean) => void,
  serverError: string | null,
  authUser: AuthUserDto | null,
  signIn: (data: LoginDto) => Promise<boolean>,
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<AuthUserDto | null>(null);

  // Clear errors after 5 seconds
  useEffect(() => {
    if (serverError) {
      return () => clearTimeout(setTimeout(() => setServerError(null), 5000));
    }
  }, [serverError]);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const verifyResponse = await verifyToken();
        if (verifyResponse.status !== 200) {
          setAuthUser(null);
          return;
        }
        const userId = verifyResponse.data.sub;
        if (userId) {
          const userProfile = await getAuthUserProfile(userId);
          setAuthUser(userProfile);
        }
      } catch {
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signIn = async (loginData: LoginDto): Promise<boolean> => {
    setLoading(true);
    setServerError(null);

    try {
      const loginResponse = await loginRequest(loginData);
      const userId = loginResponse.user.sub;
      if (userId) {
        const userProfile = await getAuthUserProfile(userId);
        setAuthUser(userProfile);
        return true;
      }
      return true;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        setServerError(error.response.data.message);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setAuthUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        serverError,
        authUser,
        signIn,
        logout
      }}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside an AuthProvider');
    }
    return context;
}