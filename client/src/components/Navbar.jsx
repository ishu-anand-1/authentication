import { Link, useNavigate } from "react-router-dom"

function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    if (onLogout) onLogout()
    navigate("/")
  }

  return (
    <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/10 border-b border-white/20 shadow-lg transition duration-300">
      
      <div className="flex justify-between items-center px-6 py-4">
        
        
        <h1
          onClick={() => navigate("/")}
          className="text-white text-xl font-bold tracking-wide cursor-pointer hover:text-blue-400 transition duration-300"
        >
          ⚡ TaskFlow
        </h1>

        
        <div className="flex items-center gap-4">
          
          {!isLoggedIn ? (
            <>
             
              <Link
                to="/"
                className="px-4 py-2 rounded-lg text-white border border-white/20 hover:bg-white/10 hover:scale-105 transition duration-300"
              >
                Login
              </Link>

             
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium hover:opacity-90 hover:scale-105 transition duration-300"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              
              <Link
                to="/dashboard"
                className="text-white hover:text-blue-400 transition duration-300"
              >
                Dashboard
              </Link>

              
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 border border-red-400/30 hover:bg-red-500 hover:text-white hover:scale-105 transition duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar