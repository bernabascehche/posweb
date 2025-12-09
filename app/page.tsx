import { Dashboard } from "@/components/dashboard/dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Home() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )
}
