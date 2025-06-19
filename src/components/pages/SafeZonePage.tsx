
import React, { useState } from 'react';
import { Shield, Lock, AlertTriangle, Power, Users, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export const SafeZonePage: React.FC = () => {
  const [isKillSwitchActive, setIsKillSwitchActive] = useState(false);
  const [isDeviceLocked, setIsDeviceLocked] = useState(false);
  const [isNetworkIsolated, setIsNetworkIsolated] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  const activateEmergencyMode = () => {
    setIsEmergencyMode(true);
    setIsKillSwitchActive(true);
    setIsDeviceLocked(true);
    setIsNetworkIsolated(true);
    console.log('Emergency mode activated - all systems locked down');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-8 w-8 text-red-600" />
        <h1 className="text-3xl font-bold">Safe Zone</h1>
      </div>

      {/* Emergency Actions */}
      <Card className={`border-2 ${isEmergencyMode ? 'border-red-500' : 'border-border'}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Emergency Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isEmergencyMode && (
              <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 font-medium">
                  ⚠️ EMERGENCY MODE ACTIVE
                </p>
                <p className="text-sm text-red-600 dark:text-red-300">
                  All security measures have been activated
                </p>
              </div>
            )}
            <Button 
              onClick={activateEmergencyMode}
              disabled={isEmergencyMode}
              variant="destructive" 
              size="lg" 
              className="w-full"
            >
              <Power className="h-5 w-5 mr-2" />
              ACTIVATE EMERGENCY MODE
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Instantly activates all protective measures
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Individual Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Power className="h-5 w-5" />
              <span>Kill Switch</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Kill Switch Active</span>
              <Switch
                checked={isKillSwitchActive}
                onCheckedChange={setIsKillSwitchActive}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Instantly terminates all network connections when threat detected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Device Lockdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Lockdown Active</span>
              <Switch
                checked={isDeviceLocked}
                onCheckedChange={setIsDeviceLocked}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Restricts device access and locks sensitive applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Network Isolation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Isolation Active</span>
              <Switch
                checked={isNetworkIsolated}
                onCheckedChange={setIsNetworkIsolated}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Isolates device from network to prevent data breaches
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Safety Features */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Safety Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Users className="h-6 w-6 mb-2" />
              Parental Controls
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Settings className="h-6 w-6 mb-2" />
              Multi-Device Management
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Threat Analysis
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Power className="h-6 w-6 mb-2" />
              Halt Operations
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Real-time Monitoring</span>
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span>Threat Detection</span>
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span>Emergency Response</span>
              <div className={`w-3 h-3 rounded-full ${isEmergencyMode ? 'bg-red-500' : 'bg-green-500'}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
