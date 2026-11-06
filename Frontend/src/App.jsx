import Home from "./Pages/Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Team from "./Pages/Team";
import Event from "./Pages/Event";
import MainLayout from "./MainLayout";
import Contributions from "./Pages/Contributions";
import Profile from "./Pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import Protected from "./utils/Protected";
import ContactPage from "./Pages/Contact";

//TODO: Modularize the whole thing later
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Team />} />
            <Route path="/events" element={<Event />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/contributions" element={<Contributions />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/profile"
              element={
                <Protected>
                  <Profile />
                </Protected>
              }
            />
          </Route>

          {/* Admin area removed; keep stale admin URLs out of the public site. */}
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
