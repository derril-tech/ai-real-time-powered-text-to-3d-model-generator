'use client'

export function InspectorPanel() {
  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Inspector</h2>
        {/* TODO: Add panel collapse/expand */}
      </div>

      {/* Scene Graph */}
      <div className="flex-1">
        <h3 className="text-md font-medium mb-2">Scene Graph</h3>
        <div className="studio-panel h-32 overflow-y-auto">
          {/* TODO: Add scene hierarchy tree */}
          <div className="text-sm text-gray-400">No objects in scene</div>
        </div>
      </div>

      {/* Object Properties */}
      <div className="flex-1">
        <h3 className="text-md font-medium mb-2">Object Properties</h3>
        <div className="studio-panel space-y-3">
          {/* TODO: Add transform controls (position, rotation, scale) */}
          <div>
            <label className="block text-sm mb-1">Position</label>
            <div className="grid grid-cols-3 gap-2">
              <input type="number" placeholder="X" className="studio-input text-sm" />
              <input type="number" placeholder="Y" className="studio-input text-sm" />
              <input type="number" placeholder="Z" className="studio-input text-sm" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-1">Rotation</label>
            <div className="grid grid-cols-3 gap-2">
              <input type="number" placeholder="X" className="studio-input text-sm" />
              <input type="number" placeholder="Y" className="studio-input text-sm" />
              <input type="number" placeholder="Z" className="studio-input text-sm" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-1">Scale</label>
            <div className="grid grid-cols-3 gap-2">
              <input type="number" placeholder="X" className="studio-input text-sm" />
              <input type="number" placeholder="Y" className="studio-input text-sm" />
              <input type="number" placeholder="Z" className="studio-input text-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Material Properties */}
      <div className="flex-1">
        <h3 className="text-md font-medium mb-2">Material</h3>
        <div className="studio-panel space-y-3">
          {/* TODO: Add PBR material controls */}
          <div>
            <label className="block text-sm mb-1">Albedo</label>
            <input type="color" className="w-full h-8 rounded border border-studio-border" />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Roughness</label>
            <input type="range" min="0" max="1" step="0.01" className="w-full" />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Metallic</label>
            <input type="range" min="0" max="1" step="0.01" className="w-full" />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Normal Strength</label>
            <input type="range" min="0" max="2" step="0.1" className="w-full" />
          </div>
        </div>
      </div>

      {/* Texture Slots */}
      <div className="flex-1">
        <h3 className="text-md font-medium mb-2">Textures</h3>
        <div className="studio-panel space-y-2">
          {/* TODO: Add texture slot management */}
          <div className="flex items-center justify-between">
            <span className="text-sm">Albedo</span>
            <button className="text-xs studio-button">Assign</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Normal</span>
            <button className="text-xs studio-button">Assign</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Roughness</span>
            <button className="text-xs studio-button">Assign</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Metallic</span>
            <button className="text-xs studio-button">Assign</button>
          </div>
        </div>
      </div>

      {/* TODO: Add UV mapping controls */}
      <div className="flex-1">
        <h3 className="text-md font-medium mb-2">UV Mapping</h3>
        <div className="studio-panel">
          <div className="text-sm text-gray-400">UV controls will appear here</div>
        </div>
      </div>
    </div>
  )
}
