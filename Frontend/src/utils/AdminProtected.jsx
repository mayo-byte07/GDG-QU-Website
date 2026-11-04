import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const AdminProtected = ({ children }) => {
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const verifyAdmin = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
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
        if (!response.ok) throw new Error("Admin authorization service is unavailable");
        const result = await response.json();
        if (!active) return;
        if (result.data?.isAdmin) setStatus("allowed");
        else navigate("/profile", { replace: true });
      } catch (error) {
        console.error("Admin access check failed:", error);
        if (active) setStatus("error");
      }
    };

    verifyAdmin();
    return () => { active = false; };
  }, [navigate]);

  if (status === "loading") {
    return <div className="min-h-[50vh] flex items-center justify-center text-slate-600">Checking admin access…</div>;
  }
  if (status === "error") {
    return <div role="alert" className="min-h-[50vh] flex items-center justify-center px-6 text-center text-red-700">Admin access could not be verified. Check the API deployment and Supabase server environment settings.</div>;
  }
  return <>{children}</>;
};

export default AdminProtected;
