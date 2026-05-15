import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './Components/Header/Header.jsx'
import Nav from './Components/Nav/Nav.jsx'
import Footer from './Components/Footer/Footer.jsx'
import Home from './Pages/Home/Home.jsx'
import Filtrado from './Pages/Filtrado/Filtrado.jsx'
import CardPopular from './Pages/CardPopular/CardPopular.jsx'
import ChardDetails from './Pages/ChardDetails/ChardDetails.jsx'
import Error from './Pages/Error/Error.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <Nav />

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/filtrar-especie" element={<Filtrado />} />
            <Route path="/mas-populares" element={<CardPopular />} />
            <Route path="/character/:id" element={<ChardDetails />} />
            <Route path="/error" element={<Error />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
