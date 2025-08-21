from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.models.generation_run import GenerationRun, GenerationStatus
from app.models.prompt import Prompt
from app.schemas.generation import GenerationRunCreate, GenerationRunUpdate, GenerationProgressUpdate
from app.core.config import settings
import uuid
import asyncio
import logging

logger = logging.getLogger(__name__)

class GenerationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_generation_run(self, user_id: str, run_data: GenerationRunCreate) -> GenerationRun:
        """Create a new generation run"""
        # Verify prompt exists and belongs to user
        result = await self.db.execute(select(Prompt).where(Prompt.id == run_data.prompt_id))
        prompt = result.scalar_one_or_none()
        
        if not prompt:
            raise ValueError("Prompt not found")
        
        if prompt.user_id != user_id:
            raise ValueError("Prompt does not belong to user")

        # Create generation run
        run = GenerationRun(
            id=str(uuid.uuid4()),
            prompt_id=run_data.prompt_id,
            user_id=user_id,
            status=GenerationStatus.PENDING,
            progress=0.0,
            stages=self._get_default_stages(),
            parameters=run_data.parameters or {},
        )
        
        self.db.add(run)
        await self.db.commit()
        await self.db.refresh(run)
        
        # Start generation process
        asyncio.create_task(self._start_generation(run.id))
        
        return run

    async def get_generation_run(self, run_id: str, user_id: str) -> Optional[GenerationRun]:
        """Get generation run by ID"""
        result = await self.db.execute(
            select(GenerationRun).where(
                GenerationRun.id == run_id,
                GenerationRun.user_id == user_id
            )
        )
        return result.scalar_one_or_none()

    async def get_user_generation_runs(
        self, 
        user_id: str, 
        skip: int = 0, 
        limit: int = 20,
        status: Optional[GenerationStatus] = None
    ) -> List[GenerationRun]:
        """Get user's generation runs with pagination"""
        query = select(GenerationRun).where(GenerationRun.user_id == user_id)
        
        if status:
            query = query.where(GenerationRun.status == status)
        
        query = query.order_by(GenerationRun.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def update_generation_progress(self, run_id: str, progress_update: GenerationProgressUpdate) -> bool:
        """Update generation progress"""
        stmt = (
            update(GenerationRun)
            .where(GenerationRun.id == run_id)
            .values(
                status=progress_update.status,
                progress=progress_update.progress,
                current_stage=progress_update.current_stage,
                stages=progress_update.stages,
                estimated_time_remaining=progress_update.estimated_time_remaining,
                updated_at=datetime.utcnow()
            )
        )
        
        result = await self.db.execute(stmt)
        await self.db.commit()
        return result.rowcount > 0

    async def complete_generation(self, run_id: str, result: Dict[str, Any]) -> bool:
        """Mark generation as completed with result"""
        stmt = (
            update(GenerationRun)
            .where(GenerationRun.id == run_id)
            .values(
                status=GenerationStatus.COMPLETED,
                progress=1.0,
                result=result,
                completed_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
        )
        
        result = await self.db.execute(stmt)
        await self.db.commit()
        return result.rowcount > 0

    async def fail_generation(self, run_id: str, error: str) -> bool:
        """Mark generation as failed with error"""
        stmt = (
            update(GenerationRun)
            .where(GenerationRun.id == run_id)
            .values(
                status=GenerationStatus.FAILED,
                error=error,
                completed_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
        )
        
        result = await self.db.execute(stmt)
        await self.db.commit()
        return result.rowcount > 0

    async def cancel_generation(self, run_id: str, user_id: str) -> bool:
        """Cancel a generation run"""
        run = await self.get_generation_run(run_id, user_id)
        if not run:
            return False
        
        if run.status in [GenerationStatus.COMPLETED, GenerationStatus.FAILED, GenerationStatus.CANCELLED]:
            return False
        
        stmt = (
            update(GenerationRun)
            .where(GenerationRun.id == run_id)
            .values(
                status=GenerationStatus.CANCELLED,
                completed_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
        )
        
        result = await self.db.execute(stmt)
        await self.db.commit()
        return result.rowcount > 0

    async def retry_generation(self, run_id: str, user_id: str, parameters: Optional[Dict[str, Any]] = None) -> Optional[GenerationRun]:
        """Retry a failed generation run"""
        run = await self.get_generation_run(run_id, user_id)
        if not run:
            return None
        
        if run.status != GenerationStatus.FAILED:
            raise ValueError("Can only retry failed generations")
        
        # Create new run with same prompt
        new_run_data = GenerationRunCreate(
            prompt_id=run.prompt_id,
            parameters=parameters or run.parameters
        )
        
        return await self.create_generation_run(user_id, new_run_data)

    def _get_default_stages(self) -> List[Dict[str, Any]]:
        """Get default generation stages"""
        return [
            {
                "id": "planning",
                "name": "Planning",
                "status": "pending",
                "progress": 0.0
            },
            {
                "id": "coarse_gen",
                "name": "Coarse Generation",
                "status": "pending",
                "progress": 0.0
            },
            {
                "id": "mesh_recon",
                "name": "Mesh Reconstruction",
                "status": "pending",
                "progress": 0.0
            },
            {
                "id": "uv_unwrap",
                "name": "UV Unwrapping",
                "status": "pending",
                "progress": 0.0
            },
            {
                "id": "texture_bake",
                "name": "Texture Baking",
                "status": "pending",
                "progress": 0.0
            },
            {
                "id": "qa_safety",
                "name": "QA & Safety",
                "status": "pending",
                "progress": 0.0
            },
            {
                "id": "optimize",
                "name": "Optimization",
                "status": "pending",
                "progress": 0.0
            },
            {
                "id": "export",
                "name": "Export",
                "status": "pending",
                "progress": 0.0
            },
            {
                "id": "publish",
                "name": "Publish",
                "status": "pending",
                "progress": 0.0
            }
        ]

    async def _start_generation(self, run_id: str):
        """Start the generation process"""
        try:
            # Update status to planning
            await self.update_generation_progress(run_id, GenerationProgressUpdate(
                run_id=run_id,
                status=GenerationStatus.PLANNING,
                progress=0.05,
                current_stage="planning",
                stages=self._get_default_stages(),
                estimated_time_remaining=300.0  # 5 minutes estimate
            ))
            
            # TODO: Integrate with LangGraph pipeline
            # This would involve:
            # 1. Sending the generation request to the AI pipeline
            # 2. Setting up WebSocket connections for real-time updates
            # 3. Handling progress updates from the pipeline
            # 4. Managing the generation lifecycle
            
            logger.info(f"Started generation for run {run_id}")
            
        except Exception as e:
            logger.error(f"Failed to start generation for run {run_id}: {e}")
            await self.fail_generation(run_id, str(e))

    async def get_generation_statistics(self, user_id: str) -> Dict[str, Any]:
        """Get generation statistics for user"""
        # Get total runs
        total_runs = await self.db.execute(
            select(GenerationRun).where(GenerationRun.user_id == user_id)
        )
        total_runs = len(total_runs.scalars().all())
        
        # Get completed runs
        completed_runs = await self.db.execute(
            select(GenerationRun).where(
                GenerationRun.user_id == user_id,
                GenerationRun.status == GenerationStatus.COMPLETED
            )
        )
        completed_runs = len(completed_runs.scalars().all())
        
        # Get failed runs
        failed_runs = await self.db.execute(
            select(GenerationRun).where(
                GenerationRun.user_id == user_id,
                GenerationRun.status == GenerationStatus.FAILED
            )
        )
        failed_runs = len(failed_runs.scalars().all())
        
        # Get active runs
        active_runs = await self.db.execute(
            select(GenerationRun).where(
                GenerationRun.user_id == user_id,
                GenerationRun.status.in_([
                    GenerationStatus.PENDING,
                    GenerationStatus.PLANNING,
                    GenerationStatus.COARSE_GEN,
                    GenerationStatus.MESH_RECON,
                    GenerationStatus.UV_UNWRAP,
                    GenerationStatus.TEXTURE_BAKE,
                    GenerationStatus.QA_SAFETY,
                    GenerationStatus.OPTIMIZE,
                    GenerationStatus.EXPORT,
                    GenerationStatus.PUBLISH
                ])
            )
        )
        active_runs = len(active_runs.scalars().all())
        
        return {
            "total_runs": total_runs,
            "completed_runs": completed_runs,
            "failed_runs": failed_runs,
            "active_runs": active_runs,
            "success_rate": (completed_runs / total_runs * 100) if total_runs > 0 else 0
        }
