import MainLayout from "./features/layouts/MainLayout"
import Tickets from "./features/tickets/Tickets"
import Dashboard from "./features/dashboard/Dashboard"
import Inventary from "./features/inventary/Inventary"

import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/inventary" element={<Inventary />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
      