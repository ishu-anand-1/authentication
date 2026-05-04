import { useEffect, useState, useContext, useCallback } from "react"
import API from "../services/api"
import TaskCard from "../components/TaskCard"
import Navbar from "../components/Navbar"
import { AuthContext } from "../context/AuthContext"

function Dashboard() {
  const { user, logout } = useContext(AuthContext)

  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("low")

  const [search, setSearch] = useState("")
  const [filterPriority, setFilterPriority] = useState("")
  const [optimize, setOptimize] = useState(false)

  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const [loading, setLoading] = useState(false)

  // 🔥 FETCH TASKS (STABLE)
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)

      const res = await API.get("/tasks", {
        params: {
          page,
          limit: 5,
          keyword: search.trim() || undefined,
          priority: filterPriority || undefined,
          optimize
        }
      })

      setTasks(res.data?.data || [])
      setPages(res.data?.pages || 1)

    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setLoading(false)
    }
  }, [page, search, filterPriority, optimize])

  // 🔄 EFFECT (NO DUPLICATE CALLS)
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // ➕ ADD TASK
  const addTask = async () => {
    if (!title.trim()) return

    try {
      await API.post("/tasks", {
        title: title.trim(),
        priority
      })

      setTitle("")
      setPriority("low")
      setPage(1)

      fetchTasks()

    } catch (error) {
      console.error("Add error:", error)
    }
  }

  // ❌ DELETE
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`)

      setTasks(prev => prev.filter(t => t._id !== id))

      // handle page fallback
      if (tasks.length === 1 && page > 1) {
        setPage(prev => prev - 1)
      }

    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  // 🔁 TOGGLE
  const toggleTask = async (task) => {
    try {
      await API.put(`/tasks/${task._id}`, {
        completed: !task.completed
      })

      setTasks(prev =>
        prev.map(t =>
          t._id === task._id
            ? { ...t, completed: !t.completed }
            : t
        )
      )

    } catch (error) {
      console.error("Toggle error:", error)
    }
  }

  return (
    <>
      <Navbar isLoggedIn={!!user} onLogout={logout} />

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-6 relative overflow-hidden">

        {/* BG EFFECT */}
        <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
        <div className="absolute w-[300px] h-[300px] bg-purple-500 opacity-20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-6">Dashboard ✨</h1>

        {/* 🔍 FILTERS */}
        <div className="flex gap-3 mb-4 flex-wrap">

          <input
            value={search}
            onChange={(e) => {
              setPage(1)
              setSearch(e.target.value)
            }}
            placeholder="Search tasks..."
            className="flex-1 p-3 rounded-lg bg-white/20 outline-none"
          />

          <select
            value={filterPriority}
            onChange={(e) => {
              setPage(1)
              setFilterPriority(e.target.value)
            }}
            className="p-3 rounded-lg bg-white/20"
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button
            onClick={() => {
              setPage(1)
              setOptimize(prev => !prev)
            }}
            className="px-4 py-2 bg-purple-600 rounded-lg hover:scale-105 transition"
          >
            {optimize ? "Optimized ON ⚡" : "Optimize"}
          </button>

        </div>

        {/* ➕ ADD TASK */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl rounded-2xl p-4 flex gap-3 mb-6">

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task..."
            className="flex-1 p-3 rounded-lg bg-white/20 outline-none"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-3 rounded-lg bg-white/20"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button
            onClick={addTask}
            className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 rounded-lg hover:scale-105 transition"
          >
            Add
          </button>

        </div>

        {/* 📋 TASK LIST */}
        <div className="grid gap-4">

          {loading ? (
            <p className="text-center text-gray-400 animate-pulse">
              Loading tasks...
            </p>
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDelete={deleteTask}
                onToggle={toggleTask}
              />
            ))
          ) : (
            <p className="text-center text-gray-400">
              No tasks found 🚀
            </p>
          )}

        </div>

        {/* 📄 PAGINATION */}
        <div className="flex justify-center items-center gap-4 mt-6">

          <button
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 hover:scale-105 transition"
          >
            Prev
          </button>

          <span>
            Page {page} / {pages}
          </span>

          <button
            disabled={page === pages}
            onClick={() => setPage(prev => prev + 1)}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 hover:scale-105 transition"
          >
            Next
          </button>

        </div>

      </div>
    </>
  )
}

export default Dashboard