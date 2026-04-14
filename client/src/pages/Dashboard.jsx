import { useEffect, useState } from "react"
import API from "../services/api"
import TaskCard from "../components/TaskCard"
import Navbar from "../components/Navbar"

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  
  const fetchTasks = async () => {
    try {
      setLoading(true)
      const res = await API.get("/tasks")
      setTasks(res.data.data)
    } catch (error) {
      console.error("Error fetching tasks", error)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!title.trim()) return

    try {
      await API.post("/tasks", { title })
      setTitle("")
      fetchTasks()
    } catch (error) {
      console.error("Error adding task", error)
    }
  }

  
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`)
      fetchTasks()
    } catch (error) {
      console.error("Error deleting task", error)
    }
  }

  const toggleTask = async (task) => {
    try {
      await API.put(`/tasks/${task._id}`, {
        completed: !task.completed
      })
      fetchTasks()
    } catch (error) {
      console.error("Error updating task", error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <>
      <Navbar isLoggedIn={true} />

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-6 relative overflow-hidden">

       
        <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
        <div className="absolute w-[300px] h-[300px] bg-purple-500 opacity-20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

       
        <h1 className="text-4xl font-bold mb-6 tracking-wide">
          Dashboard ✨
        </h1>

       
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl rounded-2xl p-4 flex gap-3 mb-6 transition hover:scale-[1.02]">

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a new task..."
            className="flex-1 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <button
            onClick={addTask}
            className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 rounded-lg font-semibold hover:opacity-90 transition hover:scale-105 active:scale-95"
          >
            Add
          </button>
        </div>

        
        <div className="grid gap-4">

          {loading ? (
            <p className="text-center text-gray-400 animate-pulse">
              Loading tasks...
            </p>
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task._id}
                className="transform transition duration-300 hover:scale-[1.02]"
              >
                <TaskCard
                  task={task}
                  onDelete={deleteTask}
                  onToggle={toggleTask}  
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center mt-10">
              No tasks yet. Add your first task 🚀
            </p>
          )}

        </div>
      </div>
    </>
  )
}

export default Dashboard