const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: process.env.NODE_ENV !== "production", // disable in prod
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    process.exit(1)
  }
}

// 🔥 Connection Events (VERY IMPORTANT)
mongoose.connection.on("connected", () => {
  console.log("📡 Mongoose connected to DB")
})

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose error:", err)
})

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ Mongoose disconnected")
})

// 🔥 Graceful Shutdown (Production Safe)
const gracefulShutdown = async (signal) => {
  try {
    await mongoose.connection.close()
    console.log(`🔌 MongoDB connection closed due to ${signal}`)
    process.exit(0)
  } catch (err) {
    console.error("❌ Error during MongoDB shutdown:", err)
    process.exit(1)
  }
}

// Handle termination signals
process.on("SIGINT", gracefulShutdown)
process.on("SIGTERM", gracefulShutdown)

module.exports = connectDB