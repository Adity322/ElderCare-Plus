import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, token } = useAuth()

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "admin") return <Navigate to="/admin" replace />
    if (user.role === "caregiver") return <Navigate to="/caregiver" replace />
    return <Navigate to="/family" replace />
  }

  return children
}