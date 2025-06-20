
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

interface PrivacySettings {
  vpn_enabled: boolean
  ad_blocker_enabled: boolean
  tracker_blocker_enabled: boolean
  secure_dns_enabled: boolean
  data_collection_consent: boolean
}

export function usePrivacySettings() {
  const [settings, setSettings] = useState<PrivacySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [vpnConnected, setVpnConnected] = useState(false)
  const { session } = useAuth()

  useEffect(() => {
    if (session) {
      fetchSettings()
    }
  }, [session])

  const fetchSettings = async () => {
    try {
      const response = await supabase.functions.invoke('privacy-manager', {
        body: { action: 'get-settings' }
      })

      if (response.error) {
        throw response.error
      }

      setSettings(response.data.settings)
    } catch (error) {
      console.error('Error fetching privacy settings:', error)
      toast.error('Failed to load privacy settings')
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings: Partial<PrivacySettings>) => {
    try {
      const response = await supabase.functions.invoke('privacy-manager', {
        body: { action: 'update-settings', settings: newSettings }
      })

      if (response.error) {
        throw response.error
      }

      setSettings(prev => prev ? { ...prev, ...newSettings } : null)
      toast.success('Privacy settings updated')
    } catch (error) {
      console.error('Error updating privacy settings:', error)
      toast.error('Failed to update privacy settings')
    }
  }

  const connectVPN = async (serverLocation: string = 'US-East') => {
    try {
      const response = await supabase.functions.invoke('privacy-manager', {
        body: { action: 'connect-vpn', serverLocation }
      })

      if (response.error) {
        throw response.error
      }

      setVpnConnected(true)
      toast.success(`VPN connected to ${serverLocation}`)
    } catch (error) {
      console.error('Error connecting VPN:', error)
      toast.error('Failed to connect VPN')
    }
  }

  const disconnectVPN = async () => {
    try {
      const response = await supabase.functions.invoke('privacy-manager', {
        body: { action: 'disconnect-vpn' }
      })

      if (response.error) {
        throw response.error
      }

      setVpnConnected(false)
      toast.success('VPN disconnected')
    } catch (error) {
      console.error('Error disconnecting VPN:', error)
      toast.error('Failed to disconnect VPN')
    }
  }

  const uploadSecureFile = async (file: File) => {
    try {
      const response = await supabase.functions.invoke('privacy-manager', {
        body: { 
          action: 'upload-secure-file', 
          fileData: {
            name: file.name,
            size: file.size,
            type: file.type
          }
        }
      })

      if (response.error) {
        throw response.error
      }

      toast.success('File uploaded to secure vault')
      return response.data.file
    } catch (error) {
      console.error('Error uploading secure file:', error)
      toast.error('Failed to upload file')
      throw error
    }
  }

  const getBlocklist = async () => {
    try {
      const response = await supabase.functions.invoke('privacy-manager', {
        body: { action: 'get-blocklist' }
      })

      if (response.error) {
        throw response.error
      }

      return response.data.blocklist
    } catch (error) {
      console.error('Error fetching blocklist:', error)
      toast.error('Failed to fetch blocklist')
      throw error
    }
  }

  return {
    settings,
    loading,
    vpnConnected,
    updateSettings,
    connectVPN,
    disconnectVPN,
    uploadSecureFile,
    getBlocklist,
    refreshSettings: fetchSettings
  }
}
