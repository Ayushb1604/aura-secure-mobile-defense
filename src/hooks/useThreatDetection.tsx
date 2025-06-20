
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

interface Threat {
  id: string
  threat_type: string
  threat_status: string
  threat_data: any
  severity_level: number
  created_at: string
}

export function useThreatDetection() {
  const [threats, setThreats] = useState<Threat[]>([])
  const [loading, setLoading] = useState(true)
  const [realTimeSocket, setRealTimeSocket] = useState<WebSocket | null>(null)
  const { session } = useAuth()

  useEffect(() => {
    if (session) {
      fetchThreats()
      setupRealTimeConnection()
    }

    return () => {
      if (realTimeSocket) {
        realTimeSocket.close()
      }
    }
  }, [session])

  const fetchThreats = async () => {
    try {
      const response = await supabase.functions.invoke('threat-detection', {
        body: { action: 'get-threats' }
      })

      if (response.error) {
        throw response.error
      }

      setThreats(response.data.threats || [])
    } catch (error) {
      console.error('Error fetching threats:', error)
      toast.error('Failed to load threats')
    } finally {
      setLoading(false)
    }
  }

  const setupRealTimeConnection = () => {
    if (!session) return

    const wsUrl = `wss://kimorwlrvulgdknvclqc.supabase.co/functions/v1/realtime-threats`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'auth',
        token: session.access_token
      }))
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      
      switch (message.type) {
        case 'auth_success':
          console.log('Real-time connection authenticated')
          break
        case 'threat_detected':
          toast.error(`New threat detected: ${message.threat.threatType}`)
          fetchThreats() // Refresh threats list
          break
        case 'new_threats':
          toast.warning(`${message.count} new threats detected`)
          fetchThreats()
          break
        case 'threat_patterns':
          message.patterns.forEach((pattern: any) => {
            if (pattern.severity >= 8) {
              toast.error(`Critical pattern detected: ${pattern.description}`)
            }
          })
          break
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    setRealTimeSocket(ws)
  }

  const reportThreat = async (threatData: any) => {
    try {
      const response = await supabase.functions.invoke('threat-detection', {
        body: { 
          action: 'report-threat', 
          threatData,
          severity: threatData.severity || 5
        }
      })

      if (response.error) {
        throw response.error
      }

      toast.success('Threat reported successfully')
      fetchThreats() // Refresh the list
      
      return response.data
    } catch (error) {
      console.error('Error reporting threat:', error)
      toast.error('Failed to report threat')
      throw error
    }
  }

  const resolveThreat = async (threatId: string) => {
    try {
      const response = await supabase.functions.invoke('threat-detection', {
        body: { action: 'resolve-threat', threatId }
      })

      if (response.error) {
        throw response.error
      }

      toast.success('Threat resolved')
      fetchThreats() // Refresh the list
    } catch (error) {
      console.error('Error resolving threat:', error)
      toast.error('Failed to resolve threat')
    }
  }

  const scanFile = async (fileHash: string) => {
    try {
      const response = await supabase.functions.invoke('threat-detection', {
        body: { action: 'scan-file', threatData: { fileHash } }
      })

      if (response.error) {
        throw response.error
      }

      return response.data.scanResult
    } catch (error) {
      console.error('Error scanning file:', error)
      toast.error('Failed to scan file')
      throw error
    }
  }

  return {
    threats,
    loading,
    reportThreat,
    resolveThreat,
    scanFile,
    refreshThreats: fetchThreats
  }
}
