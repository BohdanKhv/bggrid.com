import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import {  Avatar, Button, ErrorInfo, Icon, IconButton, InputSearch, Modal, UserProfile } from "../"
import './styles/Header.css'
import { arrowDoubleBottomIcon, arrowDownShortIcon, arrowUpShortIcon, basketFillIcon, basketIcon, bellIcon, clockIcon, closeIcon, deliveryIcon, gamesIcon, historyIcon, homeFillIcon, homeIcon, leftArrowIcon, libraryIcon, locationIcon, mapIcon, menuIcon, searchIcon, selectOptionsIcon, userIcon, usersFillIcon, usersIcon } from "../../assets/img/icons"
import { Link, NavLink, useLocation, useSearchParams } from "react-router-dom"
import { logoNameSvg, logoRevertSvg, logoSvg } from "../../assets/img/logo"
import { commonGames } from "../../assets/constants"
import { setSearchHistory } from "../../features/local/localSlice"
import UserNotification from "../user/UserNotification"
import GameSearchModal from "../../pages/game/GameSearchModal"

const Header = () => {
    const dispatch = useDispatch()

    const { pathname } = useLocation()
    const [topOffset, setTopOffset] = useState(0)
    const { searchHistory } = useSelector(state => state.local)
    const [showAllHistory, setShowAllHistory] = useState(false)
    const headerRef = useRef(null)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [openSearch, setOpenSearch] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()

    const [searchValue, setSearchValue] = useState(searchParams.get('q') || '')


    useEffect(() => {
        if (searchParams.get('q') !== searchValue) { setSearchValue(searchParams.get('q') || '') }
    }, [searchParams.get('q')])

    const { user } = useSelector(state => state.auth)

    useEffect(() => {
        const handleScroll = () => {
            setTopOffset(window.pageYOffset)
        }

        // if (window.ReactNativeWebView) {
        //     // Hide the header and bottom navbar
        //     const header = headerRef.current
        //     // if (header) {
        //         // header.style.display = 'none'
        //     // }
        // }

        window.addEventListener('scroll', handleScroll)
        window.addEventListener('resize', () => {
            setWindowWidth(window.innerWidth)
        })

        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', () => {
                setWindowWidth(window.innerWidth)
            })
        }
    }, [])

    if (pathname === '/discover' || pathname === '/library' || pathname === '/community' || pathname === '/community') return

    return (
        <>
        <div className={`${pathname == '/login' || pathname == '/register' || pathname == '/forgot-password' || pathname === '/reset-password' ? " bg-transparent-blur" : " bg-translucent-blur"} pos-fixed w-available header-container`} ref={headerRef}>
                <header className="header pos-relative px-sm-3 flex-grow-1">
                    <div className={`${pathname == '/login' || pathname == '/register' || pathname == '/forgot-password' || pathname === '/reset-password' ? "flex-1" : "w-max-md mx-auto"}`}>
                        <div className="container">
                            <div className="flex justify-between w-100 align-center gap-2 gap-sm-3">
                                <div className={`flex justify-start gap-3 align-center gap-sm-3`}>
                                    {pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/reset-password' || pathname.startsWith('/g/') ?
                                    <Link
                                        to="/"
                                        className="flex align-center pointer">
                                        { windowWidth > 800 ?
                                        logoNameSvg
                                        :
                                            logoNameSvg
                                        }
                                    </Link>
                                    :
                                    <span className="text-capitalize weight-600 fs-20 text-ellipsis-1 header-title"/>
                                    }
                                        {/* <div className="d-sm-none">
                                            <div className="flex gap-2 flex-grow-1">
                                                <Button
                                                    muted
                                                    to="/"
                                                    label="Home"
                                                    variant="text"
                                                    type="secondary"
                                                />
                                            </div>
                                        </div> */}
                                </div>
                                <div className={`justify-end flex align-center flex-no-wrap gap-3`}>
                                    {user ?
                                    <>
                                        <GameSearchModal/>
                                        <IconButton
                                            icon={bellIcon}
                                            variant="text"
                                            to="/notifications"
                                        />
                                        <div
                                            onClick={() => {
                                                document.querySelector('.open-navbar-button').click()
                                            }}
                                        >
                                            <Avatar
                                                img={user && user?.avatar ? `${import.meta.env.VITE_USERS_S3_API_URL}/${user?.avatar}` : null}
                                                name={user ? `${user?.email}` : null}
                                                rounded
                                                avatarColor="1"
                                                size="sm"
                                            />
                                        </div>
                                    </>
                                    :
                                    pathname === '/forgot-password' || pathname === '/reset-password' ? null :
                                    <>
                                    {pathname === '/login' ? null :
                                        <Button
                                            to="/login"
                                            label="Log In"
                                            variant="filled"
                                            type="secondary"
                                            borderRadius="lg"
                                        />
                                    }
                                    {pathname === '/register' ? null :
                                        <Button
                                            to="/register"
                                            label="Sign Up"
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