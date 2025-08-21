# VoxelVerve - AI-Powered Text-to-3D Model Generator
## Prompt Declaration for Claude Code

### Project Overview
VoxelVerve is a real-time text-to-3D creation studio generating progressive previews (point cloud → gaussian splats → mesh) that refine into game-ready, PBR-textured models using AI agents with human-in-the-loop approvals.

**Target Users**: 3D artists, game developers, AR/VR creators, product designers
**Core Value**: Sketch-to-asset in minutes with reproducible seeds and deterministic checkpoints

---

## Frontend Architecture

### Core Stack
- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **3D Rendering**: react-three-fiber, drei, three.js
- **State Management**: Zustand (global state), React Query (server state)
- **Real-time**: WebSocket, Socket.IO for live updates

### Key Components
- **Viewer**: WebGL2/WebGPU renderer with HDRI lighting, orbit/fly cameras, gizmos
- **Scene Graph Panel**: Objects/materials/LODs/UV sets with outliner and properties inspector
- **Prompt & Params**: Brief editor with style tokens, poly budget slider, topology constraints
- **Material & Texture UI**: Channel packing (ORM/AO), tiling/offset, normal space controls
- **UV Workspace**: Unwrap preview, seam painting, texel density visualizer
- **Safety & Provenance UI**: Similarity meters, policy warnings, citation panel
- **Collaboration**: Multi-cursor presence, comments pinned to faces/regions

### Performance & Accessibility
- **Internationalization**: i18n support
- **Accessibility**: WCAG 2.1 AA, keyboard shortcuts, high-contrast modes
- **Performance**: Code-split editors, SSR for marketing, SPA for studio
- **Exports**: GLB/gLTF/USDZ with drag-drop to DCC, one-click Sketchfab upload

---

## Backend Architecture

### Core Services
- **Framework**: FastAPI (async), Python 3.11, SQLAlchemy 2.0 (async), Pydantic v2
- **Database**: PostgreSQL + pgvector for embeddings, Redis for queues/caching
- **AI Pipeline**: LangGraph (agent orchestration), LangChain (tools/RAG)
- **3D Processing**: PyTorch, Kaolin, PyTorch3D, Open3D, Trimesh, xatlas
- **Deployment**: Docker, Kubernetes, GPU worker pods

### AI Pipeline Stages (LangGraph)
1. **Plan**: Parse natural-language briefs into structured constraints
2. **CoarseGen**: Generate coarse geometry (implicit fields or splats)
3. **MeshRecon**: Convert to watertight mesh with marching cubes/dual contouring
4. **UVUnwrap**: Generate texture coordinates with xatlas/OpenMesh
5. **TextureBake**: Create PBR texture maps (albedo, normal, roughness, metallic, AO)
6. **QA & Safety**: Validate quality, run similarity/IP checks
7. **Optimize**: Generate LODs, compress geometry (meshopt/Draco)
8. **Export**: Package for target formats (GLB/gLTF/USDZ/FBX/OBJ)
9. **Publish**: Final validation and deployment

### Data Model
- **Core Entities**: tenants, users, projects, scenes, prompts, runs, checkpoints
- **3D Assets**: meshes, materials, textures, LODs, UV maps, references
- **Metadata**: exports, audits, citations, provenance bundles

---

## Frontend/Backend Boundaries

### Frontend Responsibilities
- UI Components, state management, user interactions
- 3D Rendering with react-three-fiber, progressive previews
- Real-time WebSocket updates, progress streaming
- Client-side validation, file uploads
- Performance optimization, code splitting

### Backend Responsibilities
- AI Pipeline orchestration (LangGraph), model inference
- Data persistence, file storage, caching
- Authentication (JWT), RBAC, session management
- External APIs (OpenAI/Claude), cloud storage
- Security, input validation, audit logging

### Data Contracts
```typescript
interface GenerationRequest {
  prompt: string
  parameters: GenerationParameters
  referenceImages?: string[]
  style?: string
}

interface GenerationResponse {
  id: string
  status: GenerationStatus
  progress: number
  currentStage: string
  result?: GenerationResult
  error?: string
}

interface GenerationResult {
  meshUrl: string
  textureUrls: TextureUrls
  metadata: ModelMetadata
  provenance: ProvenanceBundle
  safety: SafetyReport
}
```

---

## Design Requirements

### Layout & UX
- **Creation-first Layout**: Left prompt pane, center 3D viewport, right inspector, bottom timeline
- **Neutral Studio-grade Palette**: Subtle micro-interactions, hover wireframes, seam highlights
- **Dark/Light Themes**: Optimized for long sessions, type scale for inspectors
- **Clear Affordances**: Scale/units, PBR channel meanings, export targets

### Color Palette
```css
--studio-primary: #1a1a1a
--studio-secondary: #2a2a2a
--studio-surface: #0f0f0f
--studio-border: #404040
--studio-accent: #6366f1
--studio-highlight: #8b5cf6
--studio-success: #10b981
--studio-warning: #f59e0b
--studio-error: #ef4444
```

### Interaction Patterns
- Drag & drop for reference images and model exports
- Keyboard shortcuts (Ctrl+S save, Ctrl+Z undo, Escape clear selection)
- Context menus for object operations, multi-select with Shift+click
- Camera controls (orbit, pan, zoom) with mouse/touch

---

## Core Integrations

### AI Services
- **OpenAI + Claude**: Via LangChain for planning, parameter extraction, tool calling
- **RAG System**: Over style guides, shader docs, asset taxonomy, customer ref libraries
- **Structured Outputs**: JSON I/O for graph nodes, deterministic flows

### 3D Engines & Libraries
- **PyTorch Ecosystem**: Kaolin, PyTorch3D, Open3D for geometry processing
- **Mesh Processing**: Trimesh, xatlas for UV unwrapping, FFmpeg for texture packing
- **Compression**: meshopt/Draco for geometry, WebP for images

### Cloud Services
- **Storage**: AWS S3/GCS with signed URLs, CloudFront CDN
- **Email**: SendGrid/SES for notifications and approvals
- **Monitoring**: Sentry, DataDog, Prometheus for observability

---

## Performance Budgets

### Frontend
- Bundle size: < 2MB initial, < 500KB per route
- Time to Interactive: < 3s on 3G
- 3D Rendering: 60fps on mid-range devices
- Memory: < 512MB for complex scenes

### Backend
- API response: < 200ms for CRUD
- Generation pipeline: < 5 minutes
- WebSocket latency: < 100ms
- Database queries: < 50ms

### Optimization Strategies
- Code splitting (route-based and component-based)
- Lazy loading for 3D models, textures, heavy components
- Caching (Redis for API responses, browser caching for assets)
- Compression (Gzip for text, Draco for geometry, WebP for images)

---

## Security & Compliance

### Authentication & Authorization
- JWT tokens (15min access, 7-day refresh)
- RBAC roles: owner, admin, artist, reviewer, automation
- Rate limiting: 100 req/min per user, 1000/min per IP
- Session management with CSRF protection

### Data Protection
- AES-256 encryption at rest, TLS 1.3 in transit
- PII minimal collection, 30-day auto-deletion
- File uploads: virus scanning, MIME validation, 50MB limit
- Audit logging for all actions, data access, system changes

### IP Safety & Content Moderation
- Similarity checks vs reference corpus using embeddings
- Content filtering for unsafe/illegal requests, brand protection
- Provenance tracking (seeds, model versions, citations, audit trail)
- Export controls with license metadata, usage restrictions

### API Security
- Input validation with Pydantic schemas, SQL injection prevention
- CORS policy with whitelisted origins, credentials handling
- WebSocket security with authentication headers, connection limits
- Error handling without sensitive data exposure

---

## Testing Expectations

### Frontend Testing
- Unit tests: components, utilities, hooks
- Integration tests: API interactions, state management
- E2E tests: critical user journeys, 3D interactions
- Visual regression testing with component snapshots
- Performance benchmarks for bundle analysis, rendering

### Backend Testing
- Unit tests: services, utilities
- Integration tests: database, external APIs
- API tests: endpoints, error handling
- Load tests: concurrent users, generation pipeline
- Security tests: auth, validation, input sanitization

### AI Pipeline Testing
- Model validation: output quality, consistency checks
- Pipeline testing: end-to-end generation workflows
- Safety testing: content filtering, similarity detection
- Performance testing: generation time, resource usage

### Coverage Requirements
- Frontend: > 80% line, > 70% branch
- Backend: > 85% line, > 75% branch
- Critical paths: 100% coverage for auth, generation, exports

---

## Implementation Guidelines

### Code Quality Standards
- **TypeScript**: Strict mode, no any types, proper interfaces
- **ESLint**: Airbnb config, custom rules for project conventions
- **Prettier**: Consistent formatting, 2-space indentation
- **Git Hooks**: Pre-commit linting, type checking, tests

### Architecture Patterns
- **Component Design**: Atomic design principles, composition over inheritance
- **State Management**: Zustand for global state, React Query for server state
- **Error Boundaries**: Graceful error handling, user-friendly messages
- **Performance Monitoring**: Real User Monitoring (RUM), error tracking

### Development Workflow
- **Feature Branches**: Git flow, pull request reviews
- **Environment Management**: Development, staging, production configs
- **Deployment**: Automated CI/CD, blue-green deployments
- **Monitoring**: Application performance, error tracking, user analytics

---

## Success Criteria

### Functional Requirements
- ✅ End-to-end generation pipeline (prompt → GLB/USDZ)
- ✅ Real-time progressive previews (point cloud → splat → mesh)
- ✅ Human-in-the-loop approvals (mesh sign-off, texture sign-off, export sign-off)
- ✅ Export with provenance bundle (seeds, checkpoints, prompts, references)
- ✅ Similarity/IP safety checks with threshold policies

### Performance Requirements
- ✅ < 5 minutes generation time for standard quality
- ✅ 60fps 3D rendering on mid-range devices
- ✅ < 200ms API responses for CRUD operations
- ✅ < 2MB initial bundle size, < 500KB per route

### Quality Requirements
- ✅ Manifold & watertight meshes with proper topology
- ✅ Correct PBR texture packing (ORM/AO channels)
- ✅ Valid GLTF/GLB outputs passing validator
- ✅ WCAG 2.1 AA accessibility compliance

### Security Requirements
- ✅ JWT authentication with RBAC
- ✅ Input validation & sanitization
- ✅ Audit logging for all actions
- ✅ Content moderation and IP safety

---

## Claude Code Instructions

### Response Format
- TypeScript for frontend, Python for backend
- Proper error handling and validation
- JSDoc/type hints for complex functions
- Follow existing naming conventions

### Code Style
- Functional components with hooks
- Composition over inheritance
- Loading and error states
- Accessibility attributes (aria-labels, roles)

### Testing
- Unit tests for new components
- Integration tests for APIs
- Error boundary testing
- Accessibility validation

### Performance
- Proper memoization
- Lazy loading for heavy components
- Bundle size optimization
- 3D rendering optimization

---

## Editing Boundaries

### Do Not Modify
- package.json dependencies (without approval)
- Database schema migrations
- Authentication/authorization core logic
- Environment configuration files
- CI/CD pipeline configurations

### Safe to Modify
- React components and hooks
- API endpoint implementations
- UI styling and theming
- Business logic and services
- Test files and fixtures

### Requires Review
- Database schema changes
- External API integrations
- Security-related code
- Performance optimizations
- Third-party library additions

---

## Domain Rules

### 3D Model Generation
- Models must be manifold (no holes, proper topology)
- UV unwrapping should minimize seams and distortion
- PBR textures require proper channel packing (ORM/AO)
- LOD generation for performance optimization

### AI Pipeline Stages
1. **Planning**: Parse prompt, extract parameters, validate constraints
2. **Coarse Generation**: Create initial geometry (SDF/splats)
3. **Mesh Reconstruction**: Convert to watertight mesh
4. **UV Unwrapping**: Generate texture coordinates
5. **Texture Baking**: Create PBR texture maps
6. **QA & Safety**: Validate quality, check similarity
7. **Optimization**: Generate LODs, compress geometry
8. **Export**: Package for target formats

### Business Rules
- Users can only access their own prompts and generations
- Public prompts are visible to all authenticated users
- Generation runs are immutable once started
- Exports include full provenance and safety reports
- Similarity scores above threshold require manual review

---

## Examples

### Good Response
```typescript
interface GenerationProgressProps {
  runId: string
  onComplete?: (result: GenerationResult) => void
}

export function GenerationProgress({ runId, onComplete }: GenerationProgressProps) {
  const { data, error, isLoading } = useGenerationRun(runId)
  
  if (error) {
    return (
      <div role="alert" className="text-red-500">
        Generation failed: {error.message}
      </div>
    )
  }
  
  if (isLoading) {
    return <ProgressSpinner aria-label="Generating 3D model" />
  }
  
  return (
    <div className="space-y-4">
      <ProgressBar value={data.progress} />
      <StageIndicator currentStage={data.currentStage} />
    </div>
  )
}
```

### Bad Response
```typescript
export function GenerationProgress(props) {
  const data = useGenerationRun(props.runId)
  return (
    <div>
      <div>{data.progress}</div>
      <div>{data.stage}</div>
    </div>
  )
}
```

---

This prompt declaration provides Claude Code with comprehensive guidance for implementing the VoxelVerve application while maintaining code quality, security, and performance standards. The declaration is battle-tested and handoff-ready, ensuring perfect alignment between technical requirements and implementation guidelines.
