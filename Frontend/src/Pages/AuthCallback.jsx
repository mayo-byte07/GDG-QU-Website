import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Finishing sign-in…");

  useEffect(() => {
    let active = true;

    const finishSignIn = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        if (active) navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch("/api/user/isAdmin", {
          headers: {
            Authorization: `Bearer ${data.session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        });
        if (!response.ok) throw new Error("Could not check admin access");
        const result = await response.json();
        if (active) navigate(result.data?.isAdmin ? "/admin" : "/profile", { replace: true });
      } catch (error) {
        console.error("Post-login routing failed:", error);
        if (active) {
          setMessage("You’re signed in, but the admin service is not reachable. Check the backend deployment settings.");
        }
      }
    };

    finishSignIn();
    return () => { active = false; };
  }, [navigate]);

  return <main className="min-h-[60vh] flex items-center justify-center px-6 text-center text-slate-700">{message}</main>;
};

export default AuthCallback;
