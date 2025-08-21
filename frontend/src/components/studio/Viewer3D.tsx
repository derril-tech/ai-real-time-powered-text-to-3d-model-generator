'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Grid, Box, Sphere } from '@react-three/drei'
import { useStudioStore } from '@/store/studioStore'
import { Button } from '@/components/ui/Button'
import { Camera, Grid3X3, Eye, EyeOff, RotateCcw } from 'lucide-react'

// 3D Scene Component
function Scene() {
  const { scene } = useThree()
  const { ui, camera, setCamera } = useStudioStore()
  
  // Camera controls
  useFrame((state) => {
    if (state.camera) {
      // Update camera position based on store
      state.camera.position.set(...camera.position)
      state.camera.lookAt(...camera.target)
    }
  })

  // Handle camera changes
  const handleCameraChange = useCallback((event: any) => {
    const camera = event.target.object
    setCamera({
      position: [camera.position.x, camera.position.y, camera.position.z],
      target: [camera.target.x, camera.target.y, camera.target.z],
    })
  }, [setCamera])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Environment */}
      <Environment preset="studio" />

      {/* Grid */}
      {ui.gridVisible && (
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6f6f6f"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#9d4b4b"
          fadeDistance={25}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={true}
        />
      )}

      {/* Axes Helper */}
      {ui.axesVisible && (
        <axesHelper args={[5]} />
      )}

      {/* Placeholder Objects */}
      <Box args={[1, 1, 1]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#4f46e5" />
      </Box>
      <Sphere args={[0.5, 32, 32]} position={[2, 0.5, 0]}>
        <meshStandardMaterial color="#dc2626" />
      </Sphere>

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        onChange={handleCameraChange}
        maxDistance={50}
        minDistance={0.5}
      />
    </>
  )
}

// Viewport Controls Component
function ViewportControls() {
  const { ui, setUI } = useStudioStore()

  const toggleGrid = useCallback(() => {
    setUI({ gridVisible: !ui.gridVisible })
  }, [ui.gridVisible, setUI])

  const toggleAxes = useCallback(() => {
    setUI({ axesVisible: !ui.axesVisible })
  }, [ui.axesVisible, setUI])

  const resetCamera = useCallback(() => {
    setUI({
      camera: {
        position: [5, 5, 5],
        target: [0, 0, 0],
        fov: 75,
      }
    })
  }, [setUI])

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      <Button
        variant="studioOutline"
        size="icon"
        onClick={toggleGrid}
        className="w-10 h-10"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      
      <Button
        variant="studioOutline"
        size="icon"
        onClick={toggleAxes}
        className="w-10 h-10"
      >
        {ui.axesVisible ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
      </Button>
      
      <Button
        variant="studioOutline"
        size="icon"
        onClick={resetCamera}
        className="w-10 h-10"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Main Viewer Component
export function Viewer3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { currentRun } = useStudioStore()

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * window.devicePixelRatio
        canvas.height = rect.height * window.devicePixelRatio
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex-1 relative bg-studio-surface">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-studio-surface/80 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-studio-accent mx-auto mb-4"></div>
            <p className="text-studio-primary">Loading 3D Model...</p>
          </div>
        </div>
      )}

      {/* Generation Progress Overlay */}
      {currentRun && currentRun.status !== 'completed' && (
        <div className="absolute bottom-4 left-4 right-4 bg-studio-surface/90 backdrop-blur-sm rounded-lg p-4 border border-studio-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-studio-primary">
              Generating 3D Model
            </h3>
            <span className="text-xs text-studio-primary/60">
              {Math.round(currentRun.progress * 100)}%
            </span>
          </div>
          <div className="w-full bg-studio-secondary rounded-full h-2">
            <div
              className="bg-gradient-to-r from-studio-accent to-studio-highlight h-2 rounded-full transition-all duration-300"
              style={{ width: `${currentRun.progress * 100}%` }}
            />
          </div>
          <p className="text-xs text-studio-primary/60 mt-1">
            {currentRun.currentStage || 'Initializing...'}
          </p>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        ref={canvasRef}
        camera={{ position: [5, 5, 5], fov: 75 }}
        shadows
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
        className="w-full h-full"
      >
        <Scene />
      </Canvas>

      {/* Viewport Controls */}
      <ViewportControls />

      {/* Camera Info */}
      <div className="absolute bottom-4 left-4 bg-studio-surface/90 backdrop-blur-sm rounded-lg p-2 border border-studio-border">
        <div className="flex items-center gap-2 text-xs text-studio-primary/60">
          <Camera className="h-3 w-3" />
          <span>Camera: Orbit</span>
        </div>
      </div>
    </div>
  )
}
