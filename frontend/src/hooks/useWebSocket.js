/**
 * Raksha AI — WebSocket Hook
 * Connects to: ws://localhost:8000/api/dashboard/ws/live-updates
 * Broadcasts new cases, status changes, and emotion alerts.
 */

import { useEffect, useRef, useCallback, useState } from 'react'

const WS_URL = (import.meta.env.VITE_WS_URL || 'ws://localhost:8000') + '/api/dashboard/ws/live-updates'

export function useRakshaWebSocket(callbacks = {}) {
  const wsRef = useRef(null)
  const reconnectTimer = useRef(null)
  const [connected, setConnected] = useState(false)
  const [reconnectCount, setReconnectCount] = useState(0)

  // Use refs for callbacks to avoid re-triggering the connection logic 
  // when handlers are defined as inline functions in components.
  const callbacksRef = useRef(callbacks)
  useEffect(() => {
    callbacksRef.current = callbacks
  }, [callbacks])

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) return

    try {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('[Raksha WS] Connected to live-updates feed')
        setConnected(true)
        setReconnectCount(0)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'ping') return 

          const { onNewCase, onStatusUpdate, onPanic } = callbacksRef.current

          if (data.type === 'new_case') {
            onNewCase?.(data.case)
            if (data.case?.priority === 'critical') {
              onPanic?.(data.case)
            }
          }

          if (data.type === 'status_update') {
            onStatusUpdate?.(data)
          }

          if (data.type === 'panic_alert') {
            onPanic?.(data)
          }
        } catch (err) {
          console.warn('[Raksha WS] Failed to parse message', event.data)
        }
      }

      ws.onerror = (err) => {
        console.warn('[Raksha WS] Connection error', err)
        setConnected(false)
      }

      ws.onclose = () => {
        setConnected(false)
        console.log('[Raksha WS] Disconnected — reconnecting in 5s...')
        // Auto-reconnect with backoff
        reconnectTimer.current = setTimeout(() => {
          setReconnectCount(c => c + 1)
          connect()
        }, 5000)
      }
    } catch (err) {
      console.error('[Raksha WS] Failed to create WebSocket', err)
    }
  }, []) // No dependencies, connection logic is stable

  useEffect(() => {
    connect()
    return () => {
      clearTimeout(reconnectTimer.current)
      if (wsRef.current) {
        wsRef.current.onclose = null // Prevent reconnect loop on intentional close
        wsRef.current.close()
      }
    }
  }, [connect])

  return { connected, reconnectCount }
}
