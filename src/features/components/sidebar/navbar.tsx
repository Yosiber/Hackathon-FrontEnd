import { Link, useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { useNotifications } from "../../context/NotificationsContext";
import { useAuth } from "../../context/AuthContext";
import FAQModal from "./FAQModal";

export default function Navbar() {
  const { search, setSearch, placeholder } = useSearch();
  const { noLeidas } = useNotifications();
  const navigate = useNavigate();

  const { authUser, logout } = useAuth();

  const avatarSrc = authUser?.profilePictureUrl
    ? `${authUser?.profilePictureUrl}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.name)}&background=2563eb&color=fff&size=160`;

  const logoutAction = async () => {
    await logout();
    navigate("/login", {
      state: { successLogout: "Has cerrado sesión satisfactoriamente" }
    });
  };

  return (
    <header
      className="h-16 z-0 bg-white/80 backdrop-blur-xl
      shadow-[0_10px_10px_-5px] shadow-blue-900/20 flex justify-between items-center px-12
      dark:bg-gray-800"
    >
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <span className="material-symbols-outlined absolute text-gray-600 dark:text-gray-100/50 left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="w-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm hover:ring-2 hover:ring-blue-400/50 dark:hover:ring-blue-600/50
             focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-green-600 focus:ring-opacity-75 transition-all placeholder:text-on-surface-variant/50"
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">

          {/* Botón de notificaciones */}
          <button
            onClick={() => navigate("/notifications")}
            className="relative p-1.5 flex items-center group"
            aria-label={`Notificaciones${noLeidas > 0 ? `, ${noLeidas} sin leer` : ""}`}
          >
            <span
              className="material-symbols-outlined text-gray-600 dark:text-gray-100/80 text-on-surface-variant hover:cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              notifications
            </span>

            {noLeidas > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 dark:bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {noLeidas > 99 ? "99+" : noLeidas}
              </span>
            )}
          </button>

          <FAQModal>
            <button className="p-1.5 flex items-center group -mr-4">
              <span
                className="material-symbols-outlined text-gray-600 dark:text-gray-100/80 text-on-surface-variant hover:cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                help_outline
              </span>
            </button>
          </FAQModal>
        </div>
        
        <Link to='/profile'>
          <div>
            <button className="p-1.5 flex items-center group">
              <span
                className="material-symbols-outlined text-gray-600 dark:text-gray-100/80 text-on-surface-variant hover:cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                settings
              </span>
            </button>
          </div>        
        </Link>


        <div>
          <button onClick={() => logoutAction()} className="p-1.5 flex items-center group">
            <span
              className="material-symbols-outlined text-gray-600 dark:text-gray-100/80 text-on-surface-variant hover:cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              logout
            </span>
          </button>
        </div>

        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          <img className="rounded-full" src={avatarSrc} alt="Profile Image" />
        </div>
      </div>
    </header>
  );
}