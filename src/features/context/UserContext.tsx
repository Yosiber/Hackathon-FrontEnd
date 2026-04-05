import { createContext, useContext, useState, type ReactNode } from "react";
import usersMock from "../../data/mock/users";

interface User {
  name: string;
  imageProfile: string;
  role: string;
  sede: string;
  turno: string;
  email: string;
}

interface UserContextType {
  user: User;
  updateImage: (base64: string) => void;
}

const UserContext = createContext<UserContextType | null>(null);

const initialUser: User = {
  name: usersMock[0].name,
  imageProfile: usersMock[0].imageProfile,
  role: "Staff Principal",
  sede: "Sede Centro",
  turno: "Mañana",
  email: "staff@drogueria.com",
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(initialUser);

  const updateImage = (base64: string) => {
    setUser((prev) => ({ ...prev, imageProfile: base64 }));
  };

  return (
    <UserContext.Provider value={{ user, updateImage }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser debe usarse dentro de UserProvider");
  return ctx;
}