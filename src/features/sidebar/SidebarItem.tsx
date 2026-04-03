import { Link } from "react-router-dom"

type Props = {
  icon: React.ReactNode
  label: string
  to: string
  active: boolean
  changePage: (page: string) => void
  page: string
}

export default function SidebarItem({ icon, label, to, active, changePage, page }: Props) {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-5 py-2.5 mx-2 rounded-lg cursor-pointer transition-all duration-200
        ${
          active
            ? "text-green-700 bg-green-100 border-green-600 border-r-4 bg-green-50/50 rounded-xl dark:bg-green-900 dark:text-green-300"
            : "text-gray-600 hover:bg-blue-50 hover:text-blue-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
        }
      `}
      onClick={() => changePage(page)}
    >
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      <span className="text-sm font-bold">{label}</span>
    </Link>
  )
}