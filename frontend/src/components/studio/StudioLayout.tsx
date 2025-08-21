'use client'

import { ReactNode } from 'react'

interface StudioLayoutProps {
  children: ReactNode
}

export function StudioLayout({ children }: StudioLayoutProps) {
  return (
    <div className="h-screen bg-studio-surface text-white">
      {/* TODO: Add top navigation bar with user menu, project selector */}
      <header className="h-12 bg-studio-primary border-b border-studio-border flex items-center px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">VoxelVerve Studio</h1>
          {/* TODO: Add project selector dropdown */}
          {/* TODO: Add user menu with settings, logout */}
        </div>
      </header>

      {/* Main content area */}
      <main className="h-[calc(100vh-3rem)]">
        {children}
      </main>

      {/* TODO: Add status bar with connection status, generation progress */}
      <footer className="h-8 bg-studio-primary border-t border-studio-border flex items-center px-4 text-sm">
        <div className="flex items-center space-x-4">
          <span>Ready</span>
          {/* TODO: Add WebSocket connection indicator */}
          {/* TODO: Add generation progress indicator */}
        </div>
      </footer>
    </div>
  )
}
