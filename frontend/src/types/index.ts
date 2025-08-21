// User and Authentication Types
export interface User {
  id: string
  email: string
  username: string
  avatar?: string
  role: 'user' | 'admin' | 'moderator'
  createdAt: string
  updatedAt: string
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  defaultExportFormat: ExportFormat
  defaultPolyBudget: number
  notifications: NotificationSettings
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  generationComplete: boolean
  generationFailed: boolean
}

// Generation and Prompt Types
export interface Prompt {
  id: string
  userId: string
  text: string
  referenceImages?: string[]
  parameters: GenerationParameters
  tags: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
  usageCount: number
}

export interface GenerationParameters {
  scale: number
  polyBudget: number
  style: GenerationStyle
  exportFormat: ExportFormat
  quality: 'draft' | 'standard' | 'high' | 'ultra'
  seed?: number
  guidanceScale?: number
  steps?: number
}

export interface GenerationStyle {
  id: string
  name: string
  description: string
  preview?: string
  parameters: Partial<GenerationParameters>
}

export type ExportFormat = 'gltf' | 'glb' | 'obj' | 'fbx' | 'usd' | 'blend'

// Generation Run Types
export interface GenerationRun {
  id: string
  promptId: string
  userId: string
  status: GenerationStatus
  progress: number
  currentStage: GenerationStage
  stages: GenerationStage[]
  result?: GenerationResult
  error?: string
  startedAt: string
  completedAt?: string
  estimatedTimeRemaining?: number
}

export type GenerationStatus = 
  | 'pending'
  | 'planning'
  | 'coarse_gen'
  | 'mesh_recon'
  | 'uv_unwrap'
  | 'texture_bake'
  | 'qa_safety'
  | 'optimize'
  | 'export'
  | 'publish'
  | 'completed'
  | 'failed'
  | 'cancelled'

export interface GenerationStage {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  startedAt?: string
  completedAt?: string
  error?: string
  output?: any
}

export interface GenerationResult {
  modelUrl: string
  thumbnailUrl: string
  metadata: ModelMetadata
  files: ModelFile[]
  statistics: GenerationStatistics
}

export interface ModelMetadata {
  vertexCount: number
  faceCount: number
  textureCount: number
  fileSize: number
  boundingBox: BoundingBox
  materials: Material[]
}

export interface BoundingBox {
  min: [number, number, number]
  max: [number, number, number]
  center: [number, number, number]
  size: [number, number, number]
}

export interface Material {
  id: string
  name: string
  type: 'pbr' | 'unlit' | 'emissive'
  properties: Record<string, any>
  textures: Texture[]
}

export interface Texture {
  id: string
  name: string
  type: 'albedo' | 'normal' | 'roughness' | 'metallic' | 'emissive' | 'ao'
  url: string
  size: [number, number]
  format: 'png' | 'jpg' | 'webp'
}

export interface ModelFile {
  id: string
  name: string
  format: ExportFormat
  url: string
  size: number
  optimized: boolean
}

export interface GenerationStatistics {
  totalTime: number
  stageTimes: Record<string, number>
  gpuUsage: number
  memoryUsage: number
  qualityScore: number
}

// 3D Scene Types
export interface SceneObject {
  id: string
  name: string
  type: 'mesh' | 'light' | 'camera' | 'group'
  transform: Transform
  visible: boolean
  children?: SceneObject[]
  properties?: Record<string, any>
}

export interface Transform {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
}

export interface Camera {
  id: string
  name: string
  type: 'perspective' | 'orthographic'
  fov?: number
  near: number
  far: number
  transform: Transform
}

export interface Light {
  id: string
  name: string
  type: 'directional' | 'point' | 'spot' | 'ambient'
  color: [number, number, number]
  intensity: number
  transform: Transform
  properties?: Record<string, any>
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
}

export interface GenerationUpdateMessage extends WebSocketMessage {
  type: 'generation_update'
  data: {
    runId: string
    status: GenerationStatus
    progress: number
    currentStage: GenerationStage
    stages: GenerationStage[]
    estimatedTimeRemaining?: number
  }
}

export interface GenerationCompleteMessage extends WebSocketMessage {
  type: 'generation_complete'
  data: {
    runId: string
    result: GenerationResult
  }
}

export interface GenerationErrorMessage extends WebSocketMessage {
  type: 'generation_error'
  data: {
    runId: string
    error: string
    stage?: string
  }
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

// UI State Types
export interface UIState {
  theme: 'light' | 'dark' | 'system'
  sidebarCollapsed: boolean
  inspectorCollapsed: boolean
  timelineCollapsed: boolean
  selectedObject?: string
  cameraMode: 'orbit' | 'fly' | 'walk'
  gridVisible: boolean
  axesVisible: boolean
  wireframeMode: boolean
}

// Form Types
export interface PromptFormData {
  text: string
  referenceImages: File[]
  parameters: GenerationParameters
  tags: string[]
  isPublic: boolean
}

export interface GenerationFormData {
  promptId: string
  parameters: Partial<GenerationParameters>
}

// Error Types
export interface ApiError {
  code: string
  message: string
  details?: any
}

export interface ValidationError {
  field: string
  message: string
}

// Event Types
export interface StudioEvent {
  type: string
  payload: any
  timestamp: string
}

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: string
  description: string
}
