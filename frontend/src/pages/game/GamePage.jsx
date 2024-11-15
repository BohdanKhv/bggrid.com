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
        <div
            className="bg-secondary mask-bottom w-100"
            style={{
                marginBottom: '-3.5rem'
            }}
        >
            <img
                src={img}
                draggable="false"
                alt="cover"
                className="w-100 object-cover object-center h-set-300-px"
                onLoad={() => setIsLoading(false)}
            />
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
    }, [user, gameById])

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
                <div className="flex flex-col h-min-100 overflow-hidden  pos-relative animation-slide-in">
                    <CoverImage img={gameById.thumbnail}/>
                    <div className="container overflow-X-auto z-1">
                        <div className="flex gap-4">
                            <div className="border border-radius-lg flex-1 p-3 bg-main mb-4">
                                <div className="flex-1 flex gap-4">
                                    <Image
                                        img={gameById.thumbnail}
                                        alt={gameById.name}
                                        classNameImg="object-cover border-radius"
                                        classNameContainer="bg-secondary border-radius w-set-200-px h-set-250-px"
                                    />
                                    <div className="flex flex-col">
                                        <div className="flex pt-4 pb-4 gap-4">
                                            <div className={`flex align-center title-1 weight-600 p-3 border-radius-lg ${gameById.avgRating == 0 ? " tag-secondary" : gameById.avgRating > 0 && gameById.avgRating <= 4 ? " tag-danger" : gameById.avgRating > 4 && gameById.avgRating <= 7 ? " tag-warning" : gameById.avgRating == 10 ? " tag-primary" : " tag-success"}`}>
                                                {gameById.avgRating.toFixed(1)}
                                            </div>
                                            <div className="flex flex-col py-3">
                                                <div className="fs-24 bold">
                                                    {gameById.name} ({gameById.yearPublished})
                                                </div>
                                                <div className="fs-16 text-secondary">
                                                    {numberFormatter(gameById.numRatings)} Reviews
                                                </div>
                                            </div>
                                        </div>
                                        {gameById.description ?
                                            <div className="fs-14 mb-4">
                                                {gameById.description}
                                            </div>
                                        : null}
                                    <div className="flex-1 flex align-center border-top py-4">
                                        <div className="flex flex-col px-5">
                                            <div className={`fs-20 weight-600`}>
                                                Weight:  <span className={`${gameById.gameWeight == 0 ? " text-secondary" : gameById.gameWeight > 0 && gameById.gameWeight <= 2 ? " text-success" : gameById.gameWeight > 2 && gameById.gameWeight <= 4 ? " text-warning" : gameById.gameWeight > 4 ? " text-danger" : " text-secondary"}`}>{gameById.gameWeight.toFixed(1)}</span> /5
                                            </div>
                                            <div className="fs-12 pt-2 text-secondary">
                                                Complexity Rating
                                            </div>
                                        </div>
                                        <div className="border-right h-100"></div>
                                        <div className="flex flex-col px-5">
                                            <div className={`fs-20 weight-600`}>
                                                {gameById.ComMinPlaytime} Min
                                            </div>
                                            <div className="fs-12 pt-2 text-secondary">
                                                Playtime
                                            </div>
                                        </div>
                                        <div className="border-right h-100"></div>
                                        <div className="flex flex-col px-5">
                                            <div className={`fs-20 weight-600`}>
                                                {gameById.MinPlayers}{gameById.MaxPlayers > gameById.MinPlayers ? `-${gameById.MaxPlayers}` : ''} Players
                                            </div>
                                            <div className="fs-12 pt-2 text-secondary">
                                                Best: {gameById.bestPlayers}
                                            </div>
                                        </div>
                                        <div className="border-right h-100"></div>
                                        <div className="flex flex-col px-5">
                                            <div className={`fs-20 weight-600`}>
                                                Age: {gameById.mfgAgeRec}+
                                            </div>
                                            <div className="fs-12 pt-2 text-secondary">
                                                Age Recommendation
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="border border-radius-lg flex-1 p-3 bg-main">
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
                                        <div className="flex flex-col gap-1">
                                            <div className="fs-14 text-secondary weight-500">
                                                Your Rating
                                            </div>
                                            <div className={`title-1 bold ${gameById.gameWeight == 0 ? " text-secondary" : gameById.gameWeight > 0 && gameById.gameWeight <= 2 ? " text-success" : gameById.gameWeight > 2 && gameById.gameWeight <= 4 ? " text-warning" : gameById.gameWeight > 4 ? " text-danger" : " text-secondary"}`}>
                                                {isInLibrary.rating}
                                            </div>
                                            <div className="fs-14 weight-500 flex align-center text-secondary gap-1">
                                                
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
                            </div> */}
                        </div>
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