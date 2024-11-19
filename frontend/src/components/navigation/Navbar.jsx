import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom'
import { bellIcon, gamesIcon, homeIcon, largePlusIcon, libraryIcon, loginIcon, logoutIcon, diceIcon, searchIcon, settingsIcon, usersIcon, discoverIcon } from '../../assets/img/icons'
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
            <div className="d-none open-navbar-button pos-absolute"
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
                        to={`/u/${user.username}`}
                        className="flex gap-3 pointer hover border-radius-lg overflow-hidden px-3 py-3">
                        <div className="flex align-center justify-center align-center">
                            <div className="border border-radius-50">
                                <Avatar
                                    img={user && user?.avatar ? `${user?.avatar}` : null}
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
                        to="/discover"
                        label="Games"
                        icon={discoverIcon}
                        // variant="filled"
                        className="justify-start w-fit-content my-4"
                        size="lg"
                        type="secondary"
                    />
                    <Button
                        // muted={pathname !== '/'}
                        to="/"
                        label="Home"
                        icon={homeIcon}
                        type={pathname === '/' ? "secondary" : "secondary"}
                        variant={pathname === '/' ? "" : "text"}
                    />
                    <Button
                        // muted={pathname !== '/library'}
                        to="/library"
                        label="Library"
                        icon={libraryIcon}
                        type={pathname === '/library' ? "secondary" : "secondary"}
                        variant={pathname === '/library' ? "" : "text"}
                    />
                    <Button
                        // muted={pathname !== '/library'}
                        to="/plays"
                        label="Plays"
                        icon={diceIcon}
                        type={pathname === '/plays' ? "secondary" : "secondary"}
                        variant={pathname === '/plays' ? "" : "text"}
                    />
                    <Button
                        // muted
                        to="/community"
                        label="Community"
                        icon={usersIcon}
                        type={pathname === '/community' ? "secondary" : "secondary"}
                        variant={pathname === '/community' ? "" : "text"}
                    />
                    <Button
                        // muted={pathname !== '/notifications'}
                        to="/notifications"
                        label="Notifications"
                        icon={bellIcon}
                        type={pathname === '/notifications' ? "secondary" : "secondary"}
                        variant={pathname === '/notifications' ? "" : "text"}
                    />
                    <Button
                        // muted={!pathname.includes('/settings')}
                        to="/settings"
                        label="Settings"
                        icon={settingsIcon}
                        type={pathname.startsWith('/settings') ? "secondary" : "secondary"}
                        variant={pathname.startsWith('/settings') ? "" : "text"}
                    />
                    <Button
                        label="Log Out"
                        icon={logoutIcon}
                        onClick={() => dispatch(logout())}
                        type="secondary"
                        className="w-100"
                        variant="text"
                        // muted
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