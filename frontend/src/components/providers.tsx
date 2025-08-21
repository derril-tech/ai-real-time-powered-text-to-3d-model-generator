'use client'

import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { useState, useEffect } from 'react'
import { useStudioStore } from '@/store/studioStore'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
      mutations: {
        retry: 1,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <StudioProvider>
        {children}
      </StudioProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

// Studio provider for global state and WebSocket management
function StudioProvider({ children }: { children: React.ReactNode }) {
  const { setUI, addActiveRun, updateActiveRun, removeActiveRun } = useStudioStore()

  // Initialize theme from system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setUI({ theme: e.matches ? 'dark' : 'light' })
    }

    // Set initial theme
    const isDark = mediaQuery.matches
    setUI({ theme: isDark ? 'dark' : 'light' })

    // Listen for system theme changes
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [setUI])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + S: Save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        // TODO: Implement save functionality
      }

      // Ctrl/Cmd + Z: Undo
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault()
        // TODO: Implement undo functionality
      }

      // Ctrl/Cmd + Shift + Z: Redo
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && event.shiftKey) {
        event.preventDefault()
        // TODO: Implement redo functionality
      }

      // Escape: Clear selection
      if (event.key === 'Escape') {
        // TODO: Clear selection
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // TODO: Update viewport dimensions
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <>{children}</>
}
