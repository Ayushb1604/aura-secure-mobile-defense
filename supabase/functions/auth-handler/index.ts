
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

    const { action, email, password, fullName, phone } = await req.json()

    switch (action) {
      case 'login':
        const { data: loginData, error: loginError } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        })
        
        if (loginError) {
          // Handle email not confirmed error more gracefully
          if (loginError.message.includes('Email not confirmed')) {
            return new Response(
              JSON.stringify({ 
                error: 'Please check your email and click the confirmation link before signing in. Check your spam folder if you don\'t see the email.',
                code: 'email_not_confirmed'
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
          }
          
          return new Response(
            JSON.stringify({ error: loginError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        // Log security audit
        if (loginData.user) {
          await supabaseClient.from('security_audit').insert({
            user_id: loginData.user.id,
            event_type: 'login',
            event_data: { success: true, method: 'password' },
            ip_address: req.headers.get('x-forwarded-for'),
            user_agent: req.headers.get('user-agent')
          })
        }

        return new Response(
          JSON.stringify({ user: loginData.user, session: loginData.session }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'signup':
        const { data: signupData, error: signupError } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${req.headers.get('origin')}/`,
            data: {
              full_name: fullName
            }
          }
        })

        if (signupError) {
          return new Response(
            JSON.stringify({ error: signupError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        return new Response(
          JSON.stringify({ 
            user: signupData.user,
            message: 'Account created successfully! Please check your email to confirm your account before signing in.'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'setup-mfa':
        // For MFA setup, we'll store the phone number for the current session
        // This doesn't require authentication since it's part of the signup process
        const sessionData = await supabaseClient.auth.getSession()
        let userId = null
        
        if (sessionData.data.session?.user) {
          userId = sessionData.data.session.user.id
        } else {
          // If no session, this might be during signup - we'll handle it differently
          return new Response(
            JSON.stringify({ 
              success: true,
              message: 'MFA settings will be configured after email confirmation'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Store MFA settings
        const { error: mfaError } = await supabaseClient.from('mfa_settings').upsert({
          user_id: userId,
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
          JSON.stringify({ success: true, message: 'MFA settings updated successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'resend-confirmation':
        const { error: resendError } = await supabaseClient.auth.resend({
          type: 'signup',
          email: email,
          options: {
            emailRedirectTo: `${req.headers.get('origin')}/`
          }
        })

        if (resendError) {
          return new Response(
            JSON.stringify({ error: resendError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Confirmation email sent' }),
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
