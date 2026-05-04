const express = require("express")
const router = express.Router()

const protect = require("../middleware/authMiddleware")

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require("../controllers/taskController")

const { getStats } = require("../controllers/analyticsController")

const Task = require("../models/task")
const mongoose = require("mongoose")

//
// 🔐 VALIDATION MIDDLEWARE
//
const validateTask = (req, res, next) => {
  let { title, priority } = req.body

  // normalize inputs
  if (title) req.body.title = title.trim()
  if (priority) req.body.priority = priority.toLowerCase()

  // title required only on create
  if (req.method === "POST" && !req.body.title) {
    return res.status(400).json({
      success: false,
      message: "Task title is required"
    })
  }

  // priority validation
  if (priority && !["low", "medium", "high"].includes(req.body.priority)) {
    return res.status(400).json({
      success: false,
      message: "Invalid priority value"
    })
  }

  next()
}

//
// 📊 ANALYTICS
//
router.get("/stats", protect, getStats)

//
// 📌 MAIN TASK ROUTES
//
router
  .route("/")
  .post(protect, validateTask, createTask)
  .get(protect, getTasks)

//
// 🔍 GET SINGLE TASK (FIXED)
//
router.get("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID"
      })
    }

    const task = await Task.findById(id)

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      })
    }

    // 🔐 Ownership check
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      })
    }

    return res.json({
      success: true,
      data: task
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

//
// 🔄 UPDATE TASK
//
router.put("/:id", protect, validateTask, updateTask)

//
// ❌ DELETE TASK
//
router.delete("/:id", protect, deleteTask)

module.exports = router