import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, Moon, Sun, User, LayoutDashboard } from 'lucide-react';
import { logout } from '../store/authSlice';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { toast } from 'sonner';

export const DashboardLayout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">TaskFlow</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm" data-testid="user-info">
              <User size={18} className="text-muted-foreground" />
              <span className="font-medium">{user?.username}</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="theme-toggle-button"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </Button>

            <Button
              variant="ghost"
              onClick={handleLogout}
              data-testid="logout-button"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-6 py-8" data-testid="dashboard-content">
        {children}
      </main>
    </div>
  );
};