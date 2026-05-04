from fastapi import APIRouter, Query
from typing import Optional

from app.models.schemas import TaskList, OptimizeResponse
from app.service.optimizer import optimize_tasks

router = APIRouter(prefix="/api", tags=["Task Optimization"])


@router.post("/optimize", response_model=OptimizeResponse)
def optimize_tasks_route(
    task_list: TaskList,
    limit: Optional[int] = Query(
        default=None,
        gt=0,
        description="Limit number of optimized tasks"
    )
):
    """
    Optimize tasks using priority-based sorting.
    Supports optional limiting of results.
    """

    # ✅ Convert Pydantic models → dict (Pydantic v2 safe)
    tasks = [task.model_dump() for task in task_list.tasks]

    # ✅ Run optimizer
    optimized = optimize_tasks(tasks, limit=limit)

    return {
        "success": True,
        "optimized": optimized
    }