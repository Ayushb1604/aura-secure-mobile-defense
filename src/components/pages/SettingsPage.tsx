
import React from 'react';
import { Settings, User, Bell, Lock, Shield, Trash, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useSecurity } from '../SecurityProvider';

export const SettingsPage: React.FC = () => {
  const { batteryLevel, setBatteryLevel } = useSecurity();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Battery Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Battery Level Simulation</label>
            <Slider
              value={[batteryLevel]}
              onValueChange={(value) => setBatteryLevel(value[0])}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">Current: {batteryLevel}%</p>
          </div>
          <div className="flex items-center justify-between">
            <span>Auto Low Power Mode (&lt; 15%)</span>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Real-time Protection</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>Auto Threat Detection</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>Cloud Security Sync</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>Advanced Threat Analysis</span>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Privacy Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Anonymous Usage Data</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <span>Auto-delete Logs</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>Secure DNS</span>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Threat Alerts</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>Scan Completion</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>VPN Status Changes</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>System Health Updates</span>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Trash className="h-4 w-4" />
              <span>Junk Cleaner</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>App Booster</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Device Health</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Account Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Smart Performance Optimizer
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Automated Security Reports
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Behavioral Analysis Engine
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Predictive Threat Detection
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Advanced Forensic Tools
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Enterprise Security Bridge
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
