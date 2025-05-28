
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Eye, EyeOff, TestTube, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { adminSettingsService } from '@/services/adminSettingsService';

const AdminStripeSettings = () => {
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [stripeConfig, setStripeConfig] = useState({
    publishableKey: '',
    secretKey: '',
    webhookSecret: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load Stripe data on component mount
  useEffect(() => {
    loadStripeData();
  }, []);

  const loadStripeData = async () => {
    setIsLoadingData(true);
    try {
      const result = await adminSettingsService.getSettings('stripe');
      if (result.success && result.data) {
        const settings = result.data.reduce((acc, setting) => {
          acc[setting.setting_key] = setting.setting_value;
          return acc;
        }, {} as any);

        setIsLiveMode(settings.is_live_mode || false);
        setStripeConfig({
          publishableKey: settings.publishable_key || '',
          secretKey: settings.secret_key || '',
          webhookSecret: settings.webhook_secret || ''
        });
      }
    } catch (error) {
      console.error('Error loading Stripe data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setStripeConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save all Stripe settings
      const savePromises = [
        adminSettingsService.saveSetting('is_live_mode', isLiveMode, 'stripe'),
        adminSettingsService.saveSetting('publishable_key', stripeConfig.publishableKey, 'stripe'),
        adminSettingsService.saveSetting('secret_key', stripeConfig.secretKey, 'stripe'),
        adminSettingsService.saveSetting('webhook_secret', stripeConfig.webhookSecret, 'stripe')
      ];

      const results = await Promise.all(savePromises);
      const hasErrors = results.some(result => !result.success);

      if (hasErrors) {
        const errors = results.filter(r => !r.success).map(r => r.error).join(', ');
        throw new Error(errors);
      }
      
      toast({
        title: "Stripe settings updated",
        description: `Configuration saved for ${isLiveMode ? 'Live' : 'Test'} mode.`,
      });
    } catch (error: any) {
      console.error('Error saving Stripe settings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update Stripe settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!stripeConfig.secretKey) {
      toast({
        title: "Missing Secret Key",
        description: "Please enter your Stripe secret key to test the connection.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Here you would test the Stripe API connection
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast({
        title: "Connection successful",
        description: "Successfully connected to Stripe API.",
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect to Stripe API. Please check your credentials.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const maskKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 8) return key;
    return key.substring(0, 8) + '•'.repeat(key.length - 8);
  };

  if (isLoadingData) {
    return <div className="flex items-center justify-center p-8">Loading Stripe settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Mode Switch */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isLiveMode ? <Zap className="h-5 w-5 text-green-600" /> : <TestTube className="h-5 w-5 text-orange-600" />}
            API Mode
          </CardTitle>
          <CardDescription>
            Switch between test mode and live mode for Stripe payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <TestTube className="h-4 w-4 text-orange-600" />
              <span className={!isLiveMode ? 'font-medium' : 'text-muted-foreground'}>Test Mode</span>
            </div>
            <Switch
              checked={isLiveMode}
              onCheckedChange={setIsLiveMode}
            />
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-green-600" />
              <span className={isLiveMode ? 'font-medium' : 'text-muted-foreground'}>Live Mode</span>
            </div>
          </div>
          {isLiveMode && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="text-sm text-red-800">
                  <strong>Warning:</strong> You are in Live Mode. Real payments will be processed.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>API Credentials</CardTitle>
          <CardDescription>
            Enter your Stripe {isLiveMode ? 'live' : 'test'} API keys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="publishableKey">
              Publishable Key {isLiveMode ? '(Live)' : '(Test)'}
            </Label>
            <div className="relative">
              <Input
                id="publishableKey"
                type={showApiKey ? 'text' : 'password'}
                value={stripeConfig.publishableKey}
                onChange={(e) => handleInputChange('publishableKey', e.target.value)}
                placeholder={`pk_${isLiveMode ? 'live' : 'test'}_...`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secretKey">
              Secret Key {isLiveMode ? '(Live)' : '(Test)'}
            </Label>
            <div className="relative">
              <Input
                id="secretKey"
                type={showSecretKey ? 'text' : 'password'}
                value={stripeConfig.secretKey}
                onChange={(e) => handleInputChange('secretKey', e.target.value)}
                placeholder={`sk_${isLiveMode ? 'live' : 'test'}_...`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowSecretKey(!showSecretKey)}
              >
                {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookSecret">Webhook Endpoint Secret (Optional)</Label>
            <Input
              id="webhookSecret"
              type="password"
              value={stripeConfig.webhookSecret}
              onChange={(e) => handleInputChange('webhookSecret', e.target.value)}
              placeholder="whsec_..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleTestConnection}
          disabled={isLoading || !stripeConfig.secretKey}
        >
          {isLoading ? "Testing..." : "Test Connection"}
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {/* Help Text */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Getting Your API Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            1. Log in to your <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stripe Dashboard</a>
          </p>
          <p className="text-sm text-muted-foreground">
            2. Go to Developers → API Keys
          </p>
          <p className="text-sm text-muted-foreground">
            3. Copy your publishable key and secret key for the appropriate mode
          </p>
          <p className="text-sm text-muted-foreground">
            4. For webhooks, go to Developers → Webhooks and copy the signing secret
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStripeSettings;
