import React, { useEffect, useState } from "react";
import LoginComponent from "../Components/auth/LoginComponent";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const Login = () => {
  const { user } = useAuth();
  const [error, setError] = useState("");

  const signIn = async (provider) => {
    setError("");
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/profile` },
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
