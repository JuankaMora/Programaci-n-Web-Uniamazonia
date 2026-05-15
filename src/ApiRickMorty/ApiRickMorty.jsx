import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './ApiRickMorty.css'

const API_URL = 'https://rickandmortyapi.com/api/character'
const SPECIES_OPTIONS = ['Human', 'Alien', 'Robot', 'Mythological Creature']

function ApiRickMorty({ showFilters = false }) {
  const { species } = useParams()
  const navigate = useNavigate()
  const selectedSpecies = species ? decodeURIComponent(species) : ''
  const [characters, setCharacters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadCharacters() {
      setIsLoading(true)
      setError('')

      try {
        const params = selectedSpecies ? `?species=${encodeURIComponent(selectedSpecies)}` : ''
        const firstResponse = await fetch(`${API_URL}${params}`)

        if (!firstResponse.ok) {
          throw new Error('No fue posible obtener los personajes solicitados.')
        }

        const firstPage = await firstResponse.json()
        const pages = firstPage.info?.pages ?? 1
        const remainingUrls = Array.from({ length: pages - 1 }, (_, index) => {
          const page = index + 2
          const separator = params ? '&' : '?'
          return `${API_URL}${params}${separator}page=${page}`
        })

        const remainingPages = await Promise.all(
          remainingUrls.map(async (url) => {
            const response = await fetch(url)

            if (!response.ok) {
              throw new Error('Una pagina de personajes no respondio correctamente.')
            }

            return response.json()
          }),
        )

        if (isActive) {
          setCharacters([
            ...firstPage.results,
            ...remainingPages.flatMap((page) => page.results),
          ])
        }
      } catch (requestError) {
        if (isActive) {
          setCharacters([])
          setError(requestError.message)
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadCharacters()

    return () => {
      isActive = false
    }
  }, [selectedSpecies])

  const pageTitle = useMemo(() => {
    if (!showFilters || !selectedSpecies) {
      return 'Personajes de Rick and Morty'
    }

    return `Personajes de especie ${selectedSpecies}`
  }, [selectedSpecies, showFilters])

  function handleSpeciesChange(event) {
    const nextSpecies = event.target.value

    if (!nextSpecies) {
      navigate('/filtrar-especie')
      return
    }

    navigate(`/filtrar-especie/${encodeURIComponent(nextSpecies)}`)
  }

  return (
    <main className="rick-page">
      <section className="rick-heading">
        <div>
          <p className="eyebrow">API REST</p>
          <h1>{pageTitle}</h1>
        </div>
        <span className="character-count">
          {isLoading ? 'Cargando...' : `${characters.length} personajes`}
        </span>
      </section>

      {showFilters && (
        <section className="species-panel" aria-label="Filtro por especie">
          <label htmlFor="species">Filtrar por especie</label>
          <select id="species" value={selectedSpecies} onChange={handleSpeciesChange}>
            <option value="">Todas las especies</option>
            {SPECIES_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </section>
      )}

      {isLoading && <p className="status-message">Consultando personajes desde la API...</p>}

      {!isLoading && error && (
        <section className="status-message error-message" role="alert">
          <h2>Error al consultar la API</h2>
          <p>{error}</p>
        </section>
      )}

      {!isLoading && !error && (
        <section className="character-grid" aria-label="Listado de personajes">
          {characters.map((character) => (
            <article className="character-card" key={character.id}>
              <img src={character.image} alt={character.name} />
              <div className="character-info">
                <h2>{character.name}</h2>
                <dl>
                  <div>
                    <dt>Especie</dt>
                    <dd>{character.species}</dd>
                  </div>
                  <div>
                    <dt>Estado</dt>
                    <dd>{character.status}</dd>
                  </div>
                  <div>
                    <dt>Genero</dt>
                    <dd>{character.gender}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default ApiRickMorty
