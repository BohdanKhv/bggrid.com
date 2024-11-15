import React from 'react'
import { NavLink, useLocation, useSearchParams } from 'react-router-dom'
import { gamesIcon, homeIcon, largePlusIcon, libraryIcon, menuIcon, noteIcon, searchIcon, usersIcon } from '../../assets/img/icons'
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
                            {homeIcon}
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
                            {libraryIcon}
                        </span>
                        {/* <span className="navbar-mob-item-label">
                            Library
                        </span> */}
                    </NavLink>
                    <NavLink 
                        className={`navbar-mob-item active`}
                        to={`/search`}
                    >
                        <div className="border flex justify-center align-center btn btn-default btn-secondary">
                            {largePlusIcon}
                        </div>
                    </NavLink>
                    <NavLink
                        to="/plays"
                        className={`navbar-mob-item ${pathname === "/plays" ? " active" : ""}`}
                    >
                        <span className="navbar-mob-item-icon">
                            {noteIcon}
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
                            {usersIcon}
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