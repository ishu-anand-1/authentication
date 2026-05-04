import axios from "axios"

// 🌍 BASE URL (env first, fallback second)
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// 🔥 Axios instance
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000 // ⏱️ 10s timeout
})

//
// 🔐 REQUEST INTERCEPTOR
//
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 🔥 FIX: prevent caching (important for pagination bug)
    config.headers["Cache-Control"] = "no-cache"
    config.headers["Pragma"] = "no-cache"

    return config
  },
  (error) => Promise.reject(error)
)

//
// 🔁 RESPONSE INTERCEPTOR
//
let isRedirecting = false

API.interceptors.response.use(
  (response) => response,

  (error) => {
    // ⏱️ TIMEOUT ERROR
    if (error.code === "ECONNABORTED") {
      console.error("⏱️ Request timeout")
      return Promise.reject({
        ...error,
        message: "Request timeout. Please try again."
      })
    }

    // 🌐 NETWORK ERROR
    if (!error.response) {
      console.error("🌐 Network error:", error.message)
      return Promise.reject({
        ...error,
        message: "Network error. Check your internet connection."
      })
    }

    const { status, data } = error.response

    // 🔒 UNAUTHORIZED (Auto logout)
    if (status === 401 && !isRedirecting) {
      isRedirecting = true

      console.warn("🔐 Session expired → logging out")

      localStorage.removeItem("token")
      localStorage.removeItem("user")

      setTimeout(() => {
        window.location.href = "/"
      }, 500)
    }

    // 🚫 FORBIDDEN
    if (status === 403) {
      console.warn("🚫 Access denied")
    }

    // 💥 SERVER ERROR
    if (status >= 500) {
      console.error("💥 Server error:", data?.message)
    }

    // 📩 FINAL MESSAGE
    const message =
      data?.message || "Something went wrong. Please try again."

    return Promise.reject({
      ...error,
      message
    })
  }
)

export default API