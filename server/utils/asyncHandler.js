const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      
      // 🔥 Attach request metadata (helps debugging)
      error.statusCode = error.statusCode || 500
      error.path = req.originalUrl
      error.method = req.method

      next(error)
    })
  }
}

module.exports = asyncHandler