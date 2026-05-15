import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import Inicio from '../../Components/Inicio/Inicio.jsx'
import {
    Container,
    Typography,
    Pagination,
    Box,
    Alert,
} from '@mui/material'
import CardCharacter from '../../Components/CardCharacter/CardCharacter.jsx'
import Buscardor from '../../Components/Buscador/Buscardor.jsx'
import Carga from '../../Components/Carga/Carga.jsx'
import './Home.css'

const API_URL = 'https://rickandmortyapi.com/api/character'

function Home() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [characters, setCharacters] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Get search term from URL params
    const searchTerm = useMemo(() => searchParams.get('name') || '', [searchParams])

    const fetchCharacters = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const params = new URLSearchParams({ page, name: searchTerm })
            const response = await fetch(`${API_URL}?${params.toString()}`)

            if (!response.ok) {
                throw new Error('No se pudieron cargar los personajes.')
            }

            const data = await response.json()
            setCharacters(data.results || [])
            setTotalPages(data.info?.pages || 1)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.')
            setCharacters([])
        } finally {
            setLoading(false)
        }
    }, [page, searchTerm])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCharacters()
        }, 400)

        return () => clearTimeout(timer)
    }, [fetchCharacters])

    const handleSearchChange = (value) => {
        setPage(1)
        setSearchParams({ name: value || '' })
    }

    const handlePageChange = (event, value) => {
        setPage(value)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <Container maxWidth="lg" className="home-container">
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Todos los Personajes
            </Typography>
            <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                className="home-subtitle"
            >
                ¡Wubba Lubba Dub Dub!
            </Typography>

            <div className="home-search">
                <Buscardor value={searchTerm} onSearch={handleSearchChange} />
            </div>

            {loading && <Carga message="Cargando personajes..." />}

            {error && (
                <Alert severity="error" className="home-alert">
                    {error}
                </Alert>
            )}

            {!loading && !error && characters.length === 0 && (
                <Alert severity="info" className="home-alert">
                    No se encontraron personajes con ese criterio.
                </Alert>
            )}

            {!loading && !error && characters.length > 0 && (
                <>
                    <div className="character-grid">
                        {characters.map((character) => (
                            <CardCharacter key={character.id} character={character} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <Box className="home-pagination">
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                            />
                        </Box>
                    )}
                </>
            )}
            <Inicio />
        </Container>
    )
}

export default Home