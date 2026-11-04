import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginComponent from "../Components/auth/LoginComponent";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async ({ email, password }) => {
    if (!isSupabaseConfigured) {
      setError("Admin sign-in is not configured. Check the Supabase environment variables.");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) throw signInError;

      const response = await fetch("/api/user/isAdmin", {
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Admin access could not be checked. Confirm the backend and database are configured.");
      }
      if (!result.data?.isAdmin) {
        await supabase.auth.signOut({ scope: "local" });
        throw new Error("This account is not on the admin allowlist.");
      }

      navigate("/admin", { replace: true });
    } catch (authError) {
      setError(authError.message || "Could not sign in. Check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginComponent
      onSubmit={handleSubmit}
      isLoading={isLoading}
      authUnavailable={!isSupabaseConfigured}
      errorMessage={error}
    />
  );
};

export default Login;
