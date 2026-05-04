function TaskCard({ task, onDelete, onToggle }) {
  if (!task) return null

  // 🔥 Normalize priority safely
  const priority = (task.priority || "low").toLowerCase()

  const priorityStyles = {
    high: "bg-red-500/20 text-red-300 border border-red-400/30",
    medium: "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30",
    low: "bg-green-500/20 text-green-300 border border-green-400/30"
  }

  const isCompleted = !!task.completed

  return (
    <div className="group relative backdrop-blur-xl bg-white/10 border border-white/20 p-5 rounded-2xl flex justify-between items-center shadow-lg transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl hover:border-white/30">

      {/* LEFT */}
      <div className="flex flex-col gap-2">

        {/* TITLE */}
        <p
          className={`text-lg font-semibold tracking-wide transition-all duration-300 ${
            isCompleted
              ? "line-through text-gray-400"
              : "text-white group-hover:text-blue-300"
          }`}
        >
          {task.title?.trim() || "Untitled Task"}
        </p>

        {/* STATUS */}
        <span
          className={`text-xs px-3 py-1 rounded-full w-fit font-medium transition-all duration-300 ${
            isCompleted
              ? "bg-green-500/20 text-green-300 border border-green-400/30 animate-pulse"
              : "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
          }`}
        >
          {isCompleted ? "✅ Completed" : "⏳ Pending"}
        </span>

        {/* PRIORITY */}
        <span
          className={`text-xs px-3 py-1 rounded-full w-fit font-medium ${
            priorityStyles[priority] || priorityStyles.low
          }`}
        >
          🔥 {priority.toUpperCase()}
        </span>

        {/* DUE DATE */}
        {task.dueDate && (
          <span className="text-xs text-gray-300">
            📅 {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* TOGGLE */}
        <button
          onClick={() => onToggle(task)}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 transform active:scale-95 hover:scale-105 ${
            isCompleted
              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 hover:bg-yellow-500 hover:text-white"
              : "bg-green-500/20 text-green-300 border border-green-400/30 hover:bg-green-500 hover:text-white"
          }`}
        >
          {isCompleted ? "↩ Undo" : "✔ Done"}
        </button>

        {/* DELETE */}
        <button
          onClick={() => onDelete(task._id)}
          className="px-4 py-1.5 rounded-lg text-sm font-semibold text-red-400 border border-red-400/30 transition-all duration-300 transform active:scale-95 hover:scale-105 hover:bg-red-500 hover:text-white"
        >
          🗑 Delete
        </button>

      </div>

      {/* HOVER EFFECT */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none"></div>

      {/* TOP LINE */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 opacity-50"></div>
    </div>
  )
}

export default TaskCard