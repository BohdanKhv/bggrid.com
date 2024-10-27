import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import {  Button, ErrorInfo, Icon, IconButton, InputSearch, Modal, UserProfile } from "../"
import './styles/Header.css'
import { arrowDoubleBottomIcon, arrowDownShortIcon, arrowUpShortIcon, basketFillIcon, basketIcon, clockIcon, closeIcon, deliveryIcon, historyIcon, homeFillIcon, homeIcon, leftArrowIcon, locationIcon, mapIcon, menuIcon, searchIcon, selectOptionsIcon, userIcon, usersFillIcon, usersIcon } from "../../assets/img/icons"
import { Link, useLocation, useSearchParams } from "react-router-dom"
import { logoNameSvg, logoRevertSvg, logoSvg } from "../../assets/img/logo"
import { commonJobsEnum, locationNewYorkEnum } from "../../assets/constants"
import { getLocations } from "../../features/suggestion/suggestionSlice"
import { setSearchHistory } from "../../features/local/localSlice"

const Header = () => {
    const dispatch = useDispatch()

    const { pathname } = useLocation()
    const [topOffset, setTopOffset] = useState(0)
    const { searchHistory } = useSelector(state => state.local)
    const [showAllHistory, setShowAllHistory] = useState(false)
    const headerRef = useRef(null)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [openSearch, setOpenSearch] = useState(false)

    const { locations, loadingId } = useSelector(state => state.suggestion)

    const [searchParams, setSearchParams] = useSearchParams()

    const [searchLocation, setSearchLocation] = useState(searchParams.get('location') || '')
    const [searchValue, setSearchValue] = useState(searchParams.get('q') || '')


    useEffect(() => {
        let promise;
    
        if (searchLocation?.length > 2) {
            promise = dispatch(getLocations(searchLocation))
        }

        return () => {
            promise && promise.abort()
        }
    }, [searchLocation])

    useEffect(() => {
        if (searchParams.get('location') !== searchLocation) { setSearchLocation(searchParams.get('location') || '') }
        if (searchParams.get('q') !== searchValue) { setSearchValue(searchParams.get('q') || '') }
    }, [searchParams.get('location'), searchParams.get('q')])

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

    const highlightText = (text, query) => {
        if (!query) {
            return text;
        }
    
        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);
    
        return parts.map((part, index) =>
            regex.test(part) ? <strong key={index} className="text-primary">{part}</strong> : part
        );
    };

    return (
        <>
        <div className={`${ pathname  === '/jobs' ? 'bg-main' : pathname == '/login' || pathname.startsWith('/login-with-email') ? " bg-transparent-blur" : " bg-translucent-blur"} pos-fixed w-available header-container`} ref={headerRef}>
                <header className="header pos-relative px-sm-3 flex-grow-1">
                    <div className={`${pathname  === '/jobs' ? "w-100" : "w-max-md mx-auto"}`}>
                        <div className="container">
                            <div className="flex justify-between w-100 align-center gap-2 gap-sm-3">
                                    <div className={`flex justify-start gap-3 align-center gap-sm-3${pathname  === '/jobs' ? "" : " flex-1"}`}>
                                        <Link
                                            to="/"
                                            className="flex align-center pointer">
                                            { windowWidth > 800 ?
                                            logoNameSvg
                                            :
                                                pathname  === '/jobs' ?
                                                <Icon icon={logoSvg} size="lg" />
                                                :
                                                logoNameSvg
                                            }
                                        </Link>
                                        {pathname  === '/jobs' ?
                                            null
                                        :
                                            <div className="d-sm-none">
                                                <div className="flex gap-2 flex-grow-1">
                                                    <Button
                                                        to="/"
                                                        label="Home"
                                                        variant="text"
                                                        type="secondary"
                                                    />
                                                    <Button
                                                        to="/jobs"
                                                        label="Jobs"
                                                        variant="text"
                                                        type="secondary"
                                                    />
                                                    <Button
                                                        to="/salaries"
                                                        label="Salaries"
                                                        variant="text"
                                                        type="secondary"
                                                    />
                                                    <Button
                                                        to="/interviews"
                                                        label="Interviews"
                                                        variant="text"
                                                        type="secondary"
                                                    />
                                                    <Button
                                                        to="/pricing"
                                                        label="Pricing"
                                                        variant="text"
                                                        type="secondary"
                                                    />
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    {pathname  === '/jobs' ?
                                        windowWidth > 800 ?
                                            <div className="flex border border-radius-lg align-center flex-1 w-max-1000-px">
                                                <InputSearch
                                                    value={searchValue}
                                                    icon={searchIcon}
                                                    onChange={(e) => setSearchValue(e.target.value)}
                                                    placeholder="Job title or company name"
                                                    className="flex-1"
                                                    clearable
                                                    searchable={
                                                        windowWidth > 800 ?
                                                        commonJobsEnum
                                                        .filter((job) => job.toLowerCase() !== searchValue.toLowerCase() && job.toLowerCase().includes(searchValue.toLowerCase())).length > 0
                                                        : false
                                                    }
                                                    onSubmit={() => {
                                                        searchParams.set('q', searchValue)
                                                        if (searchValue === '') searchParams.delete('q')
                                                        setSearchParams(searchParams.toString())
                                                    }}
                                                    closeOnSelect
                                                    searchChildren={
                                                        <div className="py-2">
                                                            {searchHistory && searchHistory.length > 0 && searchValue === '' ?
                                                            <>
                                                                <div className="fs-14 px-4 py-2 flex align-center gap-3 text-secondary weight-600">
                                                                    Search history
                                                                </div>
                                                                {searchHistory
                                                                .slice(0, searchHistory && showAllHistory ? searchHistory.length : 3)
                                                                .map((searchItem) => (
                                                                    <div className="flex justify-between align-center">
                                                                        <div
                                                                            key={searchItem}
                                                                            onClick={(e) => {
                                                                                setSearchValue(searchItem)
                                                                            }}
                                                                            className="fs-14 flex align-center px-4 py-2 gap-3 text-secondary pointer bg-secondary-hover flex-1 overflow-hidden"
                                                                        >
                                                                            <Icon icon={clockIcon} size="sm"/><span className="text-ellipsis-1">{searchItem}</span>
                                                                        </div>
                                                                        <IconButton
                                                                            icon={closeIcon}
                                                                            className="mx-2"
                                                                            onClick={() => {
                                                                                dispatch(setSearchHistory(searchHistory.filter((item) => item !== searchItem)))
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                                {searchHistory.length > 3 ?
                                                                    <Button
                                                                        label={showAllHistory ? "Show less" : "Show all"}
                                                                        variant="link"
                                                                        size="lg"
                                                                        icon={showAllHistory ? arrowUpShortIcon : arrowDownShortIcon}
                                                                        type="primary"
                                                                        onClick={() => setShowAllHistory(!showAllHistory)}
                                                                    />
                                                                : null}
                                                            </>
                                                            : null}
                                                            {commonJobsEnum
                                                            .filter((job) => job.toLowerCase() !== searchValue.toLowerCase() && job.toLowerCase().includes(searchValue.toLowerCase())).length > 0 ?
                                                                <div className="fs-14 px-4 py-2 flex align-center gap-3 text-secondary weight-600">
                                                                    Suggested jobs
                                                                </div>
                                                            : null}
                                                            {commonJobsEnum
                                                            .filter((job) => job.toLowerCase() !== searchValue.toLowerCase() && job.toLowerCase().includes(searchValue.toLowerCase()))
                                                            .slice(0, 10)
                                                            .map((job) => (
                                                                <div
                                                                    key={job}
                                                                    onClick={(e) => {
                                                                        setSearchValue(job)
                                                                    }}
                                                                    className="fs-14 px-4 py-2 flex align-center gap-3 text-secondary pointer bg-secondary-hover"
                                                                >
                                                                    <Icon icon={searchIcon} size="sm"/><span>{highlightText(`${job}`, searchValue)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    }
                                                />
                                                <Button
                                                    label="Search"
                                                    borderRadius="lg"
                                                    size="sm"
                                                    className="weight-400 flex-shrink-0 my-sm-0 mx-1"
                                                    type="primary"
                                                    variant={"filled"}
                                                    onClick={() => {
                                                        searchParams.set('q', searchValue)
                                                        if (searchValue === '') searchParams.delete('q')
                                                        setSearchParams(searchParams.toString())
                                                        if (searchValue !== "" && !searchHistory.includes(searchValue.trim())) {
                                                            dispatch(setSearchHistory([...new Set([searchValue.trim(), ...searchHistory])]))
                                                        }
                                                    }}
                                                />
                                            </div>
                                            :
                                            <>
                                            <Modal
                                                modalIsOpen={openSearch}
                                                setModalIsOpen={setOpenSearch}
                                                headerNone
                                                noAction
                                                classNameContent="p-0"
                                            >
                                                <div className="flex flex-col flex-1 h-100">
                                                    <div className="flex align-center py-4">
                                                        <Button
                                                            icon={leftArrowIcon}
                                                            type="secondary"
                                                            variant="text"
                                                            onClick={() => setOpenSearch(false)}
                                                        />
                                                        <div className="flex border border-radius-lg align-center flex-1 me-2">
                                                            <InputSearch
                                                                value={searchValue}
                                                                clearable
                                                                onSubmit={() => {
                                                                    searchParams.set('q', searchValue)
                                                                    if (searchValue === '') searchParams.delete('q')
                                                                    setSearchParams(searchParams.toString())
                                                                    setOpenSearch(false)
                                                                }}
                                                                autoFocus
                                                                icon={searchIcon}
                                                                onChange={(e) => setSearchValue(e.target.value)}
                                                                placeholder="Job title or company name"
                                                                className="flex-1"
                                                            />
                                                            <Button
                                                                label="Search"
                                                                borderRadius="lg"
                                                                size="sm"
                                                                className="weight-400 flex-shrink-0 my-sm-0 m-1"
                                                                type="primary"
                                                                variant={"filled"}
                                                                onClick={() => {
                                                                    searchParams.set('q', searchValue)
                                                                    if (searchValue === '') searchParams.delete('q')
                                                                    if (searchValue !== "" && !searchHistory.includes(searchValue.trim())) {
                                                                        dispatch(setSearchHistory([...new Set([searchValue.trim(), ...searchHistory])]))
                                                                    }
                                                                    setSearchParams(searchParams.toString())
                                                                    setOpenSearch(false)
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 overflow-y-auto flex flex-col">
                                                        {searchHistory && searchHistory.length > 0 && searchValue === '' ?
                                                        <>
                                                            <div className="fs-12 bold px-4 pb-1 pt-2 text-secondary">
                                                                Search history
                                                            </div>
                                                            {searchHistory
                                                            .slice(0, searchHistory && showAllHistory ? searchHistory.length : 3)
                                                            .map((searchItem) => (
                                                                <div className="flex justify-between align-center">
                                                                    <div
                                                                        key={searchItem}
                                                                        onClick={(e) => {
                                                                            setSearchValue(searchItem)
                                                                        }}
                                                                        className="fs-16 flex align-center px-4 py-3 gap-3 text-secondary pointer bg-secondary-hover flex-1 overflow-hidden"
                                                                    >
                                                                        <Icon icon={clockIcon} size="sm"/><span className="text-ellipsis-1">{searchItem}</span>
                                                                    </div>
                                                                    <IconButton
                                                                        icon={closeIcon}
                                                                        className="mx-2"
                                                                        onClick={() => {
                                                                            dispatch(setSearchHistory(searchHistory.filter((item) => item !== searchItem)))
                                                                        }}
                                                                    />
                                                                </div>
                                                            ))}
                                                            {searchHistory.length > 3 ?
                                                                <Button
                                                                    label={showAllHistory ? "Show less" : "Show all"}
                                                                    variant="link"
                                                                    size="lg"
                                                                    icon={showAllHistory ? arrowUpShortIcon : arrowDownShortIcon}
                                                                    type="primary"
                                                                    onClick={() => setShowAllHistory(!showAllHistory)}
                                                                />
                                                            : null}
                                                        </>
                                                        : null}
                                                        {commonJobsEnum
                                                        .filter((job) => job.toLowerCase() !== searchValue.toLowerCase() && job.toLowerCase().includes(searchValue.toLowerCase())).length > 0 ?
                                                            <div className="fs-12 bold px-4 pb-1 pt-2 text-secondary">
                                                                Suggested jobs
                                                            </div>
                                                        : null}
                                                        {commonJobsEnum
                                                        .filter((job) => job.toLowerCase() !== searchValue.toLowerCase() && job.toLowerCase().includes(searchValue.toLowerCase()))
                                                        .slice(0, 10)
                                                        .map((job) => (
                                                            <div
                                                                key={job}
                                                                onClick={(e) => {
                                                                    setSearchValue(job)
                                                                }}
                                                                className="fs-16 px-4 py-3 flex align-center gap-3 text-secondary pointer bg-secondary-hover"
                                                            >
                                                                <Icon icon={searchIcon} size="sm"/><span>{highlightText(`${job}`, searchValue)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </Modal>
                                            <Button
                                                icon={searchIcon}
                                                label={searchValue ? searchValue : <span className="opacity-75 weight-500 fs-14">
                                                    Job title or company name
                                                </span>}
                                                variant="outline"
                                                type="secondary"
                                                borderRadius="lg"
                                                className="flex-1 justify-start fs-16"
                                                onClick={() => setOpenSearch(true)}
                                            />
                                            </>
                                    : null }
                                <div className={`justify-end flex align-center flex-no-wrap gap-3${pathname  === '/jobs' ? "" : " flex-1"}`}>
                                    {pathname !== '/jobs' && pathname !== '/new' && (!user || (user && user.accountType === 'employer')) ? (
                                        <Button
                                            to="/new"
                                            label="Post a Job"
                                            variant="filled"
                                            type="primary"
                                            borderRadius="lg"
                                        />
                                    ) : pathname !== '/jobs' && user && user.accountType === 'jobSeeker' ? (
                                        <Button
                                            to="/account/resume"
                                            label="Resume"
                                            variant="filled"
                                            type="primary"
                                            borderRadius="lg"
                                        />
                                    ) : 
                                    pathname !== '/jobs' && pathname !=='/jobs' && !user ?
                                        <Button
                                            to="/login"
                                            label="Login"
                                            variant="outline"
                                            type="primary"
                                            borderRadius="lg"
                                        />
                                    : null }
                                    <UserProfile/>
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