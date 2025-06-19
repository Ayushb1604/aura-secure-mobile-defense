
import React from 'react';
import { Zap, Globe, Shield, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSecurity } from '../SecurityProvider';

export const VPNPage: React.FC = () => {
  const { isVPNActive, setIsVPNActive } = useSecurity();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Zap className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">VPN & Protection</h1>
      </div>

      {/* VPN Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>AI-Optimized VPN</span>
            <Switch
              checked={isVPNActive}
              onCheckedChange={setIsVPNActive}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isVPNActive ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium">
                {isVPNActive ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            {isVPNActive && (
              <div className="text-sm text-muted-foreground">
                <p>Server: USA East (Optimized)</p>
                <p>IP: 192.168.1.1 → 203.0.113.1</p>
                <p>Encryption: AES-256</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* VPN Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>AI Tunneling</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Auto Server Selection</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Traffic Optimization</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Smart Routing</span>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Split Tunneling</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Enable Split Tunneling</span>
              <Switch />
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Configure Apps
            </Button>
            <p className="text-xs text-muted-foreground">
              Choose which apps use VPN connection
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Protection Features */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Protection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Shield className="h-6 w-6 mb-2" />
              Firewall
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Globe className="h-6 w-6 mb-2" />
              Web Protection
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Shield className="h-6 w-6 mb-2" />
              Anti-Spam
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Settings className="h-6 w-6 mb-2" />
              Keylogger Protection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Manager & Vault */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Password Manager</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full">Setup Password Manager</Button>
            <div className="text-sm text-muted-foreground">
              <p>• Auto-fill passwords</p>
              <p>• Generate secure passwords</p>
              <p>• Sync across devices</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Secure Vault</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full">Setup Security Vault</Button>
            <div className="text-sm text-muted-foreground">
              <p>• Store credit card details</p>
              <p>• Save sensitive documents</p>
              <p>• Encrypted storage</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
