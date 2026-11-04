import React, { createContext, useContext, useState, useEffect } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL?.trim();

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data, error }) => {
        if (error) console.error("Supabase session check failed:", error);
        setUser(data.session?.user ? normalizeSupabaseUser(data.session.user) : null);
        setLoading(false);
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ? normalizeSupabaseUser(session.user) : null);
        setLoading(false);
      });
      return () => subscription.unsubscribe();
    }

    if (!backendUrl) {
      setLoading(false);
      return;
    }

    const checkUserLoggedIn = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/user/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
        } else {
          // 401 is expected when not logged in - don't treat as error
          setUser(null);
        }
      } catch (error) {
        // Only log actual network/fetch errors, not auth failures
        if (error.name !== "AbortError") {
          console.error("Auth check failed:", error);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, [backendUrl]);

  const logout = () => {
    setUser(null);
    if (isSupabaseConfigured) {
      supabase.auth.signOut().then(({ error }) => {
        if (error) console.error("Supabase logout failed:", error);
      });
    }
    if (backendUrl) {
      fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      }).catch((error) => {
        console.error("Logout failed:", error);
      });
    }
    window.location.href = `/`;
  };

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const normalizeSupabaseUser = (user) => {
  const metadata = user.user_metadata || {};
  const name = metadata.full_name || metadata.name || metadata.user_name || user.email || "User";
  return {
    ...user,
    name,
    realName: name,
    email: user.email,
    photo: metadata.avatar_url || metadata.picture || null,
  };
};

export const useAuth = () => {
  return useContext(AuthContext);
};
