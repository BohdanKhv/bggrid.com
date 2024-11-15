import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGameById } from '../../features/game/gameSlice'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Avatar, Button, ErrorInfo, Icon, Image, TabContent } from '../../components'
import { boxInIcon, boxOffIcon, clockIcon, largePlusIcon, starEmptyIcon, starsIcon, userIcon, usersIcon } from '../../assets/img/icons'
import { addCommaToNumber, numberFormatter } from '../../assets/utils'

const CoverImage = ({ img }) => {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <div className="h-sm-set-150-px h-set-250-px">
            <div
                className="bg-secondary mask-bottom w-100 pos-absolute"
                style={{
                    marginBottom: '-3.5rem'
                }}
            >
                <img
                    src={img}
                    draggable="false"
                    alt="cover"
                    className="w-100 object-cover object-center h-set-250-px h-sm-set-150-px"
                    onLoad={() => setIsLoading(false)}
                />
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
                    <CoverImage img={gameById.thumbnail}/>
                    <div className="container z-1 px-sm-3">
                            <div className="pt-6 flex-1 bg-main mb-6">
                                <div className="flex gap-4 flex-sm-col">
                                    <div className="flex flex-col align-sm-center justify-sm">
                                        <Image
                                            img={gameById.thumbnail}
                                            alt={gameById.name}
                                            classNameImg="object-cover border-radius"
                                            classNameContainer="bg-secondary border-radius w-set-200-px h-set-250-px"
                                        />
                                        <div className="title-1 text-secondary flex justify-center gap-2 align-center pt-4">
                                            <span className={`px-2 py-1 border-radius bold ${gameById.avgRating == 0 ? " tag-secondary" : gameById.avgRating > 0 && gameById.avgRating <= 4 ? " tag-danger" : gameById.avgRating > 4 && gameById.avgRating <= 7 ? " tag-warning" : gameById.avgRating == 10 ? " tag-primary" : " tag-success"}`}>
                                                {gameById.avgRating.toFixed(1)}
                                            </span>
                                            <div className="fs-24 opacity-75">
                                                ({numberFormatter(gameById.numRatings)})
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex pt-4 pb-4 gap-4">
                                            <div className="flex flex-col">
                                                <div className="fs-24 bold">
                                                    {gameById.name} ({gameById.yearPublished})
                                                </div>
                                                <div className="flex gap-2 pt-2 flex-wrap">
                                                    <div className="flex gap-1 text-nowrap tag-secondary px-2 py-1 border-radius-sm">
                                                        Weight: <strong>{gameById.gameWeight.toFixed(1)}<span className="weight-500 text-secondary">/5</span></strong>
                                                    </div>
                                                    <div className="flex gap-1 text-nowrap tag-secondary px-2 py-1 border-radius-sm">
                                                        Players: <strong>{gameById.MinPlayers}{gameById.MaxPlayers > gameById.MinPlayers ? `-${gameById.MaxPlayers}` : ''}</strong>
                                                    </div>
                                                    <div className="flex gap-1 text-nowrap tag-secondary px-2 py-1 border-radius-sm">
                                                        Playtime: <strong>{gameById.ComMinPlaytime}{gameById.ComMaxPlaytime !== gameById.ComMinPlaytime ? `-${gameById.ComMinPlaytime}` : ""} Min</strong>
                                                    </div>
                                                    <div className="flex gap-1 text-nowrap tag-secondary px-2 py-1 border-radius-sm">
                                                        Age: <strong>{gameById.mfgAgeRec}+</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {gameById.description ?
                                            <div className="fs-14 mb-4">
                                                {gameById.description.slice(0, 1).toUpperCase() + gameById.description.slice(1)}
                                            </div>
                                        : null}
                                        {user ? 
                                        <div className="border border-radius-lg flex-1 p-3 bg-main">
                                            <div className="flex-1 flex gap-4 align-center h-100">
                                                <Avatar
                                                    img={user?.avatar}
                                                    alt={user?.username}
                                                    avatarColor="1"
                                                    height="63"
                                                    width="63"
                                                    rounded
                                                    size="lg"
                                                />
                                                {isInLibrary ?
                                                    <div className="flex flex-col gap-1 pointer"
                                                            onClick={() => {
                                                                searchParams.set('addGame', gameId)
                                                                setSearchParams(searchParams)
                                                            }}>
                                                        <div className="fs-14 text-secondary weight-500">
                                                            Your Rating
                                                        </div>
                                                        <div className={`title-1 bold px-2 py-1 border-radius ${isInLibrary.rating == 0 ? " tag-secondary" : isInLibrary.rating > 0 && isInLibrary.rating <= 4 ? " tag-danger" : isInLibrary.rating > 4 && isInLibrary.rating <= 7 ? " tag-warning" : isInLibrary.rating == 10 ? " tag-primary" : " tag-success"}`}>
                                                            {isInLibrary.rating}
                                                        </div>
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
                                                }
                                            </div>
                                        </div>
                                        :
                                            <Button
                                                variant="primary"
                                                type="outline"
                                                to="/login"
                                                label="Sign in to Add to Library"
                                            />
                                        }
                                    </div>
                            </div>
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
                    {/* {tab === 'overview' &&
                            <Image
                                img={gameById.thumbnail}
                                alt={gameById.name}
                                classNameImg="w-100 h-100 object-cover border-radius"
                                classNameContainer="bg-secondary w-100"
                            />
                    } */}
                    {/* <CoverImage img={gameById.thumbnail}/> */}
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