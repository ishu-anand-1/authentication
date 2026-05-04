const Task = require("../models/task")

const getStats = async (req, res) => {
  try {
    const userId = req.user._id

    // 🔹 Aggregate stats
    const stats = await Task.aggregate([
      { $match: { user: userId } },

      {
        $facet: {
          // 🔥 Priority breakdown
          byPriority: [
            {
              $group: {
                _id: "$priority",
                count: { $sum: 1 }
              }
            }
          ],

          // 🔥 Completion stats
          byStatus: [
            {
              $group: {
                _id: "$completed",
                count: { $sum: 1 }
              }
            }
          ],

          // 🔥 Total tasks
          total: [
            {
              $count: "count"
            }
          ]
        }
      }
    ])

    const result = stats[0]

    // 🔹 Format Priority Stats
    const priorityStats = {
      high: 0,
      medium: 0,
      low: 0
    }

    result.byPriority.forEach(item => {
      priorityStats[item._id] = item.count
    })

    // 🔹 Format Status Stats
    let completed = 0
    let pending = 0

    result.byStatus.forEach(item => {
      if (item._id === true) completed = item.count
      else pending = item.count
    })

    const total = result.total[0]?.count || 0

    // 🔹 Final Response
    res.json({
      success: true,
      data: {
        total,
        completed,
        pending,
        priority: priorityStats
      }
    })

  } catch (error) {
    console.error("Analytics Error:", error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics"
    })
  }
}

module.exports = { getStats }