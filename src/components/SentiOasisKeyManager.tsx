import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Copy, Check, Loader2 } from 'lucide-react';
import { APP_CONFIG } from '@/config';
import { huggingFaceService } from '@/services';

interface SentiOasisKeyManagerProps {
  onApiKeyGenerated?: (apiKey: string) => void;
}

export function SentiOasisKeyManager({ onApiKeyGenerated }: SentiOasisKeyManagerProps) {
  const [appName, setAppName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateKey = async () => {
    if (!appName.trim()) {
      setError('Please enter an application name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/auth/generate-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: appName }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate key');
      }

      const data = await response.json();
      setGeneratedKey(data.apiKey);
      
      // Auto-set the key in the service
      huggingFaceService.setApiKey(data.apiKey);
      
      if (onApiKeyGenerated) {
        onApiKeyGenerated(data.apiKey);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          SentiOasis API Access
        </CardTitle>
        <CardDescription>
          Generate a secure API key to access the sentiment analysis endpoints.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!generatedKey ? (
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="appName" className="sr-only">Application Name</Label>
              <Input
                id="appName"
                placeholder="Enter application name (e.g., My Demo App)"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
              />
            </div>
            <Button onClick={handleGenerateKey} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Key'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                API Key generated successfully! This key has been automatically applied to your current session.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label>Your API Key</Label>
              <div className="flex gap-2">
                <div className="flex-1 p-2 bg-muted rounded font-mono text-sm break-all">
                  {generatedKey}
                </div>
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-red-500">
                Make sure to copy this key. You won't be able to see it again.
              </p>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
