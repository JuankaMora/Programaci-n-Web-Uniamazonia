import './PagPopular.css'

function PagPopular({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    // Ajustar si estamos cerca del final
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className="pagination" aria-label="Paginación de personajes populares">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        ← Anterior
      </button>

      {pageNumbers[0] > 1 && (
        <>
          <button
            className="pagination-btn pagination-number"
            onClick={() => onPageChange(1)}
            aria-label={`Ir a la página 1`}
          >
            1
          </button>
          {pageNumbers[0] > 2 && <span className="pagination-ellipsis">...</span>}
        </>
      )}

      {pageNumbers.map((page) => (
        <button
          key={page}
          className={`pagination-btn pagination-number ${page === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
          aria-label={`Ir a la página ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
          <button
            className="pagination-btn pagination-number"
            onClick={() => onPageChange(totalPages)}
            aria-label={`Ir a la página ${totalPages}`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
      >
        Siguiente →
      </button>
    </nav>
  )
}

export default PagPopular