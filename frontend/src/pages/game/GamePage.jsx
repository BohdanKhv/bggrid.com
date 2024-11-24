import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGameById } from '../../features/game/gameSlice'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Avatar, Button, ErrorInfo, HorizontalScroll, Icon, IconButton, Image, TabContent } from '../../components'
import { boxInIcon, boxOffIcon, checkIcon, clockIcon, largePlusIcon, libraryIcon, diceIcon, shareIcon, starEmptyIcon, starFillIcon, starsIcon, userIcon, usersIcon } from '../../assets/img/icons'
import { addCommaToNumber, numberFormatter } from '../../assets/utils'
import { getReviewsByGame, resetReview } from '../../features/review/reviewSlice'
import { DateTime } from 'luxon'
import { resetFeed } from '../../features/feed/feedSlice'


const PlayItem = ({ item }) => {

    const [searchParams, setSearchParams] = useSearchParams()

    return (
        <div className="px-sm-3 border-bottom show-on-hover-parent border-secondary transition-duration animation-slide-in display-on-hover-parent">
            <div className="flex gap-3 py-5 py-sm-3">
                <Avatar
                    img={item?.game?.thumbnail}
                    avatarColor={item?.game?.name?.length}
                    name={item?.game?.name}
                    size="lg"
                />
                <div className="flex flex-col justify-between flex-1">
                    <div className="flex gap-2 justify-between">
                        <div className="flex flex-col justify-between flex-1">
                            <div className="flex gap-2 align-center flex-1">
                                    <div className="flex align-center">
                                        {item.user.firstName ?
                                            <>
                                                <div className="fs-14 bold text-ellipsis-1 me-1">
                                                    {item.user.firstName}
                                                </div>
                                            </>
                                        : null}
                                        <Link className="text-secondary weight-400 fs-12 text-underlined-hover">@{item.user.username}</Link>
                                    </div>
                                    <span className="fs-14 weight-400 text-secondary">·</span>
                                    <span className="weight-400 text-secondary fs-12 text-wrap-nowrap">{
                                        // if more than 1 day, show the date
                                        // if less than 1 day, show relative time
                                        DateTime.now().diff(DateTime.fromISO(item.playDate), ['days']).days > 1 ? DateTime.fromISO(item.playDate).toFormat('LLL dd') :
                                        DateTime.fromISO(item.playDate).toRelative().replace(' days', 'd').replace(' day', 'd').replace(' hours', 'h').replace(' hour', 'h').replace(' minutes', 'm').replace(' minute', 'm').replace(' seconds', 's').replace(' second', 's')}
                                    </span>
                            </div>
                            <div className="flex fs-12 gap-2 text-secondary pt-1">
                                Played <Link target="_blank" to={`/g/${item.game._id}`} className="fs-12 text-main bold pointer text-ellipsis-1 text-underlined-hover">{item.game.name}</Link> {item?.playTimeMinutes ? `for ${item.playTimeMinutes} min` : null}
                            </div>
                        </div>
                        <IconButton
                            icon={editIcon}
                            variant="text"
                            type="secondary"
                            className="show-on-hover"
                            muted
                            size="sm"
                            onClick={() => {
                                searchParams.set('updatePlay', item._id)
                                setSearchParams(searchParams)
                            }}
                        />
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
                                    <div className="flex flex-col">
                                        <div className={`flex gap-1 align-center`}>
                                            {player.user ?
                                                <Link target="_blank" to={`/u/${player.user.username}`} className="fs-14 weight-500 pointer text-underlined-hover text-ellipsis-1">
                                                    @{player.user.username}
                                                </Link>
                                            : 
                                                <div className="fs-14 weight-500 pointer text-ellipsis-1">
                                                    {player.name}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="fs-14 bold">
                                    {addCommaToNumber(player.score) || 0}
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
        <div className="px-sm-3 border-bottom show-on-hover-parent border-secondary transition-duration animation-slide-in display-on-hover-parent">
            <div className="flex gap-3 py-5 py-sm-3">
                <Avatar
                    img={item?.game?.thumbnail}
                    avatarColor={item?.game?.name?.length}
                    name={item?.game?.name}
                    size="lg"
                />
                <div className="flex flex-col justify-between flex-1">
                    <div className="flex gap-2 justify-between">
                        <div className="flex flex-col justify-between flex-1">
                            <div className="flex gap-2 align-center flex-1">
                                <div className="flex align-center">
                                    {item.user.firstName ?
                                        <>
                                            <div className="fs-14 bold text-ellipsis-1 me-1">
                                                {item.user.firstName}
                                            </div>
                                        </>
                                    : null}
                                    <Link to={`/u/${item.user.username}`} className="text-secondary weight-400 fs-12 text-underlined-hover">@{item.user.username}</Link>
                                </div>
                                <span className="fs-14 weight-400 text-secondary">·</span>
                                <span className="weight-400 text-secondary fs-12 text-wrap-nowrap">{
                                    // if more than 1 day, show the date
                                    // if less than 1 day, show relative time
                                    DateTime.now().diff(DateTime.fromISO(item.updatedAt), ['days']).days > 1 ? DateTime.fromISO(item.updatedAt).toFormat('LLL dd') :
                                    DateTime.fromISO(item.updatedAt).toRelative().replace(' days', 'd').replace(' day', 'd').replace(' hours', 'h').replace(' hour', 'h').replace(' minutes', 'm').replace(' minute', 'm').replace(' seconds', 's').replace(' second', 's')}
                                </span>
                            </div>
                            <div className="flex fs-12 gap-2 text-secondary pt-2">
                                Added <Link target="_blank" to={`/g/${item.game._id}`} className="fs-12 text-main bold pointer text-ellipsis-1 text-underlined-hover">{item.game.name}</Link> to their library
                            </div>
                        </div>
                    </div>
                    <div className="pt-4">
                        <div className="flex gap-2">
                            <div className="flex align-center tag-warning px-2 py-1 border-radius gap-1">
                                <Icon icon={starFillIcon} size="sm" className="fill-warning"/>
                                <span className="text-warning fs-14">{item.rating || 0}</span>
                            </div>
                            {item.tags.map((tag, index) => (
                                <div key={index} className="tag-secondary px-2 py-1 fs-12 border-radius">{tag}</div>
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
            <ErrorInfo label="No reviews found" secondary="Once you start reviewing games, they will appear here." icon={weightIcon}/>
        : reviews.map((item, index, arr) => (
                <ReviewItem item={item}
                key={item._id}
            />
        ))}
        {isLoading ?
            <ErrorInfo isLoading/>
            :
            <div
                // ref={lastElementRef}
            />
        }
        <div
            ref={lastElementRef}
        />
        </>
    )
}

const PlaysTab = () => {
    const dispatch = useDispatch()

    const { reviews, isLoading, isError, hasMore } = useSelector((state) => state.review)

    const getData = () => {
        dispatch(getReviewsByGame())
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
        document.title = `${document.title} - Reviews`
    }, [])

    return (
        <>
        {reviews.length === 0 && !hasMore ?
            <ErrorInfo label="No reviews found" secondary="Once you start reviewing games, they will appear here." icon={weightIcon}/>
        : reviews.map((item, index, arr) => (
                <ReviewItem item={item}
                key={item._id}
            />
        ))}
        <div
            ref={lastElementRef}
        />
        {isLoading &&
            <ErrorInfo isLoading/>
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
            className="h-min-100 offset-header-sm"
        >
            {isLoading ?
                <ErrorInfo
                    isLoading
                />
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
                        <div className="flex align-center gap-4 mb-4">
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
                <ErrorInfo
                    code="404"
                />
            }
        </div>
    )
}

export default GamePage