require("dotenv").config()

const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")

const connectDB = require("./config/db")
const { apiLimiter, authLimiter } = require("./middleware/ratelimiter") // ✅ FIX
const { notFound, errorHandler } = require("./middleware/errorMiddleware")

const app = express()

//
// 🔌 CONNECT DATABASE
//
connectDB()

//
// 🔥 TRUST PROXY (important for deployment)
//
app.set("trust proxy", 1)

//
// ⚙️ BASIC SECURITY
//
app.use(helmet())

//
// 🪵 LOGGER (only in dev)
//
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"))
}

//
// 🌐 CORS (dynamic from .env)
//
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000"]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error("❌ Not allowed by CORS"))
    },
    credentials: true
  })
)

//
// 🧾 BODY PARSER
//
app.use(express.json({ limit: "10kb" }))

//
// 🚦 RATE LIMIT
//
app.use("/api", apiLimiter)        // ✅ FIX
app.use("/api/auth", authLimiter)  // ✅ FIX (stronger for login/signup)

//
// 📡 ROUTES
//
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/tasks", require("./routes/taskRoutes"))

//
// 🏠 ROOT ROUTE
//
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Task Optimizer API is running",
    env: process.env.NODE_ENV || "development"
  })
})

//
// ❌ 404 HANDLER
//
app.use(notFound)

//
// 🚨 GLOBAL ERROR HANDLER
//
app.use(errorHandler)

//
// 🚀 START SERVER
//
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})