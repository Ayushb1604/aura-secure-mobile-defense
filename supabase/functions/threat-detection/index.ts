
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const { data: userData } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))
    if (!userData.user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const { action, threatData, threatId, severity } = await req.json()

    switch (action) {
      case 'report-threat':
        // AI-based threat analysis would go here
        const threatScore = analyzeThreat(threatData)
        
        const { data: threat, error: threatError } = await supabaseClient
          .from('threat_logs')
          .insert({
            user_id: userData.user.id,
            threat_type: threatData.type,
            threat_data: threatData,
            severity_level: severity || threatScore,
            source_ip: req.headers.get('x-forwarded-for'),
            device_fingerprint: threatData.deviceFingerprint
          })
          .select()
          .single()

        if (threatError) {
          return new Response(
            JSON.stringify({ error: threatError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        // Log security audit
        await supabaseClient.from('security_audit').insert({
          user_id: userData.user.id,
          event_type: 'threat_detected',
          event_data: { threat_id: threat.id, type: threatData.type, severity: severity || threatScore }
        })

        return new Response(
          JSON.stringify({ threat, riskScore: threatScore }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'get-threats':
        const { data: threats, error: getError } = await supabaseClient
          .from('threat_logs')
          .select('*')
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (getError) {
          return new Response(
            JSON.stringify({ error: getError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        return new Response(
          JSON.stringify({ threats }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'resolve-threat':
        const { error: resolveError } = await supabaseClient
          .from('threat_logs')
          .update({ threat_status: 'resolved', resolved_at: new Date().toISOString() })
          .eq('id', threatId)
          .eq('user_id', userData.user.id)

        if (resolveError) {
          return new Response(
            JSON.stringify({ error: resolveError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'scan-file':
        // Integration with VirusTotal would go here
        const scanResult = await scanFileWithVirusTotal(threatData.fileHash)
        
        return new Response(
          JSON.stringify({ scanResult }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
  } catch (error) {
    console.error('Threat detection error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

function analyzeThreat(threatData: any): number {
  // Simple threat scoring algorithm - in production this would use ML
  let score = 1
  
  if (threatData.type === 'malware') score += 5
  if (threatData.type === 'phishing') score += 4
  if (threatData.suspicious_network_activity) score += 3
  if (threatData.unknown_source) score += 2
  
  return Math.min(score, 10)
}

async function scanFileWithVirusTotal(fileHash: string) {
  // Placeholder for VirusTotal integration
  // In production, you'd use the VirusTotal API key from secrets
  return {
    hash: fileHash,
    malicious: false,
    scanned: true,
    engines: 70,
    detections: 0
  }
}
