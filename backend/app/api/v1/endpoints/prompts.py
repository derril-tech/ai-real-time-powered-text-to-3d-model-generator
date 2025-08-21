from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, desc
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.prompt import Prompt
from app.schemas.prompt import PromptCreate, PromptUpdate, PromptResponse, PromptSearchFilters
from app.api.v1.endpoints.auth import get_current_user
import logging
import uuid

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=List[PromptResponse])
async def get_prompts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    user_id: Optional[str] = None,
    is_public: Optional[bool] = None,
    tags: Optional[List[str]] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get prompts with filtering and pagination"""
    try:
        query = select(Prompt)
        
        # Apply filters
        filters = []
        
        # User filter
        if user_id:
            filters.append(Prompt.user_id == user_id)
        else:
            # Show user's own prompts and public prompts
            filters.append(
                or_(
                    Prompt.user_id == current_user.id,
                    Prompt.is_public == True
                )
            )
        
        # Public filter
        if is_public is not None:
            filters.append(Prompt.is_public == is_public)
        
        # Tags filter
        if tags:
            # TODO: Implement proper tag filtering with JSON operations
            pass
        
        if filters:
            query = query.where(and_(*filters))
        
        # Order by creation date
        query = query.order_by(desc(Prompt.created_at))
        
        # Apply pagination
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        prompts = result.scalars().all()
        
        return [PromptResponse.from_orm(prompt) for prompt in prompts]
        
    except Exception as e:
        logger.error(f"Failed to get prompts: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve prompts"
        )

@router.get("/{prompt_id}", response_model=PromptResponse)
async def get_prompt(
    prompt_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific prompt by ID"""
    try:
        result = await db.execute(select(Prompt).where(Prompt.id == prompt_id))
        prompt = result.scalar_one_or_none()
        
        if not prompt:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Prompt not found"
            )
        
        # Check access permissions
        if prompt.user_id != current_user.id and not prompt.is_public:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        return PromptResponse.from_orm(prompt)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get prompt {prompt_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve prompt"
        )

@router.post("/", response_model=PromptResponse)
async def create_prompt(
    prompt_data: PromptCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new prompt"""
    try:
        # Create prompt
        prompt = Prompt(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            text=prompt_data.text,
            reference_images=prompt_data.reference_images or [],
            parameters=prompt_data.parameters or {},
            tags=prompt_data.tags or [],
            is_public=prompt_data.is_public,
            usage_count=0
        )
        
        db.add(prompt)
        await db.commit()
        await db.refresh(prompt)
        
        logger.info(f"Prompt created by user {current_user.email}: {prompt.id}")
        return PromptResponse.from_orm(prompt)
        
    except Exception as e:
        logger.error(f"Failed to create prompt: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create prompt"
        )

@router.put("/{prompt_id}", response_model=PromptResponse)
async def update_prompt(
    prompt_id: str,
    prompt_data: PromptUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a prompt"""
    try:
        result = await db.execute(select(Prompt).where(Prompt.id == prompt_id))
        prompt = result.scalar_one_or_none()
        
        if not prompt:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Prompt not found"
            )
        
        # Check ownership
        if prompt.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Update fields
        update_data = prompt_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(prompt, field, value)
        
        await db.commit()
        await db.refresh(prompt)
        
        logger.info(f"Prompt updated by user {current_user.email}: {prompt_id}")
        return PromptResponse.from_orm(prompt)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update prompt {prompt_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update prompt"
        )

@router.delete("/{prompt_id}")
async def delete_prompt(
    prompt_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a prompt"""
    try:
        result = await db.execute(select(Prompt).where(Prompt.id == prompt_id))
        prompt = result.scalar_one_or_none()
        
        if not prompt:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Prompt not found"
            )
        
        # Check ownership
        if prompt.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        await db.delete(prompt)
        await db.commit()
        
        logger.info(f"Prompt deleted by user {current_user.email}: {prompt_id}")
        return {"message": "Prompt deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete prompt {prompt_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete prompt"
        )

@router.post("/{prompt_id}/duplicate", response_model=PromptResponse)
async def duplicate_prompt(
    prompt_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Duplicate a prompt"""
    try:
        result = await db.execute(select(Prompt).where(Prompt.id == prompt_id))
        original_prompt = result.scalar_one_or_none()
        
        if not original_prompt:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Prompt not found"
            )
        
        # Check access permissions
        if original_prompt.user_id != current_user.id and not original_prompt.is_public:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Create duplicate
        duplicate_prompt = Prompt(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            text=original_prompt.text,
            reference_images=original_prompt.reference_images.copy(),
            parameters=original_prompt.parameters.copy(),
            tags=original_prompt.tags.copy(),
            is_public=False,  # Duplicates are private by default
            usage_count=0
        )
        
        db.add(duplicate_prompt)
        await db.commit()
        await db.refresh(duplicate_prompt)
        
        logger.info(f"Prompt duplicated by user {current_user.email}: {prompt_id} -> {duplicate_prompt.id}")
        return PromptResponse.from_orm(duplicate_prompt)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to duplicate prompt {prompt_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to duplicate prompt"
        )

@router.post("/{prompt_id}/use")
async def use_prompt(
    prompt_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Increment usage count for a prompt"""
    try:
        result = await db.execute(select(Prompt).where(Prompt.id == prompt_id))
        prompt = result.scalar_one_or_none()
        
        if not prompt:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Prompt not found"
            )
        
        # Check access permissions
        if prompt.user_id != current_user.id and not prompt.is_public:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Increment usage count
        prompt.usage_count += 1
        await db.commit()
        
        logger.info(f"Prompt usage incremented by user {current_user.email}: {prompt_id}")
        return {"message": "Usage count updated"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update prompt usage {prompt_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update usage count"
        )

@router.get("/search/", response_model=List[PromptResponse])
async def search_prompts(
    q: str = Query(..., min_length=1),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Search prompts by text content"""
    try:
        # Simple text search (can be enhanced with full-text search)
        query = select(Prompt).where(
            and_(
                or_(
                    Prompt.text.ilike(f"%{q}%"),
                    Prompt.tags.contains([q])
                ),
                or_(
                    Prompt.user_id == current_user.id,
                    Prompt.is_public == True
                )
            )
        ).order_by(desc(Prompt.usage_count), desc(Prompt.created_at))
        
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        prompts = result.scalars().all()
        
        return [PromptResponse.from_orm(prompt) for prompt in prompts]
        
    except Exception as e:
        logger.error(f"Failed to search prompts: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to search prompts"
        )

@router.get("/popular/", response_model=List[PromptResponse])
async def get_popular_prompts(
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get popular public prompts"""
    try:
        query = select(Prompt).where(
            and_(
                Prompt.is_public == True,
                Prompt.usage_count > 0
            )
        ).order_by(desc(Prompt.usage_count), desc(Prompt.created_at)).limit(limit)
        
        result = await db.execute(query)
        prompts = result.scalars().all()
        
        return [PromptResponse.from_orm(prompt) for prompt in prompts]
        
    except Exception as e:
        logger.error(f"Failed to get popular prompts: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve popular prompts"
        )
