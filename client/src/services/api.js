import axios from "axios"

// 🔥 Use environment-based URL
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// 🔐 Attach token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ⚠️ Handle global errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Logging out...")

      localStorage.removeItem("token")
      localStorage.removeItem("user")

      window.location.href = "/"
    }

    return Promise.reject(error)
  }
)

export default API