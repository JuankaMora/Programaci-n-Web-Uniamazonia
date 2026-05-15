import { Link, useLocation } from 'react-router-dom'
import './Error.css'

function Error() {
  const location = useLocation()
  const message = location.state?.message || 'No se encontró el personaje o la página solicitada.'

  return (
    <section className="error-page">
      <div className="error-card">
        <h1>Error</h1>
        <p>{message}</p>
        <Link to="/" className="error-button">
          Volver al inicio
        </Link>
      </div>
    </section>
  )
}

export default Error
