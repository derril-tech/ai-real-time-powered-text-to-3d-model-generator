# VoxelVerve Frontend

Real-time AI-powered text-to-3D model generator frontend built with Next.js 14, React 18, and react-three-fiber.

## Features

- 🎨 **Studio-grade UI** - Professional 3D modeling interface
- 🔄 **Real-time Updates** - WebSocket-powered live generation progress
- 🎯 **3D Viewer** - Interactive 3D scene with camera controls
- 📝 **Prompt Panel** - Text-to-3D generation with parameter controls
- 🔧 **Inspector Panel** - Object properties and material editing
- ⏱️ **Timeline** - Generation progress and checkpoint management
- 🎨 **PBR Materials** - Full PBR material system with texture support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI**: React 18, TypeScript, Tailwind CSS
- **3D Rendering**: react-three-fiber, Three.js
- **State Management**: Zustand, React Query
- **Real-time**: WebSocket
- **Styling**: Tailwind CSS with custom studio theme

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-real-time-powered-text-to-3d-model-generator/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
src/
├── app/                 # Next.js 14 App Router pages
│   ├── layout.tsx      # Root layout with providers
│   ├── page.tsx        # Main studio page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── ui/            # Base UI components
│   ├── studio/        # Studio-specific components
│   └── providers.tsx  # Context providers
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── styles/            # Additional styling
```

### Key Components

- **StudioLayout** - Main application layout
- **Viewer3D** - 3D scene rendering and interaction
- **PromptPanel** - Text input and parameter controls
- **InspectorPanel** - Object properties and material editing
- **TimelinePanel** - Generation progress and checkpoints

## Configuration

### Environment Variables

Copy `env.example` to `.env.local` and configure:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Application Configuration
NEXT_PUBLIC_APP_NAME=VoxelVerve
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Tailwind Configuration

The project uses a custom studio theme with dark colors optimized for 3D work:

- `studio-primary` - Main background color
- `studio-secondary` - Panel backgrounds
- `studio-accent` - Interactive elements
- `studio-highlight` - Accent color
- `studio-surface` - Surface colors
- `studio-border` - Border colors

## API Integration

The frontend communicates with the backend via:

- **REST API** - For CRUD operations
- **WebSocket** - For real-time updates
- **File Upload** - For reference images

### API Endpoints

- `POST /api/v1/prompts/` - Create generation prompt
- `GET /api/v1/runs/{run_id}` - Get generation status
- `WS /api/v1/ws/runs/{run_id}` - Real-time updates

## 3D Rendering

The 3D viewer uses react-three-fiber with:

- **OrbitControls** - Camera navigation
- **Environment** - HDRI lighting
- **Grid** - Reference grid
- **Transform Controls** - Object manipulation
- **Progressive Loading** - Real-time model updates

## Development Guidelines

### Code Style

- Use TypeScript strictly
- Follow React 18 best practices
- Use Tailwind CSS for styling
- Implement proper error boundaries

### Performance

- Use React.memo for expensive components
- Implement code splitting
- Optimize 3D rendering
- Handle WebSocket reconnection

### Testing

- Unit tests for utilities and hooks
- Integration tests for API communication
- E2E tests for critical flows

## Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Environment Setup

1. Set production environment variables
2. Configure API endpoints
3. Set up CDN for static assets
4. Configure error tracking

### Deployment Platforms

- **Vercel** - Recommended for Next.js
- **Netlify** - Alternative option
- **Docker** - Container deployment

## Contributing

1. Follow the coding guidelines
2. Add tests for new features
3. Update documentation
4. Ensure accessibility compliance

## License

See the main project LICENSE file.
