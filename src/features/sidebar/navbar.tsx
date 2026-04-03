import usersMock from "../../data/mock/users";
import { useSearch } from "../context/SearchContext";


const imageSrc = `data:image/png;base64,${usersMock[0].imageProfile}`;



export default function Navbar() {
  const { search, setSearch, placeholder } = useSearch();

    return (
        <header
          className="h-16 z-0 bg-white/80 backdrop-blur-xl
          shadow-[0_10px_10px_-5px] shadow-blue-900/20 flex justify-between items-center px-12
          dark:bg-gray-800"
      >
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <span className="material-symbols-outlined absolute text-gray-600 dark:text-gray-100/50 left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"> search </span>
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
              <button className="relative p-1.5 flex items-center">
                  <span className="material-symbols-outlined text-gray-600 dark:text-gray-100/80 text-on-surface-variant hover:cursor-pointer" style={{ fontVariationSettings: "'FILL' 1" }}> notifications </span>
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 dark:bg-green-500 rounded-full"></span>
              </button>
              <button className="p-1.5 flex items-center">
                  <span className="material-symbols-outlined text-gray-600 dark:text-gray-100/80 text-on-surface-variant hover:cursor-pointer" style={{ fontVariationSettings: "'FILL' 1" }}> help_outline </span>
              </button>
          </div>
            <div>
            <button className="p-1.5 flex items-center">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-100/80 text-on-surface-variant hover:cursor-pointer" style={{ fontVariationSettings: "'FILL' 1" }}> settings </span>          
              </button>
         </div>
         <div>
            <button className="p-1.5 flex items-center">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-100/80 text-on-surface-variant hover:cursor-pointer" style={{ fontVariationSettings: "'FILL' 1" }}> logout </span>

            </button>
          </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <img className="rounded-full" src={imageSrc} alt="Profile Image" />
            </div>
        </div> 
      </header>
    );
}