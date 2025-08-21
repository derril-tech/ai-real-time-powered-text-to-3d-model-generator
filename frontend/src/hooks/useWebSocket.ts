import { useEffect, useRef, useState, useCallback } from 'react'
import { WebSocketMessage, GenerationUpdateMessage, GenerationCompleteMessage, GenerationErrorMessage } from '@/types'

interface UseWebSocketOptions {
  url: string
  onMessage?: (message: WebSocketMessage) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

interface UseWebSocketReturn {
  isConnected: boolean
  sendMessage: (message: any) => void
  connect: () => void
  disconnect: () => void
  lastMessage: WebSocketMessage | null
  error: string | null
}

export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    url,
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const shouldReconnectRef = useRef(true)

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
        setError(null)
        reconnectAttemptsRef.current = 0
        onOpen?.()
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          setLastMessage(message)
          onMessage?.(message)
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err)
        }
      }

      ws.onclose = (event) => {
        setIsConnected(false)
        onClose?.()

        if (shouldReconnectRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++
            connect()
          }, reconnectInterval)
        }
      }

      ws.onerror = (event) => {
        setError('WebSocket connection error')
        onError?.(event)
      }
    } catch (err) {
      setError('Failed to create WebSocket connection')
    }
  }, [url, onMessage, onOpen, onClose, onError, reconnectInterval, maxReconnectAttempts])

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (wsRef.current) {
      wsRef.current.close()
    }
  }, [])

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      setError('WebSocket is not connected')
    }
  }, [])

  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    isConnected,
    sendMessage,
    connect,
    disconnect,
    lastMessage,
    error
  }
}

// Specialized hooks for generation updates
export function useGenerationWebSocket(runId: string) {
  const [generationUpdate, setGenerationUpdate] = useState<GenerationUpdateMessage | null>(null)
  const [generationComplete, setGenerationComplete] = useState<GenerationCompleteMessage | null>(null)
  const [generationError, setGenerationError] = useState<GenerationErrorMessage | null>(null)

  const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/runs/${runId}`

  const handleMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'generation_update':
        setGenerationUpdate(message as GenerationUpdateMessage)
        break
      case 'generation_complete':
        setGenerationComplete(message as GenerationCompleteMessage)
        break
      case 'generation_error':
        setGenerationError(message as GenerationErrorMessage)
        break
    }
  }, [])

  const ws = useWebSocket({
    url: wsUrl,
    onMessage: handleMessage
  })

  return {
    ...ws,
    generationUpdate,
    generationComplete,
    generationError
  }
}

export function useStudioWebSocket(userId: string) {
  const [studioEvents, setStudioEvents] = useState<WebSocketMessage[]>([])

  const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/studio/${userId}`

  const handleMessage = useCallback((message: WebSocketMessage) => {
    setStudioEvents(prev => [...prev, message])
  }, [])

  const ws = useWebSocket({
    url: wsUrl,
    onMessage: handleMessage
  })

  return {
    ...ws,
    studioEvents
  }
}
