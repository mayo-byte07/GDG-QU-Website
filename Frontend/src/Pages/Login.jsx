import React from "react";
import LoginComponent from "../Components/auth/LoginComponent";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL?.trim();
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID?.trim();
const authConfigured = Boolean(backendUrl && googleClientId && githubClientId);

const LoginActions = () => {
  const authContext = useAuth();
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const response = await fetch(
        `${backendUrl}/api/auth/google`,
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
    const redirectUri = `${backendUrl}/api/auth/github`;

    const scope = "user:email read:user";

    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=${scope}`;

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

const Login = () => {
  if (!authConfigured) {
    return (
      <LoginComponent
        authUnavailable
        unavailableMessage="Sign-in is unavailable because this frontend-only version has no authentication API configured."
      />
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <LoginActions />
    </GoogleOAuthProvider>
  );
};

export default Login;
