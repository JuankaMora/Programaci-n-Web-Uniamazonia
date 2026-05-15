import './Carga.css'

function Carga({ message = 'Cargando...' }) {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}

export default Carga
