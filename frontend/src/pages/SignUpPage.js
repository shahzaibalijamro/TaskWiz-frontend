import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, Check, X } from 'lucide-react';
import { authService } from '../services/authService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const passwordRequirements = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[A-Z]/, text: 'One uppercase letter' },
  { regex: /[a-z]/, text: 'One lowercase letter' },
  { regex: /[0-9]/, text: 'One number' },
  { regex: /[^A-Za-z0-9]/, text: 'One special character' },
];

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });

  const validateUsername = () => formData.username.trim().length >= 8;
  const validatePassword = (requirement) => requirement.regex.test(formData.password);
  const isFormValid = validateUsername() && passwordRequirements.every(validatePassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      await authService.signup(formData.username, formData.password);
      toast.success('Account created! Please sign in.');
      navigate('/signin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sign up failed');
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
              Create account
            </h1>
            <p className="text-base text-muted-foreground">
              Start managing your tasks effectively
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="signup-form">
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
                onBlur={() => setTouched({ ...touched, username: true })}
                required
                placeholder="Choose a username"
                className="transition-all duration-200"
              />
              {touched.username && !validateUsername() && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <X size={12} /> Username must be at least 8 characters
                </p>
              )}
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
                  onBlur={() => setTouched({ ...touched, password: true })}
                  required
                  placeholder="Create a strong password"
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

              {touched.password && (
                <div className="space-y-1 mt-3">
                  {passwordRequirements.map((req, idx) => {
                    const isValid = validatePassword(req);
                    return (
                      <div
                        key={idx}
                        className={`text-xs flex items-center gap-2 ${
                          isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
                        }`}
                      >
                        {isValid ? <Check size={12} /> : <X size={12} />}
                        {req.text}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full h-11"
              data-testid="signup-submit-button"
            >
              {loading ? (
                'Creating account...'
              ) : (
                <>
                  <UserPlus size={18} className="mr-2" />
                  Sign Up
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="font-medium text-primary hover:underline"
                data-testid="signin-link"
              >
                Sign in
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