import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import Buscardor from '../Buscador/Buscardor.jsx'
import './Nav.css'

const SPECIES_OPTIONS = ['Human', 'Alien', 'Robot', 'Mythological Creature', 'Unknown']

function Nav() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const currentSearch = searchParams.get('name') || ''
  const currentSpecies = searchParams.get('species') || ''

  function handleSearch(value) {
    const params = new URLSearchParams()
    if (value) {
      params.set('name', value)
    }
    navigate(`/?${params.toString()}`)
  }

  function handleSpeciesChange(event) {
    const value = event.target.value
    const params = new URLSearchParams()

    if (value) {
      params.set('species', value)
    }

    navigate(`/filtrar-especie?${params.toString()}`)
  }

  return (
    <nav className="site-nav" aria-label="Navegación principal">
      <div className="nav-row">
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Inicio / Todos los personajes
          </NavLink>
          <NavLink to="/filtrar-especie" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Filtrar por especie
          </NavLink>
          <NavLink to="/mas-populares" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Más Populares
          </NavLink>
        </div>

        <div className="nav-search-group">
          <Buscardor value={currentSearch} onSearch={handleSearch} />
          <label className="species-label" htmlFor="species-select">
            Especie
          </label>
          <select
            id="species-select"
            value={currentSpecies}
            onChange={handleSpeciesChange}
            className="species-select"
          >
            <option value="">Todas las especies</option>
            {SPECIES_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  )
}

export default Nav
