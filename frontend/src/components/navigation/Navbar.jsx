import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom'
import { bellIcon, gamesIcon, homeIcon, largePlusIcon, libraryIcon, loginIcon, logoutIcon, diceIcon, searchIcon, settingsIcon, usersIcon, discoverIcon, linkIcon, homeFillIcon, libraryFillIcon, discoverFillIcon, diceFillIcon, bellFillIcon, usersFillIcon, settingsFillIcon, searchFillIcon, githubIcon } from '../../assets/img/icons'
import "./styles/Navbar.css"
import { logoNameSvg, logoSvg } from '../../assets/img/logo'
import Icon from '../ui/Icon'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import pJson from '../../../package.json'

const Navbar = () => {
    const dispatch = useDispatch()


    const [navOpen, setNavOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const { unread } = useSelector(state => state.notification)

    const { user, serverVersion } = useSelector(state => state.auth)
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
                <div className="navbar-header justify-center">
                    <Link
                        to="/"
                        className="flex align-center pointer h-fit-content w-100 h-max-inherit h-100">
                        {logoNameSvg}
                    </Link>
                </div>
                <div className="navbar-body">
                    {user ?
                    <>
                    <Link
                        to={`/u/${user.username}`}
                        className={`flex gap-3 pointer hover border-radius-lg overflow-hidden${pathname.startsWith(`/u/${user.username}`) ? " bg-secondary" : ""}`}>
                        <div className="flex align-center justify-center align-center ps-3 py-3">
                            <div className={`border border-radius-50${pathname.startsWith(`/u/${user.username}`) ? " border-color-text" : ""}`}>
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
                    {/* <Button
                        to="/discover"
                        label="Games"
                        icon={discoverIcon}
                        // variant="filled"
                        className="justify-start w-fit-content my-4"
                        size="lg"
                        type="secondary"
                    /> */}
                    <Button
                        // muted={pathname !== '/'}
                        to="/"
                        label="Home"
                        icon={pathname === '/' ? homeFillIcon : homeIcon}
                        type={pathname === '/' ? "secondary" : "secondary"}
                        variant={pathname === '/' ? "" : "text"}
                    />
                    <Button
                        // muted={pathname !== '/library'}
                        to="/library"
                        label="Library"
                        icon={pathname === '/library' ? libraryFillIcon : libraryIcon}
                        type={pathname === '/library' ? "secondary" : "secondary"}
                        variant={pathname === '/library' ? "" : "text"}
                    />
                    <Button
                        // muted={pathname !== '/'}
                        to="/discover"
                        label="Games"
                        icon={pathname.startsWith('/discover') ? searchFillIcon : searchIcon}
                        type={pathname.startsWith('/discover') ? "secondary" : "secondary"}
                        variant={pathname.startsWith('/discover') ? "" : "text"}
                    />
                    <Button
                        // muted={pathname !== '/library'}
                        to="/plays"
                        label="Plays"
                        icon={pathname === '/plays' ? diceFillIcon : diceIcon}
                        type={pathname === '/plays' ? "secondary" : "secondary"}
                        variant={pathname === '/plays' ? "" : "text"}
                    />
                    <Button
                        // muted
                        to="/community"
                        label="Community"
                        icon={pathname.startsWith('/community') ? usersFillIcon : usersIcon}
                        type={pathname.startsWith('/community') ? "secondary" : "secondary"}
                        variant={pathname.startsWith('/community') ? "" : "text"}
                    />
                    <Button
                        // muted={pathname !== '/notifications'}
                        to="/notifications"
                        label={
                        <>
                            Notifications
                            {unread > 0 &&
                            <span className="fs-14 text-primary ps-3">
                                {unread}
                            </span>
                            }
                        </>
                        }
                        icon={pathname === '/notifications' ? bellFillIcon : bellIcon}
                        type={pathname === '/notifications' ? "secondary" : "secondary"}
                        variant={pathname === '/notifications' ? "" : "text"}
                    />
                    <Button
                        // muted={!pathname.includes('/settings')}
                        to="/settings"
                        label="Settings"
                        icon={pathname.startsWith('/settings') ? settingsFillIcon : settingsIcon}
                        type={pathname.startsWith('/settings') ? "secondary" : "secondary"}
                        variant={pathname.startsWith('/settings') ? "" : "text"}
                    />
                    <Button
                        label="Log Out"
                        icon={logoutIcon}
                        onClick={() => {
                            dispatch(logout())
                        }}
                        to="/"
                        type="secondary"
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
                        <Link className="fs-14 border border-radius px-3 py-2 weight-500 color-border-on-hover-text pointer transition-duration flex align-center justify-between"
                            to={"https://github.com/BohdanKhv/bggrid.com"}
                            target="_blank"
                        >
                            <span className="flex align-center gap-2">
                                <Icon
                                    icon={githubIcon}
                                    size="sm"
                                />
                                Open source
                            </span>
                            <Icon
                                icon={linkIcon}
                                size="sm"
                            />
                        </Link>
                        <Link className="fs-14 border border-radius px-3 py-2 weight-500 color-border-on-hover-text pointer transition-duration flex align-center justify-between"
                            to={"https://donate.stripe.com/28o5lK099gqzcwgaEE"}
                            target="_blank"
                            >
                            <span>
                                🧡 Support us
                            </span>
                            <Icon
                                icon={linkIcon}
                                size="sm"
                            />
                        </Link>
                        <Link className="fs-14 border border-radius px-3 py-2 weight-500 color-border-on-hover-text pointer transition-duration flex align-center justify-between"
                            to={"mailto:contact@bggrid.com"}
                            target="_blank"
                        >
                            <span>
                                contact@bggrid.com
                            </span>
                            <Icon
                                icon={linkIcon}
                                size="sm"
                            />
                        </Link>
                    </div>
                    <div className="flex gap-2 p-4 flex-col">
                        <div className="flex gap-3 align-center">
                                <div
                                    className="w-set-50-px flex align-center"
                                >
                                    {logoNameSvg}
                                </div>
                                <div className="flex align-center fs-12 text-secondary gap-2">
                                <Link
                                    className="text-secondary text-underlined-hover"
                                    to="/terms">
                                    Terms
                                </Link>
                                <span className="fs-10">
                                    |
                                </span>
                                <Link
                                    className="text-secondary text-underlined-hover"
                                    to="/privacy">
                                    Privacy
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="fs-12 text-secondary weight-500">
                                © {new Date().getFullYear()} bggrid.com
                            </div>
                            <div className="fs-12 text-secondary weight-500">
                                All rights reserved.
                            </div>
                            <div className={`fs-12 text-secondary weight-500 mt-2${serverVersion && serverVersion !== pJson.version ? " pointer text-underlined-hover" : ""}`}
                                onClick={() => {
                                        // Clear cached files
                                        caches.keys().then(function(names) {
                                            console.log(names)
                                            for (let name of names) caches.delete(name);
                                        });
                                    
                                        // Refresh service worker
                                        navigator.serviceWorker.getRegistrations().then(function(registrations) {
                                            for (let registration of registrations) {
                                                registration.unregister()
                                                .then(function() {
                                                    // Bust cache
                                                    window.location.reload(true)
                                                })
                                            }
                                        });
                                    }
                                }
                            >
                                <span className={`${serverVersion && serverVersion !== pJson.version ? " text-warning" : ""}`}>{serverVersion && pJson.version !== serverVersion ? `${serverVersion} - click to update` : `${pJson.version}`}</span>
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