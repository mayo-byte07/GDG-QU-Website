import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Protected = ({ children }) => {
  const authContext = useAuth();
  useEffect(() => {
    if (!authContext.user && !authContext.loading) {
      window.location.href = "/login";
    }
  }, [authContext.user, authContext.loading]);
  return <>{children}</>;
};

export default Protected;
