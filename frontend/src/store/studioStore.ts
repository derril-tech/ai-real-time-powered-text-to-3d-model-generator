import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { UIState, SceneObject, Transform, GenerationRun, Prompt } from '@/types'

interface StudioState {
  // UI State
  ui: UIState
  setUI: (updates: Partial<UIState>) => void
  
  // Scene State
  sceneObjects: SceneObject[]
  selectedObjectId: string | null
  addSceneObject: (object: SceneObject) => void
  removeSceneObject: (id: string) => void
  updateSceneObject: (id: string, updates: Partial<SceneObject>) => void
  selectObject: (id: string | null) => void
  updateObjectTransform: (id: string, transform: Partial<Transform>) => void
  
  // Generation State
  currentRun: GenerationRun | null
  activeRuns: GenerationRun[]
  setCurrentRun: (run: GenerationRun | null) => void
  addActiveRun: (run: GenerationRun) => void
  removeActiveRun: (id: string) => void
  updateActiveRun: (id: string, updates: Partial<GenerationRun>) => void
  
  // Prompt State
  currentPrompt: Prompt | null
  promptHistory: Prompt[]
  setCurrentPrompt: (prompt: Prompt | null) => void
  addToPromptHistory: (prompt: Prompt) => void
  clearPromptHistory: () => void
  
  // Camera State
  camera: {
    position: [number, number, number]
    target: [number, number, number]
    fov: number
  }
  setCamera: (camera: Partial<StudioState['camera']>) => void
  
  // Viewport State
  viewport: {
    width: number
    height: number
    pixelRatio: number
  }
  setViewport: (viewport: Partial<StudioState['viewport']>) => void
  
  // Selection State
  selection: {
    objects: string[]
    mode: 'single' | 'multiple'
  }
  setSelection: (selection: Partial<StudioState['selection']>) => void
  addToSelection: (objectId: string) => void
  removeFromSelection: (objectId: string) => void
  clearSelection: () => void
  
  // History State
  history: {
    undoStack: any[]
    redoStack: any[]
  }
  addToHistory: (action: any) => void
  undo: () => void
  redo: () => void
  
  // Settings State
  settings: {
    autoSave: boolean
    autoSaveInterval: number
    maxHistorySize: number
    defaultQuality: 'draft' | 'standard' | 'high' | 'ultra'
    defaultExportFormat: 'gltf' | 'glb' | 'obj' | 'fbx' | 'usd' | 'blend'
  }
  updateSettings: (settings: Partial<StudioState['settings']>) => void
  
  // Reset State
  reset: () => void
}

const initialState = {
  ui: {
    theme: 'dark' as const,
    sidebarCollapsed: false,
    inspectorCollapsed: false,
    timelineCollapsed: false,
    selectedObject: undefined,
    cameraMode: 'orbit' as const,
    gridVisible: true,
    axesVisible: true,
    wireframeMode: false,
  },
  sceneObjects: [],
  selectedObjectId: null,
  currentRun: null,
  activeRuns: [],
  currentPrompt: null,
  promptHistory: [],
  camera: {
    position: [5, 5, 5] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    fov: 75,
  },
  viewport: {
    width: 800,
    height: 600,
    pixelRatio: 1,
  },
  selection: {
    objects: [],
    mode: 'single' as const,
  },
  history: {
    undoStack: [],
    redoStack: [],
  },
  settings: {
    autoSave: true,
    autoSaveInterval: 30000, // 30 seconds
    maxHistorySize: 50,
    defaultQuality: 'standard' as const,
    defaultExportFormat: 'glb' as const,
  },
}

export const useStudioStore = create<StudioState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // UI State
        setUI: (updates) =>
          set((state) => ({
            ui: { ...state.ui, ...updates }
          })),

        // Scene State
        addSceneObject: (object) =>
          set((state) => ({
            sceneObjects: [...state.sceneObjects, object]
          })),

        removeSceneObject: (id) =>
          set((state) => ({
            sceneObjects: state.sceneObjects.filter(obj => obj.id !== id),
            selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
          })),

        updateSceneObject: (id, updates) =>
          set((state) => ({
            sceneObjects: state.sceneObjects.map(obj =>
              obj.id === id ? { ...obj, ...updates } : obj
            )
          })),

        selectObject: (id) =>
          set({ selectedObjectId: id }),

        updateObjectTransform: (id, transform) =>
          set((state) => ({
            sceneObjects: state.sceneObjects.map(obj =>
              obj.id === id
                ? { ...obj, transform: { ...obj.transform, ...transform } }
                : obj
            )
          })),

        // Generation State
        setCurrentRun: (run) =>
          set({ currentRun: run }),

        addActiveRun: (run) =>
          set((state) => ({
            activeRuns: [...state.activeRuns, run]
          })),

        removeActiveRun: (id) =>
          set((state) => ({
            activeRuns: state.activeRuns.filter(run => run.id !== id)
          })),

        updateActiveRun: (id, updates) =>
          set((state) => ({
            activeRuns: state.activeRuns.map(run =>
              run.id === id ? { ...run, ...updates } : run
            )
          })),

        // Prompt State
        setCurrentPrompt: (prompt) =>
          set({ currentPrompt: prompt }),

        addToPromptHistory: (prompt) =>
          set((state) => ({
            promptHistory: [prompt, ...state.promptHistory.slice(0, 9)] // Keep last 10
          })),

        clearPromptHistory: () =>
          set({ promptHistory: [] }),

        // Camera State
        setCamera: (camera) =>
          set((state) => ({
            camera: { ...state.camera, ...camera }
          })),

        // Viewport State
        setViewport: (viewport) =>
          set((state) => ({
            viewport: { ...state.viewport, ...viewport }
          })),

        // Selection State
        setSelection: (selection) =>
          set((state) => ({
            selection: { ...state.selection, ...selection }
          })),

        addToSelection: (objectId) =>
          set((state) => {
            const { selection } = state
            if (selection.mode === 'single') {
              return { selection: { ...selection, objects: [objectId] } }
            }
            if (!selection.objects.includes(objectId)) {
              return { selection: { ...selection, objects: [...selection.objects, objectId] } }
            }
            return state
          }),

        removeFromSelection: (objectId) =>
          set((state) => ({
            selection: {
              ...state.selection,
              objects: state.selection.objects.filter(id => id !== objectId)
            }
          })),

        clearSelection: () =>
          set((state) => ({
            selection: { ...state.selection, objects: [] }
          })),

        // History State
        addToHistory: (action) =>
          set((state) => {
            const { history, settings } = state
            const newUndoStack = [action, ...history.undoStack].slice(0, settings.maxHistorySize)
            return {
              history: {
                undoStack: newUndoStack,
                redoStack: [], // Clear redo stack when new action is added
              }
            }
          }),

        undo: () =>
          set((state) => {
            const { history } = state
            if (history.undoStack.length === 0) return state

            const [action, ...newUndoStack] = history.undoStack
            return {
              history: {
                undoStack: newUndoStack,
                redoStack: [action, ...history.redoStack],
              }
            }
          }),

        redo: () =>
          set((state) => {
            const { history } = state
            if (history.redoStack.length === 0) return state

            const [action, ...newRedoStack] = history.redoStack
            return {
              history: {
                undoStack: [action, ...history.undoStack],
                redoStack: newRedoStack,
              }
            }
          }),

        // Settings State
        updateSettings: (settings) =>
          set((state) => ({
            settings: { ...state.settings, ...settings }
          })),

        // Reset State
        reset: () => set(initialState),
      }),
      {
        name: 'voxelverve-studio-storage',
        partialize: (state) => ({
          ui: state.ui,
          settings: state.settings,
          camera: state.camera,
          promptHistory: state.promptHistory,
        }),
      }
    ),
    {
      name: 'studio-store',
    }
  )
)

// Selector hooks for better performance
export const useUI = () => useStudioStore((state) => state.ui)
export const useSetUI = () => useStudioStore((state) => state.setUI)
export const useSceneObjects = () => useStudioStore((state) => state.sceneObjects)
export const useSelectedObjectId = () => useStudioStore((state) => state.selectedObjectId)
export const useCurrentRun = () => useStudioStore((state) => state.currentRun)
export const useActiveRuns = () => useStudioStore((state) => state.activeRuns)
export const useCurrentPrompt = () => useStudioStore((state) => state.currentPrompt)
export const useCamera = () => useStudioStore((state) => state.camera)
export const useViewport = () => useStudioStore((state) => state.viewport)
export const useSelection = () => useStudioStore((state) => state.selection)
export const useSettings = () => useStudioStore((state) => state.settings)
