import React, { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// Step 1 : Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Step 2: Provider

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //1. Load any existing session from AsyncStorage
    // This is how "stay logged in works"
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch(() => {
        setSession(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
    //2. Subscribe to all future auth state changes:
    // SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, PASSWORD_RECOVERY, etc
    // This will be the single place that will update the session

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    // Clean the subscription when the provider unmounts
    return () => subscription.unsubscribe();
  }, []);

  // Auth Functions

  const signIn = async(email: string, password: string) =>{
    const { error } = await supabase.auth.signInWithPassword({email, password})
    if(error) throw error
  }
  const signUp = async (email: string, password: string) =>{
    const {error} = await supabase.auth.signUp({email, password})
    if(error) throw error
  }
  const signOut = async () =>{
    const {error} = await supabase.auth.signOut()
    if(error) throw error
  }

  return (
    <AuthContext.Provider 
    value={{session, 
            user:session?.user ?? null,
            isLoading,
            signIn,
            signUp,
            signOut
            }}>
        {children}
    </AuthContext.Provider>
  )

};

export const useAuth = () =>{
    const context = useContext(AuthContext)
    if(!context){
        throw new Error("useAuth must be called inside <AuthProvider>");
    }
    return context
}