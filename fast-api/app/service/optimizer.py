from typing import List, Dict, Optional
from datetime import datetime

from app.utils.dsa import priority_sort, calculate_score


# 🔹 Normalize task input
def normalize_task(task: Dict) -> Dict:
    """
    Ensure task has consistent structure
    """

    priority = str(task.get("priority", "low")).lower()

    # ✅ fallback if invalid priority
    if priority not in ["low", "medium", "high"]:
        priority = "low"

    due_date = task.get("dueDate")

    # ✅ convert string → datetime if needed
    if isinstance(due_date, str):
        try:
            due_date = datetime.fromisoformat(due_date)
        except Exception:
            due_date = None

    return {
        "title": (task.get("title") or "Untitled Task").strip(),
        "priority": priority,
        "dueDate": due_date
    }


# 🔹 Main optimizer
def optimize_tasks(tasks: List[Dict], limit: Optional[int] = None) -> List[Dict]:
    """
    Optimize tasks using DSA logic

    Steps:
    1. Normalize input
    2. Sort using priority + urgency
    3. Attach score + rank
    4. Optionally limit results
    """

    # ✅ Step 1: Normalize
    normalized_tasks = [normalize_task(task) for task in tasks]

    if not normalized_tasks:
        return []

    # ✅ Step 2: Sort using your DSA logic
    sorted_tasks = priority_sort(normalized_tasks)

    # ✅ Step 3: Attach rank + score
    optimized = []
    for idx, task in enumerate(sorted_tasks, start=1):
        optimized.append({
            "rank": idx,
            "title": task["title"],
            "priority": task["priority"],
            "dueDate": task["dueDate"],
            "score": calculate_score(task)
        })

    # ✅ Step 4: Apply limit safely
    if limit is not None and limit > 0:
        optimized = optimized[:limit]

    return optimized