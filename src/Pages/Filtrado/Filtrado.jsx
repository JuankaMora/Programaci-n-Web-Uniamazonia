import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CardCharacter from '../../Components/CardCharacter/CardCharacter.jsx'
import CardFiltrado from '../CardFiltrado/CardFiltrado.jsx'
import Carga from '../../Components/Carga/Carga.jsx'
import Inicio from '../../Components/Inicio/Inicio.jsx'
import './Filtrado.css'

const API_URL = 'https://rickandmortyapi.com/api/character'

function Filtrado() {
  const [searchParams] = useSearchParams()
  const species = searchParams.get('species') || ''
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function fetchWithRetry(url, retries = 3) {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(url)
          if (response.ok) {
            return response.json()
          }
          if (response.status === 404) {
            throw new Error('No encontrado')
          }
        } catch (err) {
          if (i === retries - 1) throw err
          await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)))
        }
      }
    }

    async function fetchSpecies() {
      if (!species) {
        setCharacters([])
        setError('')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const params = new URLSearchParams({ species })
        const firstPage = await fetchWithRetry(`${API_URL}?${params.toString()}`)

        if (!firstPage?.results) {
          throw new Error(`No se encontraron personajes de especie ${species}.`)
        }

        const pages = firstPage.info?.pages ?? 1
        let allResults = [...firstPage.results]

        if (pages > 1) {
          const extraUrls = Array.from({ length: pages - 1 }, (_, index) => {
            const pageNumber = index + 2
            return `${API_URL}?${params.toString()}&page=${pageNumber}`
          })

          const extraPages = await Promise.allSettled(
            extraUrls.map((url) => fetchWithRetry(url, 2)),
          )

          extraPages.forEach((result) => {
            if (result.status === 'fulfilled' && result.value?.results) {
              allResults = [...allResults, ...result.value.results]
            }
          })
        }

        if (!active) {
          return
        }

        setCharacters(allResults)
      } catch (fetchError) {
        if (!active) {
          return
        }

        console.error('Error en fetch:', fetchError)
        setCharacters([])
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Error al conectar con la API. Intenta de nuevo.'
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchSpecies()

    return () => {
      active = false
    }
  }, [species])

  return (
    <section className="filter-page">
      <div className="filter-header">
        <div>
          <h1>Filtrar por especie</h1>
          <p>{species ? `Mostrando resultados para especie ${species}` : 'Selecciona una especie con los botones de filtro.'}</p>
        </div>
      </div>

      <CardFiltrado currentSpecies={species} />

      {loading && <Carga message="Buscando personajes filtrados..." />}

      {error && <div className="filter-error">{error}</div>}

      {!loading && !error && species && characters.length > 0 && (
        <div className="character-grid">
          {characters.map((character) => (
            <CardCharacter
              key={character.id}
              character={character}
              speciesFilter={species}
            />
          ))}
        </div>
      )}

      <Inicio />
    </section>
  )
}

export default Filtrado
