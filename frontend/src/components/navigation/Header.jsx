import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import {  Avatar, Button, IconButton } from "../"
import './styles/Header.css'
import { bellIcon, searchIcon } from "../../assets/img/icons"
import { Link, NavLink, useLocation, useSearchParams } from "react-router-dom"
import { logoNameSvg, logoSvg } from "../../assets/img/logo"

const Header = () => {
    const { pathname } = useLocation()
    const headerRef = useRef(null)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const [searchParams, setSearchParams] = useSearchParams()

    const [searchValue, setSearchValue] = useState(searchParams.get('q') || '')


    useEffect(() => {
        if (searchParams.get('q') !== searchValue) { setSearchValue(searchParams.get('q') || '') }
    }, [searchParams.get('q')])

    const { user } = useSelector(state => state.auth)


    return (
        <>
        <div className={`${pathname == '/login' || pathname == '/register' || pathname == '/forgot-password' || pathname === '/reset-password' ? " bg-transparent-blur bg-sm-main" : " bg-translucent-blur"} pos-fixed w-available header-container`} ref={headerRef}>
                <header className="header pos-relative px-sm-3 flex-grow-1">
                    <div className={`${pathname == '/login' || pathname == '/register' || pathname == '/forgot-password' || pathname === '/reset-password' ? "flex-1" : "w-max-xl w-100 mx-auto"}`}>
                        <div className="container">
                            <div className="flex justify-between w-100 align-center gap-2 gap-sm-3">
                                <div className={`flex justify-start gap-3 align-center gap-sm-3`}>
                                    <Link
                                        to="/"
                                        className="flex align-center pointer h-set-45-px">
                                        { windowWidth > 800 ?
                                        logoNameSvg
                                        :
                                            logoSvg
                                        }
                                    </Link>
                                </div>
                                <div className={`justify-end flex align-center flex-no-wrap gap-3`}>
                                    <Button
                                        to="/"
                                        label="Home"
                                        variant="text"
                                        type="secondary"
                                    />
                                    <Button
                                        to="/discover"
                                        label="Games"
                                        variant="text"
                                        type="secondary"
                                    />
                                    {pathname === '/forgot-password' || pathname === '/reset-password' ? null :
                                    <>
                                    {pathname === '/register' ? 
                                        <Button
                                            to="/login"
                                            label="Log In"
                                            variant="filled"
                                            type="secondary"
                                            borderRadius="lg"
                                        />
                                    : pathname === '/login' ? 
                                    <Button
                                        to="/register"
                                        label="Sign Up"
                                        variant="filled"
                                        type="secondary"
                                        borderRadius="lg"
                                    />
                                    : 
                                    <Button
                                        to="/login"
                                        label="Log In"
                                        variant="filled"
                                        type="secondary"
                                        borderRadius="lg"
                                    />
                                    }
                                    </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            {/* </div> */}
        </div>
        </>
    )
}

export default Header