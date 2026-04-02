import { Home, ClipboardList, Bell, Package } from "lucide-react"
import SidebarItem from "./SidebarItem"
import ThemeToggle from "../themetoggle/ThemeToggle"

export default function Sidebar() {
  return (
      <aside className="h-screen w-64 bg-white dark:bg-gray-800 border-r flex flex-col justify-between shadow-sm">      
      {/* Top */}
      <div>
        {/* Logo */}
        <div className="px-6 py-4">
          <h1 className="text-lg font-bold text-blue-600">
            Coraje S.A.S
          </h1>
          <p className="text-xs text-gray-400">Farmacia principal</p>
        </div>

        {/* Menu */}
        <nav className="mt-4 flex flex-col gap-1">
          <SidebarItem icon={<Home size={18} />} label="Dashboard" to="/" />
          <SidebarItem icon={<Package size={18} />} label="Inventario" to="/inventario" />
          <SidebarItem icon={<ClipboardList size={18} />} label="Tickets" to="/tickets" />
          <SidebarItem icon={<Bell size={18} />} label="Notificaciones" to="/notificaciones" />
        </nav>
      </div>

      {/* Bottom */}
      <div className="p-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            S
          </div>
          <div>
            <p className="text-sm font-semibold">Staff Principal</p>
            <p className="text-xs text-gray-500">Ver perfil</p>
          </div>
        </div>

        {/* Botón de cambiar tema */}
        <ThemeToggle />
      </div>
    </aside>

    
  )
}