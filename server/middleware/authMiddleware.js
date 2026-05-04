const jwt = require("jsonwebtoken")
const User = require("../models/user")

const protect = async (req, res, next) => {
  try {
    let token

    // 🔐 Extract token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1]
    }

    // ❌ No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided"
      })
    }

    // ❌ JWT secret missing (env safety)
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables")
      return res.status(500).json({
        success: false,
        message: "Server configuration error"
      })
    }

    let decoded

    // 🔐 Verify token
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      return res.status(401).json({
        success: false,
        message:
          err.name === "TokenExpiredError"
            ? "Token expired, please login again"
            : "Invalid token"
      })
    }

    // 🔍 Fetch user
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      })
    }

    // ✅ Attach user
    req.user = user

    next()

  } catch (error) {
    console.error("🔥 Auth Middleware Error:", error.message)

    return res.status(500).json({
      success: false,
      message: "Server error in authentication"
    })
  }
}

module.exports = protect