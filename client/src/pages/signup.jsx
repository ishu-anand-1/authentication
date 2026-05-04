import { useState } from "react"
import API from "../services/api"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  // 🔐 VALIDATION
  const validate = () => {
    if (!name.trim()) return "Name is required"
    if (!email.trim()) return "Email is required"
    if (!password.trim()) return "Password is required"

    if (password.length < 6) {
      return "Password must be at least 6 characters"
    }

    return null
  }

  // 🚀 SIGNUP HANDLER
  const handleSignup = async () => {
    const error = validate()
    if (error) {
      alert(error)
      return
    }

    try {
      setLoading(true)

      await API.post("/auth/signup", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password
      })

      alert("Signup successful 🎉")

      navigate("/", { replace: true })

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Signup failed"

      alert(message)
    } finally {
      setLoading(false)
    }
  }

  // ⌨️ ENTER SUPPORT
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSignup()
    }
  }

  return (
    <>
      <Navbar isLoggedIn={false} />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">

        {/* BG EFFECT */}
        <div className="absolute w-[400px] h-[400px] bg-green-500 opacity-20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
        <div className="absolute w-[300px] h-[300px] bg-blue-500 opacity-20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

        {/* CARD */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-[360px] transition duration-500 hover:scale-105">

          <h2 className="text-white text-3xl font-bold mb-6 text-center tracking-wide">
            Create Account 🚀
          </h2>

          {/* NAME */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full mb-4 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400 transition"
            placeholder="Enter your name"
          />

          {/* EMAIL */}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full mb-4 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Enter your email"
          />

          {/* PASSWORD */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full mb-6 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-400 transition"
            placeholder="Create password"
          />

          {/* BUTTON */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className={`w-full p-3 rounded-lg text-white font-semibold tracking-wide transition duration-300 ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 hover:scale-105"
            }`}
          >
            {loading ? "Creating..." : "Signup"}
          </button>

          {/* LOGIN LINK */}
          <p className="text-gray-300 text-sm mt-4 text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-green-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </>
  )
}

export default Signup