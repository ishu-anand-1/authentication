const Task = require("../models/task")
const mongoose = require("mongoose")

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const { title } = req.body

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      })
    }

    const task = await Task.create({
      user: req.user._id,
      title
    })

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// GET TASKS (FILTER + SEARCH + SORT)
const getTasks = async (req, res) => {
  try {
    const { completed, keyword } = req.query

    let query = { user: req.user._id }

    // FILTER
    if (completed !== undefined) {
      query.completed = completed === "true"
    }

    // SEARCH
    if (keyword) {
      query.title = { $regex: keyword, $options: "i" }
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 }) // latest first

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const { title, completed } = req.body

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID"
      })
    }

    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      })
    }

    // Check ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      })
    }

    // Update only if provided
    if (title !== undefined) task.title = title
    if (completed !== undefined) task.completed = completed

    const updatedTask = await task.save()

    res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID"
      })
    }

    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      })
    }

    // Check ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      })
    }

    await task.deleteOne()

    res.json({
      success: true,
      message: "Task deleted successfully"
    })

  } catch (error) {
    res.status(500).json({
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