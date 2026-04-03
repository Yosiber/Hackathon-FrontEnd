import Sidebar from "../sidebar/Sidebar"
 
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Sidebar />
      <main className="flex-1 min-h-screen">
        {children}
      </main>
    </div>
  )
}