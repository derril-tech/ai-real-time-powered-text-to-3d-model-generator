'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { StudioSlider } from '@/components/ui/Slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useCreatePrompt, useCreateRun } from '@/hooks/useApi'
import { useStudioStore } from '@/store/studioStore'
import { GenerationParameters, ExportFormat } from '@/types'
import { Upload, Sparkles, Settings, Save, Play } from 'lucide-react'

export function PromptPanel() {
  const [text, setText] = useState('')
  const [parameters, setParameters] = useState<GenerationParameters>({
    scale: 1.0,
    polyBudget: 10000,
    style: { id: 'default', name: 'Default', description: 'Default style' },
    exportFormat: 'glb',
    quality: 'standard',
  })
  const [isExpanded, setIsExpanded] = useState(false)

  const createPrompt = useCreatePrompt()
  const createRun = useCreateRun()
  const { setCurrentPrompt, addToPromptHistory } = useStudioStore()

  const handleSubmit = useCallback(async () => {
    if (!text.trim()) return

    try {
      // Create prompt
      const promptResult = await createPrompt.mutateAsync({
        text: text.trim(),
        parameters,
        tags: [],
        isPublic: false,
      })

      if (promptResult.data) {
        const prompt = promptResult.data
        setCurrentPrompt(prompt)
        addToPromptHistory(prompt)

        // Create generation run
        const runResult = await createRun.mutateAsync({
          promptId: prompt.id,
          parameters,
        })

        if (runResult.data) {
          // TODO: Handle successful generation start
          console.log('Generation started:', runResult.data)
        }
      }
    } catch (error) {
      console.error('Failed to start generation:', error)
    }
  }, [text, parameters, createPrompt, createRun, setCurrentPrompt, addToPromptHistory])

  const handleSavePrompt = useCallback(async () => {
    if (!text.trim()) return

    try {
      const result = await createPrompt.mutateAsync({
        text: text.trim(),
        parameters,
        tags: [],
        isPublic: false,
      })

      if (result.data) {
        setCurrentPrompt(result.data)
        addToPromptHistory(result.data)
      }
    } catch (error) {
      console.error('Failed to save prompt:', error)
    }
  }, [text, parameters, createPrompt, setCurrentPrompt, addToPromptHistory])

  const updateParameter = useCallback((key: keyof GenerationParameters, value: any) => {
    setParameters(prev => ({ ...prev, [key]: value }))
  }, [])

  return (
    <div className="w-80 bg-studio-surface border-r border-studio-border flex flex-col">
      <div className="p-4 border-b border-studio-border">
        <h2 className="text-lg font-semibold text-studio-primary">Prompt</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Text Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-studio-primary">
            Describe your 3D model
          </label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="A futuristic robot with glowing blue eyes, metallic armor, and articulated joints..."
            className="min-h-[120px] resize-none"
          />
        </div>

        {/* Reference Images */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-studio-primary">
            Reference Images (Optional)
          </label>
          <div className="border-2 border-dashed border-studio-border rounded-lg p-4 text-center">
            <Upload className="mx-auto h-8 w-8 text-studio-primary/60 mb-2" />
            <p className="text-sm text-studio-primary/60">
              Drag & drop images or click to upload
            </p>
            <Button variant="studioGhost" size="sm" className="mt-2">
              Choose Files
            </Button>
          </div>
        </div>

        {/* Basic Parameters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Basic Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Scale */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-studio-primary">
                Scale: {parameters.scale}x
              </label>
              <StudioSlider
                value={[parameters.scale]}
                onValueChange={([value]) => updateParameter('scale', value)}
                min={0.1}
                max={10}
                step={0.1}
              />
            </div>

            {/* Poly Budget */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-studio-primary">
                Poly Budget: {parameters.polyBudget.toLocaleString()}
              </label>
              <StudioSlider
                value={[parameters.polyBudget]}
                onValueChange={([value]) => updateParameter('polyBudget', Math.round(value))}
                min={1000}
                max={1000000}
                step={1000}
              />
            </div>

            {/* Quality */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-studio-primary">
                Quality
              </label>
              <select
                value={parameters.quality}
                onChange={(e) => updateParameter('quality', e.target.value)}
                className="w-full p-2 bg-studio-secondary border border-studio-border rounded text-studio-primary"
              >
                <option value="draft">Draft</option>
                <option value="standard">Standard</option>
                <option value="high">High</option>
                <option value="ultra">Ultra</option>
              </select>
            </div>

            {/* Export Format */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-studio-primary">
                Export Format
              </label>
              <select
                value={parameters.exportFormat}
                onChange={(e) => updateParameter('exportFormat', e.target.value as ExportFormat)}
                className="w-full p-2 bg-studio-secondary border border-studio-border rounded text-studio-primary"
              >
                <option value="glb">GLB (Recommended)</option>
                <option value="gltf">GLTF</option>
                <option value="obj">OBJ</option>
                <option value="fbx">FBX</option>
                <option value="usd">USD</option>
                <option value="blend">Blend</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Parameters (Collapsible) */}
        <Card>
          <CardHeader 
            className="pb-3 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Advanced Parameters
              </span>
              <span className="text-sm text-studio-primary/60">
                {isExpanded ? '−' : '+'}
              </span>
            </CardTitle>
          </CardHeader>
          {isExpanded && (
            <CardContent className="space-y-4">
              {/* Seed */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-studio-primary">
                  Seed (Optional)
                </label>
                <Input
                  type="number"
                  placeholder="Random"
                  value={parameters.seed || ''}
                  onChange={(e) => updateParameter('seed', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>

              {/* Guidance Scale */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-studio-primary">
                  Guidance Scale: {parameters.guidanceScale || 7.5}
                </label>
                <StudioSlider
                  value={[parameters.guidanceScale || 7.5]}
                  onValueChange={([value]) => updateParameter('guidanceScale', value)}
                  min={1}
                  max={20}
                  step={0.1}
                />
              </div>

              {/* Steps */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-studio-primary">
                  Steps: {parameters.steps || 50}
                </label>
                <StudioSlider
                  value={[parameters.steps || 50]}
                  onValueChange={([value]) => updateParameter('steps', Math.round(value))}
                  min={10}
                  max={1000}
                  step={1}
                />
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-studio-border space-y-2">
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() || createRun.isLoading}
          className="w-full"
          variant="studio"
          size="studio"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {createRun.isLoading ? 'Starting Generation...' : 'Generate 3D Model'}
        </Button>
        
        <Button
          onClick={handleSavePrompt}
          disabled={!text.trim() || createPrompt.isLoading}
          variant="studioOutline"
          size="studio"
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {createPrompt.isLoading ? 'Saving...' : 'Save Prompt'}
        </Button>
      </div>
    </div>
  )
}
