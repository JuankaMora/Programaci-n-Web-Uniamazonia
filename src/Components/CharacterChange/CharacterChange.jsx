import { useEffect, useCallback } from 'react' // Importamos hooks necesarios
import { Link, useNavigate } from 'react-router-dom'
import './CharacterChange.css'

function CharacterChange({ previousId, nextId, speciesFilter = '', popularFilter = false }) {
    const navigate = useNavigate()

    // Memorizamos la función de construcción de links para usarla en el useEffect
    const buildLink = useCallback((id) => {
        const params = new URLSearchParams()
        if (speciesFilter) {
            params.set('species', speciesFilter)
        }
        if (popularFilter) {
            params.set('popular', '1')
        }
        const query = params.toString() ? `?${params.toString()}` : ''
        return `/character/${id}${query}`
    }, [speciesFilter, popularFilter])

    // Lógica para el teclado
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowLeft' && previousId) {
                navigate(buildLink(previousId))
            } else if (event.key === 'ArrowRight' && nextId) {
                navigate(buildLink(nextId))
            }
        }

        // Agregamos el escuchador al montar el componente
        window.addEventListener('keydown', handleKeyDown)

        // Limpiamos el escuchador al desmontar el componente
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [previousId, nextId, navigate, buildLink])

    return (
        <div className="character-change">
            <div className="character-change-buttons">
                <button
                    className="character-change-button"
                    disabled={!previousId}
                    onClick={() => previousId && navigate(buildLink(previousId))}
                >
                    ← <span className="keyboard-hint">Izquierda</span> Personaje anterior
                </button>
                <button
                    className="character-change-button"
                    disabled={!nextId}
                    onClick={() => nextId && navigate(buildLink(nextId))}
                >
                    Siguiente personaje <span className="keyboard-hint">Derecha</span> →
                </button>
            </div>
            <Link to="/" className="character-change-back">
                Volver al inicio
            </Link>
        </div>
    )
}

export default CharacterChange