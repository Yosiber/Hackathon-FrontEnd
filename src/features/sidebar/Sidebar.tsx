import SidebarItem from "./SidebarItem";
import usersMock from "../../data/mock/users";
import { useState } from "react";
import ThemeToggle from "../themetoggle/ThemeToggle"


export default function Sidebar() {

  const [actualPage, setActualPage] = useState("dashboard");

  const imageSrc = `data:image/png;base64,${usersMock[0].imageProfile}`;

  return (
    <aside className="sticky top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between shadow-sm flex-shrink-0 z-40 dark:border-gray-700 dark:bg-gray-800">
      {/* Top */}
      <div>
        {/* Logo */}
        <div className="mt-5 ml-3 mb-10 px-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
          </div>
          <div>
              <h1 className="text-xl font-bold text-blue-800 tracking-tight dark:text-blue-400">Coraje</h1>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest dark:text-gray-300">Centro de Servicio</h2>
          </div>
        </div>

        

        {/* Menu */}
        <nav className="mt-4 flex flex-col gap-1">
          <SidebarItem icon="dashboard" label="Dashboard" to="/" active={actualPage === "dashboard"} changePage={setActualPage} page="dashboard" />
          <SidebarItem icon="inventory_2" label="Inventario" to="/inventory" active={actualPage === "inventory"} changePage={setActualPage} page="inventory" />
          <SidebarItem icon="confirmation_number" label="Tickets" to="/tickets" active={actualPage === "tickets"} changePage={setActualPage} page="tickets" />
          <SidebarItem icon="notifications" label="Notificaciones" to="/notifications" active={actualPage === "notifications"} changePage={setActualPage} page="notifications" />
        </nav>

      </div>

      {/* Bottom */}
      <div>
        {/* Theme Toggle */}
        <div className="ml-42">
          <ThemeToggle />
        </div>
        <div className="p-4 border-t border-gray-200 shadow-sm dark:border-gray-700">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 shadow-[0_0_10px_0px_rgba(0,0,0,0.2)] shadow-blue-500/100 rounded-full bg-blue-100 dark:bg-blue-900 dark:text-blue-300 flex items-center justify-center text-blue-600 font-bold">
              <img className="rounded-full" src={imageSrc} alt="Profile Image" />
            </div>
            <div>
              <p className="text-sm font-semibold dark:text-white">Staff Principal</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ver perfil</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
