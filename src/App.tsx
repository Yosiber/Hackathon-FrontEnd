import MainLayout from "./features/layouts/MainLayout"
import Tickets from "./features/pages/tickets/Tickets"
import Dashboard from "./features/pages/dashboard/Dashboard"
import Inventory from "./features/pages/inventory/Inventory"
import Notifications from "./features/pages/notification/Notifications"
import Register from "./features/pages/auth/Register"
import InitialVerification from "./features/pages/auth/InitialVerification"
import Login from "./features/pages/auth/Login"
import { SearchProvider } from "./features/context/SearchContext"
import { NotificationsProvider } from "./features/context/NotificationsContext"
import { UserProvider } from "./features/context/UserContext"
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useAuth } from "./features/context/AuthContext"
import { ProtectedRoute } from "./features/routesControl/routes"
import Profile from "./features/profile/Profile"
import { setupAxiosResponseInterceptor } from "./features/api/axios.instance"
import { useEffect } from "react"
import Unauthorized from "./features/pages/errors/Unauthorized"
import NotFound from "./features/pages/errors/NotFound"

function App() {

  const { logout } = useAuth();

  // Configuración del Interceptor
  useEffect(() => {
    setupAxiosResponseInterceptor(
      () => {
        logout();
      }
    )
  }, []);

  return (
    <BrowserRouter>
      <UserProvider>
        <SearchProvider>
          <NotificationsProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-registration" element={<InitialVerification />} />
              <Route path="/error/unauthorized" element={<Unauthorized />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/*" element={
                <MainLayout>
                  <Routes>
                    <Route element={<ProtectedRoute requiredRoles={[]} />} >
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/tickets" element={<Tickets />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>
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