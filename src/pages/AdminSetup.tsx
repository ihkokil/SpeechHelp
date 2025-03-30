
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { CircleAlertIcon, ShieldIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSetup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !username || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
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
      
      toast({
        title: "Admin account created",
        description: "Your admin account has been set up successfully.",
      });
      
      navigate('/admin/login');
    } catch (err: any) {
      setError(err.message || 'Failed to create admin account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0edfb] p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="flex flex-col items-center gap-1">
            <img 
              src="/speech-help-new-logo.svg" 
              alt="SpeechHelp Logo" 
              className="h-12"
            />
            <h1 className="text-xl font-medium text-[#b44ca1]">Admin Portal</h1>
          </div>
        </div>
        
        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-semibold text-gray-800">Create Admin Account</h2>
                <p className="text-gray-500 text-sm">Set up your first administrator account</p>
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center text-sm">
                  <CircleAlertIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-gray-50"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#8E31A3] hover:bg-[#7d2a91]"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Admin Account"}
                </Button>
              </form>
              
              <div className="flex items-center justify-center text-xs text-gray-500 mt-6 gap-1">
                <ShieldIcon className="h-3 w-3" />
                <span>Use this option only for the initial setup of your admin portal</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSetup;
