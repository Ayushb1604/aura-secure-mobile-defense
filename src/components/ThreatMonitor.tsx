
import React, { useState } from 'react'
import { useThreatDetection } from '@/hooks/useThreatDetection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Shield, CheckCircle, Clock, Scan } from 'lucide-react'
import { toast } from 'sonner'

export function ThreatMonitor() {
  const { threats, loading, resolveThreat, scanFile } = useThreatDetection()
  const [scanning, setScanning] = useState(false)

  const getSeverityColor = (level: number) => {
    if (level >= 8) return 'destructive'
    if (level >= 5) return 'secondary'
    return 'default'
  }

  const getSeverityIcon = (level: number) => {
    if (level >= 8) return <AlertTriangle className="h-4 w-4" />
    if (level >= 5) return <Shield className="h-4 w-4" />
    return <CheckCircle className="h-4 w-4" />
  }

  const handleScanFile = async () => {
    setScanning(true)
    try {
      // Simulate file hash for demo
      const mockFileHash = 'a1b2c3d4e5f6'
      const result = await scanFile(mockFileHash)
      
      if (result.malicious) {
        toast.error(`Malware detected! ${result.detections}/${result.engines} engines flagged this file`)
      } else {
        toast.success('File scan completed - No threats detected')
      }
    } catch (error) {
      toast.error('File scan failed')
    } finally {
      setScanning(false)
    }
  }

  if (loading) {
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Threat Monitor</h2>
        <Button onClick={handleScanFile} disabled={scanning}>
          <Scan className="h-4 w-4 mr-2" />
          {scanning ? 'Scanning...' : 'Quick Scan'}
        </Button>
      </div>

      {threats.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-green-600">All Clear!</p>
            <p className="text-muted-foreground">No active threats detected</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {threats.map((threat) => (
            <Card key={threat.id} className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    {getSeverityIcon(threat.severity_level)}
                    <span className="capitalize">{threat.threat_type.replace('_', ' ')}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getSeverityColor(threat.severity_level)}>
                      Severity {threat.severity_level}/10
                    </Badge>
                    <Badge variant={threat.threat_status === 'active' ? 'destructive' : 'default'}>
                      {threat.threat_status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4" />
                      <span>Detected: {new Date(threat.created_at).toLocaleString()}</span>
                    </div>
                    {threat.threat_data.description && (
                      <p className="mb-2">{threat.threat_data.description}</p>
                    )}
                    {threat.threat_data.source_ip && (
                      <p>Source IP: {threat.threat_data.source_ip}</p>
                    )}
                  </div>
                  
                  {threat.threat_status === 'active' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => resolveThreat(threat.id)}
                        variant="outline"
                      >
                        Mark as Resolved
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
