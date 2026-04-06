import { createContext, useContext, useState, type ReactNode } from 'react';
import { AxiosError } from "axios";

import {
  createUser,
  verifyUser
} from "../api/requests/user.request";

import type { CreateUserDto, VerifyUserOtpDto } from '../api/types/user.types';

interface UserContextType {
  loading: boolean,
  serverError: string | null,
  signUp: (data: CreateUserDto) => Promise<string | null>;
  verifyUserRegistration: (data: VerifyUserOtpDto) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const signUp = async (createUserRequest: CreateUserDto): Promise<string | null> => {
    setLoading(true);
    setServerError(null);
    try {
      const response = await createUser(createUserRequest);
      if (response.data?.user?.id) {
        return response.data.user.id;
      }
      setServerError(null);
      return null;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        setServerError(error.response.data.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyUserRegistration = async (verifyUserOtpDto: VerifyUserOtpDto): Promise<boolean> => {
    setLoading(true);
    setServerError(null);
    try {
      await verifyUser(verifyUserOtpDto);
      setServerError(null);
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

  return (
    <UserContext.Provider
      value={{
        loading,
        serverError,
        signUp,
        verifyUserRegistration
      }}
    >
      {children}
    </UserContext.Provider>
  )
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used inside an UserProvider');
  }
  return context;
}