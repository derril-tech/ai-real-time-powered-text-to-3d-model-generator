# VoxelVerve API Specification

## Overview
The VoxelVerve API provides endpoints for text-to-3D model generation, real-time previews, and asset management. All endpoints return JSON responses and use standard HTTP status codes.

## Base URL
- Development: `http://localhost:8000/api/v1`
- Production: `https://api.voxelverve.com/api/v1`

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Common Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

## Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {}
  }
}
```

## Endpoints

### Authentication

#### POST /auth/login
Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "bearer",
    "expires_in": 1800
  }
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Prompts

#### POST /prompts/
Create a new generation prompt.

**Request Body:**
```json
{
  "text": "bronze steampunk pocket watch with exposed gears",
  "parameters": {
    "scale": "medium",
    "poly_budget": 5000,
    "style": "realistic",
    "export_format": "glb"
  },
  "references": [
    {
      "type": "image",
      "url": "https://example.com/reference.jpg"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prompt_123",
    "text": "bronze steampunk pocket watch with exposed gears",
    "parameters": {},
    "status": "created",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /prompts/{prompt_id}
Get prompt details and generation status.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prompt_123",
    "text": "bronze steampunk pocket watch with exposed gears",
    "parameters": {},
    "status": "processing",
    "progress": 0.75,
    "current_stage": "texture_baking",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:05:00Z"
  }
}
```

### Generation Runs

#### POST /runs/
Start a new generation run from a prompt.

**Request Body:**
```json
{
  "prompt_id": "prompt_123",
  "options": {
    "quality": "high",
    "enable_progressive": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "run_id": "run_456",
    "prompt_id": "prompt_123",
    "status": "started",
    "websocket_url": "ws://localhost:8000/api/v1/ws/runs/run_456"
  }
}
```

#### GET /runs/{run_id}
Get generation run status and results.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "run_456",
    "status": "completed",
    "progress": 1.0,
    "stages": [
      {
        "name": "planning",
        "status": "completed",
        "duration": 2.5
      },
      {
        "name": "geometry_generation",
        "status": "completed",
        "duration": 15.2
      },
      {
        "name": "texture_baking",
        "status": "completed",
        "duration": 8.7
      }
    ],
    "result": {
      "mesh_url": "https://storage.voxelverve.com/meshes/run_456.glb",
      "textures": {
        "albedo": "https://storage.voxelverve.com/textures/run_456_albedo.png",
        "normal": "https://storage.voxelverve.com/textures/run_456_normal.png",
        "roughness": "https://storage.voxelverve.com/textures/run_456_roughness.png"
      },
      "provenance": {
        "seed": 12345,
        "model_version": "v1.0",
        "checkpoints": []
      }
    }
  }
}
```

### Geometry Operations

#### POST /geometry/optimize
Optimize mesh for target platform.

**Request Body:**
```json
{
  "mesh_url": "https://storage.voxelverve.com/meshes/run_456.glb",
  "target": "web",
  "options": {
    "max_triangles": 1000,
    "compression": "draco"
  }
}
```

#### POST /geometry/uv-unwrap
Generate UV maps for mesh.

**Request Body:**
```json
{
  "mesh_url": "https://storage.voxelverve.com/meshes/run_456.glb",
  "options": {
    "method": "xatlas",
    "padding": 2
  }
}
```

### Texture Operations

#### POST /textures/bake
Bake PBR textures from high-poly mesh.

**Request Body:**
```json
{
  "mesh_url": "https://storage.voxelverve.com/meshes/run_456.glb",
  "textures": ["albedo", "normal", "roughness", "metallic"],
  "options": {
    "resolution": 2048,
    "samples": 64
  }
}
```

#### POST /textures/optimize
Optimize textures for target platform.

**Request Body:**
```json
{
  "texture_urls": {
    "albedo": "https://storage.voxelverve.com/textures/run_456_albedo.png",
    "normal": "https://storage.voxelverve.com/textures/run_456_normal.png"
  },
  "target": "mobile",
  "options": {
    "compression": "astc",
    "quality": 0.8
  }
}
```

### Exports

#### POST /exports/
Export model in specified format.

**Request Body:**
```json
{
  "run_id": "run_456",
  "format": "glb",
  "options": {
    "include_textures": true,
    "include_provenance": true,
    "compression": "draco"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "export_id": "export_789",
    "download_url": "https://storage.voxelverve.com/exports/export_789.glb",
    "expires_at": "2024-01-08T00:00:00Z",
    "provenance": {
      "seed": 12345,
      "model_version": "v1.0",
      "checkpoints": [],
      "citations": []
    }
  }
}
```

### WebSocket

#### WebSocket Connection
Connect to real-time updates for generation progress.

**URL:** `ws://localhost:8000/api/v1/ws/runs/{run_id}`

**Message Types:**

1. **Progress Update:**
```json
{
  "type": "progress",
  "data": {
    "stage": "geometry_generation",
    "progress": 0.75,
    "message": "Generating mesh from point cloud..."
  }
}
```

2. **Preview Update:**
```json
{
  "type": "preview",
  "data": {
    "stage": "point_cloud",
    "preview_url": "https://storage.voxelverve.com/previews/run_456_point_cloud.glb"
  }
}
```

3. **Stage Complete:**
```json
{
  "type": "stage_complete",
  "data": {
    "stage": "geometry_generation",
    "result": {
      "mesh_url": "https://storage.voxelverve.com/meshes/run_456.glb"
    }
  }
}
```

4. **Generation Complete:**
```json
{
  "type": "complete",
  "data": {
    "run_id": "run_456",
    "result": {
      "mesh_url": "https://storage.voxelverve.com/meshes/run_456.glb",
      "textures": {}
    }
  }
}
```

## Data Models

### Prompt Model
```typescript
interface Prompt {
  id: string;
  text: string;
  parameters: {
    scale: 'small' | 'medium' | 'large';
    poly_budget: number;
    style: string;
    export_format: 'glb' | 'gltf' | 'usdz';
  };
  references: Reference[];
  status: 'created' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}
```

### Run Model
```typescript
interface Run {
  id: string;
  prompt_id: string;
  status: 'started' | 'processing' | 'completed' | 'failed';
  progress: number;
  stages: Stage[];
  result?: RunResult;
  created_at: string;
  updated_at: string;
}
```

### Stage Model
```typescript
interface Stage {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  duration?: number;
  result?: any;
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid request data |
| `AUTHENTICATION_ERROR` | Invalid or missing authentication |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `GENERATION_FAILED` | AI generation failed |
| `STORAGE_ERROR` | File storage error |
| `INTERNAL_ERROR` | Server error |

## Rate Limits
- Authentication endpoints: 10 requests per minute
- Generation endpoints: 5 requests per minute
- Other endpoints: 100 requests per minute

## WebSocket Rate Limits
- Connection limit: 10 per user
- Message size: 1MB max
- Heartbeat: 30 seconds
