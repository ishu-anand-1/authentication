import { useState, useContext } from "react"
import API from "../services/api"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password })
      login(res.data.data)
      navigate("/dashboard")
    } catch (err) {
      alert(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
      
     
      <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-[300px] h-[300px] bg-purple-500 opacity-20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

     
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-[350px] transform transition duration-500 hover:scale-105">
        
        <h2 className="text-white text-3xl font-bold mb-6 text-center tracking-wide">
          Welcome Back 👋
        </h2>

        <input
          className="w-full mb-4 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Enter your email"
          onChange={e => setEmail(e.target.value)}
        />

     
        <input
          type="password"
          className="w-full mb-6 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-400 transition"
          placeholder="Enter your password"
          onChange={e => setPassword(e.target.value)}
        />

        
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg text-white font-semibold tracking-wide hover:opacity-90 transition duration-300 hover:scale-105"
        >
          Login
        </button>

       
        <p className="text-gray-300 text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login