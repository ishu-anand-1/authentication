require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// DB Connection
connectDB()

// Routes
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/tasks", require("./routes/taskRoutes"))

app.get("/", (req, res) => {
  res.send("API is running...")
})

// Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))