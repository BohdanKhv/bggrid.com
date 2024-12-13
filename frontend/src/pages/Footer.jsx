import { Button } from '../components'
import { emailIcon, instagramIcon, loginIcon } from '../assets/img/icons'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Footer = () => {
    const { pathname } = useLocation()

    const { user } = useSelector(state => state.auth)

    return (
        (['/','/terms','/faq','/pricing','/privacy'].includes(pathname) || pathname.startsWith('/salaries') || pathname.startsWith('/interviews')) &&
        <footer className="bg-black container px-sm-3 py-6 flex flex-col border-top">
            <div className="w-max-xl w-100 mx-auto h-100 flex flex-col flex-1 gap-6">
                <div className="flex justify-between flex-1 flex-sm-col gap-sm-6">
                    <div className="flex flex-col gap-1">
                        <div className="fs-14 weight-600 text-white text-uppercase pb-4">
                            SITE MAP
                        </div>
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Home"
                            to="/"
                        />
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Discover Games"
                            to="/discover"
                        />
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Login"
                            to="/login"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="fs-14 weight-600 text-white text-uppercase pb-4">
                            About
                        </div>
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Privacy Policy"
                            to="/privacy"
                        />
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Terms of Service"
                            to="/terms"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="fs-14 weight-600 text-white text-uppercase pb-4">
                            Contact
                        </div>
                        <Button
                            muted
                            className="text-white justify-start weight-400 fill-white"
                            variant="link"
                            icon={emailIcon}
                            label="contact@bggrid.com"
                            to="mailto:contact@bggrid.com"
                            target="_blank"
                        />
                    </div>
                </div>
                    <div className="fs-12 text-white opacity-75 text-center">
                        © {new Date().getFullYear()} BGGRID All rights reserved.
                    </div>
            </div>
        </footer>
    )
}

export default Footer