import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session) {
    redirect('/auth/signin')
  }

  return <>{children}</>
}