# VoxelVerve Repository Map

## Project Overview
VoxelVerve is a real-time AI-powered text-to-3D model generator with progressive previews and game-ready outputs. This repository contains both frontend (Next.js 14) and backend (FastAPI) applications.

## Repository Structure

### Root Level
```
├── frontend/                 # Next.js 14 React application
├── backend/                  # FastAPI Python application
├── docs/                     # Project documentation
├── PROJECT_BRIEF            # Complete project specifications
├── PROMPT_DECLARATION       # Claude Code prompt instructions
└── README.md                # Main project readme
```

### Frontend Structure (`frontend/`)
```
frontend/
├── src/
│   ├── app/                 # Next.js 14 App Router pages
│   │   ├── layout.tsx       # Root layout with providers
│   │   ├── page.tsx         # Main studio page
│   │   └── globals.css      # Global styles and Tailwind
│   ├── components/          # Reusable React components
│   │   ├── ui/              # Base UI components (shadcn/ui)
│   │   ├── studio/          # Studio-specific components
│   │   └── providers.tsx    # Context providers
│   ├── lib/                 # Utility libraries and configurations
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Helper functions
│   └── styles/              # Additional styling
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

### Backend Structure (`backend/`)
```
backend/
├── app/
│   ├── api/                 # API endpoints
│   │   └── v1/
│   │       ├── api.py       # Main API router
│   │       └── endpoints/   # Individual endpoint modules
│   ├── core/                # Core application logic
│   │   ├── config.py        # Settings and configuration
│   │   ├── database.py      # Database connection
│   │   ├── security.py      # Authentication and security
│   │   └── events.py        # Application lifecycle events
│   ├── models/              # SQLAlchemy database models
│   ├── schemas/             # Pydantic schemas
│   ├── services/            # Business logic services
│   │   ├── ai/              # AI integration services
│   │   ├── geometry/        # 3D geometry processing
│   │   ├── textures/        # Texture generation
│   │   └── storage/         # File storage services
│   ├── workers/             # Background task workers
│   └── utils/               # Helper utilities
├── alembic/                 # Database migrations
├── tests/                   # Test files
├── main.py                  # Application entry point
├── requirements.txt         # Python dependencies
└── .env.example             # Environment variables template
```

### Documentation (`docs/`)
```
docs/
├── REPO_MAP.md             # This file - repository structure
├── API_SPEC.md             # API endpoints and schemas
├── CLAUDE.md               # Claude Code collaboration guide
└── PROMPT_DECLARATION.md   # Detailed prompt instructions
```

## Key Technologies

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **react-three-fiber** for 3D rendering
- **Zustand** for state management
- **React Query** for data fetching

### Backend
- **FastAPI** with async support
- **SQLAlchemy 2.0** for database ORM
- **PostgreSQL** with pgvector for vector storage
- **Redis** for caching and message queues
- **LangGraph** for AI agent orchestration
- **LangChain** for AI tool integration
- **Celery** for background tasks

## Development Workflow

### Frontend Development
1. Navigate to `frontend/` directory
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Access at `http://localhost:3000`

### Backend Development
1. Navigate to `backend/` directory
2. Create virtual environment: `python -m venv venv`
3. Install dependencies: `pip install -r requirements.txt`
4. Set up environment variables (copy `.env.example`)
5. Start development server: `uvicorn main:app --reload`
6. Access API docs at `http://localhost:8000/docs`

## File Editing Guidelines

### Editable Files
- All files in `frontend/src/` (except configuration files)
- All files in `backend/app/` (except core configuration)
- Documentation files in `docs/`

### Do Not Edit
- Configuration files (`package.json`, `requirements.txt`, etc.)
- Migration files in `alembic/`
- Environment files (`.env`)

### TODO Markers
Look for `TODO:` comments throughout the codebase for areas that need implementation:
- `TODO: Implement 3D viewer component`
- `TODO: Add WebSocket connection`
- `TODO: Implement AI agent pipeline`

## Component Responsibilities

### Frontend Components
- **StudioLayout**: Main application layout
- **Viewer3D**: 3D scene rendering and interaction
- **PromptPanel**: Text input and parameter controls
- **InspectorPanel**: Object properties and material editing
- **TimelinePanel**: Generation progress and checkpoints

### Backend Services
- **AIService**: OpenAI/Claude integration
- **GeometryService**: 3D mesh processing
- **TextureService**: PBR texture generation
- **ExportService**: Model export and optimization
- **WebSocketService**: Real-time communication

## Data Flow
1. User enters prompt in PromptPanel
2. Frontend sends request to backend API
3. Backend processes through LangGraph pipeline
4. Progress updates sent via WebSocket
5. 3D preview updates in real-time
6. Final model exported with provenance
