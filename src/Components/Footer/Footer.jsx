import './Footer.css'

function Footer() {
    return (
        <footer className="app-footer">
            <img
                className="footer-image footer-image-left"
                src="/img/rick_cara.jpg"
                alt="Morty cara"
            />
            <p className="footer-text">By: Juan Carlos Mora Rojas</p>
            <img
                className="footer-image footer-image-right"
                src="/img/morty_cara.png"
                alt="Rick cara"
            />
        </footer>
    )
}

export default Footer
