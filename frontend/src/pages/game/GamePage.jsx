import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGameById } from '../../features/game/gameSlice'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Avatar, Button, ErrorInfo, Icon, Image, TabContent } from '../../components'
import { largePlusIcon, starEmptyIcon, starsIcon } from '../../assets/img/icons'
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
                <div className="flex flex-col h-min-100 overflow-hidden border border-radius-lg my-3 pos-relative animation-slide-in">
                    <CoverImage img={gameById.thumbnail}/>
                    <div className="container overflow-X-auto z-1">
                        <div className="flex gap-4">
                            <div className="border border-radius-lg flex-1 p-3 bg-translucent-blur">
                                <div className="flex gap-5 align-center">
                                    <Image
                                        img={gameById.thumbnail}
                                        alt={gameById.name}
                                        classNameImg="object-cover border-radius"
                                        classNameContainer="bg-secondary border-radius w-set-75-px"
                                    />
                                    <div className="flex gap-6 flex-1">
                                        <div className="flex flex-col gap-1">
                                            <div className="fs-14 text-secondary weight-500">
                                                Rank
                                            </div>
                                            <div className={`title-1 bold ${gameById.avgRating == 0 ? " text-secondary" : gameById.avgRating > 0 && gameById.avgRating <= 4 ? " text-danger" : gameById.avgRating > 4 && gameById.avgRating <= 7 ? " text-warning" : gameById.avgRating == 10 ? " text-primary" : " text-success"}`}>
                                                {gameById.avgRating.toFixed(1)}
                                            </div>
                                            {/* <div className="fs-14 weight-500 flex align-center text-secondary gap-1">
                                                {numberFormatter(gameById.numRatings)}
                                            </div> */}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="fs-14 text-secondary weight-500">
                                                Weight
                                            </div>
                                            <div className={`title-1 bold ${gameById.gameWeight == 0 ? " text-secondary" : gameById.gameWeight > 0 && gameById.gameWeight <= 2 ? " text-success" : gameById.gameWeight > 2 && gameById.gameWeight <= 4 ? " text-warning" : gameById.gameWeight > 4 ? " text-danger" : " text-secondary"}`}>
                                                {gameById.gameWeight.toFixed(1)}
                                            </div>
                                            {/* <div className="fs-14 weight-500 flex align-center text-secondary gap-1">
                                                Complexity
                                            </div> */}
                                        </div>
                                        {gameById.bestPlayers ?
                                            <div className="flex flex-col gap-1">
                                                <div className="fs-14 text-secondary weight-500">
                                                    Players
                                                </div>
                                                <div className={`title-1 bold`}>
                                                    {/* string as an array, but get only number */}
                                                    {gameById.bestPlayers}+
                                                </div>
                                                {/* <div className="fs-14 weight-500 flex align-center text-secondary gap-1">
                                                    Best: {gameById.bestPlayers}
                                                </div> */}
                                            </div>
                                        : null}
                                        {gameById.ComMinPlaytime ?
                                            <div className="flex flex-col gap-1">
                                                <div className="fs-14 text-secondary weight-500">
                                                    Playtime
                                                </div>
                                                <div className={`title-1 bold`}>
                                                    {gameById.ComMinPlaytime} min
                                                </div>
                                            </div>
                                        : null}
                                        {gameById.mfgAgeRec ?
                                            <div className="flex flex-col gap-1">
                                                <div className="fs-14 text-secondary weight-500">
                                                    Age
                                                </div>
                                                <div className={`title-1 bold`}>
                                                    {gameById.mfgAgeRec}+
                                                </div>
                                            </div>
                                        : null}
                                    </div>
                                </div>
                            </div>
                            {!isInLibrary ?
                                <div className="p-3">
                                    <div className="flex justify-center align-center h-100">
                                        <Button
                                            icon={largePlusIcon}
                                            variant="primary"
                                            type="filled"
                                            className="mt-2"
                                            onClick={() => {
                                                searchParams.set('addGame', gameId)
                                                setSearchParams(searchParams)
                                            }}
                                            label="Add"
                                        />
                                    </div>
                                </div>
                                : null}
                        </div>
                        <div className="flex flex-col px-4 pt-4 pb-4">
                            <div className="fs-24 bold">
                                {gameById.name}
                            </div>
                            <div className="fs-16 text-secondary weight-600">
                                {gameById.yearPublished}
                            </div>
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