
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  const { headers } = req
  const upgradeHeader = headers.get("upgrade") || ""

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 })
  }

  const { socket, response } = Deno.upgradeWebSocket(req)
  
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  )

  let userId: string | null = null

  socket.onopen = () => {
    console.log("WebSocket connection opened")
  }

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data)
      
      if (message.type === 'auth') {
        const { data: userData } = await supabaseClient.auth.getUser(message.token)
        if (userData.user) {
          userId = userData.user.id
          socket.send(JSON.stringify({ type: 'auth_success', userId }))
          
          // Start monitoring threats for this user
          startThreatMonitoring(userId, socket, supabaseClient)
        } else {
          socket.send(JSON.stringify({ type: 'auth_error', message: 'Invalid token' }))
        }
      }
      
      if (message.type === 'threat_alert') {
        // Handle real-time threat reporting
        if (userId) {
          await supabaseClient.from('threat_logs').insert({
            user_id: userId,
            threat_type: message.threatType,
            threat_data: message.data,
            severity_level: message.severity || 5
          })
          
          // Broadcast to all connected clients for this user
          socket.send(JSON.stringify({
            type: 'threat_detected',
            threat: message,
            timestamp: new Date().toISOString()
          }))
        }
      }
    } catch (error) {
      console.error('WebSocket message error:', error)
      socket.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }))
    }
  }

  socket.onclose = () => {
    console.log("WebSocket connection closed")
  }

  socket.onerror = (error) => {
    console.error("WebSocket error:", error)
  }

  return response
})

async function startThreatMonitoring(userId: string, socket: WebSocket, supabaseClient: any) {
  // Simulate real-time threat monitoring
  const monitoringInterval = setInterval(async () => {
    try {
      // Check for new threats
      const { data: recentThreats } = await supabaseClient
        .from('threat_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('threat_status', 'active')
        .gte('created_at', new Date(Date.now() - 60000).toISOString()) // Last minute

      if (recentThreats && recentThreats.length > 0) {
        socket.send(JSON.stringify({
          type: 'new_threats',
          threats: recentThreats,
          count: recentThreats.length
        }))
      }

      // Simulate AI threat pattern detection
      const threatPatterns = await detectThreatPatterns(userId, supabaseClient)
      if (threatPatterns.length > 0) {
        socket.send(JSON.stringify({
          type: 'threat_patterns',
          patterns: threatPatterns
        }))
      }
    } catch (error) {
      console.error('Threat monitoring error:', error)
    }
  }, 30000) // Check every 30 seconds

  // Clean up on connection close
  socket.addEventListener('close', () => {
    clearInterval(monitoringInterval)
  })
}

async function detectThreatPatterns(userId: string, supabaseClient: any) {
  // AI-based pattern detection (simplified version)
  const { data: threats } = await supabaseClient
    .from('threat_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 3600000).toISOString()) // Last hour

  const patterns = []
  
  if (threats && threats.length > 5) {
    patterns.push({
      type: 'high_activity',
      description: 'Unusually high threat activity detected',
      severity: 7,
      count: threats.length
    })
  }

  const malwareThreats = threats?.filter(t => t.threat_type === 'malware') || []
  if (malwareThreats.length > 2) {
    patterns.push({
      type: 'malware_cluster',
      description: 'Multiple malware threats detected',
      severity: 9,
      count: malwareThreats.length
    })
  }

  return patterns
}
