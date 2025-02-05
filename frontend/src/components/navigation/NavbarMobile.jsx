import React from 'react'
import { NavLink, useLocation, useSearchParams } from 'react-router-dom'
import { gamesIcon, homeIcon, largePlusIcon, libraryIcon, menuIcon, diceIcon, searchIcon, usersIcon, discoverIcon, homeFillIcon, usersFillIcon, diceFillIcon, discoverFillIcon, libraryFillIcon, searchFillIcon } from '../../assets/img/icons'
import "./styles/NavbarMobile.css"
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import { useSelector } from 'react-redux'

const NavbarMobile = () => {
    const { pathname } = useLocation()

    const { user } = useSelector(state => state.auth)
    const [searchParams, setSearchParams] = useSearchParams()

    return (
            <div className="navbar-mob">
                <div className="navbar-mob-links">
                    <NavLink
                        to={`/`}
                        className={`navbar-mob-item ${pathname === "/" ? " active" : ""}`}
                    >
                        <span className="navbar-mob-item-icon">
                            {pathname === "/" ? homeFillIcon : homeIcon}
                        </span>
                        {/* <span className="navbar-mob-item-label">
                            Home
                        </span> */}
                    </NavLink>
                    <NavLink 
                        to={`/library`}
                        className={`navbar-mob-item ${location.pathname.startsWith("/supply") ? " active" : ""}`}
                    >
                        <span className="navbar-mob-item-icon">
                            {pathname === "/library" ? libraryFillIcon : libraryIcon}
                        </span>
                        {/* <span className="navbar-mob-item-label">
                            Library
                        </span> */}
                    </NavLink>
                    <NavLink 
                        // className={`navbar-mob-item active`}
                        className={`navbar-mob-item ${pathname.startsWith('/discover') ? " active" : ""}`}
                        to={`/discover`}
                        onClick={() => 
                        {
                            if (pathname == '/discover')
                            {
                                document.querySelector('.search-input-mobile').click()
                            }
                        }
                        }
                    >
                        {/* <div className="border flex justify-center align-center btn btn-default btn-secondary">
                            {discoverIcon}
                        </div> */}
                        <span className="navbar-mob-item-icon">
                            {pathname.startsWith('/discover') ? searchFillIcon : searchIcon}
                        </span>
                    </NavLink>
                    <NavLink
                        to="/plays"
                        className={`navbar-mob-item ${pathname === "/plays" ? " active" : ""}`}
                    >
                        <span className="navbar-mob-item-icon">
                            {pathname === "/plays" ? diceFillIcon : diceIcon}
                        </span>
                        {/* <span className="navbar-mob-item-label">
                            Logs
                        </span> */}
                    </NavLink>
                    <NavLink 
                        to={`/community`}
                        className={`navbar-mob-item ${location.pathname.startsWith("/community") ? " active" : ""}`}
                    >
                        <span className="navbar-mob-item-icon">
                            {pathname.startsWith("/community") ? usersFillIcon : usersIcon}
                        </span>
                        {/* <span className="navbar-mob-item-label">
                            Community
                        </span> */}
                    </NavLink>
                </div>
            </div>
    )
}

export default NavbarMobile