# VoxelVerve - AI-Powered Text-to-3D Model Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Node.js 18+](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)

Real-time AI-powered text-to-3D creation studio with progressive previews and game-ready outputs.

## 🚀 Features

- **🎨 Text-to-3D Generation** - Transform natural language descriptions into 3D models
- **🔄 Real-time Previews** - Progressive rendering from point clouds to final meshes
- **🎯 Studio-grade UI** - Professional 3D modeling interface with intuitive controls
- **🤖 AI Orchestration** - LangGraph-powered pipeline with multiple AI agents
- **🎨 PBR Materials** - Full PBR material system with texture generation
- **📦 Game-ready Exports** - Optimized outputs for Unity, Unreal, WebGL
- **🔐 Provenance Tracking** - Complete audit trail with seeds and citations
- **⚡ GPU Acceleration** - Hardware-accelerated 3D processing

## 🏗️ Architecture

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **react-three-fiber** for 3D rendering
- **Tailwind CSS** with custom studio theme
- **WebSocket** for real-time updates

### Backend
- **FastAPI** with async support
- **LangGraph** for AI agent orchestration
- **PostgreSQL** with pgvector for vector storage
- **Redis** for caching and message queues
- **GPU Workers** for 3D processing

## 🛠️ Quick Start

### Prerequisites

- **Node.js 18+** and **npm**
- **Python 3.11+** and **pip**
- **PostgreSQL** with pgvector extension
- **Redis**
- **GPU** (optional, for 3D processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-real-time-powered-text-to-3d-model-generator.git
   cd ai-real-time-powered-text-to-3d-model-generator
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp env.example .env
   # Edit .env with your configuration
   uvicorn main:app --reload
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   cp env.example .env.local
   # Edit .env.local with your configuration
   npm run dev
   ```

4. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## 📖 Documentation

- **[Frontend README](frontend/README.md)** - Frontend setup and development
- **[Backend README](backend/README.md)** - Backend setup and development
- **[API Specification](docs/API_SPEC.md)** - Complete API documentation
- **[Repository Map](docs/REPO_MAP.md)** - Project structure overview
- **[Claude Guide](docs/CLAUDE.md)** - AI collaboration guidelines

## 🎯 Usage

### Creating a 3D Model

1. **Enter a description** in the prompt panel
   ```
   "bronze steampunk pocket watch with exposed gears"
   ```

2. **Adjust parameters**
   - Scale: Small, Medium, Large
   - Poly Budget: 1,000 - 50,000 triangles
   - Style: Realistic, Stylized, Cartoon, Low-poly
   - Export Format: GLB, GLTF, USDZ

3. **Watch real-time generation**
   - Point cloud preview
   - Progressive mesh refinement
   - Texture baking
   - Final optimization

4. **Export your model**
   - Game-ready formats
   - PBR textures included
   - Provenance bundle

## 🔧 Development

### Project Structure

```
├── frontend/           # Next.js 14 React application
├── backend/            # FastAPI Python application
├── docs/              # Project documentation
├── PROJECT_BRIEF      # Complete project specifications
└── README.md          # This file
```

### Key Components

- **Studio Layout** - Main application interface
- **3D Viewer** - Interactive 3D scene rendering
- **Prompt Panel** - Text input and parameter controls
- **Inspector Panel** - Object properties and material editing
- **Timeline Panel** - Generation progress and checkpoints

### AI Pipeline

1. **Planning** - Analyze prompt and create generation plan
2. **Geometry Generation** - Create 3D mesh from text
3. **UV Unwrapping** - Generate texture coordinates
4. **Texture Baking** - Create PBR textures
5. **Optimization** - Optimize for target platform
6. **Export** - Generate final model

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run test
npm run type-check
```

### Backend
```bash
cd backend
pytest
black .
isort .
flake8 .
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Docker)
```bash
cd backend
docker build -t voxelverve-backend .
docker run -p 8000:8000 voxelverve-backend
```

### GPU Workers
```bash
docker run --gpus all voxelverve-worker
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the coding guidelines
4. Add tests for new features
5. Submit a pull request

### Development Guidelines

- Use TypeScript for frontend code
- Use Python 3.11+ for backend code
- Follow the established code style
- Add proper documentation
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** and **Anthropic** for AI models
- **Three.js** and **react-three-fiber** for 3D rendering
- **FastAPI** for the backend framework
- **LangGraph** for AI orchestration

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/ai-real-time-powered-text-to-3d-model-generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/ai-real-time-powered-text-to-3d-model-generator/discussions)
- **Documentation**: [Project Wiki](https://github.com/your-username/ai-real-time-powered-text-to-3d-model-generator/wiki)

---

**VoxelVerve** - Transforming imagination into 3D reality 🎨✨
