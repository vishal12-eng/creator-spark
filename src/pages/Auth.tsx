import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  ArrowRight,
  Chrome
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup, loginWithGoogle, isLoading, user } = useAuth();
  const { toast } = useToast();
  
  const isSignup = searchParams.get('mode') === 'signup';
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignup) {
      if (formData.password.length < 6) {
        toast({
          title: 'Password too short',
          description: 'Password must be at least 6 characters.',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await signup(formData.email, formData.password, formData.name);
      
      if (error) {
        toast({
          title: 'Signup failed',
          description: error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Account created!',
          description: 'Welcome to CreatorAI. Start creating amazing content!',
        });
        navigate('/dashboard');
      }
    } else {
      const { error } = await login(formData.email, formData.password);
      
      if (error) {
        toast({
          title: 'Login failed',
          description: error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Welcome back!',
          description: 'Ready to create something amazing?',
        });
        navigate('/dashboard');
      }
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await loginWithGoogle();
    
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
    // OAuth redirects automatically, no need to navigate
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float animation-delay-200" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-2xl">
            Creator<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Auth Card */}
        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold mb-2">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-muted-foreground">
              {isSignup
                ? 'Start your journey to content creation mastery'
                : 'Sign in to continue creating amazing content'}
            </p>
          </div>

          {/* Google Sign In */}
          <Button
            variant="outline"
            className="w-full mb-6"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Chrome className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required={isSignup}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="premium"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignup ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle Mode */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <Link to="/auth" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link to="/auth?mode=signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </>
            )}
          </p>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
