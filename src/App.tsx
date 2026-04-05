import MainLayout from "./features/layouts/MainLayout"
import Tickets from "./features/pages/tickets/Tickets"
import Dashboard from "./features/pages/dashboard/Dashboard"
import Inventory from "./features/pages/inventary/Inventory"
import Notifications from "./features/pages/notification/Notifications"
import Register from "./features/pages/auth/Register"
import { SearchProvider } from "./features/context/SearchContext"
import { NotificationsProvider } from "./features/context/NotificationsContext"
import { UserProvider } from "./features/context/UserContext"
import Profile from "./features/pages/profile/Profile"
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <SearchProvider>
          <NotificationsProvider>
            <Routes>
              {/**<Route path="/login" element={<Login />} />
              <Route path="/verification" element={<Verification />} />**/}
              <Route path="/register" element={<Register />} />
              <Route path="/*" element={
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/tickets" element={<Tickets />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </MainLayout>
              } />
            </Routes>
          </NotificationsProvider>
        </SearchProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App