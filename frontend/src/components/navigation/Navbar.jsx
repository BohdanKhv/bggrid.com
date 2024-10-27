import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { gamesIcon, homeIcon, libraryIcon, searchIcon, usersIcon } from '../../assets/img/icons'
import "./styles/Navbar.css"

const Navbar = () => {
    const { pathname } = useLocation()

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
                        <span className="navbar-mob-item-label">
                            Home
                        </span>
                    </NavLink>
                    <NavLink 
                        to={`/search`}
                        className={`navbar-mob-item ${location.pathname.startsWith("/supply") ? " active" : ""}`}
                    >
                        <span className="navbar-mob-item-icon">
                            {searchIcon}
                        </span>
                        <span className="navbar-mob-item-label">
                            Search
                        </span>
                    </NavLink>
                    <NavLink
                        to={`/library`}
                        className={`navbar-mob-item ${location.pathname.startsWith("/library") ? " active" : ""}`}
                    >
                        <span className="navbar-mob-item-icon">
                            {libraryIcon}
                        </span>
                        <span className="navbar-mob-item-label">
                            Library
                        </span>
                    </NavLink>
                    <NavLink 
                        to={`/crew`}
                        className={`navbar-mob-item ${location.pathname.startsWith("/crew") ? " active" : ""}`}
                    >
                        <span className="navbar-mob-item-icon">
                            {usersIcon}
                        </span>
                        <span className="navbar-mob-item-label">
                            Crew
                        </span>
                    </NavLink>
                    <div className="navbar-more-apps-btn d-none"
                        onClick={() => setNavOpen(!navOpen)}
                    />
                </div>
            </div>
    )
}

export default Navbar