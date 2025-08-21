from sqlalchemy import Column, String, DateTime, Boolean, JSON, ForeignKey, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Prompt(Base):
    __tablename__ = "prompts"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    text = Column(String, nullable=False)
    reference_images = Column(JSON, default=[], nullable=False)  # Array of image URLs
    parameters = Column(JSON, nullable=False)  # Generation parameters
    tags = Column(JSON, default=[], nullable=False)  # Array of tags
    is_public = Column(Boolean, default=False, nullable=False)
    usage_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="prompts")
    generation_runs = relationship("GenerationRun", back_populates="prompt", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Prompt(id={self.id}, text={self.text[:50]}..., user_id={self.user_id})>"
