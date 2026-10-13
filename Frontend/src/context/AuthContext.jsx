import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/me`,
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
  }, []);

  const login = (userData) => {
    setUser(userData);
    window.location.href = `/profile`;
  };

  const logout = () => {
    setUser(null);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch((error) => {
      console.error("Logout failed:", error);
    });
    window.location.href = `/`;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
