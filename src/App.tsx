import MainLayout from "./features/layouts/MainLayout"
import Tickets from "./features/tickets/Tickets"
import Dashboard from "./features/dashboard/Dashboard"
import Inventory from "./features/inventary/Inventory"
import Notifications from "./features/notification/Notifications"
import { SearchProvider } from "./features/context/SearchContext"
import { NotificationsProvider } from "./features/context/NotificationsContext"
import { UserProvider } from "./features/context/UserContext"
import Profile from "./features/profile/Profile"
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <SearchProvider>
          <NotificationsProvider>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </MainLayout>
          </NotificationsProvider>
        </SearchProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App