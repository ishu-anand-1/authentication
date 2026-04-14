function TaskCard({ task, onDelete, onToggle }) {
  return (
    <div className="group relative backdrop-blur-xl bg-white/10 border border-white/20 p-5 rounded-2xl flex justify-between items-center shadow-lg transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl hover:border-white/30">

     
      <div className="flex flex-col gap-2">

       
        <p
          className={`text-lg font-semibold tracking-wide transition-all duration-300 ${
            task.completed
              ? "line-through text-gray-400"
              : "text-white group-hover:text-blue-300"
          }`}
        >
          {task.title}
        </p>

       
        <span
          className={`text-xs px-3 py-1 rounded-full w-fit font-medium transition-all duration-300 ${
            task.completed
              ? "bg-green-500/20 text-green-300 border border-green-400/30 animate-pulse"
              : "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
          }`}
        >
          {task.completed ? "✅ Completed" : "⏳ Pending"}
        </span>

      </div>

      
      <div className="flex items-center gap-3">

        
        <button
          onClick={() => onToggle(task)}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 transform active:scale-95 hover:scale-105 ${
            task.completed
              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 hover:bg-yellow-500 hover:text-white"
              : "bg-green-500/20 text-green-300 border border-green-400/30 hover:bg-green-500 hover:text-white"
          }`}
        >
          {task.completed ? "↩ Undo" : "✔ Done"}
        </button>

        
        <button
          onClick={() => onDelete(task._id)}
          className="px-4 py-1.5 rounded-lg text-sm font-semibold text-red-400 border border-red-400/30 transition-all duration-300 transform active:scale-95 hover:scale-105 hover:bg-red-500 hover:text-white"
        >
          🗑 Delete
        </button>

      </div>

      
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none"></div>

     
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 opacity-50"></div>
    </div>
  )
}

export default TaskCard