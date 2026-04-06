import MainLayout from "./features/layouts/MainLayout"
import Tickets from "./features/pages/tickets/Tickets"
import Dashboard from "./features/pages/dashboard/Dashboard"
import Inventory from "./features/pages/inventary/Inventory"
import Notifications from "./features/pages/notification/Notifications"
import Register from "./features/pages/auth/Register"
import InitialVerification from "./features/pages/auth/InitialVerification"
import Login from "./features/pages/auth/Login"
import { SearchProvider } from "./features/context/SearchContext"
import { NotificationsProvider } from "./features/context/NotificationsContext"
import { UserProvider } from "./features/context/UserContext"
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./features/context/AuthContext"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <SearchProvider>
            <NotificationsProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-registration" element={<InitialVerification />} />
                <Route path="/*" element={
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/tickets" element={<Tickets />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/notifications" element={<Notifications />} />
                    </Routes>
                  </MainLayout>
                } />
              </Routes>
            </NotificationsProvider>
          </SearchProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App