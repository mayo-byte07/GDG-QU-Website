import React, { use, useEffect } from "react";
import LoginComponent from "../Components/auth/LoginComponent";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const authContext = useAuth();
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: codeResponse.code }),
          credentials: "include",
        }
      );
      const data = await response.json();
      authContext.login(data.user);
    },
    flow: "auth-code",
  });

  const handleGithubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;

    const redirectUri = `${import.meta.env.VITE_BACKEND_URL}/api/auth/github`;

    const scope = "user:email read:user";

    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    window.location.href = githubUrl;
  };

  return (
    <div>
      <LoginComponent
        handleGoogleLogin={handleGoogleLogin}
        handleGithubLogin={handleGithubLogin}
      />
    </div>
  );
};

export default Login;
