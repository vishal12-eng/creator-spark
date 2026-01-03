import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface SubscriptionState {
  subscribed: boolean;
  plan: 'FREE' | 'CREATOR' | 'PRO';
  subscriptionEnd: string | null;
  tokensRemaining: number;
  tokensLimit: number;
  isLoading: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  subscription: SubscriptionState;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  loginWithGoogle: () => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const formatUser = (user: User): AuthUser => ({
  id: user.id,
  email: user.email || '',
  name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
  avatar: user.user_metadata?.avatar_url,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionState>({
    subscribed: false,
    plan: 'FREE',
    subscriptionEnd: null,
    tokensRemaining: 20,
    tokensLimit: 20,
    isLoading: false,
  });

  const checkSubscription = useCallback(async () => {
    if (!session) {
      setSubscription({
        subscribed: false,
        plan: 'FREE',
        subscriptionEnd: null,
        tokensRemaining: 20,
        tokensLimit: 20,
        isLoading: false,
      });
      return;
    }

    setSubscription(prev => ({ ...prev, isLoading: true }));

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');

      if (error) {
        console.error('Subscription check error:', error);
        return;
      }

      setSubscription({
        subscribed: data?.subscribed ?? false,
        plan: data?.plan ?? 'FREE',
        subscriptionEnd: data?.subscription_end ?? null,
        tokensRemaining: data?.tokens_remaining ?? 20,
        tokensLimit: data?.tokens_limit ?? 20,
        isLoading: false,
      });
    } catch (error) {
      console.error('Subscription check failed:', error);
      setSubscription(prev => ({ ...prev, isLoading: false }));
    }
  }, [session]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ? formatUser(session.user) : null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ? formatUser(session.user) : null);
      setIsLoading(false);
    });

    return () => authSubscription.unsubscribe();
  }, []);

  // Check subscription when session changes
  useEffect(() => {
    if (session) {
      checkSubscription();
    }
  }, [session, checkSubscription]);

  // Check subscription periodically (every minute)
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      checkSubscription();
    }, 60000);

    return () => clearInterval(interval);
  }, [session, checkSubscription]);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error: error.message };
      }
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name,
          },
        },
      });
      
      if (error) {
        return { error: error.message };
      }
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) {
        return { error: error.message };
      }
      return {};
    } catch (err) {
      return { error: 'Failed to sign in with Google' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setSubscription({
      subscribed: false,
      plan: 'FREE',
      subscriptionEnd: null,
      tokensRemaining: 20,
      tokensLimit: 20,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      subscription,
      login, 
      signup, 
      loginWithGoogle, 
      logout,
      checkSubscription,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
