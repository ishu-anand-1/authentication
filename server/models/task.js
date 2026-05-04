const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"]
    },

    completed: {
      type: Boolean,
      default: false,
      index: true
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
      lowercase: true,   // 🔥 ensures always lowercase
      trim: true,
      index: true
    },

    priorityValue: {
      type: Number,
      default: 1
    },

    dueDate: {
      type: Date,
      default: null,
      index: true
    }
  },
  {
    timestamps: true
  }
)

//
// 🔥 AUTO CALCULATE PRIORITY VALUE
//
taskSchema.pre("save", function (next) {
  const map = {
    low: 1,
    medium: 2,
    high: 3
  }

  // fallback safety
  if (!this.priority || !map[this.priority]) {
    this.priority = "low"
  }

  this.priorityValue = map[this.priority]

  next()
})

//
// 🔥 OPTIMIZED INDEX (important for pagination + sorting)
//
taskSchema.index({
  user: 1,
  priorityValue: -1,
  createdAt: -1
})

//
// 🔥 CLEAN RESPONSE
//
taskSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v
    return ret
  }
})

module.exports = mongoose.model("Task", taskSchema)