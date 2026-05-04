const User = require("../models/user")
const bcrypt = require("bcryptjs")
const generateToken = require("../utils/generateToken")
const axios = require("axios")

// ==============================
// 🟢 REGISTER USER
// ==============================
const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body

    // 🧹 Normalize input
    name = name?.trim()
    email = email?.toLowerCase().trim()

    // ❌ Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      })
    }

    // 🔍 Check existing user
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      })
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 🧾 Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    // ⚡ OPTIONAL FastAPI call (safe + env-based)
    if (process.env.FASTAPI_URL) {
      try {
        await axios.post(`${process.env.FASTAPI_URL}/api/optimize`, {
          tasks: [{ title: "Welcome Task", priority: "low" }]
        })
      } catch (err) {
        console.log("⚠️ FastAPI not reachable:", err.message)
      }
    }

    // ✅ Response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      }
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ==============================
// 🔵 LOGIN USER
// ==============================
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body

    // 🧹 Normalize
    email = email?.toLowerCase().trim()

    // ❌ Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      })
    }

    // 🔍 Find user
    const user = await User.findOne({ email })

    // ❌ Invalid credentials
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      })
    }

    // ⚡ OPTIONAL FastAPI call
    if (process.env.FASTAPI_URL) {
      try {
        await axios.post(`${process.env.FASTAPI_URL}/api/optimize`, {
          tasks: [{ title: "Login Check Task", priority: "medium" }]
        })
      } catch (err) {
        console.log("⚠️ FastAPI not reachable:", err.message)
      }
    }

    // ✅ Response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      }
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  registerUser,
  loginUser
}