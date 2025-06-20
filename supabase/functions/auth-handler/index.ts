
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

    const { action, email, password, mfaCode, phone } = await req.json()

    switch (action) {
      case 'login':
        const { data: loginData, error: loginError } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        })
        
        if (loginError) {
          return new Response(
            JSON.stringify({ error: loginError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        // Log security audit
        await supabaseClient.from('security_audit').insert({
          user_id: loginData.user.id,
          event_type: 'login',
          event_data: { success: true, method: 'password' },
          ip_address: req.headers.get('x-forwarded-for'),
          user_agent: req.headers.get('user-agent')
        })

        return new Response(
          JSON.stringify({ user: loginData.user, session: loginData.session }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'signup':
        const { data: signupData, error: signupError } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${req.headers.get('origin')}/auth/callback`
          }
        })

        if (signupError) {
          return new Response(
            JSON.stringify({ error: signupError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        return new Response(
          JSON.stringify({ user: signupData.user }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'setup-mfa':
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

        // Store MFA settings
        const { error: mfaError } = await supabaseClient.from('mfa_settings').upsert({
          user_id: userData.user.id,
          mfa_type: phone ? 'sms' : 'email',
          phone_number: phone,
          is_enabled: true
        })

        if (mfaError) {
          return new Response(
            JSON.stringify({ error: mfaError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
  } catch (error) {
    console.error('Auth handler error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
