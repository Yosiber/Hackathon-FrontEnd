import Sidebar from "../components/sidebar/Sidebar"
import Navbar from "../components/sidebar/navbar"
 
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        {children}
      </div>
    </div>
  )
}
     