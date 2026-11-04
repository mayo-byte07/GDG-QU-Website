import React, { useEffect, useState } from "react";
import LoginComponent from "../Components/auth/LoginComponent";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const Login = () => {
  const { user } = useAuth();
  const [error, setError] = useState("");

  const signIn = async (provider) => {
    setError("");
    const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.trim();
    const redirectOrigin = import.meta.env.PROD
      ? (configuredSiteUrl || "https://gdg-qu-website.vercel.app")
      : window.location.origin;
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${redirectOrigin.replace(/\/$/, "")}/auth/callback` },
    });
    if (authError) setError(authError.message);
  };

  useEffect(() => {
    if (user) window.location.replace("/profile");
  }, [user]);

  return (
    <LoginComponent
      handleGoogleLogin={() => signIn("google")}
      handleGithubLogin={() => signIn("github")}
      authUnavailable={!isSupabaseConfigured}
      unavailableMessage="Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to Frontend/.env.local to enable sign-in."
      errorMessage={error}
    />
  );
};

export default Login;
