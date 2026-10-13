import React, { useEffect } from "react";

const AdminProtected = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/isAdmin`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data.isAdmin) {
          setLoading(false);
        } else {
          window.location.href = "/login";
        }
      })
      .catch(() => {
        window.location.href = "/login";
      });
  }, []);
  return <>{!loading && children}</>;
};

export default AdminProtected;
