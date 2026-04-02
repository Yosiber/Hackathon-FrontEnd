import { Link } from "react-router-dom"

type Props = {
  icon: React.ReactNode
  label: string
  to: string
  active?: boolean
}

export default function SidebarItem({ icon, label, to, active }: Props) {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-5 py-2.5 mx-2 rounded-lg cursor-pointer transition-all
        ${
          active
            ? "bg-blue-100 text-blue-600 font-medium"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }
      `}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  )
}