import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../services/supabase';

export interface FarmerProfile {
  id: string;
  fullName: string;
  phoneNumber?: string;
  state: string;
  district: string;
  taluka: string;
  village?: string;
  pincode?: string;
  primarySoilType: string;
  totalLandAcres: number;
  kisanRegId: string;
  preferredLanguage: 'mr' | 'hi' | 'en';
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  primarySoilType: string;
  totalLandAcres: number;
  preferredLanguage: 'mr' | 'hi' | 'en';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: FarmerProfile | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signUp: (data: SignUpData) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  isConfigured: false,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    if (!isSupabaseConfigured) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching farmer profile:', error.message);
        return;
      }

      if (data) {
        setProfile({
          id: data.id,
          fullName: data.full_name,
          phoneNumber: data.phone_number,
          state: data.state,
          district: data.district,
          taluka: data.taluka,
          village: data.village,
          pincode: data.pincode,
          primarySoilType: data.primary_soil_type,
          totalLandAcres: parseFloat(data.total_land_acres) || 0,
          kisanRegId: data.kisan_reg_id,
          preferredLanguage: data.preferred_language || 'mr',
        });
      }
    } catch (err) {
      console.error('Profile fetch exception:', err);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Check for local authenticated user session
      try {
        const savedUserStr = localStorage.getItem('krishidrishti_local_user');
        const savedProfileStr = localStorage.getItem('krishidrishti_local_profile');
        if (savedUserStr && savedProfileStr) {
          const parsedUser = JSON.parse(savedUserStr);
          const parsedProfile = JSON.parse(savedProfileStr);
          setUser(parsedUser);
          setProfile(parsedProfile);
        }
      } catch (err) {
        console.error('Failed to parse local user profile:', err);
      }
      setLoading(false);
      return;
    }

    // Get current Supabase session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          await fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Authenticate against local registered user
      try {
        const savedUserStr = localStorage.getItem('krishidrishti_local_user');
        const savedProfileStr = localStorage.getItem('krishidrishti_local_profile');
        const savedCredsStr = localStorage.getItem('krishidrishti_local_credentials');

        if (savedUserStr && savedProfileStr && savedCredsStr) {
          const creds = JSON.parse(savedCredsStr);
          if (creds.email.toLowerCase() === email.toLowerCase() && creds.password === password) {
            const parsedUser = JSON.parse(savedUserStr);
            const parsedProfile = JSON.parse(savedProfileStr);
            setUser(parsedUser);
            setProfile(parsedProfile);
            return { error: null };
          }
        }
        return { error: new Error('Invalid email or password. Please verify your credentials or register a new account.') };
      } catch (err: any) {
        return { error: new Error(err.message || 'Local authentication error.') };
      }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (data: SignUpData) => {
    // Generate authentic formatted Maharashtra Kisan Reg ID e.g. MH-NSK-2026-XXXX
    const districtCode = data.district.slice(0, 3).toUpperCase();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const kisanRegId = `MH-${districtCode}-2026-${randomDigits}`;

    if (!isSupabaseConfigured) {
      // Real local persistence when remote Supabase is unconfigured
      const localUser: User = {
        id: `usr_${Date.now()}`,
        app_metadata: {},
        user_metadata: {
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          state: data.state,
          district: data.district,
          taluka: data.taluka,
          village: data.village,
          primary_soil_type: data.primarySoilType,
          total_land_acres: data.totalLandAcres,
          preferred_language: data.preferredLanguage,
          kisan_reg_id: kisanRegId,
        },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email: data.email,
      } as any;

      const localProfile: FarmerProfile = {
        id: localUser.id,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        state: data.state,
        district: data.district,
        taluka: data.taluka,
        village: data.village,
        primarySoilType: data.primarySoilType,
        totalLandAcres: data.totalLandAcres,
        preferredLanguage: data.preferredLanguage,
        kisanRegId: kisanRegId,
      };

      try {
        localStorage.setItem('krishidrishti_local_user', JSON.stringify(localUser));
        localStorage.setItem('krishidrishti_local_profile', JSON.stringify(localProfile));
        localStorage.setItem('krishidrishti_local_credentials', JSON.stringify({ email: data.email, password: data.password }));
        localStorage.setItem('krishidrishti_language', data.preferredLanguage);
      } catch (e) {
        console.error('Storage save error:', e);
      }

      setUser(localUser);
      setProfile(localProfile);
      return { error: null };
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          state: data.state,
          district: data.district,
          taluka: data.taluka,
          village: data.village,
          primary_soil_type: data.primarySoilType,
          total_land_acres: data.totalLandAcres,
          preferred_language: data.preferredLanguage,
          kisan_reg_id: kisanRegId,
        },
      },
    });

    if (authError) {
      return { error: authError };
    }

    // Upsert explicit profile record
    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        full_name: data.fullName,
        phone_number: data.phoneNumber,
        state: data.state,
        district: data.district,
        taluka: data.taluka,
        village: data.village,
        primary_soil_type: data.primarySoilType,
        total_land_acres: data.totalLandAcres,
        kisan_reg_id: kisanRegId,
        preferred_language: data.preferredLanguage,
      });

      if (profileError) {
        console.error('Profile creation error:', profileError.message);
      } else {
        await fetchProfile(authData.user.id);
      }
    }

    return { error: null };
  };

  const signOut = async () => {
    localStorage.removeItem('krishidrishti_local_user');
    localStorage.removeItem('krishidrishti_local_profile');
    localStorage.removeItem('krishidrishti_local_credentials');

    if (!isSupabaseConfigured) {
      setUser(null);
      setSession(null);
      setProfile(null);
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    return { error };
  };

  const refreshProfile = async () => {
    if (user && isSupabaseConfigured) {
      await fetchProfile(user.id);
    } else {
      const savedProfileStr = localStorage.getItem('krishidrishti_local_profile');
      if (savedProfileStr) {
        setProfile(JSON.parse(savedProfileStr));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
