
import React from 'react';
import { Shield, Battery, Zap, Users, AlertTriangle, CheckCircle, Clock, Lock } from 'lucide-react';
import { useSecurity } from './SecurityProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export const Dashboard: React.FC = () => {
  const { batteryLevel, isLowPowerMode, threatLevel, lastScanTime, isVPNActive, runQuickScan, toggleLowPowerMode } = useSecurity();

  const getBatteryColor = () => {
    if (batteryLevel < 15) return 'text-red-500';
    if (batteryLevel < 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getThreatColor = () => {
    switch (threatLevel) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Security Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className={`font-medium ${getThreatColor()}`}>
            Threat Level: {threatLevel.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Battery Status</CardTitle>
            <Battery className={`h-4 w-4 ${getBatteryColor()}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batteryLevel}%</div>
            <Progress value={batteryLevel} className="mt-2" />
            {isLowPowerMode && (
              <p className="text-xs text-yellow-600 mt-1">Low Power Mode Active</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VPN Status</CardTitle>
            <Zap className={`h-4 w-4 ${isVPNActive ? 'text-green-500' : 'text-gray-400'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isVPNActive ? 'Protected' : 'Disconnected'}</div>
            <p className="text-xs text-muted-foreground">
              {isVPNActive ? 'Your connection is secure' : 'Click to connect'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Scan</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastScanTime === 'Never' ? 'Never' : 'Today'}
            </div>
            <p className="text-xs text-muted-foreground">{lastScanTime}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98/100</div>
            <p className="text-xs text-muted-foreground">Excellent security</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Button onClick={runQuickScan} className="flex flex-col items-center p-4 h-auto">
              <Shield className="h-6 w-6 mb-2" />
              Quick Scan
            </Button>
            <Button onClick={toggleLowPowerMode} variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Battery className="h-6 w-6 mb-2" />
              {isLowPowerMode ? 'Disable' : 'Enable'} Low Power
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Lock className="h-6 w-6 mb-2" />
              App Lock
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Threat Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Protections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Real-time Protection</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span>Firewall</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span>Anti-phishing</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span>Spam Protection</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <p className="font-medium">No threats detected</p>
              <p className="text-muted-foreground">Last scan: {lastScanTime}</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">VPN Status</p>
              <p className="text-muted-foreground">{isVPNActive ? 'Connected to secure server' : 'Not connected'}</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">System Health</p>
              <p className="text-muted-foreground">All systems operating normally</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
