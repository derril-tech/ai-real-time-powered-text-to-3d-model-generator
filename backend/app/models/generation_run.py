from sqlalchemy import Column, String, DateTime, JSON, ForeignKey, Enum, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class GenerationStatus(str, enum.Enum):
    PENDING = "pending"
    PLANNING = "planning"
    COARSE_GEN = "coarse_gen"
    MESH_RECON = "mesh_recon"
    UV_UNWRAP = "uv_unwrap"
    TEXTURE_BAKE = "texture_bake"
    QA_SAFETY = "qa_safety"
    OPTIMIZE = "optimize"
    EXPORT = "export"
    PUBLISH = "publish"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class GenerationRun(Base):
    __tablename__ = "generation_runs"

    id = Column(String, primary_key=True, index=True)
    prompt_id = Column(String, ForeignKey("prompts.id"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    status = Column(Enum(GenerationStatus), default=GenerationStatus.PENDING, nullable=False)
    progress = Column(Float, default=0.0, nullable=False)  # 0.0 to 1.0
    current_stage = Column(String, nullable=True)
    stages = Column(JSON, default=[], nullable=False)  # Array of stage objects
    result = Column(JSON, nullable=True)  # Generation result data
    error = Column(String, nullable=True)
    estimated_time_remaining = Column(Float, nullable=True)  # in seconds
    started_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    prompt = relationship("Prompt", back_populates="generation_runs")
    user = relationship("User", back_populates="generation_runs")
    exports = relationship("Export", back_populates="generation_run", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<GenerationRun(id={self.id}, status={self.status}, progress={self.progress})>"
