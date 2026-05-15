import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PagPopular from '../../Components/PagPopular/PagPopular.jsx'
import Inicio from '../../Components/Inicio/Inicio.jsx'
import './CardPopular.css'

const API_URL = 'https://rickandmortyapi.com/api/character'
const ITEMS_PER_PAGE = 40

function CardPopular() {
    const [allCharacters, setAllCharacters] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        let isActive = true

        async function loadCharacters() {
            setIsLoading(true)
            setError('')

            try {
                // Obtener primera página para saber cuántas páginas hay
                const firstResponse = await fetch(API_URL)
                if (!firstResponse.ok) {
                    throw new Error('No fue posible obtener los personajes.')
                }

                const firstPage = await firstResponse.json()
                const totalPages = firstPage.info?.pages ?? 1

                // Obtener todas las páginas
                const allUrls = Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1
                    return `${API_URL}?page=${page}`
                })

                const allPages = await Promise.all(
                    allUrls.map(async (url) => {
                        const response = await fetch(url)
                        if (!response.ok) {
                            throw new Error('Una página de personajes no respondió correctamente.')
                        }
                        return response.json()
                    })
                )

                if (isActive) {
                    const characters = allPages.flatMap((page) => page.results)
                    // Ordenar por cantidad de episodios descendente
                    characters.sort((a, b) => b.episode.length - a.episode.length)
                    setAllCharacters(characters)
                }
            } catch (requestError) {
                if (isActive) {
                    setAllCharacters([])
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
    }, [])

    // Calcular personajes para la página actual
    const paginatedCharacters = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        const endIndex = startIndex + ITEMS_PER_PAGE
        return allCharacters.slice(startIndex, endIndex)
    }, [allCharacters, currentPage])

    const totalPages = Math.ceil(allCharacters.length / ITEMS_PER_PAGE)

    function handlePageChange(page) {
        setCurrentPage(page)
        window.scrollTo(0, 0)
    }

    return (
        <main className="popular-page">
            <section className="popular-heading">
                <div>
                    <p className="eyebrow">Personajes Más Populares</p>
                    <h1>Ordenados por apariciones en episodios</h1>
                </div>
                <span className="character-count">
                    {isLoading ? 'Cargando...' : `${allCharacters.length} personajes`}
                </span>
            </section>

            {isLoading && <p className="status-message">Consultando personajes desde la API...</p>}

            {!isLoading && error && (
                <section className="status-message error-message" role="alert">
                    <h2>Error al consultar la API</h2>
                    <p>{error}</p>
                </section>
            )}

            {!isLoading && !error && (
                <>
                    <section className="character-grid" aria-label="Listado de personajes populares">
                        {paginatedCharacters.map((character) => (
                            <article className="character-card" key={character.id}>
                                <Link to={`/character/${character.id}?popular=1`} className="card-link">
                                    <div className="card-image">
                                        <img src={character.image} alt={character.name} />
                                    </div>
                                    <div className="card-content">
                                        <h2>{character.name}</h2>
                                        <p>
                                            <strong>Especie:</strong> {character.species}
                                        </p>
                                        <p>
                                            <strong>Estado:</strong> {character.status}
                                        </p>
                                        <p>
                                            <strong>Género:</strong> {character.gender}
                                        </p>
                                        <p>
                                            <strong>Episodios:</strong> {character.episode.length}
                                        </p>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </section>

                    {totalPages > 1 && (
                        <PagPopular
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}

            <Inicio />
        </main>
    )
}

export default CardPopular