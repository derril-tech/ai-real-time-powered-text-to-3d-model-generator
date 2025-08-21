from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Base Prompt schema
class PromptBase(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)
    reference_images: List[str] = Field(default_factory=list)
    parameters: Dict[str, Any] = Field(default_factory=dict)
    tags: List[str] = Field(default_factory=list)
    is_public: bool = False

# Create Prompt schema
class PromptCreate(PromptBase):
    pass

# Update Prompt schema
class PromptUpdate(BaseModel):
    text: Optional[str] = Field(None, min_length=1, max_length=2000)
    reference_images: Optional[List[str]] = None
    parameters: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    is_public: Optional[bool] = None

# Prompt response schema
class PromptResponse(PromptBase):
    id: str
    user_id: str
    usage_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Prompt with user info schema
class PromptWithUser(PromptResponse):
    user: Dict[str, Any]  # User info (id, username, avatar)

# Generation parameters schema
class GenerationParameters(BaseModel):
    scale: float = Field(1.0, ge=0.1, le=10.0)
    poly_budget: int = Field(10000, ge=1000, le=1000000)
    style: Dict[str, Any] = Field(default_factory=dict)
    export_format: str = "glb"
    quality: str = "standard"
    seed: Optional[int] = None
    guidance_scale: Optional[float] = Field(None, ge=1.0, le=20.0)
    steps: Optional[int] = Field(None, ge=10, le=1000)

# Generation style schema
class GenerationStyle(BaseModel):
    id: str
    name: str
    description: str
    preview: Optional[str] = None
    parameters: Dict[str, Any] = Field(default_factory=dict)

# Prompt template schema
class PromptTemplate(BaseModel):
    id: str
    name: str
    description: str
    text: str
    parameters: Dict[str, Any] = Field(default_factory=dict)
    tags: List[str] = Field(default_factory=list)
    is_official: bool = False
    usage_count: int = 0

# Prompt search filters schema
class PromptSearchFilters(BaseModel):
    tags: Optional[List[str]] = None
    is_public: Optional[bool] = None
    user_id: Optional[str] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None
    min_usage_count: Optional[int] = None
    max_usage_count: Optional[int] = None

# Prompt search response schema
class PromptSearchResponse(BaseModel):
    prompts: List[PromptResponse]
    total: int
    page: int
    limit: int
    has_next: bool
    has_prev: bool
