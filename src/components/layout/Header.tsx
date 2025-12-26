import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Create', href: '/dashboard/thumbnail' },
  { name: 'Studio', href: '/dashboard' },
  { name: 'Features', href: '#features' },
  { name: 'Analytics', href: '/dashboard/analytics' },
  { name: 'Pricing', href: '/pricing' },
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
          ? 'glass-strong py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Logo Icon */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsla(199,89%,70%,0.2)] to-[hsla(263,70%,50%,0.2)] flex items-center justify-center border border-[hsla(210,20%,90%,0.1)]">
              <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-[hsl(var(--ice-blue))] to-[hsl(var(--electric-purple))]" />
            </div>
            {/* Logo Text */}
            <span className="text-[hsla(199,89%,85%,0.95)] text-lg font-light tracking-[0.1em] uppercase">
              Creator<span className="font-normal">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-[hsla(210,20%,90%,0.6)] hover:text-[hsla(210,20%,90%,0.95)] text-xs font-light tracking-[0.15em] uppercase transition-colors duration-300"
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
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsla(199,89%,70%,0.3)] to-[hsla(263,70%,50%,0.3)] flex items-center justify-center border border-[hsla(210,20%,90%,0.1)]">
                    <span className="text-xs font-medium text-[hsla(210,20%,90%,0.9)]">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[hsla(210,20%,90%,0.7)] text-sm font-light tracking-wide max-w-[120px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <button 
                  onClick={logout}
                  className="text-[hsla(210,20%,90%,0.5)] hover:text-[hsla(210,20%,90%,0.8)] text-xs font-light tracking-wider uppercase transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link 
                  to="/auth"
                  className="text-[hsla(210,20%,90%,0.6)] hover:text-[hsla(210,20%,90%,0.95)] text-xs font-light tracking-[0.12em] uppercase transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link to="/auth?mode=signup">
                  <button className="btn-cta py-2.5 px-5 rounded-lg text-white text-xs font-medium tracking-wider uppercase transition-all duration-300">
                    Get Started
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-[hsla(210,20%,90%,0.7)] hover:text-[hsla(210,20%,90%,0.95)] transition-colors duration-300"
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
            className="md:hidden glass-strong border-t border-[hsla(210,20%,90%,0.05)]"
          >
            <div className="px-6 py-8 space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-[hsla(210,20%,90%,0.7)] hover:text-[hsla(210,20%,90%,0.95)] text-sm font-light tracking-[0.1em] uppercase transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-6 border-t border-[hsla(210,20%,90%,0.1)] space-y-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsla(199,89%,70%,0.3)] to-[hsla(263,70%,50%,0.3)] flex items-center justify-center border border-[hsla(210,20%,90%,0.1)]">
                        <span className="text-sm font-medium text-[hsla(210,20%,90%,0.9)]">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[hsla(210,20%,90%,0.7)] text-sm font-light tracking-wide">
                        {user.email?.split('@')[0]}
                      </span>
                    </div>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <button className="w-full py-3 px-5 rounded-lg border border-[hsla(210,20%,90%,0.15)] text-[hsla(210,20%,90%,0.8)] text-sm font-light tracking-wider uppercase transition-colors duration-300 hover:bg-[hsla(210,20%,90%,0.05)]">
                        Dashboard
                      </button>
                    </Link>
                    <button 
                      onClick={logout}
                      className="w-full py-3 px-5 text-[hsla(210,20%,90%,0.5)] text-sm font-light tracking-wider uppercase transition-colors duration-300 hover:text-[hsla(210,20%,90%,0.8)]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <button className="w-full py-3 px-5 rounded-lg border border-[hsla(210,20%,90%,0.15)] text-[hsla(210,20%,90%,0.8)] text-sm font-light tracking-wider uppercase transition-colors duration-300 hover:bg-[hsla(210,20%,90%,0.05)]">
                        Sign In
                      </button>
                    </Link>
                    <Link to="/auth?mode=signup" onClick={() => setIsOpen(false)}>
                      <button className="btn-cta w-full py-3 px-5 rounded-lg text-white text-sm font-medium tracking-wider uppercase transition-all duration-300">
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