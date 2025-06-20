
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

    const { action, settings, serverLocation, fileData } = await req.json()

    switch (action) {
      case 'get-settings':
        const { data: privacySettings, error } = await supabaseClient
          .from('privacy_settings')
          .select('*')
          .eq('user_id', userData.user.id)
          .single()

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        return new Response(
          JSON.stringify({ settings: privacySettings }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'update-settings':
        const { error: updateError } = await supabaseClient
          .from('privacy_settings')
          .update(settings)
          .eq('user_id', userData.user.id)

        if (updateError) {
          return new Response(
            JSON.stringify({ error: updateError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'connect-vpn':
        // Start VPN session
        const { data: vpnSession, error: vpnError } = await supabaseClient
          .from('vpn_sessions')
          .insert({
            user_id: userData.user.id,
            server_location: serverLocation,
            is_active: true
          })
          .select()
          .single()

        if (vpnError) {
          return new Response(
            JSON.stringify({ error: vpnError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        return new Response(
          JSON.stringify({ session: vpnSession }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'disconnect-vpn':
        const { error: disconnectError } = await supabaseClient
          .from('vpn_sessions')
          .update({ 
            is_active: false, 
            disconnected_at: new Date().toISOString() 
          })
          .eq('user_id', userData.user.id)
          .eq('is_active', true)

        if (disconnectError) {
          return new Response(
            JSON.stringify({ error: disconnectError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'upload-secure-file':
        // Encrypt and store file
        const encryptedFile = await encryptFile(fileData)
        
        const { data: secureFile, error: fileError } = await supabaseClient
          .from('secure_files')
          .insert({
            user_id: userData.user.id,
            file_name: fileData.name,
            file_size: fileData.size,
            mime_type: fileData.type,
            encryption_key_hash: encryptedFile.keyHash,
            storage_path: encryptedFile.path
          })
          .select()
          .single()

        if (fileError) {
          return new Response(
            JSON.stringify({ error: fileError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        return new Response(
          JSON.stringify({ file: secureFile }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'get-blocklist':
        // Return ad/tracker blocklist
        const blocklist = await getBlocklist()
        
        return new Response(
          JSON.stringify({ blocklist }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
  } catch (error) {
    console.error('Privacy manager error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function encryptFile(fileData: any) {
  // Placeholder for AES-256 encryption
  const keyHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(fileData.name + Date.now()))
  return {
    keyHash: Array.from(new Uint8Array(keyHash)).map(b => b.toString(16).padStart(2, '0')).join(''),
    path: `/secure/${crypto.randomUUID()}`
  }
}

async function getBlocklist() {
  // Dynamic blocklist for ads and trackers
  return [
    'doubleclick.net',
    'googleadservices.com',
    'googlesyndication.com',
    'facebook.com/tr',
    'analytics.google.com',
    'googletagmanager.com'
  ]
}
