from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.generation_run import GenerationStatus

# Base Generation Run schema
class GenerationRunBase(BaseModel):
    prompt_id: str
    parameters: Optional[Dict[str, Any]] = Field(default_factory=dict)

# Create Generation Run schema
class GenerationRunCreate(GenerationRunBase):
    pass

# Update Generation Run schema
class GenerationRunUpdate(BaseModel):
    status: Optional[GenerationStatus] = None
    progress: Optional[float] = Field(None, ge=0.0, le=1.0)
    current_stage: Optional[str] = None
    stages: Optional[List[Dict[str, Any]]] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    estimated_time_remaining: Optional[float] = None
    completed_at: Optional[datetime] = None

# Generation Stage schema
class GenerationStage(BaseModel):
    id: str
    name: str
    status: str  # 'pending', 'running', 'completed', 'failed'
    progress: float = Field(0.0, ge=0.0, le=1.0)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error: Optional[str] = None
    output: Optional[Dict[str, Any]] = None

# Generation Result schema
class GenerationResult(BaseModel):
    model_url: str
    thumbnail_url: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    files: List[Dict[str, Any]] = Field(default_factory=list)
    statistics: Dict[str, Any] = Field(default_factory=dict)

# Model Metadata schema
class ModelMetadata(BaseModel):
    vertex_count: int
    face_count: int
    texture_count: int
    file_size: int
    bounding_box: Dict[str, List[float]]
    materials: List[Dict[str, Any]] = Field(default_factory=list)

# Model File schema
class ModelFile(BaseModel):
    id: str
    name: str
    format: str
    url: str
    size: int
    optimized: bool

# Generation Statistics schema
class GenerationStatistics(BaseModel):
    total_time: float
    stage_times: Dict[str, float] = Field(default_factory=dict)
    gpu_usage: float
    memory_usage: float
    quality_score: float

# Generation Run response schema
class GenerationRunResponse(GenerationRunBase):
    id: str
    user_id: str
    status: GenerationStatus
    progress: float
    current_stage: Optional[str]
    stages: List[Dict[str, Any]]
    result: Optional[Dict[str, Any]]
    error: Optional[str]
    estimated_time_remaining: Optional[float]
    started_at: datetime
    completed_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Generation Run with prompt info schema
class GenerationRunWithPrompt(GenerationRunResponse):
    prompt: Dict[str, Any]  # Prompt info

# Generation Run with user info schema
class GenerationRunWithUser(GenerationRunResponse):
    user: Dict[str, Any]  # User info

# Generation Run full schema
class GenerationRunFull(GenerationRunWithPrompt):
    user: Dict[str, Any]  # User info

# Generation search filters schema
class GenerationSearchFilters(BaseModel):
    status: Optional[GenerationStatus] = None
    user_id: Optional[str] = None
    prompt_id: Optional[str] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None
    min_progress: Optional[float] = None
    max_progress: Optional[float] = None

# Generation search response schema
class GenerationSearchResponse(BaseModel):
    runs: List[GenerationRunResponse]
    total: int
    page: int
    limit: int
    has_next: bool
    has_prev: bool

# Generation progress update schema
class GenerationProgressUpdate(BaseModel):
    run_id: str
    status: GenerationStatus
    progress: float
    current_stage: Optional[str]
    stages: List[Dict[str, Any]]
    estimated_time_remaining: Optional[float]

# Generation completion schema
class GenerationCompletion(BaseModel):
    run_id: str
    result: GenerationResult

# Generation error schema
class GenerationError(BaseModel):
    run_id: str
    error: str
    stage: Optional[str]

# Generation cancellation schema
class GenerationCancellation(BaseModel):
    run_id: str
    reason: Optional[str] = None

# Generation retry schema
class GenerationRetry(BaseModel):
    run_id: str
    parameters: Optional[Dict[str, Any]] = None
