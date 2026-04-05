import { createContext, useContext, useState, type ReactNode } from 'react';
import usersMock from '../../data/mock/users';

interface User {
  name: string;
  email?: string;
  imageProfile: string;
}

interface UserContextType {
  user: User;
  updateImage: (image: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(usersMock[0]);

  const updateImage = (image: string) => {
    setUser(prev => ({ ...prev, imageProfile: image }));
  };

  return (
    <UserContext.Provider value={{ user, updateImage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};