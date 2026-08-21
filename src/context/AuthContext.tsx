'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabaseClient } from '@/config/supabaseClientInit';
import type { UserRole } from '@/types';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isSignedIn: boolean;
  isAdmin: boolean;
  role: UserRole;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSession = useCallback(async () => {
    try {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) {
        console.error('Error fetching Supabase session:', error);
      }
      setSession(data.session);
      setUser(data.session?.user ?? null);
    } catch (err) {
      console.error('Error initializing auth:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchSession]);

  const signOut = useCallback(async () => {
    try {
      await supabaseClient.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await supabaseClient.auth.getUser();
      setUser(data.user ?? null);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }, []);

  const role: UserRole = useMemo(() => {
    if (!user) return 'guest';
    const metadataRole = user.user_metadata?.role || user.app_metadata?.role;
    if (metadataRole === 'admin') return 'admin';
    if (metadataRole === 'moderator') return 'moderator';
    return 'user';
  }, [user]);

  const isAdmin = role === 'admin';
  const isSignedIn = !!user;

  const value = useMemo(
    () => ({
      user,
      session,
      isLoading,
      isSignedIn,
      isAdmin,
      role,
      signOut,
      refreshUser,
    }),
    [user, session, isLoading, isSignedIn, isAdmin, role, signOut, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
