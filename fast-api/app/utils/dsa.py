from datetime import datetime
from typing import Optional, Dict, List


# 🔹 Priority Mapping
def priority_value(priority: str) -> int:
    mapping = {"high": 3, "medium": 2, "low": 1}
    return mapping.get(str(priority).lower(), 1)


# 🔹 Due Date Urgency Score
def due_date_score(due_date: Optional[object]) -> int:
    """
    Higher score = more urgent
    """

    if not due_date:
        return 0

    try:
        # ✅ Handle both string and datetime
        if isinstance(due_date, str):
            due = datetime.fromisoformat(due_date)
        else:
            due = due_date

        now = datetime.now()
        diff = (due - now).days

        # 🔥 Urgency Logic
        if diff < 0:
            return 4  # overdue (highest priority)
        elif diff <= 1:
            return 3
        elif diff <= 3:
            return 2
        elif diff <= 7:
            return 1
        else:
            return 0

    except Exception:
        return 0


# 🔹 Final Score Calculation
def calculate_score(task: Dict) -> int:
    """
    Combined score:
    Priority weight + urgency
    """

    priority_score = priority_value(task.get("priority", "low"))
    urgency_score = due_date_score(task.get("dueDate"))

    # 🔥 Weighted scoring
    return (priority_score * 2) + urgency_score


# 🔹 Sort Tasks (CORE DSA)
def priority_sort(tasks: List[Dict]) -> List[Dict]:
    """
    Sort tasks based on:
    1. Combined score (priority + urgency)
    2. Latest created (fallback)
    """

    return sorted(
        tasks,
        key=lambda task: (
            calculate_score(task),  # 🔥 main sorting logic
        ),
        reverse=True
    )