// ==============================
// ❌ 404 NOT FOUND
// ==============================
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`)
  res.status(404)
  next(error)
}

// ==============================
// ⚠️ GLOBAL ERROR HANDLER
// ==============================
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  let message = err.message || "Internal Server Error"

  // 🔴 Mongoose Invalid ObjectId
  if (err.name === "CastError") {
    statusCode = 400
    message = "Invalid ID format"
  }

  // 🔴 Mongoose Duplicate Key
  if (err.code === 11000) {
    statusCode = 400
    const field = Object.keys(err.keyValue || {})[0]
    message = `${field} already exists`
  }

  // 🔴 Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400
    message = Object.values(err.errors)
      .map(val => val.message)
      .join(", ")
  }

  // 🔴 JWT Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401
    message = "Invalid token"
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401
    message = "Token expired, please login again"
  }

  // 🔴 Axios / External API errors (FastAPI etc.)
  if (err.isAxiosError) {
    statusCode = err.response?.status || 500
    message = err.response?.data?.message || "External service error"
  }

  // 🔥 LOG ERROR (only in development)
  if (process.env.NODE_ENV !== "production") {
    console.error("🔥 ERROR:", err)
  }

  res.status(statusCode).json({
    success: false,
    message,
    path: req.originalUrl,
    method: req.method,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  })
}

module.exports = { notFound, errorHandler }