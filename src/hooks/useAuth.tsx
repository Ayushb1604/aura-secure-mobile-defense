
import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  setupMFA: (phone?: string) => Promise<{ error: any }>
  resendConfirmation: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (event === 'SIGNED_IN') {
          toast.success('Successfully signed in!')
        } else if (event === 'SIGNED_OUT') {
          toast.success('Successfully signed out!')
        }
      }
    )

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const response = await supabase.functions.invoke('auth-handler', {
        body: { action: 'login', email, password }
      })
      
      if (response.error) {
        throw response.error
      }

      if (response.data?.error) {
        return { error: response.data }
      }
      
      return { error: null }
    } catch (error: any) {
      console.error('Sign in error:', error)
      return { error }
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const response = await supabase.functions.invoke('auth-handler', {
        body: { 
          action: 'signup', 
          email, 
          password,
          fullName 
        }
      })
      
      if (response.error) {
        throw response.error
      }

      if (response.data?.error) {
        return { error: response.data }
      }
      
      return { error: null, message: response.data?.message }
    } catch (error: any) {
      console.error('Sign up error:', error)
      return { error }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
      toast.error('Error signing out')
    }
  }

  const setupMFA = async (phone?: string) => {
    try {
      const response = await supabase.functions.invoke('auth-handler', {
        body: { action: 'setup-mfa', phone }
      })
      
      if (response.error) {
        throw response.error
      }

      if (response.data?.error) {
        return { error: response.data }
      }
      
      if (response.data?.message) {
        toast.success(response.data.message)
      }
      
      return { error: null }
    } catch (error: any) {
      console.error('MFA setup error:', error)
      return { error }
    }
  }

  const resendConfirmation = async (email: string) => {
    try {
      const response = await supabase.functions.invoke('auth-handler', {
        body: { action: 'resend-confirmation', email }
      })
      
      if (response.error) {
        throw response.error
      }

      if (response.data?.error) {
        return { error: response.data }
      }
      
      return { error: null }
    } catch (error: any) {
      console.error('Resend confirmation error:', error)
      return { error }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      setupMFA,
      resendConfirmation
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
