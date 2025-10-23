import Home from "./Pages/Home";
import Roadmap from "./Pages/Roadmap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Team from "./Pages/Team";
import Event from "./Pages/Event";
import MainLayout from "./MainLayout";
import AdminLayout from "./Pages/Admin/AdminLayout";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    {/* Main Routes */}
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/roadmap" element={<Roadmap />} />
                        <Route path="/team" element={<Team />} />
                        <Route path="/events" element={<Event />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route path="/admin/*" element={<AdminLayout />}>
                        
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

export default App;
