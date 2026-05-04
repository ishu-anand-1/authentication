import { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext)
  const location = useLocation()

  // ⏳ Wait for auth check (prevents flicker)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  // 🔒 If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // ✅ Authorized
  return children
}

export default PrivateRoute