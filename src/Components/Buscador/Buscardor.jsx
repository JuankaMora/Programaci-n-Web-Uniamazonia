import './Buscardor.css'

function Buscardor({ value, onSearch }) {
  function handleSubmit(event) {
    event.preventDefault()
    const nextValue = event.target.search.value.trim()
    onSearch(nextValue)
  }

  function handleChange(event) {
    onSearch(event.target.value)
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label htmlFor="search-input" className="search-label">
        Buscar personaje
      </label>
      <div className="search-input-group">
        <input
          id="search-input"
          name="search"
          type="search"
          value={value}
          onChange={handleChange}
          placeholder="Escribe el nombre..."
          aria-label="Buscar personaje"
        />
        <button type="submit">Buscar</button>
      </div>
    </form>
  )
}

export default Buscardor
