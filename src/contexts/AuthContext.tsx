import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/backend/supabase-client';
import { Profile } from '@/types/database';
import { useQuery } from '@tanstack/react-query';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchProfileQuery = async (userId: string) => {
    const startTime = performance.now();
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const duration = performance.now() - startTime;
      if (duration > 1000) {
        console.log(`[AuthContext] Profile fetched in ${duration.toFixed(0)}ms`);
      }
      return data as Profile;
    } catch (error: any) {
      console.error('[AuthContext] Error in fetchProfile:', error?.message || error);
      throw error;
    }
  };

  const { data: profile, isLoading: profileLoading, refetch } = useQuery<Profile | null>({
    queryKey: ['profile', user?.id],
    queryFn: () => user?.id ? fetchProfileQuery(user.id) : null,
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes caching to reduce refetches on reload
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (renamed from cacheTime in newer versions)
    retry: 1, // Retry once on failure
  });

  const refreshProfile = async () => {
    if (!user?.id) return;
    await refetch();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('[AuthContext] Error getting session:', sessionError);
          if (mounted) setInitialLoading(false);
          return;
        }

        if (mounted) {
          setUser(session?.user ?? null);
          setInitialLoading(false);
        }
      } catch (error) {
        console.error('[AuthContext] Error initializing auth:', error);
        if (mounted) setInitialLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        try {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
        } catch (error) {
          console.error('[AuthContext] Error in onAuthStateChange:', error);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Overall loading: initial auth OR profile loading (only when user exists)
  const loading = initialLoading || (user && profileLoading);

  // Clear profile if no user
  useEffect(() => {
    if (!user) {
      // The query will handle this automatically with the enabled flag
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: user ? profile ?? null : null,
        loading,
        refreshProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};