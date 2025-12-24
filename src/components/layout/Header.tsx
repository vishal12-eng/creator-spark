import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Menu, 
  X, 
  Sparkles, 
  Sun, 
  Moon,
  ChevronDown,
  Zap,
  Image,
  Lightbulb,
  BarChart3,
  Palette,
  Bot
} from 'lucide-react';

const features = [
  { name: 'Thumbnail Generator', href: '/dashboard/thumbnail', icon: Image },
  { name: 'Video Ideas', href: '/dashboard/ideas', icon: Lightbulb },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Branding', href: '/dashboard/branding', icon: Palette },
  { name: 'AI Assistant', href: '/dashboard/chat', icon: Bot },
];

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent opacity-50 blur-lg group-hover:opacity-75 transition-opacity" />
            </div>
            <span className="font-display font-bold text-xl">
              Creator<span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <div 
              className="relative"
              onMouseEnter={() => setShowFeatures(true)}
              onMouseLeave={() => setShowFeatures(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {showFeatures && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 glass rounded-xl p-2"
                  >
                    {features.map((feature) => (
                      <Link
                        key={feature.name}
                        to={feature.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/10 transition-colors"
                      >
                        <feature.icon className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">{feature.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link 
              to="/pricing" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link 
              to="/blog" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button variant="premium" size="sm">
                    <Zap className="w-4 h-4" />
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent/10 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="px-4 py-6 space-y-4">
              {features.map((feature) => (
                <Link
                  key={feature.name}
                  to={feature.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <feature.icon className="w-5 h-5 text-primary" />
                  <span className="font-medium">{feature.name}</span>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-border space-y-3">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button className="w-full" variant="outline">
                        Dashboard
                      </Button>
                    </Link>
                    <Button className="w-full" variant="ghost" onClick={logout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button className="w-full" variant="outline">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth?mode=signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full" variant="premium">
                        <Zap className="w-4 h-4" />
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
