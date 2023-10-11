
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface AdminSignupFormProps {
  onAdminExistsError: () => void;
}

const AdminSignupForm = ({ onAdminExistsError }: AdminSignupFormProps) => {
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
        if (error.message.includes('Admin users already exist')) {
          onAdminExistsError();
          return;
        }
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center text-sm">
          <div className="mr-2 flex-shrink-0">⚠️</div>
          {error}
        </div>
      )}
      
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
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Admin Account"}
      </Button>
    </form>
  );
};

export default AdminSignupForm;
