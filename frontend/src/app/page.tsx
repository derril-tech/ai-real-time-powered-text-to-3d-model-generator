import { StudioLayout } from '@/components/studio/StudioLayout'
import { PromptPanel } from '@/components/studio/PromptPanel'
import { Viewer3D } from '@/components/studio/Viewer3D'
import { InspectorPanel } from '@/components/studio/InspectorPanel'
import { TimelinePanel } from '@/components/studio/TimelinePanel'

export default function StudioPage() {
  return (
    <StudioLayout>
      <div className="flex h-screen bg-studio-surface">
        {/* Left Panel - Prompt & Parameters */}
        <div className="w-80 border-r border-studio-border">
          <PromptPanel />
        </div>
        
        {/* Center - 3D Viewport */}
        <div className="flex-1 relative">
          <Viewer3D />
        </div>
        
        {/* Right Panel - Inspector */}
        <div className="w-80 border-l border-studio-border">
          <InspectorPanel />
        </div>
        
        {/* Bottom Panel - Timeline & Stages */}
        <div className="absolute bottom-0 left-0 right-0 h-32 border-t border-studio-border">
          <TimelinePanel />
        </div>
      </div>
    </StudioLayout>
  )
}
