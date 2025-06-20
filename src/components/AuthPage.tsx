
import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Lock, Mail, Phone, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResendButton, setShowResendButton] = useState(false)
  const { signIn, signUp, setupMFA, resendConfirmation } = useAuth()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setShowResendButton(false)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        if (error.code === 'email_not_confirmed') {
          toast.error(error.error || 'Please confirm your email before signing in')
          setShowResendButton(true)
        } else {
          toast.error(error.error || error.message || 'Failed to sign in')
        }
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error, message } = await signUp(email, password, fullName)
      if (error) {
        toast.error(error.error || error.message || 'Failed to sign up')
      } else {
        toast.success(message || 'Account created! Please check your email to confirm your account.')
        setShowResendButton(true)
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleMFASetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await setupMFA(phone)
      if (error) {
        toast.error(error.error || error.message || 'Failed to setup MFA')
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)
    try {
      const { error } = await resendConfirmation(email)
      if (error) {
        toast.error(error.error || error.message || 'Failed to resend confirmation')
      } else {
        toast.success('Confirmation email sent! Check your inbox.')
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Aura Secure
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Mobile Defense System
          </p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="mfa">MFA Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Sign In</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                  
                  {showResendButton && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleResendConfirmation}
                      disabled={loading}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Resend Confirmation Email
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Create Account</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                  
                  {showResendButton && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        Didn't receive the confirmation email?
                      </p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={handleResendConfirmation}
                        disabled={loading}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Resend Email
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mfa">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Multi-Factor Authentication</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMFASetup} className="space-y-4">
                  <div>
                    <Label htmlFor="mfa-phone">Phone Number (Optional)</Label>
                    <Input
                      id="mfa-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Leave empty to use email-based MFA
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Setting up MFA...' : 'Setup MFA'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
