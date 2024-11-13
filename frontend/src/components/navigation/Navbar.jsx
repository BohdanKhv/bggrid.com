import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom'
import { bellIcon, gamesIcon, homeIcon, largePlusIcon, libraryIcon, loginIcon, logoutIcon, searchIcon, settingsIcon, usersIcon } from '../../assets/img/icons'
import "./styles/Navbar.css"
import { logoNameSvg, logoSvg } from '../../assets/img/logo'
import Icon from '../ui/Icon'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice'

const Navbar = () => {
    const dispatch = useDispatch()


    const [navOpen, setNavOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const { user } = useSelector(state => state.auth)
    const { pathname } = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        let timeOutId;
        if (!navOpen) {
            timeOutId = setTimeout(() => {
                setIsOpen(false);
                setNavOpen(false);
            }, 150);
        } else {
            setIsOpen(true);
            setNavOpen(true);
        }

        return () => clearTimeout(timeOutId);
    }, [navOpen]);

    return (
        <>
        {window.innerWidth <= 800 &&
            <div className="d-none open-navbar-button"
                onClick={() => setNavOpen(true)}
            />
        }
        {(isOpen || window.innerWidth > 800) &&
        <nav className={`navbar-wrapper${ window.innerWidth <= 800 ? navOpen ? " navbar-open" : " navbar-closed" : ""}`}
            onClick={() => {
                if (navOpen && window.innerWidth <= 800) setNavOpen(false)
            }}
        >
            <div className="navbar">
                <div className="navbar-header">
                    <Link
                        to="/"
                        className="flex align-center pointer">
                        { window.innerWidth > 800 ?
                        logoNameSvg
                        :
                            pathname  === '/jobs' ?
                            <Icon icon={logoSvg} size="lg" />
                            :
                            logoNameSvg
                        }
                    </Link>
                </div>
                <div className="navbar-body">
                    {user ?
                    <>
                    <Link
                        to={`/${user.username}`}
                        className="flex gap-3 pointer hover border-radius-lg overflow-hidden px-3 py-3">
                        <div className="flex align-center justify-center align-center">
                            <div className="border border-radius-50">
                                <Avatar
                                    img={user && user?.avatar ? `${import.meta.env.VITE_USERS_S3_API_URL}/${user?.avatar}` : null}
                                    name={user ? `${user?.email}` : null}
                                    rounded
                                    defaultColor={user}
                                    len={1}
                                    avatarColor="0"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="fs-14 weight-600 text-ellipsis-1">
                                {user.firstName} {user.lastName}
                            </div>
                            <div className="fs-14 weight-600 text-secondary text-ellipsis-1">
                                @{user.username}
                            </div>
                        </div>
                    </Link>
                    <Button
                        to="/search"
                        label="Search"
                        icon={searchIcon}
                        variant="filled"
                        className="justify-start w-fit-content my-4"
                        size="lg"
                        type="primary"
                    />
                    <Button
                        muted={pathname !== '/'}
                        to="/"
                        label="Home"
                        variant="text"
                        icon={homeIcon}
                        type="secondary"
                    />
                    <Button
                        muted={pathname !== '/library'}
                        to="/library"
                        label="Library"
                        variant="text"
                        icon={libraryIcon}
                        type="secondary"
                    />
                    <Button
                        muted
                        to="/crew"
                        label="Community"
                        variant="text"
                        icon={usersIcon}
                        type="secondary"
                    />
                    <Button
                        muted={pathname !== '/library'}
                        to="/notifications"
                        label="Notifications"
                        variant="text"
                        icon={bellIcon}
                        type="secondary"
                    />
                    <Button
                        muted
                        to="/settings"
                        label="Settings"
                        variant="text"
                        icon={settingsIcon}
                        type="secondary"
                    />
                    <Button
                        label="Log Out"
                        icon={logoutIcon}
                        onClick={() => dispatch(logout())}
                        type="secondary"
                        className="w-100"
                        variant="text"
                        muted
                    />
                    </>
                    :
                    <>
                    <Button
                        to="/"
                        label="Home"
                        variant="text"
                        icon={homeIcon}
                        type="secondary"
                    />
                    <Button
                        to="/login"
                        label="Log in"
                        variant="text"
                        icon={loginIcon}
                        type="secondary"
                    />
                    </>
                    }
                </div>
                <div className="navbar-footer">
                    <div className="fs-12 text-secondary p-4">
                        © {new Date().getFullYear()} Game
                    </div>
                </div>
            </div>
        </nav>
        }
        </>
    )
}

export default Navbar