import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Carga from '../../Components/Carga/Carga.jsx'
import CharacterChange from '../../Components/CharacterChange/CharacterChange.jsx'
import './ChardDetails.css'

const API_URL = 'https://rickandmortyapi.com/api/character'

function ChardDetails() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [character, setCharacter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filteredIds, setFilteredIds] = useState([])

  const searchParams = new URLSearchParams(location.search)
  const speciesFilter = searchParams.get('species') || ''
  const popularFilter = searchParams.get('popular') === '1'

  useEffect(() => {
    let active = true

    async function fetchCharacter() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(`${API_URL}/${id}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('No se encontró el personaje solicitado.')
          }
          throw new Error('No fue posible cargar los detalles del personaje.')
        }

        const data = await response.json()

        if (!active) {
          return
        }

        setCharacter(data)
      } catch (fetchError) {
        if (!active) {
          return
        }

        if (fetchError instanceof Error) {
          setError(fetchError.message)
        } else {
          setError('Ocurrió un error inesperado.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchCharacter()

    return () => {
      active = false
    }
  }, [id])

  useEffect(() => {
    let active = true

    async function fetchFilteredList() {
      if (!speciesFilter && !popularFilter) {
        setFilteredIds([])
        return
      }

      try {
        if (speciesFilter) {
          const params = new URLSearchParams({ species: speciesFilter })
          const firstPage = await fetch(`${API_URL}?${params.toString()}`)
          if (!firstPage.ok) {
            throw new Error('No fue posible cargar la lista filtrada.')
          }

          const firstData = await firstPage.json()
          const pages = firstData.info?.pages ?? 1
          let allCharacters = [...(firstData.results || [])]

          if (pages > 1) {
            const extraUrls = Array.from({ length: pages - 1 }, (_, index) => {
              const pageNumber = index + 2
              return `${API_URL}?${params.toString()}&page=${pageNumber}`
            })

            const extraPages = await Promise.all(
              extraUrls.map(async (url) => {
                const response = await fetch(url)
                if (!response.ok) {
                  throw new Error('No fue posible cargar la lista filtrada.')
                }
                return response.json()
              })
            )

            extraPages.forEach((page) => {
              if (page?.results) {
                allCharacters = [...allCharacters, ...page.results]
              }
            })
          }

          if (!active) {
            return
          }

          setFilteredIds(allCharacters.map((item) => item.id))
        } else if (popularFilter) {
          const firstPage = await fetch(API_URL)
          if (!firstPage.ok) {
            throw new Error('No fue posible cargar la lista de populares.')
          }

          const firstData = await firstPage.json()
          const pages = firstData.info?.pages ?? 1
          let allCharacters = [...(firstData.results || [])]

          if (pages > 1) {
            const extraUrls = Array.from({ length: pages - 1 }, (_, index) => {
              const pageNumber = index + 2
              return `${API_URL}?page=${pageNumber}`
            })

            const extraPages = await Promise.all(
              extraUrls.map(async (url) => {
                const response = await fetch(url)
                if (!response.ok) {
                  throw new Error('No fue posible cargar la lista de populares.')
                }
                return response.json()
              })
            )

            extraPages.forEach((page) => {
              if (page?.results) {
                allCharacters = [...allCharacters, ...page.results]
              }
            })
          }

          if (!active) {
            return
          }

          allCharacters.sort((a, b) => b.episode.length - a.episode.length)
          setFilteredIds(allCharacters.map((item) => item.id))
        }
      } catch (fetchError) {
        if (!active) {
          return
        }

        console.error(fetchError)
        setFilteredIds([])
      }
    }

    fetchFilteredList()

    return () => {
      active = false
    }
  }, [speciesFilter, popularFilter])

  if (loading) {
    return <Carga message="Cargando detalles del personaje..." />
  }

  if (error) {
    navigate('/error', {
      state: {
        message: error,
      },
      replace: true,
    })
    return null
  }

  if (!character) {
    return null
  }

  const currentId = Number(id)
  let previousId = currentId > 1 ? currentId - 1 : null
  let nextId = currentId + 1

  if ((speciesFilter || popularFilter) && filteredIds.length > 0) {
    const currentIndex = filteredIds.indexOf(currentId)
    if (currentIndex >= 0) {
      previousId = currentIndex > 0 ? filteredIds[currentIndex - 1] : null
      nextId =
        currentIndex < filteredIds.length - 1
          ? filteredIds[currentIndex + 1]
          : null
    }
  }

  return (
    <section className="details-page">
      <div className="details-card">
        <div className="details-image">
          <img src={character.image} alt={character.name} />
        </div>
        <div className="details-content">
          <h1>{character.name}</h1>
          <p className="details-tagline">Detalle completo del personaje</p>

          <div className="details-grid">
            <div>
              <strong>Estado:</strong>
              <span>{character.status}</span>
            </div>
            <div>
              <strong>Especie:</strong>
              <span>{character.species}</span>
            </div>
            <div>
              <strong>Género:</strong>
              <span>{character.gender}</span>
            </div>
            <div>
              <strong>Tipo:</strong>
              <span>{character.type || 'Desconocido'}</span>
            </div>
            <div>
              <strong>Origen:</strong>
              <span>{character.origin?.name}</span>
            </div>
            <div>
              <strong>Locación:</strong>
              <span>{character.location?.name}</span>
            </div>
            <div>
              <strong>Episodios:</strong>
              <span>{character.episode?.length}</span>
            </div>
            <div>
              <strong>Creado:</strong>
              <span>{new Date(character.created).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <CharacterChange
        previousId={previousId}
        nextId={nextId}
        speciesFilter={speciesFilter}
        popularFilter={popularFilter}
      />
    </section>
  )
}

export default ChardDetails
