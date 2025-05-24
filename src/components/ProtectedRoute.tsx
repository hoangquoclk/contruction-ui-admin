import type React from "react"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  // Check if login is still valid (optional: add expiration check)
  const loginTime = localStorage.getItem("loginTime")
  const isLoginValid = Boolean(loginTime)

  if (!isAuthenticated || !isLoginValid) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
