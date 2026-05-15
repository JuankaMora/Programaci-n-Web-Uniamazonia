import { NavLink } from 'react-router-dom'
import './CardCharacter.css'

function CardCharacter({ character, speciesFilter = '' }) {
  const detailLink = `/character/${character.id}${
    speciesFilter ? `?species=${encodeURIComponent(speciesFilter)}` : ''
  }`

  return (
    <article className="character-card">
      <NavLink to={detailLink} className="card-link">
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
        </div>
      </NavLink>
    </article>
  )
}

export default CardCharacter
