const express = require("express")
const router = express.Router()

const {
  registerUser,
  loginUser
} = require("../controllers/authController")

const protect = require("../middleware/authMiddleware")

//
// 🔐 VALIDATION MIDDLEWARES
//

// ✅ Signup validation (name + email + password)
const validateSignup = (req, res, next) => {
  let { name, email, password } = req.body

  name = name?.trim()
  email = email?.toLowerCase().trim()

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required"
    })
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters"
    })
  }

  req.body.name = name
  req.body.email = email

  next()
}

// ✅ Login validation (email + password)
const validateLogin = (req, res, next) => {
  let { email, password } = req.body

  email = email?.toLowerCase().trim()

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    })
  }

  req.body.email = email

  next()
}

//
// 🚀 ROUTES
//

// 🔥 Signup
router.post("/signup", validateSignup, registerUser)

// 🔥 Login
router.post("/login", validateLogin, loginUser)

// 🔐 Get current user
router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    data: req.user
  })
})

module.exports = router