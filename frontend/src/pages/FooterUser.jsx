import { Button } from '../components'
import { emailIcon, instagramIcon, loginIcon } from '../assets/img/icons'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const FooterUser = () => {
    return (
        <footer className="container px-sm-3 py-2 fs-12 text-center text-secondary">
                This is Beta version of the site.
                Please report any bugs to <span
                    onClick={() => window.open("mailto:contact@bggrid.com")}
                className="text-secondary weight-500 text-underlined-hover">
                    contact@bggrid.com
                </span>
        </footer>
    )
}

export default FooterUser