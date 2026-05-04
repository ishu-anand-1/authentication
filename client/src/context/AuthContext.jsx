import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔐 Safe JSON parse
  const safeParse = (data) => {
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }

  // 🚀 Load user on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (storedUser && token) {
      const parsedUser = safeParse(storedUser)

      if (parsedUser) {
        setUser(parsedUser)
      } else {
        // corrupted data → cleanup
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    }

    setLoading(false)
  }, [])

  // 🔑 LOGIN
  const login = (data) => {
    if (!data?.token) return

    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data))

    setUser(data)
  }

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.clear()
    setUser(null)

    // Optional: force redirect
    window.location.href = "/"
  }

  // ✅ Helper
  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}