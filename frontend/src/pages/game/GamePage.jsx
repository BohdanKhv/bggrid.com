import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGameById, getGameOverview } from '../../features/game/gameSlice'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Avatar, Button, Collapse, Dropdown, ErrorInfo, HorizontalScroll, Icon, IconButton, Image, ProgressBar, Skeleton, TabContent } from '../../components'
import { boxInIcon, boxOffIcon, checkIcon, clockIcon, largePlusIcon, libraryIcon, diceIcon, shareIcon, starEmptyIcon, starFillIcon, starsIcon, userIcon, usersIcon, plugIcon, rightArrowIcon, leftArrowSmIcon, leftArrowIcon, moreIcon } from '../../assets/img/icons'
import { addCommaToNumber, numberFormatter } from '../../assets/utils'
import { getGameStats, getReviewsByGame, resetReview } from '../../features/review/reviewSlice'
import { getPlaysByGame, resetPlay, getGamePlayStats } from '../../features/play/playSlice'
import { DateTime } from 'luxon'
import { resetFeed } from '../../features/feed/feedSlice'
import UserGuardLoginModal from '../auth/UserGuardLoginModal'


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
                    {item.playTimeMinutes ?
                        <div className="fs-12 text-secondary">
                            <span className="text-secondary">Played for</span> {item.playTimeMinutes} <span className="text-secondary">min</span>
                        </div>
                    : null}
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
                    <div className="flex gap-2 flex-sm-col align-center align-sm-start">
                        <div className="flex align-center gap-2">
                            <span className={`fs-14 weight-600 text-warning`}>{item.rating || 0}</span>
                            <div className="flex gap-1 align-center">
                                {[...Array(5)].map((_, i) => (
                                    <Icon icon={starFillIcon} size="xs" className={`text-warning ${i + 1 <= item.rating ? 'fill-warning' : 'fill-secondary'}`} key={i}/>
                                ))}
                            </div>
                        </div>
                        <div className="flex align-center gap-1 flex-sm-wrap">
                            {item.tags.map((tag, index) => (
                                <div key={index} className="px-2 py-1 bg-secondary border-radius weight-500 flex align-center fs-12 weight-500">{tag}</div>
                            ))}
                        </div>
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
    const { gameById } = useSelector((state) => state.game)


    return (
        <div className="w-set-300-px flex-1 border-radius-lg bg-secondary h-fit-content w-set-sm-auto order-sm-1">
            <div>
                <div className="flex flex-col p-3">
                    <div className="flex-1 flex justify-between py-4 mx-4 border-bottom align-center">
                        <span className="fs-14 opacity-75 pt-2 weight-500">
                            Plays
                        </span>
                        <div className="fs-14 bold flex align-center">
                            {numberFormatter(gameById?.playStats?.totalPlays)}
                        </div>
                    </div>
                    <div className="flex-1 flex justify-between py-4 mx-4 border-bottom align-center">
                        <span className="fs-14 opacity-75 pt-2 weight-500">
                            Avg. Players
                        </span>
                        <div className="fs-14 bold flex align-center">
                            {gameById?.playStats?.avgPlayers.toFixed(0)}
                        </div>
                    </div>
                    <div className="flex-1 flex justify-between py-4 mx-4 border-bottom align-center">
                        <span className="fs-14 opacity-75 pt-2 weight-500">
                            Avg. Playtime
                        </span>
                        <div className="fs-14 bold flex align-center">
                            {gameById?.playStats?.avgPlayTime.toFixed(0)} Min
                        </div>
                    </div>
                    <div className="flex-1 flex justify-between py-4 mx-4 align-center">
                        <span className="fs-14 opacity-75 pt-2 weight-500">
                            Avg. Score
                        </span>
                        <div className="fs-14 bold flex align-center">
                            {gameById?.playStats?.avgScore.toFixed(0)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const GameReviewStats = () => {
    const { gameById } = useSelector((state) => state.game)

    return (
        <div className="w-set-300-px flex-1 border-radius-lg bg-secondary h-fit-content w-set-sm-auto order-sm-1 mb-4">
            <div className="bg-secondary border-radius-lg">
                
                <div className="flex flex-col gap-3 pt-5 px-5">
                <div className="flex flex-col align-center justify-center">
                    <div className="fs-54">
                        {(gameById?.reviewStats?.avgRating || 0)?.toFixed(1)}
                    </div>
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Icon icon={starFillIcon} size="sm" className={`${i + 1 <= gameById?.reviewStats?.avgRating ? 'fill-warning' : 'fill-secondary'}`} key={i}/>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-1">
                    <div className="flex gap-3">
                        <div className="fs-12 text-secondary w-set-10-px">
                            5
                        </div>
                        <ProgressBar
                        // calculate percentage of 5 star ratings
                        value={gameById?.reviewStats?.total5Star / gameById?.reviewStats?.totalReviews * 100 || 0}
                        type="primary"/>
                    </div>
                    <div className="flex gap-3">
                        <div className="fs-12 text-secondary w-set-10-px">
                            4
                        </div>
                        <ProgressBar
                        // calculate percentage of 5 star ratings
                        value={gameById?.reviewStats?.total4Star / gameById?.reviewStats?.totalReviews * 100 || 0}
                        type="primary"/>
                    </div>
                    <div className="flex gap-3">
                        <div className="fs-12 text-secondary w-set-10-px">
                            3
                        </div>
                        <ProgressBar
                        // calculate percentage of 5 star ratings
                        value={gameById?.reviewStats?.total3Star / gameById?.reviewStats?.totalReviews * 100 || 0}
                        type="primary"/>
                    </div>
                    <div className="flex gap-3">
                        <div className="fs-12 text-secondary w-set-10-px">
                            2
                        </div>
                        <ProgressBar
                        // calculate percentage of 5 star ratings
                        value={gameById?.reviewStats?.total2Star / gameById?.reviewStats?.totalReviews * 100 || 0}
                        type="primary"/>
                    </div>
                    <div className="flex gap-3">
                        <div className="fs-12 text-secondary w-set-10-px">
                            1
                        </div>
                        <ProgressBar
                        // calculate percentage of 5 star ratings
                        value={gameById?.reviewStats?.total1Star / gameById?.reviewStats?.totalReviews * 100 || 0}
                        type="primary"/>
                    </div>
                </div>
            </div>
            <Collapse
                isOpen
                classNameContainer="p-5"
                customLabel={
                    <div className="flex gap-3 align-center justify-between">
                        <div className="fs-14 text-secondary">
                            {numberFormatter(gameById?.reviewStats?.totalReviews || 0)} reviews
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
                        {gameById?.reviewStats?.totalFavorites || 0}
                    </div>
                </div>
                <div className="justify-between flex gap-2 border-bottom pb-3 pt-3">
                    <div className="fs-14 text-secondary">
                        Owned
                    </div>
                    <div className="fs-14 text-end text-nowrap">
                        {gameById?.reviewStats?.totalOwned || 0}
                    </div>
                </div>
                <div className="justify-between flex gap-2 border-bottom pb-3 pt-3">
                    <div className="fs-14 text-secondary">
                        Wishlist:
                    </div>
                    <div className="fs-14 text-end text-nowrap">
                        {gameById?.reviewStats?.totalWishlist || 0}
                    </div>
                </div>
                <div className="justify-between flex gap-2 border-bottom pb-3 pt-3">
                    <div className="fs-14 text-secondary">
                        Played
                    </div>
                    <div className="fs-14 text-end text-nowrap">
                        {gameById?.reviewStats?.totalPlayed || 0}
                    </div>
                </div>
                <div className="justify-between flex gap-2 pt-2">
                    <div className="fs-14 text-secondary">
                        Want to Play
                    </div>
                    <div className="fs-14 text-end text-nowrap">
                        {gameById?.reviewStats?.totalWantToPlay || 0}
                    </div>
                </div>
                </div>
                </Collapse>
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
            <ErrorInfo label="No reviews found" icon={starEmptyIcon}/>
        : 
            <div className="flex gap-6 flex-sm-col gap-sm-0 pt-4 px-sm-3">
                <div className="flex-1 order-sm-2">
                    {reviews.map((item, index, arr) => (
                        <ReviewItem item={item}
                        key={item._id}
                        />
                    ))}
                </div>
                {window.innerWidth >= 800 ?
                <GameReviewStats/>
                : null}
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
            <div className="flex gap-6 flex-sm-col gap-sm-0 pt-4 px-sm-3">
                <div className="flex-1 order-sm-2">
                    {plays.map((item, index, arr) => (
                        <PlayItem
                            item={item}
                            key={item._id}
                        />
                    ))}
                </div>
                {window.innerWidth >= 800 ?
                <GamePlayStats/>
                : null}
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

const RulesTab = () => {
    return (
        <div className="flex flex-col gap-6 pt-6">
            <div className="fs-14 text-secondary text-center">
                Coming soon...
            </div>
        </div>
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
    const navigate = useNavigate()
    const { gameById } = useSelector(state => state.game)

    return (
        <div className="flex justify-between gap-6 my-6 animation-slide-in my-sm-4 px-sm-3">
            <div>
                <div className="flex flex-col gap-6">
                    <div>
                        <div className="fs-24 weight-500">
                            About this game
                        </div>
                        <div className="flex flex-sm-col gap-5 pt-5">
                            <p className="fs-14 text-secondary flex-1"
                                dangerouslySetInnerHTML={{ __html: gameById.description }}
                            />
                            <div className="flex flex-col gap-3 w-set-200-px w-set-sm-auto">
                                <div className="flex flex-col gap-1">
                                    <div className="fs-14 weight-600">Year Published</div>
                                    <div className="fs-14 text-secondary">
                                        {gameById.year || '--'}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="fs-14 weight-600">Type</div>
                                    <div className="fs-14 text-secondary">
                                        {gameById?.types?.join(', ') || '--'}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="fs-14 weight-600">Theme</div>
                                    <div className="fs-14 text-secondary">
                                        {gameById.themes.join(', ') || '--'}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="fs-14 weight-600">Mechanics</div>
                                    <div className="fs-14 text-secondary">
                                        {gameById?.mechanics?.join(', ') || '--'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="fs-24 flex align-center gap-4 weight-500 transition-slide-right-hover-parent pointer mt-4"
                            onClick={() => { navigate(`/g/${gameById._id}/reviews`) }}
                        >
                            Ratings and reviews
                            <Icon icon={rightArrowIcon} size="xs" className="transition-slide-right-hover"/>
                        </div>
                        <div className="flex gap-6 pt-5 align-center">
                            <div className="flex flex-col align-center justify-center">
                                <div className="fs-54">
                                    {gameById?.reviewStats?.avgRating?.toFixed(1)}
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Icon icon={starFillIcon} size="sm" className={`${i + 1 <= gameById?.reviewStats?.avgRating ? 'fill-warning' : 'fill-secondary'}`} key={i}/>
                                    ))}
                                </div>
                                <div className="fs-12 text-secondary pt-4 flex justify-start w-100">
                                    {numberFormatter(gameById?.reviewStats?.totalReviews)} reviews
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 gap-1">
                                <div className="flex gap-3">
                                    <div className="fs-12 text-secondary w-set-10-px">
                                        5
                                    </div>
                                    <ProgressBar
                                    // calculate percentage of 5 star ratings
                                    value={gameById?.reviewStats?.total5Star / gameById?.reviewStats?.totalReviews * 100 || 0}
                                    type="primary"/>
                                </div>
                                <div className="flex gap-3">
                                    <div className="fs-12 text-secondary w-set-10-px">
                                        4
                                    </div>
                                    <ProgressBar
                                    // calculate percentage of 5 star ratings
                                    value={gameById?.reviewStats?.total4Star / gameById?.reviewStats?.totalReviews * 100 || 0}
                                    type="primary"/>
                                </div>
                                <div className="flex gap-3">
                                    <div className="fs-12 text-secondary w-set-10-px">
                                        3
                                    </div>
                                    <ProgressBar
                                    // calculate percentage of 5 star ratings
                                    value={gameById?.reviewStats?.total3Star / gameById?.reviewStats?.totalReviews * 100 || 0}
                                    type="primary"/>
                                </div>
                                <div className="flex gap-3">
                                    <div className="fs-12 text-secondary w-set-10-px">
                                        2
                                    </div>
                                    <ProgressBar
                                    // calculate percentage of 5 star ratings
                                    value={gameById?.reviewStats?.total2Star / gameById?.reviewStats?.totalReviews * 100 || 0}
                                    type="primary"/>
                                </div>
                                <div className="flex gap-3">
                                    <div className="fs-12 text-secondary w-set-10-px">
                                        1
                                    </div>
                                    <ProgressBar
                                    // calculate percentage of 5 star ratings
                                    value={gameById?.reviewStats?.total1Star / gameById?.reviewStats?.totalReviews * 100 || 0}
                                    type="primary"/>
                                </div>
                            </div>
                        </div>
                        {gameById?.last3Reviews?.length > 0 ?
                            <div className="flex flex-col pt-4">
                                {gameById?.last3Reviews.map((item, index) => (
                                    <ReviewItem item={item} key={index}/>
                                ))}
                            </div>
                        : null}
                    </div>
                    <div>
                        <div className="fs-24 flex align-center gap-4 weight-500 transition-slide-right-hover-parent pointer mt-4"
                            onClick={() => { navigate(`/g/${gameById._id}/plays`) }}
                        >
                            Plays and stats
                            <Icon icon={rightArrowIcon} size="xs" className="transition-slide-right-hover"/>
                        </div>
                        <div className="flex gap-3 gap-sm-2 pt-5 flex-sm-col">
                            <div className="flex gap-3 flex-1">
                                <div className="flex-1 flex flex-col p-4 bg-secondary border-radius align-center justify-center col-sm-6">
                                    <div className="fs-24 bold flex align-center">
                                        {numberFormatter(gameById?.playStats?.totalPlays || 0)}
                                    </div>
                                    <span className="fs-12 opacity-75 pt-2 weight-500">
                                        Plays
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col p-4 bg-secondary border-radius align-center justify-center col-sm-6">
                                    <div className="fs-24 bold flex align-center">
                                        {gameById?.playStats?.avgPlayers?.toFixed(0) || 0}
                                    </div>
                                    <span className="fs-12 opacity-75 pt-2 weight-500">
                                        Avg. Players
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-3 flex-1">
                                <div className="flex-1 flex flex-col p-4 bg-secondary border-radius align-center justify-center col-sm-6">
                                    <div className="fs-24 bold flex align-center">
                                        {gameById?.playStats?.avgPlayTime?.toFixed(0) || 0} Min
                                    </div>
                                    <span className="fs-12 opacity-75 pt-2 weight-500">
                                        Avg. Playtime
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col p-4 bg-secondary border-radius align-center justify-center col-sm-6">
                                    <div className="fs-24 bold flex align-center">
                                        {gameById?.playStats?.avgScore?.toFixed(0) || 0}
                                    </div>
                                    <span className="fs-12 opacity-75 pt-2 weight-500">
                                        Avg. Score
                                    </span>
                                </div>
                            </div>
                        </div>
                        {gameById?.last3Plays?.length > 0 ?
                            <div className="flex flex-col pt-4">
                                {gameById?.last3Plays.map((item, index) => (
                                    <PlayItem item={item} key={index}/>
                                ))}
                            </div>
                        : null}
                    </div>
                </div>
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

        const promise = dispatch(getGameOverview(gameId))

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
                <div className="flex flex-col h-min-100 container animation-slide-in">
                    {window.innerWidth < 800 ?
                        <div className="flex justify-between bg-main px-sm-3 py-3 sticky top-0 z-9">
                            <div className="flex align-center gap-3">
                                <IconButton
                                    icon={leftArrowIcon}
                                    variant="secondary"
                                    type="text"
                                    onClick={() => navigate('/library')}
                                />
                                <div className="fs-14 weight-600">
                                    {gameById.name}
                                </div>
                            </div>
                            <Dropdown
                                customDropdown={
                                    <IconButton
                                        icon={moreIcon}
                                        variant="secondary"
                                        type="text"
                                    />
                                }
                            >
                                <div className="flex flex-col">
                                <UserGuardLoginModal>
                                    { isInLibrary ?
                                            <Button
                                                className="justify-start"
                                                icon={checkIcon}
                                                borderRadius="sm"
                                                variant="secondary"
                                                type="text"
                                                onClick={() => {
                                                    searchParams.set('addGame', gameId)
                                                    setSearchParams(searchParams)
                                                }}
                                                label="In Library"
                                            />
                                        :
                                            <Button
                                                className="justify-start"
                                                icon={largePlusIcon}
                                                variant="secondary"
                                                borderRadius="sm"
                                                type="text"
                                                onClick={() => {
                                                    searchParams.set('addGame', gameId)
                                                    setSearchParams(searchParams)
                                                }}
                                                label="Add to Library"
                                            />
                                    }
                                </UserGuardLoginModal>
                            <UserGuardLoginModal>
                                <Button
                                    className="justify-start"
                                    icon={diceIcon}
                                    borderRadius="sm"
                                    variant="secondary"
                                    type="text"
                                    onClick={(e) => {
                                        searchParams.set('logPlay', gameById._id)
                                        setSearchParams(searchParams)
                                    }}
                                    label="Log a Play"
                                />
                            </UserGuardLoginModal>
                            <Button
                                className="justify-start"
                                icon={shareIcon}
                                variant="secondary"
                                borderRadius="sm"
                                label="Share"
                                type="text"
                                onClick={() => {
                                    navigator.share({
                                        title: gameById.name,
                                        text: `Check out ${gameById.name} on BGGRID!`,
                                        url: window.location.href
                                    })
                                }}
                            />
                            </div>
                            </Dropdown>
                        </div>
                    : null }
                    <div className="flex flex-col mt-6 pos-relative mt-sm-0 px-sm-3">
                        {window.innerWidth >= 1100 ?
                            <CoverImage img={gameById.image}/>
                        : null }
                        <div className="z-3 w-max-600-px bg-translucent-blur border-radius bg-sm-main">
                        <div className="flex gap-4">
                            {window.innerWidth < 1100 ?
                                <div>
                                    <Image
                                        img={gameById.image}
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
                                <div className="fs-18 pt-2">({gameById.year})</div>
                                {gameById?.publishers?.length ?
                                    <div className="flex gap-2 pt-2 align-center">
                                        {gameById.publishers
                                        .slice(0, 2)
                                        .map((publisher, index) => (
                                            <Link className="fs-14 weight-600 flex-shrink-0 text-underlined-hover"
                                                to={`/p/${publisher._id}`}
                                                key={index}
                                            >
                                                {publisher.name}
                                            </Link>
                                        ))}
                                        <span className="fs-12">{gameById.publishers.length > 2 ? `+${gameById.publishers.length - 2}` : null}</span>
                                    </div>
                                : null}
                            </div>
                        </div>
                        <HorizontalScroll 
                            className="my-6 my-sm-4"
                        >
                            <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2">
                                <div className="fs-14 bold flex align-center">
                                    {gameById.complexityWeight ?
                                    <>
                                    {gameById.complexityWeight?.toFixed(1)}<span className="weight-500 text-secondary">/5</span>
                                    </>
                                    : '--'}
                                </div>
                                <span className="fs-12 opacity-75 pt-2 weight-500">
                                    Weight
                                </span>
                            </div>
                            <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2">
                                <div className="fs-14 bold flex align-center">
                                    {gameById.minPlaytime ?
                                    <>
                                    {gameById.minPlaytime}{gameById.maxPlaytime !== gameById.minPlaytime ? `-${gameById.maxPlaytime}` : ""} Min
                                    </>
                                    : '--'}
                                </div>
                                <span className="fs-12 opacity-75 pt-2 weight-500">
                                    Playtime
                                </span>
                            </div>
                            <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2">
                                <div className="fs-14 bold flex align-center">
                                    {gameById.minPlayers ?
                                    <>
                                    {gameById.minPlayers}{gameById.maxPlayers > gameById.minPlayers ? `-${gameById.maxPlayers}` : ''}
                                    </>
                                    : '--'}
                                </div>
                                <span className="fs-12 opacity-75 pt-2 weight-500">
                                    Players
                                </span>
                            </div>
                            <div className="flex flex-col pe-4 align-center justify-center w-min-100-px">
                                <div className="fs-14 bold flex align-center">
                                    {gameById.minAge ?
                                    <>
                                    {gameById.minAge}+
                                    </>
                                    : '--'}
                                </div>
                                <span className="fs-12 opacity-75 pt-2 weight-500">
                                    Age
                                </span>
                            </div>
                        </HorizontalScroll>
                        {window.innerWidth > 800 ?
                        <div className="flex align-center gap-4 mb-6 mb-sm-3">
                            <UserGuardLoginModal>
                                { isInLibrary ?
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
                                }
                            </UserGuardLoginModal>
                            <UserGuardLoginModal>
                                <Button
                                    icon={diceIcon}
                                    variant="secondary"
                                    type="filled"
                                    onClick={(e) => {
                                        searchParams.set('logPlay', gameById._id)
                                        setSearchParams(searchParams)
                                    }}
                                    label="Log a Play"
                                />
                            </UserGuardLoginModal>
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
                        : isInLibrary ?
                            <UserGuardLoginModal>
                                <div>
                                    <Button
                                        icon={checkIcon}
                                        variant="secondary"
                                        type="outline"
                                        className="w-100 my-3"
                                        size="lg"
                                        onClick={() => {
                                            searchParams.set('addGame', gameId)
                                            setSearchParams(searchParams)
                                        }}
                                        label="In Library"
                                    />
                                </div>
                            </UserGuardLoginModal>
                            :
                            <UserGuardLoginModal>
                                <div>
                                    <Button
                                        icon={largePlusIcon}
                                        variant="secondary"
                                        size="lg"
                                        className="w-100 my-3"
                                        type="filled"
                                        onClick={() => {
                                            searchParams.set('addGame', gameId)
                                            setSearchParams(searchParams)
                                        }}
                                        label="Add to Library"
                                    />
                                </div>
                            </UserGuardLoginModal>
                        }
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
                    : tab === 'rules' ?
                        <RulesTab />
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