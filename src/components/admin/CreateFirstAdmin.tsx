
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CircleAlertIcon, KeyIcon } from 'lucide-react';

const CreateFirstAdmin = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    if (!email || !username || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('create_first_admin', {
        email_input: email,
        username_input: username,
        password_input: password
      });
      
      if (error) {
        throw error;
      }
      
      setSuccess(true);
      toast({
        title: "Admin created successfully",
        description: "You can now log in to the admin portal",
      });
    } catch (err: any) {
      console.error("Error creating admin:", err);
      setError(err.message || 'Failed to create admin account');
      toast({
        title: "Failed to create admin",
        description: err.message || 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Created Successfully</CardTitle>
          <CardDescription>
            Your admin account has been created. You can now log in to the admin portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              For security reasons, please make note of your admin credentials and keep them safe.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
            onClick={() => window.location.href = '/admin/login'}
          >
            Go to Admin Login
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Admin Account</CardTitle>
        <CardDescription>
          Set up the first admin account for SpeechHelp
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-800 p-3 rounded-md mb-4 flex items-center text-sm">
            <CircleAlertIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <p className="text-xs text-gray-500">Must be at least 8 characters long</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Admin...
              </span>
            ) : (
              <span className="flex items-center">
                <KeyIcon className="h-4 w-4 mr-2" />
                Create Admin Account
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateFirstAdmin;
