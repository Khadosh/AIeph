import { withSession } from "@/actions/auth"

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await withSession()
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <header className="w-full h-16 bg-gray-100">
        <div className="flex items-center justify-between w-full h-full max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold">Creator</h1>
          <div></div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </header>
      <main className="w-full h-full relative">
        {children}
      </main>
      <footer className="w-full h-16 bg-gray-100">

      </footer>
    </div>
  )
}