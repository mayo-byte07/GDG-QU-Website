import Home from "./Pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Team from "./Pages/Team";
import Event from "./Pages/Event";
import MainLayout from "./MainLayout";
import AdminLayout from "./Pages/Admin/AdminLayout";
import Login from "./Pages/Login";
import Contributions from "./Pages/Contributions";
import Profile from "./Pages/Profile";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import Protected from "./utils/Protected";
import ContactPage from "./Pages/Contact";
import WallOfFame from "./Pages/WallOfFame";

//TODO: Modularize the whole thing later
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminEvent from "./Pages/Admin/AdminEvent";
import AdminTeamPage from "./Pages/Admin/AdminTeam";
import AdminContactPage from "./Pages/Admin/AdminContactPage";
import AdminWallOfFamePage from "./Pages/Admin/AdminWallOfFame";
import AdminProtected from "./utils/AdminProtected";

//TODO: Modularize the whole thing later
function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Main Routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/team" element={<Team />} />
                <Route path="/events" element={<Event />} />
                <Route path="/login" element={<Login />} />
                <Route path="/contributions" element={<Contributions />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/wall-of-fame" element={<WallOfFame />} />
                <Route
                  path="/profile"
                  element={
                    <Protected>
                      <Profile />
                    </Protected>
                  }
                />
              </Route>

              {/* Admin Routes */}


              <Route path="/admin" element={<AdminProtected><AdminLayout /></AdminProtected>}>
                <Route index element={<AdminDashboard />} />
                <Route path="event" element={<AdminEvent />} />
                <Route path="team" element={<AdminTeamPage />} />
                <Route path="contact" element={<AdminContactPage />} />
                <Route path="wall-of-fame" element={<AdminWallOfFamePage />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
