
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FirstAdminSetupProps {
  onSetupComplete: () => void;
}

const FirstAdminSetup = ({ onSetupComplete }: FirstAdminSetupProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!username || !email || !password) {
      setErrorMessage('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Create a hash for the password (this is done server-side in the function)
      const response = await supabase.functions.invoke('admin-auth', {
        body: { 
          method: 'create_first_admin', 
          username,
          email,
          password
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create admin user');
      }

      toast({
        title: "Success",
        description: "Admin account created successfully. You can now log in.",
      });
      
      onSetupComplete();
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      setErrorMessage(error.message || 'An error occurred during setup');
      toast({
        title: "Error",
        description: error.message || 'Failed to create admin user',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <Shield className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">SpeechHelp Admin</h1>
        <p className="text-white/80">First-time Setup</p>
      </div>
      
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Create Admin Account</CardTitle>
          <CardDescription>
            Set up your first administrator account to access the admin dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                autoComplete="username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                autoComplete="new-password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Admin Account'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center text-xs text-gray-500">
          This account will have full administrative privileges
        </CardFooter>
      </Card>
    </div>
  );
};

export default FirstAdminSetup;
