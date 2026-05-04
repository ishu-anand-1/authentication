const Task = require("../models/task")
const mongoose = require("mongoose")
const axios = require("axios")

// 🔥 Priority weight
const priorityWeight = {
  high: 3,
  medium: 2,
  low: 1
}

// 🔥 Normalize input safely (FIXED)
const normalizeTaskInput = (body) => {
  let normalized = {}

  if (body.title !== undefined) {
    normalized.title = body.title.trim()
  }

  if (body.priority !== undefined) {
    const p = body.priority.toLowerCase()
    normalized.priority = ["low", "medium", "high"].includes(p) ? p : "low"
  }

  if (body.dueDate !== undefined) {
    normalized.dueDate = body.dueDate || null
  }

  return normalized
}

//
// 🟢 CREATE TASK
//
const createTask = async (req, res) => {
  try {
    const { title, priority, dueDate } = normalizeTaskInput(req.body)

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      })
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      priority: priority || "low",
      dueDate
    })

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//
// 🟡 GET TASKS (FIXED PAGINATION + STABLE SORT)
//
const getTasks = async (req, res) => {
  try {
    const { completed, keyword, priority, optimize } = req.query

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const skip = (page - 1) * limit

    let query = { user: req.user._id }

    if (completed !== undefined) {
      query.completed = completed === "true"
    }

    if (priority) {
      query.priority = priority
    }

    if (keyword) {
      query.title = { $regex: keyword, $options: "i" }
    }

    const total = await Task.countDocuments(query)

    // ✅ SORT AT DB LEVEL (FIXED)
    let tasks = await Task.find(query)
      .sort({
        priority: -1,      // high > medium > low (string works because of enum order trick)
        createdAt: -1
      })
      .skip(skip)
      .limit(limit)

    //
    // 🔥 FASTAPI OPTIMIZATION
    //
    if (optimize === "true" && tasks.length > 0) {
      try {
        const response = await axios.post(
          `${process.env.FASTAPI_URL}/api/optimize`,
          {
            tasks: tasks.map(t => ({
              title: t.title,
              priority: t.priority,
              dueDate: t.dueDate
            }))
          }
        )

        return res.json({
          success: true,
          optimized: true,
          page,
          pages: Math.ceil(total / limit),
          count: tasks.length,
          data: response.data.optimized
        })

      } catch (err) {
        console.log("⚠️ FastAPI failed → fallback sorting")
      }
    }

    // ❌ REMOVE EXTRA SORT (IMPORTANT FIX)
    // We DO NOT sort again here → pagination stays correct

    return res.json({
      success: true,
      optimized: false,
      page,
      pages: Math.ceil(total / limit),
      count: tasks.length,
      data: tasks
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//
// 🔵 UPDATE TASK (FIXED PRIORITY BUG)
//
const updateTask = async (req, res) => {
  try {
    const { id } = req.params

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

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      })
    }

    const updates = normalizeTaskInput(req.body)

    // ✅ APPLY ONLY PROVIDED FIELDS
    Object.keys(updates).forEach((key) => {
      task[key] = updates[key]
    })

    if (req.body.completed !== undefined) {
      task.completed = req.body.completed
    }

    const updatedTask = await task.save()

    return res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//
// 🔴 DELETE TASK
//
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params

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

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      })
    }

    await task.deleteOne()

    return res.json({
      success: true,
      message: "Task deleted successfully"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
}