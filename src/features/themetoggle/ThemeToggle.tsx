import { useState, useEffect } from "react"
 
type Props = {
  lightClassName?: string
  darkClassName?: string
  lightLabel?: string
  darkLabel?: string
}
 
export default function ThemeToggle({
  lightClassName = "px-3 py-2 rounded-md bg-slate-200 text-sm",
  darkClassName = "px-3 py-2 rounded-md bg-slate-700 text-sm text-white",
  lightLabel = "🌙 Dark",
  darkLabel = "☀️ Light",
}: Props) {
 
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
    <button
      aria-pressed={dark}
      onClick={() => setDark((prev) => !prev)}
      className={dark ? darkClassName : lightClassName}
    >
      {dark ? darkLabel : lightLabel}
    </button>
  )
}
