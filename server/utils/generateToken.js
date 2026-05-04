const jwt = require("jsonwebtoken")

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("❌ JWT_SECRET is not defined in environment variables")
  }

  return jwt.sign(
    {
      id: userId // 🔥 ALWAYS use consistent key
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "7d",
      issuer: "task-optimizer-api",     // optional but good
      audience: "task-optimizer-users"  // optional but good
    }
  )
}

module.exports = generateToken