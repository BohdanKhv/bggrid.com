import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom'
import { bellIcon, gamesIcon, homeIcon, largePlusIcon, libraryIcon, loginIcon, logoutIcon, diceIcon, searchIcon, settingsIcon, usersIcon, discoverIcon, linkIcon } from '../../assets/img/icons'
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

    const { notifications } = useSelector(state => state.notification)

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
                <div className="navbar-header mt-2 mb-4">
                    <Link
                        to="/"
                        className="flex align-center pointer my-2">
                            {logoNameSvg}
                    </Link>
                </div>
                <div className="navbar-body">
                    {user ?
                    <>
                    <Link
                        to={`/u/${user.username}`}
                        className="flex gap-3 pointer hover border-radius-lg overflow-hidden">
                        <div className="flex align-center justify-center align-center ps-3 py-3">
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
                        <div className="flex flex-col justify-center pe-3 py-3 overflow-hidden">
                            <div className="fs-14 weight-600 text-ellipsis">
                                {user.firstName} {user.lastName}
                            </div>
                            <div className="fs-14 weight-600 text-secondary text-ellipsis">
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
                        label={
                        <>
                            Notifications
                            <span className="fs-14 text-danger ps-3">
                                {notifications.filter(notification => !notification.read).length || ""}
                            </span>
                        </>
                        }
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
                    <div className="flex flex-col px-4 gap-2">
                        <div className="pb-2">
                            <div className="fs-14 border border-radius px-4 py-3 weight-500 color-border-on-hover-text pointer transition-duration flex align-center justify-between"
                                onClick={() => window.open("mailto:contact@bggrid.com", "_blank")}>
                                <span>
                                    contact@bggrid.com
                                </span>
                                <Icon
                                    icon={linkIcon}
                                    size="sm"
                                />
                            </div>
                            <div className="fs-12 pt-1 text-secondary">
                                You can share your thoughts with us and make our project better.
                            </div>
                        </div>
                        <Button
                            to="/terms"
                            label="Terms of use"
                            variant="link"
                            type="secondary"
                        />
                        <Button
                            to="/privacy"
                            label="Privacy policy"
                            variant="link"
                            type="secondary"
                        />
                    </div>
                    <div className="flex gap-2 p-4 flex-col">
                        <div
                            className="w-set-50-px"
                        >
                            {logoNameSvg}
                        </div>
                        <div className="flex flex-col">
                            <div className="fs-12 text-secondary weight-500">
                                © {new Date().getFullYear()} bggrid.com
                            </div>
                            <div className="fs-12 text-secondary weight-500">
                                All rights reserved.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        }
        </>
    )
}

export default Navbar