import React from 'react'
import { NavLink, useLocation, useSearchParams } from 'react-router-dom'
import { gamesIcon, homeIcon, largePlusIcon, libraryIcon, menuIcon, searchIcon, usersIcon } from '../../assets/img/icons'
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
                        <span className="navbar-mob-item-label">
                            Home
                        </span>
                    </NavLink>
                    <NavLink 
                        to={`/library`}
                        className={`navbar-mob-item ${location.pathname.startsWith("/supply") ? " active" : ""}`}
                    >
                        <span className="navbar-mob-item-icon">
                            {libraryIcon}
                        </span>
                        <span className="navbar-mob-item-label">
                            Library
                        </span>
                    </NavLink>
                    <div 
                        className={`navbar-mob-item active`}
                        onClick={() => {
                            searchParams.set("sg", true)
                            setSearchParams(searchParams)
                        }}
                    >
                        <div className="border flex justify-center align-center btn btn-default btn-secondary">
                            {largePlusIcon}
                        </div>
                    </div>
                    <NavLink 
                        to={`/crew`}
                        className={`navbar-mob-item ${location.pathname.startsWith("/crew") ? " active" : ""}`}
                    >
                        <span className="navbar-mob-item-icon">
                            {usersIcon}
                        </span>
                        <span className="navbar-mob-item-label">
                            Community
                        </span>
                    </NavLink>
                    <div
                        onClick={() => {
                            document.querySelector('.open-navbar-button').click()
                        }}
                        className={`navbar-mob-item`}
                    >
                        <span className="navbar-mob-item-icon">
                            {menuIcon}
                        </span>
                        <span className="navbar-mob-item-label">
                            More
                        </span>
                    </div>
                </div>
            </div>
    )
}

export default NavbarMobile