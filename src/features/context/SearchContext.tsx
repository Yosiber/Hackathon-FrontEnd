import { createContext, useContext, useState } from "react";

type SearchContextType = {
  search: string;
  setSearch: (value: string) => void;
  placeholder: string;
  setPlaceholder: (value: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState("");
  const [placeholder, setPlaceholder] = useState("Buscar...");

  return (
    <SearchContext.Provider
      value={{ search, setSearch, placeholder, setPlaceholder }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearch debe usarse dentro de <SearchProvider>");
  }
  return ctx;
}