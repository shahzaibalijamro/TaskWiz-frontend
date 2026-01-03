import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CheckSquare, Check, X } from 'lucide-react';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validatePassword = (pwd) => {
    return {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };
  };

  const passwordChecks = validatePassword(password);
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.trim().length < 8) {
      toast.error('Username must be at least 8 characters');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Password does not meet all requirements');
      return;
    }

    setLoading(true);

    try {
      await authService.signup(username, password);
      toast.success('Account created successfully! Please sign in.');
      navigate('/signin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sign up failed. Username may already exist.');
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
              Create your account
            </h2>
            <p className="mt-2 text-slate-600">Start managing your tasks efficiently.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="signup-form">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username (min 8 characters)"
                required
                minLength={8}
                data-testid="signup-username-input"
                className="h-11"
              />
              <p className="text-xs text-slate-500">Will be converted to lowercase</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                data-testid="signup-password-input"
                className="h-11"
              />
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium text-slate-700">Password requirements:</p>
                <div className="space-y-1">
                  {[
                    { key: 'length', label: 'At least 8 characters' },
                    { key: 'uppercase', label: 'One uppercase letter' },
                    { key: 'lowercase', label: 'One lowercase letter' },
                    { key: 'number', label: 'One number' },
                    { key: 'special', label: 'One special character' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2 text-xs">
                      {passwordChecks[key] ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <X className="w-4 h-4 text-slate-400" />
                      )}
                      <span className={passwordChecks[key] ? 'text-emerald-700' : 'text-slate-500'}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !isPasswordValid || username.trim().length < 8}
              data-testid="signup-submit-button"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11 font-medium shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                to="/signin"
                data-testid="signin-link"
                className="font-medium text-slate-900 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
