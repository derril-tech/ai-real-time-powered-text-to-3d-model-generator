# Backend Implementation Instructions

## Overview
This is the FastAPI backend for VoxelVerve - a real-time AI-powered text-to-3D model generator. The application uses Python 3.11, SQLAlchemy 2.0, LangGraph for AI orchestration, and WebSockets for real-time communication.

## Key Components to Implement

### 1. Core Services (`app/core/`)
**TODO:** Complete the following core modules:

#### config.py ✅
- Already implemented with environment variables
- Add additional configuration for AI services

#### database.py
- Implement async SQLAlchemy 2.0 setup
- Add database connection pooling
- Implement migration management

#### security.py
- Implement JWT token creation and validation
- Add password hashing with bcrypt
- Implement RBAC (Role-Based Access Control)
- Add rate limiting middleware

#### events.py
- Implement application startup/shutdown handlers
- Add database connection management
- Implement background task initialization

### 2. Models (`app/models/`)
**TODO:** Create SQLAlchemy models for:
- User (authentication and user management)
- Prompt (text prompts and parameters)
- Run (generation runs and status)
- Mesh (3D geometry data)
- Texture (PBR texture data)
- Export (exported models and metadata)
- Checkpoint (generation checkpoints)

### 3. Services (`app/services/`)
**TODO:** Implement the following service layers:

#### ai/ (`app/services/ai/`)
- **AIService**: OpenAI/Claude integration
- **LangGraphService**: Agent orchestration pipeline
- **RAGService**: Vector search and retrieval
- **PlanningService**: Prompt analysis and planning

#### geometry/ (`app/services/geometry/`)
- **GeometryService**: 3D mesh processing
- **UVService**: UV unwrapping operations
- **OptimizationService**: Mesh optimization and LOD generation
- **ValidationService**: Mesh validation and quality checks

#### texture/ (`app/services/texture/`)
- **TextureService**: PBR texture generation
- **BakingService**: Texture baking from high-poly meshes
- **OptimizationService**: Texture compression and optimization
- **GenerationService**: AI-powered texture generation

#### storage/ (`app/services/storage/`)
- **S3Service**: AWS S3 file storage
- **LocalStorageService**: Local file storage for development
- **CDNService**: Content delivery network integration

### 4. Workers (`app/workers/`)
**TODO:** Implement background task workers:
- **GeometryWorker**: GPU-accelerated geometry processing
- **TextureWorker**: GPU-accelerated texture operations
- **ExportWorker**: Model export and optimization
- **CleanupWorker**: Temporary file cleanup

### 5. API Endpoints (`app/api/v1/endpoints/`)
**TODO:** Complete the following endpoint implementations:

#### auth.py ✅
- Implement actual JWT authentication
- Add user registration and management
- Implement refresh token logic

#### prompts.py ✅
- Connect to database models
- Add validation and error handling
- Implement prompt templates

#### runs.py ✅
- Implement LangGraph pipeline integration
- Add WebSocket progress updates
- Implement run cancellation

#### geometry.py ✅
- Connect to GPU workers
- Add mesh validation
- Implement optimization algorithms

#### textures.py ✅
- Connect to texture generation services
- Add PBR material support
- Implement texture packing

#### exports.py ✅
- Add multiple format support
- Implement provenance tracking
- Add batch export functionality

#### websocket.py ✅
- Implement proper connection management
- Add message queuing
- Implement error handling and reconnection

## Implementation Priority

### Phase 1: Core Infrastructure
1. Set up database models and migrations
2. Implement authentication and authorization
3. Create basic API endpoints with database integration
4. Set up WebSocket connection management

### Phase 2: AI Integration
1. Implement LangGraph pipeline for generation
2. Add OpenAI/Claude integration
3. Implement RAG for style guides and references
4. Add progressive generation with checkpoints

### Phase 3: 3D Processing
1. Implement geometry generation pipeline
2. Add UV unwrapping and texture baking
3. Implement mesh optimization and LOD generation
4. Add validation and quality checks

### Phase 4: Advanced Features
1. Implement GPU worker system
2. Add batch processing capabilities
3. Implement export and optimization
4. Add monitoring and analytics

## Development Guidelines

### Code Style
- Use Python 3.11+ features and type hints
- Follow FastAPI best practices
- Use async/await for all I/O operations
- Implement proper error handling and logging

### Database
- Use SQLAlchemy 2.0 async patterns
- Implement proper migrations with Alembic
- Add database connection pooling
- Use pgvector for vector storage

### Security
- Implement proper JWT token management
- Add rate limiting and request validation
- Use environment variables for secrets
- Implement proper CORS configuration

### Performance
- Use async operations for all I/O
- Implement proper caching with Redis
- Use background workers for heavy tasks
- Optimize database queries

## Testing Strategy
- Unit tests for all services
- Integration tests for API endpoints
- E2E tests for complete workflows
- Performance testing for 3D operations

## Deployment
- Set up Docker containers for services
- Configure GPU worker containers
- Implement proper monitoring and logging
- Set up CI/CD pipeline

## Environment Setup
- PostgreSQL with pgvector extension
- Redis for caching and message queues
- AWS S3 for file storage
- GPU instances for 3D processing
