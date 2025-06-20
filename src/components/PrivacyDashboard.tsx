
import React, { useState } from 'react'
import { usePrivacySettings } from '@/hooks/usePrivacySettings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Globe, Eye, Upload, Server } from 'lucide-react'
import { toast } from 'sonner'

export function PrivacyDashboard() {
  const { settings, loading, vpnConnected, updateSettings, connectVPN, disconnectVPN, uploadSecureFile } = usePrivacySettings()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleToggleSetting = async (key: keyof typeof settings, value: boolean) => {
    if (settings) {
      await updateSettings({ [key]: value })
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      try {
        await uploadSecureFile(file)
        setSelectedFile(null)
        event.target.value = '' // Reset input
      } catch (error) {
        console.error('Upload failed:', error)
      }
    }
  }

  if (loading || !settings) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Privacy Dashboard</h2>

      {/* VPN Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>VPN Protection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">VPN Status</p>
              <p className="text-sm text-muted-foreground">
                {vpnConnected ? 'Connected - Your traffic is encrypted' : 'Disconnected - Your traffic is not protected'}
              </p>
            </div>
            <div className="flex space-x-2">
              {vpnConnected ? (
                <Button onClick={disconnectVPN} variant="outline">
                  <Server className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              ) : (
                <Button onClick={() => connectVPN('US-East')}>
                  <Server className="h-4 w-4 mr-2" />
                  Connect to US-East
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Privacy Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ad-blocker">Ad Blocker</Label>
              <p className="text-sm text-muted-foreground">Block advertisements and tracking pixels</p>
            </div>
            <Switch
              id="ad-blocker"
              checked={settings.ad_blocker_enabled}
              onCheckedChange={(checked) => handleToggleSetting('ad_blocker_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="tracker-blocker">Tracker Blocker</Label>
              <p className="text-sm text-muted-foreground">Prevent websites from tracking your activity</p>
            </div>
            <Switch
              id="tracker-blocker"
              checked={settings.tracker_blocker_enabled}
              onCheckedChange={(checked) => handleToggleSetting('tracker_blocker_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="secure-dns">Secure DNS</Label>
              <p className="text-sm text-muted-foreground">Use encrypted DNS for enhanced privacy</p>
            </div>
            <Switch
              id="secure-dns"
              checked={settings.secure_dns_enabled}
              onCheckedChange={(checked) => handleToggleSetting('secure_dns_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="data-collection">Data Collection Consent</Label>
              <p className="text-sm text-muted-foreground">Allow anonymous usage analytics</p>
            </div>
            <Switch
              id="data-collection"
              checked={settings.data_collection_consent}
              onCheckedChange={(checked) => handleToggleSetting('data_collection_consent', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Secure File Vault */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Secure File Vault</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload sensitive files to your encrypted vault. Files are protected with AES-256 encryption.
            </p>
            
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                onChange={handleFileUpload}
                className="flex-1"
                accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              />
              <Button disabled={!selectedFile}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>

            {selectedFile && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm">
                  <strong>Selected:</strong> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
