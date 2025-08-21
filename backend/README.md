# VoxelVerve Backend

Real-time AI-powered text-to-3D model generator backend built with FastAPI, LangGraph, and WebSockets.

## Features

- 🚀 **FastAPI** - High-performance async API framework
- 🤖 **AI Integration** - OpenAI/Claude with LangGraph orchestration
- 🔄 **Real-time** - WebSocket-powered live updates
- 🎯 **3D Processing** - GPU-accelerated geometry and texture operations
- 🗄️ **Database** - PostgreSQL with pgvector for vector storage
- 🔐 **Authentication** - JWT-based auth with RBAC
- 📦 **Storage** - S3 integration for file management

## Tech Stack

- **Framework**: FastAPI with async support
- **Database**: PostgreSQL with pgvector
- **Cache**: Redis for sessions and message queues
- **AI**: LangGraph, LangChain, OpenAI, Claude
- **3D Processing**: PyTorch, Open3D, Trimesh
- **Storage**: AWS S3
- **Background Tasks**: Celery with Redis

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL with pgvector extension
- Redis
- GPU (optional, for 3D processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-real-time-powered-text-to-3d-model-generator/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Set up database**
   ```bash
   # Create PostgreSQL database with pgvector
   createdb voxelverve
   # Run migrations (when implemented)
   # alembic upgrade head
   ```

6. **Start development server**
   ```bash
   uvicorn main:app --reload
   ```

7. **Access API documentation**
   Navigate to [http://localhost:8000/docs](http://localhost:8000/docs)

## Development

### Available Scripts

- `uvicorn main:app --reload` - Start development server
- `pytest` - Run tests
- `black .` - Format code
- `isort .` - Sort imports
- `flake8 .` - Lint code
- `mypy .` - Type checking

### Project Structure

```
app/
├── api/                 # API endpoints
│   └── v1/
│       ├── api.py      # Main API router
│       └── endpoints/  # Individual endpoint modules
├── core/               # Core application logic
│   ├── config.py      # Settings and configuration
│   ├── database.py    # Database connection
│   ├── security.py    # Authentication and security
│   └── events.py      # Application lifecycle events
├── models/            # SQLAlchemy database models
├── schemas/           # Pydantic schemas
├── services/          # Business logic services
│   ├── ai/           # AI integration services
│   ├── geometry/     # 3D geometry processing
│   ├── textures/     # Texture generation
│   └── storage/      # File storage services
└── workers/          # Background task workers
```

### Key Components

- **API Endpoints** - REST and WebSocket endpoints
- **AI Services** - LangGraph pipeline and AI integration
- **3D Processing** - Geometry and texture operations
- **Database Models** - SQLAlchemy ORM models
- **Background Workers** - GPU-accelerated processing

## Configuration

### Environment Variables

Copy `env.example` to `.env` and configure:

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost/voxelverve
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=voxelverve

# Redis
REDIS_URL=redis://localhost:6379

# AI Services
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
S3_BUCKET=voxelverve-assets
```

### Database Setup

1. **Install PostgreSQL with pgvector**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   # Install pgvector extension
   ```

2. **Create database**
   ```bash
   createdb voxelverve
   psql voxelverve -c "CREATE EXTENSION vector;"
   ```

3. **Run migrations**
   ```bash
   alembic upgrade head
   ```

## API Documentation

### Authentication

Most endpoints require JWT authentication:

```bash
# Login
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Use token in subsequent requests
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8000/api/v1/prompts/"
```

### Key Endpoints

- `POST /api/v1/prompts/` - Create generation prompt
- `POST /api/v1/runs/` - Start generation run
- `GET /api/v1/runs/{run_id}` - Get run status
- `WS /api/v1/ws/runs/{run_id}` - Real-time updates
- `POST /api/v1/exports/` - Export model

### WebSocket Messages

```json
{
  "type": "progress",
  "data": {
    "stage": "geometry_generation",
    "progress": 0.75,
    "message": "Generating mesh..."
  }
}
```

## AI Pipeline

The AI pipeline uses LangGraph for orchestration:

1. **Planning** - Analyze prompt and create generation plan
2. **Geometry Generation** - Create 3D mesh from text
3. **UV Unwrapping** - Generate texture coordinates
4. **Texture Baking** - Create PBR textures
5. **Optimization** - Optimize for target platform
6. **Export** - Generate final model

## 3D Processing

### Geometry Operations

- **Mesh Generation** - AI-powered 3D model creation
- **UV Unwrapping** - Texture coordinate generation
- **Optimization** - LOD generation and compression
- **Validation** - Watertight and manifold checks

### Texture Operations

- **PBR Baking** - Generate PBR texture maps
- **AI Generation** - AI-powered texture creation
- **Optimization** - Compression and format conversion
- **Packing** - Texture atlas generation

## Development Guidelines

### Code Style

- Use Python 3.11+ features
- Follow FastAPI best practices
- Use async/await for I/O operations
- Implement proper error handling

### Database

- Use SQLAlchemy 2.0 async patterns
- Implement proper migrations
- Use pgvector for vector storage
- Add database connection pooling

### Security

- Implement proper JWT management
- Add rate limiting
- Use environment variables for secrets
- Implement proper CORS

## Testing

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_api.py
```

### Test Structure

- **Unit Tests** - Individual function testing
- **Integration Tests** - API endpoint testing
- **E2E Tests** - Complete workflow testing

## Deployment

### Production Setup

1. **Set production environment variables**
2. **Configure database and Redis**
3. **Set up GPU workers**
4. **Configure S3 storage**
5. **Set up monitoring and logging**

### Docker Deployment

```bash
# Build image
docker build -t voxelverve-backend .

# Run container
docker run -p 8000:8000 voxelverve-backend
```

### GPU Workers

For 3D processing, set up GPU worker containers:

```bash
# Run GPU worker
docker run --gpus all voxelverve-worker
```

## Monitoring

### Health Checks

- `GET /health` - Application health
- `GET /api/v1/health` - API health
- Database connection monitoring
- Redis connection monitoring

### Logging

- Structured logging with JSON format
- Request/response logging
- Error tracking with Sentry
- Performance monitoring

## Contributing

1. Follow the coding guidelines
2. Add tests for new features
3. Update documentation
4. Ensure security best practices

## License

See the main project LICENSE file.
