from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from enum import Enum
from datetime import datetime


# 🔥 Priority Enum
class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


# 🟢 Task Input Schema
class Task(BaseModel):
    title: str = Field(..., min_length=1, examples=["Complete project"])
    priority: PriorityEnum = Field(default=PriorityEnum.low)
    dueDate: Optional[datetime] = Field(
        default=None,
        examples=["2026-05-10T12:00:00"]
    )

    # ✅ Pydantic v2 validator
    @field_validator("title")
    @classmethod
    def clean_title(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Title cannot be empty")
        return value


# 🟡 Task List Input
class TaskList(BaseModel):
    tasks: List[Task]


# 🔵 Optimized Task Output
class OptimizedTask(BaseModel):
    rank: int
    title: str
    priority: PriorityEnum
    dueDate: Optional[datetime]
    score: int


# 🔴 Response Schema
class OptimizeResponse(BaseModel):
    success: bool
    optimized: List[OptimizedTask]