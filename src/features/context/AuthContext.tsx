import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AxiosError } from "axios";

import {
    loginRequest,
    getAuthUserProfile
} from "../api/requests/auth.request";

import type { LoginDto, AuthUserDto } from '../api/types/auth.type';

interface AuthContextType {
  loading: boolean,
  serverError: string | null,
  authUser: AuthUserDto | null,
  signIn: (data: LoginDto) => Promise<boolean>,
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<AuthUserDto | null>(null);

  // Clear errors after 5 seconds
  useEffect(() => {
    if (serverError) {
      return () => clearTimeout(setTimeout(() => setServerError(null), 5000));
    }
  }, [serverError]);

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

  const logout = () => {
    setAuthUser(null);
    {/** PENDIENTE IMPLEMENTAR SERVICIO BORRADO COOKIE BACKEND */}
  }

  {/** PENDIENTE CHECKEO DE TOKEN VALIDO */}

  return (
    <AuthContext.Provider
      value={{
        loading,
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
        throw new error('useAuth must be used inside an AuthProvider');
    }
    return context;
}