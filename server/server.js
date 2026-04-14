require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

const app = express()

// ✅ Connect Database
connectDB()

// ✅ CORS CONFIG (VERY IMPORTANT FOR VERCEL)
const allowedOrigins = [
  "http://localhost:5173", // local frontend (Vite)
  "https://authentication-three-lemon.vercel.app" // your deployed frontend
]

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true
  })
)

// ✅ Middleware
app.use(express.json())

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/tasks", require("./routes/taskRoutes"))

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.status(200).send("🚀 API is running...")
})

// ❌ Handle Unknown Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  })
})

// ❌ Global Error Handler (VERY IMPORTANT)
app.use((err, req, res, next) => {
  console.error(err.stack)

  res.status(500).json({
    success: false,
    message: err.message || "Server Error"
  })
})

// ✅ Start Server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})