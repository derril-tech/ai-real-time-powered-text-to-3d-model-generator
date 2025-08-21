# CLAUDE.md — Collaboration & Editing Guidelines

This document is Claude's onboarding guide.  
It defines the **purpose of the project, coding conventions, editing rules, and collaboration workflow**.  
Claude should always respect these boundaries when generating code.

---

## 📌 Project Overview
- **Name:** VoxelVerve - AI-Powered Text-to-3D Model Generator
- **Purpose:** Real-time text-to-3D creation studio that transforms natural language descriptions into game-ready 3D models with progressive previews, PBR textures, and provenance tracking.
- **Target Users:** 3D artists, game developers, content creators, and designers who need rapid 3D asset generation
- **Goals:** Provide a professional-grade 3D creation tool with AI-powered generation, real-time collaboration, and game-ready outputs
- **Tech Stack:**  
  - Frontend: Next.js 14 + React 18 + TypeScript + Tailwind CSS + react-three-fiber
  - Backend: FastAPI + SQLAlchemy 2.0 + PostgreSQL + pgvector + Redis + LangGraph
  - Services: OpenAI + Claude + AWS S3 + GPU Workers  

---

## 📂 Folder & File Structure
- **frontend/** → Next.js 14 React application with 3D viewer and studio interface
- **backend/** → FastAPI application with AI pipeline and 3D processing
- **docs/** → Project documentation (`REPO_MAP.md`, `API_SPEC.md`, `PROMPT_DECLARATION.md`, `CLAUDE.md`)
- **scripts/** → Development and deployment scripts
- **PROJECT_BRIEF** → Complete project specifications and 8-step implementation plan  

### Editable by Claude
- `frontend/src/**/*` (except `_INSTRUCTIONS.md`)  
- `backend/app/**/*` (except migrations unless asked)  
- Tests in `frontend/tests/` and `backend/tests/`  
- Documentation updates (with approval)

### Do Not Touch
- Lockfiles (`package-lock.json`, `poetry.lock`, etc.)  
- CI/CD configs (`.github/workflows/*`) unless explicitly requested  
- Auto-generated code or migrations  
- Environment files (`.env.example` is template only)
- Docker configurations unless specifically asked
- This file (`CLAUDE.md`) without explicit permission

---

## 🎨 Coding Conventions
- **Languages:** TypeScript (frontend), Python 3.11+ (backend)
- **Style Guides:**  
  - Frontend: ESLint + TypeScript strict mode + Prettier
  - Backend: Black + isort + flake8 (PEP8) + mypy
- **Naming:**  
  - Components: `PascalCase` (e.g., `StudioLayout`, `Viewer3D`)
  - Variables: `camelCase` (TS), `snake_case` (Python)
  - Files: `kebab-case` for components, `snake_case` for utilities
  - Constants: `UPPER_SNAKE_CASE`
- **Commenting:**  
  - Document public components, functions, and non-obvious logic
  - Use `// TODO:` or `# TODO:` for clear tasks
  - Add JSDoc comments for complex functions
  - Include type annotations for all function parameters and returns

---

## 🤝 AI Collaboration Rules
- Always respond with **full file rewrites** if >30 lines are changed.  
- Keep responses **concise in explanation, complete in code**.  
- Never remove error handling, logging, or comments unless replacing them with better versions.  
- Preserve imports and typing.  
- If ambiguity arises:  
  1. Ask up to **2 clarifying questions**  
  2. If unanswered, proceed with best guess and note assumptions
- **Always include error boundaries and loading states** for async operations
- **Follow the established patterns** in existing code (naming, structure, error handling)

---

## ✍️ Editing Rules
- **Editable Files:** All app source code under `frontend/src/` and `backend/app/`  
- **Avoid:** lockfiles, auto-generated files, CI configs, environment files
- **Format of Responses:**  
  - Full file rewrites for large changes  
  - Patches (with clear diff context) for small fixes
  - Always include file path in response
- **Error Handling:** must remain in place at all times
- **Type Safety:** Maintain strict TypeScript and Python type checking
- **Performance:** Consider bundle size, memory usage, and rendering performance

---

## 📦 Project Dependencies
- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, react-three-fiber, Zustand, React Query, lucide-react
- **Backend:** FastAPI, SQLAlchemy 2.0, Pydantic v2, PostgreSQL, pgvector, Redis, LangGraph, LangChain
- **Services:** OpenAI, Claude, AWS S3, GPU Workers (PyTorch, Open3D, Trimesh)
- **Environment:**  
  - Variables in `env.example` files must be respected
  - Secrets should never be hardcoded
  - Use environment-specific configurations
  - Always validate environment variables on startup

---

## 🛠️ Workflow & Tools
- **Run locally:**  
  - Frontend: `npm run dev` (http://localhost:3000)
  - Backend: `uvicorn main:app --reload` (http://localhost:8000)
  - Full stack: `./scripts/dev.sh` (runs both simultaneously)
- **FE ↔ BE boundary:** REST JSON via `/api/v1/*` + WebSocket for real-time updates
- **Testing:**  
  - Frontend: Jest + React Testing Library + Playwright
  - Backend: pytest + pytest-asyncio + pytest-cov
- **CI/CD:** GitHub Actions (lint, type-check, test, build, security scan)
- **Deployment:** Vercel (Frontend) + Render/Docker (Backend) + GPU Workers
- **Development:** Docker Compose for local database and services

---

## 📚 Contextual Knowledge
- **Design System:** Studio theme with dark colors (`studio-primary`, `studio-secondary`, `studio-accent`, `studio-highlight`, `studio-surface`, `studio-border`)
- **Domain Rules:** 
  - 3D models must be watertight and manifold
  - PBR materials require specific texture maps (albedo, normal, roughness, metallic)
  - Generation pipeline: Planning → Geometry → UV → Textures → Optimization → Export
  - Real-time updates via WebSocket for progressive previews
  - Human-in-the-loop approvals for quality control
- **Scaffolding Rules:** Follow the 8-step implementation plan in PROJECT_BRIEF
- **UX Principles:** 
  - Studio-grade interface for professional 3D work
  - Accessibility (WCAG 2.1 AA) with keyboard navigation
  - Empty/loading/error states for all async operations
  - Mobile-first responsive design
  - Performance budgets: <2MB bundle, <3s TTI, 60fps rendering

---

## 🔒 Security & Compliance
- **Authentication:** JWT tokens with refresh mechanism
- **Authorization:** Role-based access control (RBAC)
- **Input Validation:** Pydantic schemas for all API endpoints
- **Data Protection:** Encryption at rest and in transit
- **Content Safety:** Similarity checks, IP protection, content filtering
- **Audit Logging:** All user actions and system changes logged
- **Rate Limiting:** 100 req/min per user, 1000/min per IP

---

## 🧪 Testing Requirements
- **Frontend:** >80% line coverage, >70% branch coverage
- **Backend:** >85% line coverage, >75% branch coverage
- **Critical Paths:** 100% coverage for auth, generation, exports
- **Test Types:** Unit, integration, E2E, visual regression, performance
- **Error Scenarios:** Network failures, invalid inputs, edge cases
- **Accessibility:** Screen reader compatibility, keyboard navigation

---

## 🚀 Performance Guidelines
- **Frontend Performance:**
  - Bundle size: <2MB initial, <500KB per route
  - Time to Interactive: <3s on 3G
  - 3D Rendering: 60fps on mid-range devices
  - Memory: <512MB for complex scenes
- **Backend Performance:**
  - API response: <200ms for CRUD operations
  - Generation pipeline: <5 minutes
  - WebSocket latency: <100ms
  - Database queries: <50ms
- **Optimization Strategies:**
  - Code splitting and lazy loading
  - Caching (Redis, browser)
  - Compression (Gzip, Draco, WebP)
  - CDN for static assets

---

## 📋 Implementation Checklist
When implementing new features, ensure:
- [ ] TypeScript strict mode compliance
- [ ] Error boundaries and loading states
- [ ] Accessibility attributes (aria-labels, roles)
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Unit tests with good coverage
- [ ] Documentation and comments
- [ ] Security considerations
- [ ] Environment variable validation
- [ ] Logging and monitoring hooks

---

## ✅ Examples

**Good Answer Example**
```tsx
// Good: Full file rewrite, assumptions stated, comments kept, error handling included
import { useEffect, useState } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useApi } from "@/hooks/useApi";
import { GenerationRun, GenerationStatus } from "@/types";

interface GenerationProgressProps {
  runId: string;
  onComplete?: (result: GenerationRun) => void;
  onError?: (error: Error) => void;
}

export default function GenerationProgress({ 
  runId, 
  onComplete, 
  onError 
}: GenerationProgressProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  
  const { data: runData, isLoading, error: apiError } = useApi(`/runs/${runId}`);
  const { sendMessage, lastMessage, isConnected } = useWebSocket(`/ws/runs/${runId}`);

  useEffect(() => {
    if (lastMessage?.type === "progress") {
      setProgress(lastMessage.data.progress);
      setStage(lastMessage.data.stage);
    } else if (lastMessage?.type === "complete") {
      onComplete?.(lastMessage.data);
    } else if (lastMessage?.type === "error") {
      const error = new Error(lastMessage.data.message);
      setError(error.message);
      onError?.(error);
    }
  }, [lastMessage, onComplete, onError]);

  useEffect(() => {
    if (apiError) {
      setError(apiError.message);
      onError?.(apiError);
    }
  }, [apiError, onError]);

  if (isLoading) {
    return (
      <div className="studio-panel" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-studio-accent mx-auto mb-2"></div>
        <div className="text-sm text-studio-primary">Loading generation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="studio-panel" role="alert">
        <div className="text-sm font-medium text-studio-error mb-2">Generation Error</div>
        <div className="text-xs text-studio-error/80">{error}</div>
      </div>
    );
  }

  return (
    <div className="studio-panel">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-studio-primary">Generation Progress</div>
        <div className="text-xs text-studio-primary/60">
          {isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>
      <div className="w-full h-2 bg-studio-surface rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-studio-accent to-studio-highlight transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
          role="progressbar"
          aria-valuenow={progress * 100}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className="text-xs text-studio-primary/60 mt-1">{stage}</div>
    </div>
  );
}
    } else if (lastMessage?.type === "complete") {
      onComplete?.(lastMessage.data);
    } else if (lastMessage?.type === "error") {
      const error = new Error(lastMessage.data.message);
      setError(error.message);
      onError?.(error);
    }
  }, [lastMessage, onComplete, onError]);

  useEffect(() => {
    if (apiError) {
      setError(apiError.message);
      onError?.(apiError);
    }
  }, [apiError, onError]);

  if (isLoading) {
    return (
      <div className="studio-panel" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-studio-accent mx-auto mb-2"></div>
        <div className="text-sm text-studio-primary">Loading generation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="studio-panel" role="alert">
        <div className="text-sm font-medium text-studio-error mb-2">Generation Error</div>
        <div className="text-xs text-studio-error/80">{error}</div>
      </div>
    );
  }

  return (
    <div className="studio-panel">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-studio-primary">Generation Progress</div>
        <div className="text-xs text-studio-primary/60">
          {isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>
      <div className="w-full h-2 bg-studio-surface rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-studio-accent to-studio-highlight transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
          role="progressbar"
          aria-valuenow={progress * 100}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className="text-xs text-studio-primary/60 mt-1">{stage}</div>
    </div>
  );
}
```

**Bad Answer Example**
```tsx
// Bad: Missing error handling, no loading states, hardcoded values, no accessibility
export default function GenerationProgress({ runId }) {
  return (
    <div>
      <div>Progress: 50%</div>
      <div>Stage: Generating</div>
    </div>
  );
}
```

---

## 🎯 Success Criteria
- **Functional:** End-to-end generation pipeline working
- **Performance:** Meets all performance budgets
- **Quality:** High test coverage, accessibility compliance
- **Security:** All security requirements implemented
- **User Experience:** Intuitive, responsive, accessible interface
- **Maintainability:** Clean, documented, well-structured code

---

## 📞 Communication Protocol
- **Questions:** Ask specific, actionable questions
- **Assumptions:** State assumptions clearly when making decisions
- **Trade-offs:** Explain technical decisions and their implications
- **Progress:** Provide status updates for complex implementations
- **Issues:** Flag potential problems early with suggested solutions

This guide ensures Claude can effectively collaborate on the VoxelVerve project while maintaining code quality, security, and performance standards.



