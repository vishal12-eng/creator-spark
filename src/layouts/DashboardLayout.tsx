import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  LayoutDashboard, 
  Image, 
  Lightbulb, 
  BarChart3, 
  Palette, 
  Bot,
  History,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  Target,
  Shield,
  Coins
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Layers, FileVideo } from 'lucide-react';
import { TokenDisplayHeader } from '@/components/TokenDisplayHeader';

const sidebarLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Thumbnail Generator', href: '/dashboard/thumbnail', icon: Image },
  { name: 'Video Ideas', href: '/dashboard/ideas', icon: Lightbulb },
  { name: 'Niche Analyzer', href: '/dashboard/niche', icon: Target },
  { name: 'Content Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Channel Branding', href: '/dashboard/branding', icon: Palette, plan: 'CREATOR' },
  { name: 'AI Assistant', href: '/dashboard/chat', icon: Bot },
  { name: 'Content Calendar', href: '/dashboard/calendar', icon: Calendar, pro: true },
  { name: 'Batch Generation', href: '/dashboard/batch', icon: Layers, pro: true },
  { name: 'Advanced Scripting', href: '/dashboard/scripting', icon: FileVideo, pro: true },
  { name: 'Token History', href: '/dashboard/token-history', icon: Coins },
  { name: 'History', href: '/dashboard/history', icon: History },
  { name: 'History', href: '/dashboard/history', icon: History },
];

import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Crown } from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { currentPlan } = useFeatureAccess();
  const { user, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">
                Creator<span className="gradient-text">AI</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname === link.href;
              const isPro = (link as any).pro;
              const planTag = (link as any).plan;
              const isLocked = isPro && currentPlan !== 'PRO';
              const showPlanBadge = planTag && currentPlan === 'FREE';
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  } ${isLocked ? 'opacity-70' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                  {isPro && (
                    <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded ${isLocked ? 'bg-primary/20 text-primary' : 'bg-green-500/20 text-green-400'}`}>
                      {isLocked ? 'PRO' : <Crown className="w-3 h-3" />}
                    </span>
                  )}
                  {showPlanBadge && (
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-electric-purple/20 text-electric-purple">
                      {planTag}
                    </span>
                  )}
                  {isActive && !isPro && !showPlanBadge && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-sidebar-border space-y-2">
            <Link
              to="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between h-full px-4 sm:px-6">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent/10"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Page Title - Desktop */}
            <div className="hidden lg:block">
              <h1 className="text-lg font-semibold capitalize">
                {location.pathname.split('/').pop() || 'Dashboard'}
              </h1>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Token Display */}
              <TokenDisplayHeader />
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
