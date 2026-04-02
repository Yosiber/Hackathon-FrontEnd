import Sidebar from "../sidebar/Sidebar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gray-50">
      <Sidebar />

      <main className="flex-1 min-h-screen p-6">
        {children}
      </main>
    </div>
  )
}
