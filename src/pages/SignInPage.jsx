import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CheckSquare } from 'lucide-react';

const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authService.signin(username, password);
      console.log(data);
      
      login(data.accessToken, username.trim().toLowerCase());
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Sign in failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1663497653290-1b8f327096f7?crop=entropy&cs=srgb&fm=jpg&q=85)',
        }}
      >
        <div className="absolute inset-0 bg-slate-900/40" />
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckSquare className="w-12 h-12 text-slate-900" strokeWidth={2} />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Sign in to TaskWiz
            </h2>
            <p className="mt-2 text-slate-600">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="signin-form">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                minLength={8}
                data-testid="signin-username-input"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                data-testid="signin-password-input"
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              data-testid="signin-submit-button"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11 font-medium shadow-sm transition-all active:scale-95"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                data-testid="signup-link"
                className="font-medium text-slate-900 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
