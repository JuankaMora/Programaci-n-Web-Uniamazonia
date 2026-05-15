import { useNavigate } from 'react-router-dom'
import './CardFiltrado.css'

const SPECIES_OPTIONS = ['Human', 'Alien', 'Humanoid', 'Robot', 'Mythological Creature']

function CardFiltrado({ currentSpecies }) {
    const navigate = useNavigate()

    function handleSpeciesClick(species) {
        navigate(`/filtrar-especie?species=${encodeURIComponent(species)}`)
    }

    return (
        <div className="card-filter">
            <div className="card-filter-buttons">
                {SPECIES_OPTIONS.map((species) => (
                    <button
                        key={species}
                        className={`card-filter-button${species === currentSpecies ? ' active' : ''}`}
                        type="button"
                        onClick={() => handleSpeciesClick(species)}
                    >
                        {species}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default CardFiltrado
