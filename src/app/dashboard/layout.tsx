import { ThemeToggler } from "@/components/ui/theme-toggler"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <header className="flex justify-end p-4 w-full">
        <ThemeToggler />
      </header>
      {children}
    </div>
  )
}