# Frontend Implementation Instructions

## Overview
This is the Next.js 14 frontend for VoxelVerve - a real-time AI-powered text-to-3D model generator. The application uses React 18, TypeScript, Tailwind CSS, and react-three-fiber for 3D rendering.

## Key Components to Implement

### 1. Providers (`src/components/providers.tsx`)
**TODO:** Implement the following providers:
- WebSocket context for real-time communication
- Zustand store for global state management
- React Query for API data fetching

### 2. Studio Components (`src/components/studio/`)
**TODO:** Complete the following components:

#### StudioLayout.tsx
- Add top navigation with user menu and project selector
- Add status bar with connection indicators
- Implement panel collapse/expand functionality

#### PromptPanel.tsx
- Connect to backend API for prompt submission
- Add reference image upload functionality
- Implement prompt template save/load
- Add validation and error handling

#### Viewer3D.tsx
- Implement 3D model loading and rendering
- Add transform controls (translate, rotate, scale)
- Implement camera presets and viewport controls
- Add progressive preview updates from WebSocket
- Implement material preview and editing

#### InspectorPanel.tsx
- Add scene hierarchy tree component
- Implement transform controls for selected objects
- Add PBR material property editing
- Implement texture slot management
- Add UV mapping controls

#### TimelinePanel.tsx
- Connect to WebSocket for real-time progress updates
- Implement checkpoint management
- Add timeline controls (play, pause, reset)
- Show generation stage progress

### 3. Hooks (`src/hooks/`)
**TODO:** Create the following custom hooks:
- `useWebSocket.ts` - WebSocket connection management
- `useStore.ts` - Zustand store for global state
- `useApi.ts` - API client with React Query
- `use3DViewer.ts` - 3D viewer state management

### 4. Types (`src/types/`)
**TODO:** Define TypeScript interfaces for:
- API request/response types
- 3D model data structures
- WebSocket message types
- Application state types

### 5. Utils (`src/utils/`)
**TODO:** Create utility functions for:
- API client configuration
- WebSocket message handling
- 3D model format conversion
- File upload/download

## Implementation Priority

### Phase 1: Core Infrastructure
1. Set up WebSocket context and connection management
2. Implement Zustand store for global state
3. Create API client with React Query
4. Add basic error handling and loading states

### Phase 2: 3D Viewer
1. Implement 3D model loading and rendering
2. Add basic camera controls and viewport
3. Connect to WebSocket for real-time updates
4. Add progressive preview functionality

### Phase 3: Studio Features
1. Complete prompt panel with API integration
2. Implement inspector panel with object properties
3. Add timeline with generation progress
4. Implement material and texture editing

### Phase 4: Advanced Features
1. Add UV mapping workspace
2. Implement export functionality
3. Add collaboration features
4. Implement advanced 3D controls

## Development Guidelines

### Code Style
- Use TypeScript strictly with proper type definitions
- Follow React 18 best practices with hooks
- Use Tailwind CSS for styling with custom studio theme
- Implement proper error boundaries and loading states

### Performance
- Implement code splitting for heavy components
- Use React.memo for expensive 3D components
- Optimize WebSocket message handling
- Implement proper cleanup for 3D resources

### Accessibility
- Add proper ARIA labels and roles
- Implement keyboard navigation
- Add high contrast mode support
- Ensure screen reader compatibility

## Testing Strategy
- Unit tests for utility functions and hooks
- Integration tests for API communication
- E2E tests for critical user flows
- Performance testing for 3D rendering

## Deployment
- Configure environment variables for API endpoints
- Set up proper build optimization
- Implement proper error tracking
- Configure CDN for static assets
