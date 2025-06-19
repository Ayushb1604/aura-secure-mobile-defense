
import React, { useState } from 'react';
import { Shield, Search, FileSearch, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useSecurity } from '../SecurityProvider';

export const AntivirusPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanType, setScanType] = useState<string>('');
  const [linkToCheck, setLinkToCheck] = useState('');
  const { runQuickScan } = useSecurity();

  const startScan = (type: string) => {
    setScanType(type);
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          runQuickScan();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const checkLink = () => {
    if (linkToCheck) {
      console.log('Checking link for phishing:', linkToCheck);
      // Simulate link check
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Security Scanner</h1>
      </div>

      {/* Scan Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Quick Scan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Fast scan of critical system areas
            </p>
            <Button 
              onClick={() => startScan('quick')} 
              disabled={isScanning}
              className="w-full"
            >
              Start Quick Scan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Full System Scan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Comprehensive scan of entire device
            </p>
            <Button 
              onClick={() => startScan('full')} 
              disabled={isScanning}
              variant="outline"
              className="w-full"
            >
              Start Full Scan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileSearch className="h-5 w-5" />
              <span>Custom Scan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Scan specific files or folders
            </p>
            <Button 
              onClick={() => startScan('custom')} 
              disabled={isScanning}
              variant="outline"
              className="w-full"
            >
              Select Files
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Scan Progress */}
      {isScanning && (
        <Card>
          <CardHeader>
            <CardTitle>Scanning in Progress...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Scanning {scanType} scan</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} />
              <p className="text-sm text-muted-foreground">
                Please wait while we scan your device for threats...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Link Checker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Phishing Link Checker</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Paste a suspicious link to check if it's a phishing attempt
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Paste link here..."
                value={linkToCheck}
                onChange={(e) => setLinkToCheck(e.target.value)}
                className="flex-1"
              />
              <Button onClick={checkLink} disabled={!linkToCheck}>
                Check Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Real-time Protection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>File System Monitor</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span>App Activity Scanner</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span>Environment Scanner</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span>Cryptomining Protection</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Sandbox Environment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Lock className="h-4 w-4 mr-2" />
              Permission Manager
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Vulnerability Scanner
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
