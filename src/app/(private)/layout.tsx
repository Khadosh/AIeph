import { getUser } from "@/actions/auth"
import { redirect } from "next/navigation"

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect('/')
  }

  return children;
}