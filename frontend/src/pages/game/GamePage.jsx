import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGameById } from '../../features/game/gameSlice'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Avatar, Button, Collapse, ErrorInfo, HorizontalScroll, Icon, IconButton, Image, Skeleton, TabContent } from '../../components'
import { boxInIcon, boxOffIcon, checkIcon, clockIcon, largePlusIcon, libraryIcon, diceIcon, shareIcon, starEmptyIcon, starFillIcon, starsIcon, userIcon, usersIcon, plugIcon } from '../../assets/img/icons'
import { addCommaToNumber, numberFormatter } from '../../assets/utils'
import { getGameStats, getReviewsByGame, resetReview } from '../../features/review/reviewSlice'
import { getPlaysByGame, resetPlay, getGamePlayStats } from '../../features/play/playSlice'
import { DateTime } from 'luxon'
import { resetFeed } from '../../features/feed/feedSlice'


const PlayItem = ({ item }) => {

    const [searchParams, setSearchParams] = useSearchParams()

    return (
        <div className="border-bottom show-on-hover-parent border-secondary transition-duration animation-slide-in display-on-hover-parent">
            <div className="flex gap-3 py-5 py-sm-3">
                <Avatar
                    img={item?.user?.avatar}
                    rounded
                    avatarColor={item?.user?.username?.length}
                    name={item?.user?.username}
                />
                <div className="flex flex-col justify-between flex-1">
                    <div className="flex flex-col flex-1 py-1">
                        <div className="flex gap-2 justify-between">
                            <div className="flex flex-col flex-1">
                                {item.user.firstName ?
                                    <>
                                        <div className="fs-14 bold text-ellipsis-1 me-1">
                                            {item.user.firstName} {item.user.lastName}
                                        </div>
                                    </>
                                : null}
                                <Link to={`/u/${item.user.username}`} className="text-secondary weight-400 fs-12 text-underlined-hover">@{item.user.username}</Link>
                            </div>
                            <span className="weight-400 text-secondary fs-12 text-wrap-nowrap">{
                                // if more than 1 day, show the date
                                // if less than 1 day, show relative time
                                DateTime.now().diff(DateTime.fromISO(item.updatedAt), ['days']).days > 1 ? DateTime.fromISO(item.updatedAt).toFormat('LLL dd') :
                                DateTime.fromISO(item.updatedAt).toRelative().replace(' days', 'd').replace(' day', 'd').replace(' hours', 'h').replace(' hour', 'h').replace(' minutes', 'm').replace(' minute', 'm').replace(' seconds', 's').replace(' second', 's')}
                            </span>
                        </div>
                    </div>
                    {item.comment ?
                        <div className="fs-14 pt-3">
                            {item.comment}
                        </div>
                    : null}
                    <div className="flex flex flex-col border border-radius overflow-hidden mt-3">
                        <div className="fs-12 bold py-1 text-center border-bottom bg-secondary">
                            Players
                        </div>
                        {item?.players.length &&
                        [...item?.players]
                        .sort((a, b) => b.score - a.score)
                        ?.map((player, index) => (
                            <div className="flex justify-between align-center px-3 py-2"
                                key={index}
                            >
                                <div className="flex gap-2 align-center">
                                    <Avatar
                                        img={player?.user?.avatar}
                                        size="xs"
                                        rounded
                                        avatarColor={player?.name?.length}
                                        name={player?.name}
                                    />
                                    {player.winner ?
                                        <Icon icon="🥇" size="sm"/>
                                    : null}
                                    <div className={`flex flex-col`}>
                                        {player.user ?
                                            <Link target="_blank" to={`/u/${player.user.username}`} className="fs-14 weight-500 pointer text-underlined-hover text-ellipsis-1">
                                                @{player.user.username}
                                            </Link>
                                        : 
                                            <div className="fs-14 weight-500 pointer text-ellipsis-1">
                                                {player.name}
                                            </div>
                                        }
                                        {player.color ?
                                            <div className="fs-12 text-secondary">
                                                {player.color}
                                            </div>
                                        : null}
                                    </div>
                                </div>
                                <div className={`fs-14 ${!player.score ? " opacity-50" : " bold"}`}>
                                    {addCommaToNumber(player.score) || ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}


const ReviewItem = ({ item }) => {
    return (
        <div className="border-bottom show-on-hover-parent border-secondary transition-duration animation-slide-in display-on-hover-parent">
            <div className="flex gap-3 pt-5 pb-3 py-sm-3">
                <Avatar
                    img={item?.user?.avatar}
                    rounded
                    avatarColor={item?.user?.username?.length}
                    name={item?.user?.username}
                />
                <div className="flex flex-col flex-1 py-1">
                    <div className="flex gap-2 justify-between">
                        <div className="flex flex-col flex-1">
                            {item.user.firstName ?
                                <>
                                    <div className="fs-14 bold text-ellipsis-1 me-1">
                                        {item.user.firstName} {item.user.lastName}
                                    </div>
                                </>
                            : null}
                            <Link to={`/u/${item.user.username}`} className="text-secondary weight-400 fs-12 text-underlined-hover">@{item.user.username}</Link>
                        </div>
                        <span className="weight-400 text-secondary fs-12 text-wrap-nowrap">{
                            // if more than 1 day, show the date
                            // if less than 1 day, show relative time
                            DateTime.now().diff(DateTime.fromISO(item.updatedAt), ['days']).days > 1 ? DateTime.fromISO(item.updatedAt).toFormat('LLL dd') :
                            DateTime.fromISO(item.updatedAt).toRelative().replace(' days', 'd').replace(' day', 'd').replace(' hours', 'h').replace(' hour', 'h').replace(' minutes', 'm').replace(' minute', 'm').replace(' seconds', 's').replace(' second', 's')}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-1 pb-5">
                <div>
                    <div className="flex gap-2">
                        <div className="flex align-center px-2 py-1 border-radius gap-1">
                            <Icon icon={starFillIcon} size="sm" className={`${item.rating == 0 ? 'fill-secondary' : item.rating === 5 ? 'fill-primary' : item.rating >= 4 && item.rating < 5 ? 'fill-success' : item.rating >= 3 && item.rating < 4 ? 'fill-warning' : 'fill-danger'}`}/>
                            <span className={`fs-14 bold ${item.rating == 0 ? 'text-secondary' : item.rating === 5 ? 'text-primary' : item.rating >= 4 && item.rating < 5 ? 'text-success' : item.rating >= 3 && item.rating < 4 ? 'text-warning' : 'text-danger'}`}>{item.rating || 0}</span>
                        </div>
                        {item.tags.map((tag, index) => (
                            <div key={index} className="px-2 bg-secondary border-radius weight-500 flex align-center fs-12 weight-500">{tag}</div>
                        ))}
                    </div>
                    {item.comment ?
                        <div className="fs-14 pt-3">
                            {item.comment}
                        </div>
                    : null}
                </div>
            </div>
        </div>
    )
}

const GamePlayStats = () => {
    const dispatch = useDispatch()
    const { gameId } = useParams()

    const { stats } = useSelector((state) => state.play)

    useEffect(() => {
        const promise = dispatch(getGamePlayStats(gameId))

        return () => {
            promise && promise.abort()
        }
    }, [gameId])

    return (
        !stats.isError &&
        <div className="w-set-300-px flex-1 border-radius-lg bg-secondary h-fit-content my-3 w-set-sm-auto order-sm-1">
            {stats.isLoading ?
                <Skeleton animation="wave" height={60} className="border-radius-lg"/>
            :
            <>
            <Collapse
                isOpen
                classNameContainer="p-5"
                customLabel={
                    <div className="flex gap-3 align-center justify-between">
                        <div className="fs-18 weight-500">
                            Plays:
                        </div>
                        <div className={`fs-20 weight-500 flex align-center text-nowrap gap-1`}>
                            {stats?.data?.totalPlays || 0}
                        </div>
                    </div>
                }
            >
            <div className="flex flex-col px-5 pb-5">
                <div className="justify-between flex gap-2 border-bottom pb-3 pt-3">
                    <div className="fs-14 text-secondary">
                        Avg. Playtime:
                    </div>
                    <div className="fs-14 text-end text-nowrap">
                        {stats?.data?.avgPlayTime || 0} min
                    </div>
                </div>
                <div className="justify-between flex gap-2 border-bottom pb-3 pt-3">
                    <div className="fs-14 text-secondary">
                        Avg. Players:
                    </div>
                    <div className="fs-14 text-end text-nowrap">
                        {stats?.data?.avgPlayers?.toFixed(2) || 0}
                    </div>
                </div>
                <div className="justify-between flex gap-2 border-bottom pb-3 pt-3">
                    <div className="fs-14 text-secondary">
                        Win Rate:
                    </div>
                    <div className="fs-14 text-end text-nowrap">
                        {stats?.data?.avgWinRate?.toFixed(2) || 0}%
                    </div>
                </div>
                <div className="justify-between flex gap-2 pt-2">
                    <div className="fs-14 text-secondary">
                        Avg. Score:
                    </div>
                    <div className="fs-14 text-end text-nowrap">
                        {stats?.data?.avgScore?.toFixed(2) || 0}
                    </div>
                </div>
            </div>
            </Collapse>
            </>
            }
        </div>
    )
}

const GameReviewStats = () => {
    const dispatch = useDispatch()
    const { gameId } = useParams()

    const { stats } = useSelector((state) => state.review)

    useEffect(() => {
        const promise = dispatch(getGameStats(gameId))

        return () => {
            promise && promise.abort()
        }
    }, [gameId])

    return (
        !stats.isError &&
        <div className="w-set-300-px flex-1 border-radius-lg bg-secondary h-fit-content my-3 w-set-sm-auto order-sm-1">
            {stats.isLoading ?
                <Skeleton animation="wave" height={60} className="border-radius-lg"/>
            :
            <>
            <Collapse
                isOpen
                classNameContainer="p-5"
                customLabel={
                    <div className="flex gap-3 align-center justify-between">
                        <div className="fs-18 weight-500">
                            Avg. Rating:
                        </div>
                        <div className={`fs-20 weight-500 flex align-center text-nowrap gap-1 ${stats?.data?.avgRating === 10 ? 'text-primary' : stats?.data?.avgRating >= 7 ? 'text-success' : stats?.data?.avgRating >= 5 ? 'text-warning' : 'text-danger'}`}>
                            <Icon icon={starFillIcon} size="md" className={stats?.data?.avgRating === 10 ? 'fill-primary' : stats?.data?.avgRating >= 7 ? 'fill-success' : stats?.data?.avgRating >= 5 ? 'fill-warning' : 'fill-danger'}/>
                            <span>
                                {stats?.data?.avgRating?.toFixed(1) || 0}
                            </span>
                        </div>
                    </div>
                }
            >
            <div className="flex flex-col pb-5 px-5">
                <div className="justify-between flex gap-2 border-bottom pb-3 pt-3">
                    <div className="fs-14 text-secondary">
                        Favorite:
                    </div>
                    <div className="fs-14 text-end text-nowrap">
                        {stats?.data?.totalFavorites || 0}
                    </div>
                </div>
                <div className="justify-between flex gap-2 border-bottom pb-3 pt-3">
                    <div className="fs-14 text-secondary">
                        Owned
                    </div>
                    <div className="fs-14 text-end text-nowrap">
                        {stats?.data?.totalOwned || 0}
                    </div>
                </div>
                <div className="justify-between flex gap-2 border-bottom pb-3 pt-3">
                    <div className="fs-14 text-secondary">
                        Wishlist:
                    </div>
                    <div className="fs-14 text-end text-nowrap">
                        {stats?.data?.totalWishlist || 0}
                    </div>
                </div>
                <div className="justify-between flex gap-2 border-bottom pb-3 pt-3">
                    <div className="fs-14 text-secondary">
                        Played
                    </div>
                    <div className="fs-14 text-end text-nowrap">
                        {stats?.data?.totalPlayed || 0}
                    </div>
                </div>
                <div className="justify-between flex gap-2 pt-2">
                    <div className="fs-14 text-secondary">
                        Want to Play
                    </div>
                    <div className="fs-14 text-end text-nowrap">
                        {stats?.data?.totalWantToPlay || 0}
                    </div>
                </div>
                </div>
                </Collapse>
            </>
            }
        </div>
    )
}


const ReviewsTab = () => {
    const dispatch = useDispatch()
    const { gameId } = useParams()

    const { reviews, isLoading, isError, hasMore } = useSelector((state) => state.review)

    const getData = () => {
        dispatch(getReviewsByGame(gameId))
    }


    const observer = useRef();
    const lastElementRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isError && !isLoading) {
                const promise = getData();
        
                return () => {
                    promise && promise.abort();
                    dispatch(resetFeed());
                    observer.current && observer.current.disconnect();
                }
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore, isError]);

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = `${document.title} - Reviews`
    }, [])

    return (
        <>
        {reviews.length === 0 && !hasMore ?
            <ErrorInfo label="No reviews found" icon={starEmptyIcon}/>
        : 
            <div className="flex gap-6 flex-sm-col gap-sm-0 pt-4">
                <div className="flex-1 order-sm-2">
                    {reviews.map((item, index, arr) => (
                        <ReviewItem item={item}
                        key={item._id}
                        />
                    ))}
                </div>
                <GameReviewStats/>
            </div>
        }
        {isLoading ?
            <ErrorInfo isLoading/>
            :
            <div
                ref={lastElementRef}
            />
        }
        </>
    )
}

const PlaysTab = () => {
    const dispatch = useDispatch()

    const { plays, isLoading, isError, hasMore } = useSelector((state) => state.play)
    const { gameId } = useParams()

    const getData = () => {
        dispatch(getPlaysByGame(gameId))
    }


    const observer = useRef();
    const lastElementRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isError) {
                const promise = getData();
        
                return () => {
                    promise && promise.abort();
                    dispatch(resetFeed());
                    observer.current && observer.current.disconnect();
                }
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore, isError]);

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = `${document.title} - plays`

        return () => {
            dispatch(resetPlay())
        }
    }, [])

    return (
        <>
        {plays.length === 0 && !hasMore ?
            <ErrorInfo label="No plays found" icon={diceIcon}/>
        :
        <div className="flex gap-6 flex-sm-col gap-sm-0 pt-4">
                <div className="flex-1 order-sm-2">
                    {plays.map((item, index, arr) => (
                        <PlayItem
                            item={item}
                            key={item._id}
                        />
                    ))}
                </div>
                {/* <GamePlayStats/> */}
            </div>
        }
        {isLoading ?
            <ErrorInfo isLoading/>
            :
            <div
                ref={lastElementRef}
            />
        }
        </>
    )
}

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
            <div className="col-sm-12 col-8">
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
        if (!gameId) return

        const promise = dispatch(getGameById(gameId))

        return () => {
            promise && promise.abort()
        }
    }, [gameId])

    useEffect(() => {
        document.title = gameById?.name || 'Game'
    }, [gameById])


    return (
        <div
            className="h-min-100 offset-header-sm"
        >
            {isLoading ?
                <div className="h-min-100 justify-center align-center flex">
                    <ErrorInfo
                        isLoading
                    />
                </div>
            : gameById ? 
                <div className="flex flex-col h-min-100 container px-sm-3 animation-slide-in">
                    <div className="flex flex-col mt-6 pos-relative mt-sm-4">
                        {window.innerWidth >= 1100 ?
                            <CoverImage img={gameById.thumbnail}/>
                        : null }
                        <div className="z-3 w-max-600-px bg-translucent-blur border-radius bg-sm-main">
                        <div className="flex gap-4">
                            {window.innerWidth < 1100 ?
                                <div>
                                    <Image
                                        img={gameById.thumbnail}
                                        alt="cover"
                                        classNameContainer="border-radius w-set-100-px h-set-150-px h-sm-set-100-px"
                                        classNameImg="object-cover border-radius object-center"
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
                            {gameById.ComMinPlaytime ?
                            <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2">
                                <div className="fs-14 bold flex align-center">
                                    {gameById.ComMinPlaytime}{gameById.ComMaxPlaytime !== gameById.ComMinPlaytime ? `-${gameById.ComMaxPlaytime}` : ""} Min
                                </div>
                                <span className="fs-12 opacity-75 pt-2 weight-500">
                                    Playtime
                                </span>
                            </div>
                            : null }
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
                        <div className="flex align-center gap-4 mb-6">
                            { user ?
                                isInLibrary ?
                                    <div>
                                        <Button
                                            icon={libraryIcon}
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
                                            variant="secondary"
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
                                            variant="secondary"
                                            type="outline"
                                            to="/login"
                                            label="Sign in to add to library"
                                        />
                                    </div>
                            }
                            <Button
                                icon={diceIcon}
                                variant="secondary"
                                type="filled"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    searchParams.set('logPlay', gameById._id)
                                    setSearchParams(searchParams)
                                }}
                                label="Log a Play"
                            />
                            <IconButton
                                icon={shareIcon}
                                variant="secondary"
                                muted
                                dataTooltipContent="Share"
                                type="text"
                                onClick={() => {
                                    navigator.share({
                                        title: gameById.name,
                                        text: gameById.description
                                    })
                                }}
                            />
                        </div>
                    </div>
                </div>
                    <div>
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
                    : tab === 'reviews' ?
                        <ReviewsTab/>
                    : tab === 'plays' ?
                        <PlaysTab/>
                    : <Overview/> }
                    <div className="flex gap-3 px-4">
                </div>
            </div>
            :
            <div className="h-min-100 justify-center align-center flex">
                    <ErrorInfo
                        code="404"
                        info="Game not found"
                    />
                </div>
            }
        </div>
    )
}

export default GamePage