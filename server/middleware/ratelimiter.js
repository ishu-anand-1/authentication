const rateLimit = require("express-rate-limit")

// 🔐 General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later."
    })
  },

  skip: (req) => {
    return req.path === "/" || req.path === "/health"
  }
})

// 🔐 Auth limiter (strict)
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many login attempts. Try again later."
    })
  }
})

module.exports = {
  apiLimiter,
  authLimiter
}