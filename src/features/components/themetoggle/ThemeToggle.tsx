import { useState, useEffect } from "react"
 
export default function ThemeToggle() {
 
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false
 
    const saved = localStorage.getItem("theme")
    if (saved === "dark") return true
    if (saved === "light") return false
 
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })
 
  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [dark])
 
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={dark}
        onChange={() => setDark((prev) => !prev)}
        aria-pressed={dark}
      />
      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span className="ml-2 flex items-center text-sm font-medium text-gray-400 dark:text-gray-300">
        {dark ? (
          <span className="material-symbols-outlined">dark_mode</span>
        ) : (
          <span className="material-symbols-outlined">light_mode</span>
        )}
      </span>
    </label>
  )
}
