import MainLayout from "./features/layouts/MainLayout"
import Tickets from "./features/tickets/Tickets"
import Dashboard from "./features/dashboard/Dashboard"
import Inventory from "./features/inventary/Inventory"
import { SearchProvider } from "./features/context/SearchContext";

import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <MainLayout>
         <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/inventory" element={<Inventory />} />
         </Routes>
        </MainLayout>
      </SearchProvider>
    </BrowserRouter>
  )
}

export default App
      