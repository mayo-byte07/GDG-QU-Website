import Home from './Pages/Home'
import Navbar from './Components/Navbar'
import Roadmap from './Pages/Roadmap'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './Components/FooterSection'
import Team from './Pages/Team'
import Event from './Pages/Event'

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <div style={{ height: `var(--navbar-height, 70px)` }} className="w-full"></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/team" element={<Team/>} />
          <Route path='/events' element={<Event/>} />
        </Routes>
        <Footer/>
      </Router>
    </>
  )
}

export default App
