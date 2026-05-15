import { useEffect, useState } from 'react'
import './Inicio.css'

function Inicio() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo(0, 0)
  }

  if (!visible) {
    return null
  }

  return (
    <button className="scroll-top-button" onClick={scrollToTop}>
      <img src="/img/portal.jpg" alt="Ir al inicio" className="scroll-top-image" />
    </button>
  )
}

export default Inicio
