import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';
import creatorAiLogo from '@/assets/creator-ai-logo.png';

const navItems = [
  { name: 'Create', href: '/dashboard/thumbnail' },
  { name: 'Studio', href: '/dashboard' },
  { name: 'Features', href: '/#features' },
  { name: 'Analytics', href: '/dashboard/analytics' },
  { name: 'Pricing', href: '/#pricing' },
];

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || !isLandingPage
          ? 'bg-deep-navy-900/90 backdrop-blur-xl border-b border-ice-blue/10 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={creatorAiLogo} 
              alt="Creator AI" 
              className="h-7 w-auto transition-all duration-300 group-hover:opacity-80"
            />
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-ice-blue/50 hover:text-ice-blue text-xs font-light tracking-[0.15em] uppercase transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side - User */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-ice-blue/10 flex items-center justify-center border border-ice-blue/20">
                    <span className="text-xs font-medium text-ice-blue/90">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-ice-blue/60 text-sm font-light tracking-wide max-w-[120px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <button 
                  onClick={logout}
                  className="text-ice-blue/40 hover:text-ice-blue text-xs font-light tracking-wider uppercase transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link 
                  to="/auth"
                  className="text-ice-blue/50 hover:text-ice-blue text-xs font-light tracking-[0.12em] uppercase transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link to="/auth?mode=signup">
                  <button className="py-2.5 px-5 rounded-lg bg-gradient-to-r from-ice-blue/20 to-electric-purple/20 border border-ice-blue/30 text-ice-blue text-xs font-medium tracking-wider uppercase transition-all duration-300 hover:from-ice-blue/30 hover:to-electric-purple/30 hover:border-ice-blue/50">
                    Get Started
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-ice-blue/60 hover:text-ice-blue transition-colors duration-300"
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
            className="md:hidden bg-deep-navy-900/95 backdrop-blur-xl border-t border-ice-blue/10"
          >
            <div className="px-6 py-8 space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-ice-blue/60 hover:text-ice-blue text-sm font-light tracking-[0.1em] uppercase transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-6 border-t border-ice-blue/10 space-y-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-ice-blue/10 flex items-center justify-center border border-ice-blue/20">
                        <span className="text-sm font-medium text-ice-blue/90">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-ice-blue/60 text-sm font-light tracking-wide">
                        {user.email?.split('@')[0]}
                      </span>
                    </div>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <button className="w-full py-3 px-5 rounded-lg border border-ice-blue/20 text-ice-blue/80 text-sm font-light tracking-wider uppercase transition-colors duration-300 hover:bg-ice-blue/5">
                        Dashboard
                      </button>
                    </Link>
                    <button 
                      onClick={logout}
                      className="w-full py-3 px-5 text-ice-blue/40 text-sm font-light tracking-wider uppercase transition-colors duration-300 hover:text-ice-blue"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <button className="w-full py-3 px-5 rounded-lg border border-ice-blue/20 text-ice-blue/80 text-sm font-light tracking-wider uppercase transition-colors duration-300 hover:bg-ice-blue/5">
                        Sign In
                      </button>
                    </Link>
                    <Link to="/auth?mode=signup" onClick={() => setIsOpen(false)}>
                      <button className="w-full py-3 px-5 rounded-lg bg-gradient-to-r from-ice-blue/20 to-electric-purple/20 border border-ice-blue/30 text-ice-blue text-sm font-medium tracking-wider uppercase transition-all duration-300">
                        Get Started
                      </button>
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
