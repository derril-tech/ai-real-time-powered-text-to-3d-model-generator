'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { StudioProgress, AnimatedProgress } from '@/components/ui/Progress'
import { Button } from '@/components/ui/Button'
import { useStudioStore } from '@/store/studioStore'
import { useGenerationWebSocket } from '@/hooks/useWebSocket'
import { Clock, Play, Pause, Square, RotateCcw, Download } from 'lucide-react'
import { formatDuration } from '@/lib/utils'

interface Stage {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  startedAt?: string
  completedAt?: string
  error?: string
}

export function TimelinePanel() {
  const { currentRun, setCurrentRun } = useStudioStore()
  const [stages, setStages] = useState<Stage[]>([
    { id: 'planning', name: 'Planning', status: 'pending', progress: 0 },
    { id: 'coarse_gen', name: 'Coarse Generation', status: 'pending', progress: 0 },
    { id: 'mesh_recon', name: 'Mesh Reconstruction', status: 'pending', progress: 0 },
    { id: 'uv_unwrap', name: 'UV Unwrapping', status: 'pending', progress: 0 },
    { id: 'texture_bake', name: 'Texture Baking', status: 'pending', progress: 0 },
    { id: 'qa_safety', name: 'QA & Safety', status: 'pending', progress: 0 },
    { id: 'optimize', name: 'Optimization', status: 'pending', progress: 0 },
    { id: 'export', name: 'Export', status: 'pending', progress: 0 },
    { id: 'publish', name: 'Publish', status: 'pending', progress: 0 },
  ])

  // WebSocket connection for real-time updates
  const ws = useGenerationWebSocket(currentRun?.id || '')

  // Update stages based on WebSocket messages
  useEffect(() => {
    if (ws.generationUpdate) {
      const update = ws.generationUpdate.data
      setStages(update.stages || stages)
      
      // Update current run
      if (currentRun) {
        setCurrentRun({
          ...currentRun,
          status: update.status,
          progress: update.progress,
          currentStage: update.currentStage,
          estimatedTimeRemaining: update.estimatedTimeRemaining,
        })
      }
    }
  }, [ws.generationUpdate, currentRun, setCurrentRun, stages])

  // Handle generation completion
  useEffect(() => {
    if (ws.generationComplete && currentRun) {
      setCurrentRun({
        ...currentRun,
        status: 'completed',
        progress: 1.0,
        result: ws.generationComplete.data.result,
      })
    }
  }, [ws.generationComplete, currentRun, setCurrentRun])

  // Handle generation error
  useEffect(() => {
    if (ws.generationError && currentRun) {
      setCurrentRun({
        ...currentRun,
        status: 'failed',
        error: ws.generationError.data.error,
      })
    }
  }, [ws.generationError, currentRun, setCurrentRun])

  const getStageIcon = (status: Stage['status']) => {
    switch (status) {
      case 'completed':
        return '✓'
      case 'running':
        return '⟳'
      case 'failed':
        return '✗'
      default:
        return '○'
    }
  }

  const getStageColor = (status: Stage['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-500'
      case 'running':
        return 'text-blue-500'
      case 'failed':
        return 'text-red-500'
      default:
        return 'text-studio-primary/40'
    }
  }

  const handleCancel = () => {
    // TODO: Implement cancel generation
    console.log('Cancel generation')
  }

  const handleRetry = () => {
    // TODO: Implement retry generation
    console.log('Retry generation')
  }

  const handleDownload = () => {
    // TODO: Implement download result
    console.log('Download result')
  }

  if (!currentRun) {
    return (
      <div className="h-32 bg-studio-surface border-t border-studio-border flex items-center justify-center">
        <p className="text-studio-primary/60">No active generation</p>
      </div>
    )
  }

  return (
    <div className="h-32 bg-studio-surface border-t border-studio-border flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-studio-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-studio-primary" />
          <h3 className="text-sm font-medium text-studio-primary">Timeline</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {currentRun.status === 'completed' && (
            <Button
              variant="studioOutline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          )}
          
          {currentRun.status === 'failed' && (
            <Button
              variant="studioOutline"
              size="sm"
              onClick={handleRetry}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
          
          {['pending', 'planning', 'coarse_gen', 'mesh_recon', 'uv_unwrap', 'texture_bake', 'qa_safety', 'optimize', 'export'].includes(currentRun.status) && (
            <Button
              variant="studioOutline"
              size="sm"
              onClick={handleCancel}
            >
              <Square className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-3 border-b border-studio-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-studio-primary">
            Overall Progress
          </span>
          <span className="text-xs text-studio-primary/60">
            {Math.round(currentRun.progress * 100)}%
          </span>
        </div>
        <AnimatedProgress 
          value={currentRun.progress * 100} 
          animated={currentRun.status !== 'completed' && currentRun.status !== 'failed'}
        />
        {currentRun.estimatedTimeRemaining && (
          <p className="text-xs text-studio-primary/60 mt-1">
            Estimated time remaining: {formatDuration(currentRun.estimatedTimeRemaining)}
          </p>
        )}
      </div>

      {/* Stages */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-2 p-3 min-w-max">
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              className="flex flex-col items-center gap-2 min-w-[80px]"
            >
              <div className={`text-lg ${getStageColor(stage.status)}`}>
                {getStageIcon(stage.status)}
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-studio-primary">
                  {stage.name}
                </p>
                <p className="text-xs text-studio-primary/60">
                  {Math.round(stage.progress * 100)}%
                </p>
              </div>
              {stage.status === 'running' && (
                <div className="w-12 h-1 bg-studio-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-studio-accent to-studio-highlight transition-all duration-300"
                    style={{ width: `${stage.progress * 100}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
