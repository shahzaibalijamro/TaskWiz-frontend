import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { authService } from '../services/authService';
import { setCredentials } from '../store/authSlice';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export default function SignInPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.signin(formData.username, formData.password);
      dispatch(setCredentials({ token: response.accessToken, username: formData.username }));
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-8 bg-background"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-base text-muted-foreground">
              Sign in to manage your tasks efficiently
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="signin-form">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                data-testid="username-input"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                placeholder="Enter your username"
                className="transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  data-testid="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="Enter your password"
                  className="pr-10 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="toggle-password-visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11"
              data-testid="signin-submit-button"
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-primary hover:underline"
                data-testid="signup-link"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      <div
        className="hidden lg:block relative overflow-hidden bg-muted"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1759960034404-6177700c19ec?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYWJzdHJhY3QlMjBnZW9tZXRyaWMlMjBzaGFwZXMlMjBwcm9kdWN0aXZpdHl8ZW58MHx8fHwxNzY3NDU2NzU3fDA&ixlib=rb-4.1.0&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
      </div>
    </div>
  );
}