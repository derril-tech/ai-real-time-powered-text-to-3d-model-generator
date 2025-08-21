from sqlalchemy import Column, String, DateTime, JSON, ForeignKey, Enum, Integer, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class ExportFormat(str, enum.Enum):
    GLTF = "gltf"
    GLB = "glb"
    OBJ = "obj"
    FBX = "fbx"
    USD = "usd"
    BLEND = "blend"

class ExportStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class Export(Base):
    __tablename__ = "exports"

    id = Column(String, primary_key=True, index=True)
    generation_run_id = Column(String, ForeignKey("generation_runs.id"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    format = Column(Enum(ExportFormat), nullable=False)
    status = Column(Enum(ExportStatus), default=ExportStatus.PENDING, nullable=False)
    file_url = Column(String, nullable=True)
    file_size = Column(Integer, nullable=True)  # in bytes
    metadata = Column(JSON, default={}, nullable=False)  # Export metadata
    options = Column(JSON, default={}, nullable=False)  # Export options
    is_optimized = Column(Boolean, default=False, nullable=False)
    error = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    generation_run = relationship("GenerationRun", back_populates="exports")
    user = relationship("User", back_populates="exports")

    def __repr__(self):
        return f"<Export(id={self.id}, format={self.format}, status={self.status})>"
