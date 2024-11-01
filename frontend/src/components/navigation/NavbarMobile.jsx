import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { gamesIcon, homeIcon, largePlusIcon, libraryIcon, searchIcon, usersIcon } from '../../assets/img/icons'
import "./styles/NavbarMobile.css"
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import { useSelector } from 'react-redux'

const NavbarMobile = () => {
    const { pathname } = useLocation()

    const { user } = useSelector(state => state.auth)

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
                            Browse
                        </span>
                    </NavLink>
                    <div 
                        className={`navbar-mob-item`}
                    >
                        <div className="border border-radius-50 flex justify-center align-center icon-btn-primary icon-btn icon-btn-filled icon-btn-secondary">
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
                            Crew
                        </span>
                    </NavLink>
                    <div 
                        className={`navbar-mob-item`}
                        onClick={() => {
                            document.querySelector('.open-navbar-button').click()
                        }}
                    >
                        <span className="navbar-mob-item-icon">
                            <Avatar
                                img={user && user?.avatar ? `${import.meta.env.VITE_USERS_S3_API_URL}/${user?.avatar}` : null}
                                name={user ? `${user?.email}` : null}
                                rounded
                                defaultColor={user}
                                len={1}
                                avatarColor="0"
                            />
                        </span>
                        <span className="navbar-mob-item-label">
                            You
                        </span>
                    </div>
                </div>
            </div>
    )
}

export default NavbarMobile