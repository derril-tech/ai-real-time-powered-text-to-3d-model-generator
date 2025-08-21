from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime
from app.models.user import UserRole

# Base User schema
class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    avatar: Optional[str] = None
    role: UserRole = UserRole.USER
    is_active: bool = True
    is_verified: bool = False
    preferences: Dict[str, Any] = Field(default_factory=dict)

# Create User schema
class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

# Update User schema
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    avatar: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None
    preferences: Optional[Dict[str, Any]] = None

# User preferences schema
class UserPreferences(BaseModel):
    theme: str = "dark"
    default_export_format: str = "glb"
    default_poly_budget: int = 10000
    notifications: Dict[str, bool] = Field(default_factory=dict)

# User response schema
class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

# User in DB schema (includes hashed password)
class UserInDB(UserResponse):
    hashed_password: str

# Login schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Token schema
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

# Token data schema
class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None

# Password change schema
class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)

# Password reset request schema
class PasswordResetRequest(BaseModel):
    email: EmailStr

# Password reset schema
class PasswordReset(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)
