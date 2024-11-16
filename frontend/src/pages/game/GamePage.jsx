import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGameById } from '../../features/game/gameSlice'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Avatar, Button, ErrorInfo, HorizontalScroll, Icon, IconButton, Image, TabContent } from '../../components'
import { boxInIcon, boxOffIcon, checkIcon, clockIcon, largePlusIcon, noteIcon, shareIcon, starEmptyIcon, starFillIcon, starsIcon, userIcon, usersIcon } from '../../assets/img/icons'
import { addCommaToNumber, numberFormatter } from '../../assets/utils'

const CoverImage = ({ img }) => {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <div className="pos-absolute right-0">
            <div
                className="bg-secondary h-set-250-px h-sm-set-150-px border-radius"
            >
                <img
                    src={img}
                    draggable="false"
                    alt="cover"
                    className="z-1 w-100 h-100 border-radius object-cover object-center pos-relative box-shadow"
                    onLoad={() => setIsLoading(false)}
                />
                <img
                    src={img}
                    draggable="false"
                    alt="cover"
                    className="z-0 h-100 border-radius object-cover object-center pos-absolute left-0 blur-20"
                    style={{
                        marginTop: '10%',
                        width: '80%',
                        marginLeft: '10%'
                    }}
                />
            </div>
        </div>
    )
}

const Overview = () => {
    const { gameById } = useSelector(state => state.game)

    return (
        <div className="flex justify-between gap-6 mt-5 animation-slide-in">
            <div className="container px-sm-3 col-sm-12 col-8">
                <div className="fs-18 weight-500">
                    About this game
                </div>
                <p className="fs-14 opacity-75 mt-4">
                    {gameById.description.slice(0, 1).toUpperCase() + gameById.description.slice(1)}
                </p>
            </div>
        </div>
    )
}

const GamePage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { gameId, tab } = useParams()

    const { gameById, isLoading } = useSelector(state => state.game)
    const { user } = useSelector(state => state.auth)
    const { library } = useSelector(state => state.library)
    const [searchParams, setSearchParams] = useSearchParams()

    const isInLibrary = useMemo(() => {
        return library?.find(lib => lib.game._id === gameById?._id)
    }, [user, gameById, library])

    useEffect(() => {
        window.scrollTo(0, 0)

        const promise = dispatch(getGameById(gameId))

        return () => {
            promise && promise.abort()
        }
    }, [])

    useEffect(() => {
        document.title = gameById?.name || 'Game'
    }, [gameById])


    return (
        <div
            className="h-min-100"
        >
            {isLoading ?
                <ErrorInfo
                    isLoading
                />
            : gameById ? 
                <div className="flex flex-col h-min-100 pos-relative animation-slide-in">
                    <div className="flex flex-col mt-6 container px-sm-3 pos-relative mt-sm-4">
                        {window.innerWidth >= 800 ?
                            <CoverImage img={gameById.thumbnail}/>
                        : null }
                        <div className="flex gap-4">
                            {window.innerWidth < 800 ?
                                <div>
                                    <Image
                                        img={gameById.thumbnail}
                                        alt="cover"
                                        className="border-radius w-set-100-px h-set-150-px"
                                        classNameImg="object-cover border-radius object-center w-set-100-px h-set-150-px"
                                    />
                                </div>
                            : null }
                            <div>
                                <div className="fs-54 fs-sm-28 weight-600">
                                    {gameById.name}
                                </div>
                                <div className="fs-18 pt-2 ">({gameById.yearPublished})</div>
                            </div>
                        </div>
                        <HorizontalScroll 
                            className="my-6 my-sm-5"
                        >
                            <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2">
                                <div className="fs-14 bold flex align-center">
                                    {gameById.avgRating.toFixed(1)}
                                    <Icon
                                        icon={starFillIcon}
                                        className="ms-1"
                                        size="sm"
                                    />
                                </div>
                                <span className="fs-12 opacity-75 pt-2 weight-500">
                                    {numberFormatter(gameById.numRatings)} reviews
                                </span>
                            </div>
                            <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2">
                                <div className="fs-14 bold flex align-center">
                                    {gameById.gameWeight.toFixed(1)}<span className="weight-500 text-secondary">/5</span>
                                </div>
                                <span className="fs-12 opacity-75 pt-2 weight-500">
                                    Weight
                                </span>
                            </div>
                            <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2">
                                <div className="fs-14 bold flex align-center">
                                    {gameById.ComMinPlaytime}{gameById.ComMaxPlaytime !== gameById.ComMinPlaytime ? `-${gameById.ComMinPlaytime}` : ""} Min
                                </div>
                                <span className="fs-12 opacity-75 pt-2 weight-500">
                                    Playtime
                                </span>
                            </div>
                            <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2">
                                <div className="fs-14 bold flex align-center">
                                    {gameById.MinPlayers}{gameById.MaxPlayers > gameById.MinPlayers ? `-${gameById.MaxPlayers}` : ''}
                                </div>
                                <span className="fs-12 opacity-75 pt-2 weight-500">
                                    Players
                                </span>
                            </div>
                            <div className="flex flex-col pe-4 align-center justify-center w-min-100-px">
                                <div className="fs-14 bold flex align-center">
                                    {gameById.mfgAgeRec}+
                                </div>
                                <span className="fs-12 opacity-75 pt-2 weight-500">
                                    Age
                                </span>
                            </div>
                        </HorizontalScroll>
                        <div className="flex align-center gap-4 mb-4">
                            { user ?
                                isInLibrary ?
                                    <div>
                                        <Button
                                            icon={checkIcon}
                                            variant="secondary"
                                            type="outline"
                                            onClick={() => {
                                                searchParams.set('addGame', gameId)
                                                setSearchParams(searchParams)
                                            }}
                                            label="In Library"
                                        />
                                    </div>
                                :
                                    <div>
                                        <Button
                                            icon={largePlusIcon}
                                            variant="primary"
                                            type="outline"
                                            onClick={() => {
                                                searchParams.set('addGame', gameId)
                                                setSearchParams(searchParams)
                                            }}
                                            label="Add to Library"
                                        />
                                    </div>
                                :
                                    <div>
                                        <Button
                                            variant="primary"
                                            type="outline"
                                            to="/login"
                                            label="Sign in to add to library"
                                        />
                                    </div>
                            }
                            <Button
                                icon={noteIcon}
                                variant="primary"
                                type="filled"
                                onClick={() => {
                                    searchParams.set('play', gameId)
                                    setSearchParams(searchParams)
                                }}
                                label="Play"
                            />
                            <IconButton
                                icon={shareIcon}
                                variant="secondary"
                                muted
                                dataTooltipContent="Share"
                                type="text"
                                onClick={() => {
                                    searchParams.set('play', gameId)
                                    setSearchParams(searchParams)
                                }}
                            />
                        </div>
                    </div>
                    <div className="container">
                        <TabContent
                            items={[
                                {label: 'Overview'},
                                {label: 'Rules'},
                                {label: 'Reviews'},
                                {label: 'Plays'}
                            ]}
                            activeTabName={tab || 'overview'}
                            setActiveTabName={(e) => {
                                navigate(`/g/${gameId}/${e}`)
                            }}
                        />
                    </div>
                    {tab === 'overview' ?
                        <Overview/>
                    : <Overview/>}
                    <div className="flex gap-3 px-4">
                    </div>
                </div>
            :
                <ErrorInfo
                    code="404"
                />
            }
        </div>
    )
}

export default GamePage