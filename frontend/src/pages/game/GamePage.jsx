import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGameById, getGameOverview } from '../../features/game/gameSlice'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Avatar, Button, Collapse, Dropdown, ErrorInfo, Gallery, HorizontalScroll, Icon, IconButton, Image, ProgressBar, Skeleton, TabContent } from '../../components'
import { boxInIcon, boxOffIcon, checkIcon, clockIcon, largePlusIcon, libraryIcon, diceIcon, shareIcon, starEmptyIcon, starFillIcon, starsIcon, userIcon, usersIcon, plugIcon, rightArrowIcon, leftArrowSmIcon, leftArrowIcon, moreIcon, gamesIcon, startHalfFillIcon, amazonIcon } from '../../assets/img/icons'
import { addCommaToNumber, numberFormatter } from '../../assets/utils'
import { getGameStats, getReviewsByGame, resetReview } from '../../features/review/reviewSlice'
import { getPlaysByGame, resetPlay, getGamePlayStats } from '../../features/play/playSlice'
import { DateTime } from 'luxon'
import { resetFeed } from '../../features/feed/feedSlice'
import UserGuardLoginModal from '../auth/UserGuardLoginModal'
import HorizontalScrollControlled from '../../components/ui/HorizontalScrollControlled'
import FooterUser from '../FooterUser'
import { tagsDetailedEnum } from '../../assets/constants'
import { Helmet, HelmetProvider } from 'react-helmet-async';

const YoutubeVideoItem = ({ item, thumbnail }) => {
    const [error, setError] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        error ? null :
        <Link className="flex gap-3 flex-col animation-slide-in"
            target="_blank"
            to={`https://www.youtube.com/watch?v=${item.videoId}`}
        >
            <div className="border-radius bg-secondary flex align-center justify-center border-radius-lg overflow-hidden h-set-200-px">
                {/* Embed youtube video */}
                <Image
                    img={item.thumbnail ? item.thumbnail : `https://img.youtube.com/vi/${item.videoId}/0.jpg`}
                    errIcon={plugIcon}
                    classNameContainer="w-100 h-100 bg-hover-after"
                    classNameImg="w-100 h-100 object-cover"
                />
            </div>
            <div className="flex flex-col gap-1 flex-1">
                <div className="fs-14 weight-500 text-ellipsis-2 text-underlined-hover"
                    title={item.title}
                >
                    {item.title}
                </div>
                <div className="flex gap-2 align-center text-secondary fs-12 pt-2">
                    {item.category ?
                        <div className="tag-secondary px-2 py-1 border-radius-sm fs-12 text-capitalize">{item.category}</div>
                    : null}
                    •
                    <div className="fs-12 text-secondary">
                        {/* days ago */}
                        {DateTime.fromISO(item.postedDate).toRelative()}
                    </div>
                </div>
            </div>
        </Link>
    )
}


const ImagesTab = () => {
    const { gameById } = useSelector((state) => state.game)

    const [selectedCategory, setSelectedCategory] = useState('All')
    const [openGallery, setOpenGallery] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <HelmetProvider>
            <Helmet>
                <title>{gameById.name} - images</title>
                <meta name="description" content="Game images"/>
                <link rel="canonical"
                    href={`https://bggrid.com/g/${gameById._id}/images`}
                />
            </Helmet>
            <Gallery
                isOpen={openGallery}
                setIsOpen={setOpenGallery}
                items={gameById.images}
            />
            <div className="flex gap-4 flex-col pt-4 pb-6 px-sm-3">
                {gameById.images.length === 0 ?
                    <ErrorInfo label="No images found"/>
                :
                <>
                <div className="grid grid-cols-3 grid-md-cols-2 grid-sm-cols-2 gap-4">
                    {gameById?.images
                        ?.map((item, index) => (
                            <div className="flex gap-3 flex-col animation-slide-in"
                                key={index}
                            >
                                <div className="border-radius bg-secondary flex align-center justify-center border-radius-lg overflow-hidden h-set-200-px"
                                onClick={() => {
                                    setOpenGallery(true)
                                }}
                                >
                                    {/* Embed youtube video */}
                                    <Image
                                        img={item.image}
                                        errIcon={plugIcon}
                                        classNameContainer="w-100 h-100 bg-hover-after"
                                        classNameImg="w-100 h-100 object-cover"
                                    />
                                </div>
                                {/* <div className="flex flex-col gap-1 flex-1">
                                    <div className="fs-14 weight-500 text-ellipsis-2 text-underlined-hover">
                                        {item.caption}
                                    </div>
                                </div> */}
                            </div>
                    ))}
                </div>
                </>
                }
            </div>
        </HelmetProvider>
    )
}


const VideosTab = () => {
    const { gameById } = useSelector((state) => state.game)

    const [selectedCategory, setSelectedCategory] = useState('All')

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <HelmetProvider>
            <Helmet>
                <title>{gameById.name} - videos</title>
                <meta name="description" content="Game videos"/>
                <link rel="canonical"
                    href={`https://bggrid.com/g/${gameById._id}/videos`}
                />
            </Helmet>
            <div className="flex gap-4 flex-col pt-4 pb-6 px-sm-3">
                {gameById.videos.length === 0 ?
                    <ErrorInfo label="No videos found"/>
                :
                <>
                <HorizontalScroll>
                    <Button
                        label="All"
                        onClick={() => setSelectedCategory('All')}
                        variant="secondary"
                        type={selectedCategory === 'All' ? 'filled' : 'default'}
                        className="flex-shrink-0"
                    />
                    {[...new Set(gameById.videos.map((item, index) => (
                        item.category
                    )))]
                    .map((category, index, arr) => (
                        <Button
                            label={category}
                            onClick={() => setSelectedCategory(category)}
                            variant="secondary"
                            type={selectedCategory === category ? 'filled' : 'default'}
                            className="flex-shrink-0 text-capitalize"
                            key={index}
                        />
                    ))}
                </HorizontalScroll>
                <div className="grid grid-cols-3 grid-md-cols-2 grid-sm-cols-1 gap-4">
                    {gameById?.videos
                        .filter(v => selectedCategory == "All" || selectedCategory == v.category)
                        ?.map((item, index) => (
                        <YoutubeVideoItem
                            item={item}
                            key={index}
                        />
                    ))}
                </div>
                </>
                }
            </div>
        </HelmetProvider>
    )
}


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
                                {item?.user?.firstName ?
                                    <>
                                        <div className="fs-14 bold text-ellipsis-1 me-1">
                                            {item?.user?.firstName} {item?.user?.lastName}
                                        </div>
                                    </>
                                : null}
                                <Link to={`/u/${item?.user?.username}`} className="text-secondary weight-400 fs-12 text-underlined-hover">@{item?.user?.username}</Link>
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
                    {item.image ?
                        <div className="pt-3">
                            <Image
                                img={item?.image?.image}
                                classNameImg="border-radius"
                                bigDisplay
                                classNameContainer="border border-radius h-max-350-px h-min-200-px h-100"
                            />
                        </div>
                    : null}
                    { item.players.length > 0 ?
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
                                            <Link to={`/u/${player.user.username}`} className="fs-14 weight-500 pointer text-underlined-hover text-ellipsis-1">
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
                    : null}
                </div>
            </div>
        </div>
    )
}


const ReviewItem = ({ item }) => {
    const getStarIcon = (rating, index) => {
        if (rating >= index + 1) {
            return starFillIcon;
        } else if (rating >= index + 0.5) {
            return startHalfFillIcon;
        } else {
            return starEmptyIcon;
        }
    };

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
                            {item?.user?.firstName ?
                                <>
                                    <div className="fs-14 bold text-ellipsis-1 me-1">
                                        {item?.user?.firstName} {item?.user?.lastName}
                                    </div>
                                </>
                            : null}
                            <Link to={`/u/${item?.user?.username}`} className="text-secondary weight-400 fs-12 text-underlined-hover">@{item?.user?.username}</Link>
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
                                    <Icon 
                                    icon={getStarIcon(item.rating, i)}
                                    size="xs" className={`${!item.rating ? 'fill-secondary' : 'fill-warning'}`} key={i}/>
                                ))}
                            </div>
                        </div>
                        <div className="flex align-center gap-1 flex-sm-wrap">
                            {item.tags.map((tag, index) => (
                                <div key={index} className="px-2 py-1 bg-secondary border-radius weight-500 flex align-center fs-12 weight-500">
                                    <span className="me-2">
                                        {tagsDetailedEnum.find(t => t.label === tag)?.icon || ""}
                                    </span>
                                    {tag}</div>
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
        <div className="flex-1 border-radius mt-6 bg-secondary h-fit-content w-set-sm-auto order-sm-1 pos-relative animation-slide-in">
            <div>
                <div className="flex flex-col p-5">
                    <div className="flex-1 flex justify-between pb-4 border-bottom align-center">
                        <span className="fs-14 opacity-75 pt-2 weight-500">
                            Plays
                        </span>
                        <div className="fs-14 bold flex align-center">
                            {numberFormatter(gameById?.playStats?.totalPlays || 0)}
                        </div>
                    </div>
                    <div className="flex-1 flex justify-between py-4 border-bottom align-center">
                        <span className="fs-14 opacity-75 pt-2 weight-500">
                            Avg. Players
                        </span>
                        <div className="fs-14 bold flex align-center">
                            {gameById?.playStats?.avgPlayers?.toFixed(0) || '0'}
                        </div>
                    </div>
                    <div className="flex-1 flex justify-between py-4 border-bottom align-center">
                        <span className="fs-14 opacity-75 pt-2 weight-500">
                            Avg. Playtime
                        </span>
                        <div className="fs-14 bold flex align-center">
                            {gameById?.playStats?.avgPlayTime?.toFixed(0) || '0'} Min
                        </div>
                    </div>
                    <div className="flex-1 flex justify-between pt-4 align-center">
                        <span className="fs-14 opacity-75 pt-2 weight-500">
                            Avg. Score
                        </span>
                        <div className="fs-14 bold flex align-center">
                            {gameById?.playStats?.avgScore?.toFixed(0) || '0'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const GameReviewStats = () => {
    const { gameById } = useSelector((state) => state.game)

    const getStarIcon = (rating, index) => {
        if (rating >= index + 1) {
            return starFillIcon;
        } else if (rating >= index + 0.5) {
            return startHalfFillIcon;
        } else {
            return starEmptyIcon;
        }
    };

    return (
        <div className="flex-1 border-radius mt-6 bg-secondary h-fit-content w-set-sm-auto order-sm-1 mb-4 pos-relative animation-slide-in">
            <div className="bg-secondary border-radius">
                
                <div className="flex flex-col gap-3 pt-5 px-5">
                <div className="flex flex-col align-center justify-center">
                    <div className="fs-54">
                        {(gameById?.reviewStats?.avgRating || 0)?.toFixed(1)}
                    </div>
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Icon icon={getStarIcon(gameById?.reviewStats?.avgRating || 0, i)} size="sm" className={`${!gameById?.reviewStats?.avgRating ? 'fill-secondary' : 'fill-warning'}`} key={i}/>
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

    const { gameById } = useSelector((state) => state.game)
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
                    dispatch(resetReview());
                    observer.current && observer.current.disconnect();
                }
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore, isError]);

    useEffect(() => {
        window.scrollTo(0, 0)
        dispatch(resetReview())
        getData()
    }, [])

    return (
        <HelmetProvider>
            <Helmet>
                <title>{gameById?.name} - reviews</title>
                <meta name="description" content="Game overview"/>
                <link rel="canonical"
                    href={`https://bggrid.com/g/${gameById?._id}/overview`}
                />
            </Helmet>
            <div className="flex-1">
            {reviews.length === 0 && !hasMore ?
                <ErrorInfo label="No reviews found" secondary="When someone reviews a game, it will show up here."/>
            : 
                <div className="gap-sm-0 px-sm-3">
                    <div className="flex-1 order-sm-2">
                        {reviews.map((item, index, arr) => (
                            <ReviewItem item={item}
                            key={item._id}
                            />
                        ))}
                    </div>
                </div>
            }
            {isLoading ?
                <ErrorInfo isLoading/>
                :
                <div
                    ref={lastElementRef}
                />
            }
            </div>
        </HelmetProvider>
    )
}

const PlaysTab = () => {
    const dispatch = useDispatch()

    const { gameById } = useSelector((state) => state.game)
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
                    dispatch(resetPlay());
                    observer.current && observer.current.disconnect();
                }
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore, isError]);

    useEffect(() => {
        window.scrollTo(0, 0)
        dispatch(resetPlay())
        getData()
    }, [])

    return (
        <>
        <HelmetProvider>
            <Helmet>
                <title>{gameById.name} - plays</title>
                <meta name="description" content="Game overview"/>
                <link rel="canonical"
                    href={`https://bggrid.com/g/${gameById._id}/overview`}
                />
            </Helmet>
            {plays.length === 0 && !hasMore ?
                <ErrorInfo
                    label="No plays found"
                    secondary="When someone plays a game, it will show up here."
                />
            :
                <div className="flex gap-6 flex-sm-col gap-sm-0 px-sm-3">
                    <div className="flex-1 order-sm-2">
                        {plays.map((item, index, arr) => (
                            <PlayItem
                                item={item}
                                key={item._id}
                            />
                        ))}
                    </div>
                </div>
            }
            {isLoading ?
                <ErrorInfo isLoading/>
                :
                <div
                    ref={lastElementRef}
                />
            }
        </HelmetProvider>
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

    const { tab } = useParams()

    const { gameById } = useSelector(state => state.game)
    const { library } = useSelector(state => state.library)
    const { user } = useSelector(state => state.auth)

    const [searchParams, setSearchParams] = useSearchParams()

    const isInLibrary = useMemo(() => {
        if (!user) return false
        return library?.find(lib => lib.game._id === gameById?._id)
    }, [user, gameById, library])

    return (
        <div className="ms-6 flex-1 w-max-250-px">
                <div
                    className="bg-secondary mt-6 h-sm-set-150-px border-radius pos-relative h-set-300-px w-min-200-px w-max-300-px">
                    <Image
                        img={img}
                        errIcon={gamesIcon}
                        classNameContainer="bg-secondary border-radius z-3 relative"
                        classNameImg="w-100 h-100 border-radius object-cover object-center pos-relative box-shadow-lg"
                    />
                    <Image
                        img={img}
                        errIcon={gamesIcon}
                        classNameContainer="bg-secondary pos-absolute left-0 top-0 border-radius relative"
                        classNameImg="h-100 border-radius object-cover object-center blur-20"
                    />
                </div>
                {tab === 'reviews' ?
                    <GameReviewStats/>
                : tab === 'plays' ?
                    <GamePlayStats/>
                :
                <>
                {window.innerWidth > 800 ?
                    <div className="flex flex-col gap-2 mb-6 mb-sm-3 mt-6">
                        <UserGuardLoginModal>
                            <Button
                                size="lg"
                                icon={diceIcon}
                                variant="secondary"
                                type="filled"
                                className="w-100"
                                onClick={(e) => {
                                    searchParams.set('logPlay', gameById._id)
                                    setSearchParams(searchParams)
                                }}
                                label="Log a Play"
                            />
                        </UserGuardLoginModal>
                        <UserGuardLoginModal>
                            { isInLibrary ?
                                <Button
                                    size="lg"
                                    icon={libraryIcon}
                                    variant="secondary"
                                    type="default"
                                    className="w-100"
                                    onClick={() => {
                                        searchParams.set('addGame', gameById._id)
                                        setSearchParams(searchParams)
                                    }}
                                    label="In Library"
                                />
                            :
                                <Button
                                    size="lg"
                                    icon={largePlusIcon}
                                    variant="secondary"
                                    className="w-100"
                                    type="filled"
                                    onClick={() => {
                                        searchParams.set('addGame', gameById._id)
                                        setSearchParams(searchParams)
                                    }}
                                    label="Add to Library"
                                />
                            }
                        </UserGuardLoginModal>
                        {gameById.buyUrl ?
                            <Button
                                icon={amazonIcon}
                                label="Buy on Amazon"
                                borderRadius="lg"
                                size="lg"
                                variant="secondary"
                                type="default"
                                to={gameById.buyUrl}
                                target="_blank"
                            />
                        : null}
                        <Button
                            size="lg"
                            label="Share"
                            icon={shareIcon}
                            variant="secondary"
                            type="default"
                            muted
                            className="w-100"
                            onClick={() => {
                                navigator.share({
                                    title: gameById.name,
                                    url: window.location.href
                                })
                            }}
                        />
                    </div>
                : isInLibrary ?
                    <UserGuardLoginModal>
                        <div>
                            <Button
                                size="lg"
                                icon={libraryIcon}
                                variant="secondary"
                                type="outline"
                                className="w-100 my-3"
                                onClick={() => {
                                    searchParams.set('addGame', gameById._id)
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
                                size="lg"
                                icon={largePlusIcon}
                                variant="secondary"
                                className="w-100"
                                type="filled"
                                onClick={() => {
                                    searchParams.set('addGame', gameById._id)
                                    setSearchParams(searchParams)
                                }}
                                label="Add to Library"
                            />
                        </div>
                    </UserGuardLoginModal>
                }
                </>
                }
        </div>
    )
}

const Overview = () => {
    const navigate = useNavigate()
    const { gameById } = useSelector(state => state.game)
    const [showMoreMechanics, setShowMoreMechanics] = useState(false)
    const [showMorePublishers, setShowMorePublishers] = useState(false)
    const [showMoreDesigners, setShowMoreDesigners] = useState(false)
    const [showMoreArtists, setShowMoreArtists] = useState(false)
    const [showMoreDescription, setShowMoreDescription] = useState(false)

    const getStarIcon = (rating, index) => {
        if (rating >= index + 1) {
            return starFillIcon;
        } else if (rating >= index + 0.5) {
            return startHalfFillIcon;
        } else {
            return starEmptyIcon;
        }
    };
    return (
        <HelmetProvider>
            <Helmet>
                <title>{gameById?.name}</title>
                <meta name="description" content="Game overview"/>
                <link rel="canonical"
                    href={`https://bggrid.com/g/${gameById?._id}/overview`}
                />
            </Helmet>
            <div className="my-4 animation-slide-in my-sm-4 px-sm-3">
                    <div className="flex flex-col gap-6 overflow-hidden">
                        <div className="flex flex-col gap-4 overflow-hidden">
                            <div>
                                <div className="flex flex-wrap gap-1 align-center">
                                    <span className="text-secondary fs-14 weight-500">
                                        Types:
                                    </span>
                                    {gameById.types.length ? gameById.types.map
                                    ((item, index, arr) => (
                                        <div key={index}>
                                            <Link 
                                                to={`/discover?types=${item}`}
                                                className="fs-14 text-underlined-hover weight-500">
                                                {item}
                                            </Link>
                                        {index < arr.length - 1 ? ', ' : ''}
                                        </div>
                                    )) : '--'}
                                </div>
                                <div className="flex flex-wrap gap-1 align-center pt-2">
                                    <span className="text-secondary fs-14 weight-500">
                                        Themes:
                                    </span>
                                    {gameById.themes.length ? gameById.themes.map
                                    ((item, index, arr) => (
                                        <div key={index}>
                                            <Link 
                                                to={`/discover?themes=${item}`}
                                                className="fs-14 text-underlined-hover weight-500">
                                                {item}
                                            </Link>
                                        {index < arr.length - 1 ? ', ' : ''}
                                        </div>
                                    )) : '--'}
                                </div>
                                <div className="flex flex-wrap gap-1 align-center pt-2">
                                    <span className="text-secondary fs-14 weight-500">
                                        Mechanics:
                                    </span>
                                    {gameById.mechanics.length ? gameById.mechanics
                                    .slice(0, showMoreMechanics ? gameById.mechanics.length : 2)
                                    .map
                                    ((item, index, arr) => (
                                        <div key={index}>
                                            <Link 
                                                to={`/discover?mechanics=${item}`}
                                                className="fs-14 text-underlined-hover weight-500">
                                                {item}
                                            </Link>
                                        {index < arr.length - 1 ? ', ' : ''}
                                        </div>
                                    )) : '--'}
                                    {gameById.mechanics.length > 2 ?
                                        <div className="flex gap-1 align-center">
                                            <span className="fs-14 weight-500 pointer hover-opacity-75 text-primary"
                                                onClick={() => setShowMoreMechanics(!showMoreMechanics)}
                                            >
                                                {showMoreMechanics ? 'Show less' : gameById.mechanics.length > 2 ? `+${gameById.mechanics.length - 2} more` : ''}
                                            </span>
                                        </div>
                                    : null}
                                </div>
                                <div className="flex flex-wrap gap-1 align-center pt-2">
                                    <span className="text-secondary fs-14 weight-500">
                                        Publishers:
                                    </span>
                                    {gameById.publishers.length ? gameById.publishers
                                    .slice(0, showMorePublishers ? gameById.publishers.length : 2)
                                    .map
                                    ((item, index, arr) => (
                                        <div key={index}>
                                            <Link 
                                                to={`/publisher/${item._id}`}
                                                className="fs-14 text-underlined-hover weight-500">
                                                {item.name}
                                            </Link>
                                        {index < arr.length - 1 ? ', ' : ''}
                                        </div>
                                    )) : '--'}
                                    {gameById.publishers.length > 2 ?
                                        <div className="flex gap-1 align-center">
                                            <span className="fs-14 weight-500 pointer hover-opacity-75 text-primary"
                                                onClick={() => setShowMorePublishers(!showMorePublishers)}
                                            >
                                                {showMorePublishers ? 'Show less' : gameById.publishers.length > 2 ? `+${gameById.publishers.length - 2} more` : ''}
                                            </span>
                                        </div>
                                    : null}
                                </div>
                                <div className="flex flex-wrap gap-1 align-center pt-2">
                                    <span className="text-secondary fs-14 weight-500">
                                        Designers:
                                    </span>
                                    {gameById.designers.length ? gameById.designers
                                    .slice(0, showMoreDesigners ? gameById.designers.length : 2)
                                    .map
                                    ((item, index, arr) => (
                                        <div key={index}>
                                            <Link 
                                                to={`/person/${item._id}`}
                                                className="fs-14 text-underlined-hover weight-500">
                                                {item.name}
                                            </Link>
                                        {index < arr.length - 1 ? ', ' : ''}
                                        </div>
                                    )) : '--'}
                                    {gameById.designers.length > 2 ?
                                        <div className="flex gap-1 align-center">
                                            <span className="fs-14 weight-500 pointer hover-opacity-75 text-primary"
                                                onClick={() => setShowMoreDesigners(!showMoreDesigners)}
                                            >
                                                {showMoreDesigners ? 'Show less' : gameById.designers.length > 2 ? `+${gameById.designers.length - 2} more` : ''}
                                            </span>
                                        </div>
                                    : null}
                                </div>
                                <div className="flex flex-wrap gap-1 align-center pt-2">
                                    <span className="text-secondary fs-14 weight-500">
                                        Artists:
                                    </span>
                                    {gameById.artists.length ? gameById.artists
                                    .slice(0, showMoreArtists ? gameById.artists.length : 2)
                                    .map
                                    ((item, index, arr) => (
                                        <div key={index}>
                                            <Link 
                                                to={`/person/${item._id}`}
                                                className="fs-14 text-underlined-hover weight-500">
                                                {item.name}
                                            </Link>
                                            {index < arr.length - 1 ? ', ' : ''}
                                        </div>
                                    )) : '--'}
                                    {gameById.artists.length > 2 ?
                                        <div className="flex gap-1 align-center">
                                            <span className="fs-14 weight-500 pointer hover-opacity-75 text-primary"
                                                onClick={() => setShowMoreArtists(!showMoreArtists)}
                                            >
                                                {showMoreArtists ? 'Show less' : gameById.artists.length > 2 ? `+${gameById.artists.length - 2} more` : ''}
                                            </span>
                                        </div>
                                    : null}
                                </div>
                            </div>
                            {gameById?.images.length > 0 ?
                                <div>
                                    <HorizontalScroll
                                        contentClassName="align-start gap-4"
                                    >
                                        {gameById
                                        ?.images
                                        .slice(0,
                                            6
                                        ).map((item, index) => (
                                            <div
                                                className="col-5 flex-fill col-sm-10"
                                                key={index}
                                                onClick={() => {
                                                    navigate(`/g/${gameById._id}/images`)
                                                }}
                                            >
                                                <Image
                                                    img={item.image}
                                                    errIcon={plugIcon}
                                                    classNameContainer="w-100 h-set-300-px h-sm-set-250-px bg-hover-after border-radius"
                                                    classNameImg="w-100 h-100 object-cover"
                                                />
                                            </div>
                                        ))}
                                    </HorizontalScroll>
                                </div>
                            : null}
                            {gameById?.description.length > 0 ?
                                <p className="fs-14 flex-1"> 
                                <span
                                    dangerouslySetInnerHTML={{__html: gameById.description.slice(0, showMoreDescription ? gameById.description.length : 500) }}
                                />
                                {gameById?.description?.length > 500 ?
                                        <span className="fs-14 weight-500 pointer hover-opacity-75 text-primary ps-2"
                                            onClick={() => setShowMoreDescription(!showMoreDescription)}    
                                        >
                                            {showMoreDescription ? 'Show less' : 'Show more'}
                                        </span>
                                : null}
                                </p>
                            : null}
                        </div>
                        <div>
                            <div className="fs-20 flex align-center gap-4 weight-500 transition-slide-right-hover-parent pointer mt-4"
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
                                            <Icon icon={getStarIcon(gameById?.reviewStats?.avgRating, i)} size="sm" className={`${!gameById?.reviewStats?.avgRating ? 'fill-secondary' : 'fill-warning'}`} key={i}/>
                                        ))}
                                    </div>
                                    <div className="fs-12 text-secondary pt-4 flex justify-start w-100">
                                        {numberFormatter(gameById?.reviewStats?.totalReviews || 0)} reviews
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
                        {gameById?.last3Plays.length > 0 ?
                            <div>
                                <div className="fs-20 flex align-center gap-4 weight-500 transition-slide-right-hover-parent pointer mt-4"
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
                        : null}
                        {gameById?.videos.length > 0 ?
                            <div>
                                <div className="fs-20 flex align-center gap-4 weight-500 transition-slide-right-hover-parent pointer mt-4"
                                    onClick={() => { navigate(`/g/${gameById._id}/videos`) }}
                                >
                                    Videos
                                    <Icon icon={rightArrowIcon} size="xs" className="transition-slide-right-hover"/>
                                </div>
                                <HorizontalScroll
                                    contentClassName="align-start gap-4 pt-5"
                                >
                                    {gameById
                                    ?.videos
                                    .slice(0,
                                        6
                                    ).map((item, index) => (
                                        <div
                                        className="col-5 flex-fill col-sm-8"
                                            key={index}
                                        >
                                            <YoutubeVideoItem item={item}/>
                                        </div>
                                    ))}
                                </HorizontalScroll>
                            </div>
                        : null}
                    </div>
            </div>
        </HelmetProvider>
    )
}

const GameShortInfo = () => {
    const { gameById } = useSelector(state => state.game)
    return (
        <HorizontalScroll 
            className="my-4 my-sm-4"
        >
            <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2 flex-1">
                <div className="fs-14 bold flex align-center">
                    {gameById.complexityWeight ?
                    <>
                    {gameById?.complexityWeight?.toFixed(1)}<span className="weight-500 text-secondary">/5</span>
                    </>
                    : '--'}
                </div>
                <span className="fs-12 opacity-75 pt-2 weight-500">
                    Weight
                </span>
            </div>
            <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2 flex-1">
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
            <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2 flex-1">
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
            <div className="flex flex-col pe-4 align-center justify-center w-min-100-px flex-1">
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
                <div className="flex flex-col container h-min-100 animation-slide-in">
                    {window.innerWidth < 800 ?
                    <>
                        <div className="flex justify-between p-3">
                            <div className="flex align-center gap-3">
                                <IconButton
                                    icon={leftArrowIcon}
                                    variant="secondary"
                                    type="text"
                                    onClick={() => {
                                        if (window.history.state && window.history.state.idx > 0) {
                                            navigate(-1); // Go back to the previous page
                                        } else {
                                            navigate('/discover')
                                        }
                                    }}
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
                                            icon={libraryIcon}
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
                                {gameById.buyUrl ?
                                    <Button
                                        className="justify-start"
                                        icon={amazonIcon}
                                        variant="secondary"
                                        borderRadius="sm"
                                        label="Buy on Amazon"
                                        type="text"
                                        to={gameById.buyUrl}
                                        target="_blank"
                                    />
                                : null}
                            </div>
                            </Dropdown>
                        </div>
                    </>
                    : null }
                    <div className="flex sticky top-0 z-9 px-sm-3 bg-main">
                        <div className="overflow-hidden flex-1">
                            <div>
                                <TabContent
                                    items={
                                        [
                                        { label: 'Overview' },
                                        ...(gameById?.images?.length ? [{ label: 'Images' }] : []),
                                        ...(gameById?.videos?.length ? [{ label: 'Videos' }] : []),
                                        { label: 'Reviews' },
                                        { label: 'Plays' },
                                    ]
                                    }
                                    classNameContainer="w-100"
                                    classNameItem="flex-1"
                                    activeTabName={tab || 'overview'}
                                    setActiveTabName={(e) => {
                                        navigate(`/g/${gameId}/${e}`)
                                    }}
                                />
                            </div>
                        </div>
                            <div className="w-max-250-px d-sm-none w-100 ms-6"></div>
                    </div>
                    <div className="flex flex-1">
                    <div className="flex-1 flex flex-col overflow-x-hidden overflow-sm-">
                                <div className="flex flex-col flex-1">
                                    {(window.innerWidth < 800 || window.innerWidth >= 800) && (tab === 'overview' || !tab) ?
                                    <div className="flex flex-col mt-4 pos-relative mt-sm-0 px-sm-3">
                                        <div className="z-3 border-radius bg-sm-main">
                                            <div className="flex gap-4 pt-sm-5">
                                                {window.innerWidth < 800 && gameById.image ?
                                                    <div>
                                                        <Avatar
                                                            bigDisplay
                                                            img={gameById.image}
                                                            alt="cover"
                                                            size="xl"
                                                            classNameContainer="border-radius w-set-100-px h-set-150-px h-sm-set-100-px"
                                                            classNameImg="object-cover border-radius object-center"
                                                        />
                                                    </div>
                                                : null }
                                                <div className="flex flex-col overflow-x-hidden">
                                                    <div className="fs-54 fs-sm-28 weight-600">
                                                        {gameById.name} {window.innerWidth >= 800 && gameById.year ? <span className="weight-500 fs-20 text-secondary">{gameById.year}</span> : ''}
                                                    </div>
                                                    {window.innerWidth < 800 ?
                                                    <>
                                                        <div className="flex flex-col gap-2">
                                                            {gameById.publishers.length ?
                                                                gameById.publishers.slice(0, 1).map((item, index) => (
                                                                    <div key={index}>
                                                                        <Link 
                                                                            to={`/publisher/${item._id}`}
                                                                            className="fs-14 text-underlined-hover text-primary weight-500">
                                                                            {item.name}
                                                                        </Link>
                                                                    </div>
                                                                ))
                                                            : null}
                                                            {gameById.year ?
                                                                <div className="fs-14">
                                                                    {gameById.year}
                                                                </div>
                                                            : null}
                                                        </div>
                                                    </>
                                                    : null}
                                                </div>
                                            </div>
                                            <div className="flex flex-col overflow-hidden my-4">
                                                <GameShortInfo/>
                                            </div>
                                            {window.innerWidth < 800 ?
                                            <div>
                                                <UserGuardLoginModal>
                                                    <Button
                                                        icon={diceIcon}
                                                        borderRadius="lg"
                                                        size="lg"
                                                        className="w-100 mb-3"
                                                        variant="secondary"
                                                        type="filled"
                                                        onClick={() => {
                                                            searchParams.set('logPlay', gameId)
                                                            setSearchParams(searchParams)
                                                        }}
                                                        label="Log a Play"
                                                    />
                                                </UserGuardLoginModal>
                                                <UserGuardLoginModal>
                                                    { isInLibrary ?
                                                        <Button
                                                            icon={libraryIcon}
                                                            borderRadius="lg"
                                                            size="lg"
                                                            className="w-100"
                                                            variant="secondary"
                                                            type="default"
                                                            onClick={() => {
                                                                searchParams.set('addGame', gameId)
                                                                setSearchParams(searchParams)
                                                            }}
                                                            label="In Library"
                                                        />
                                                    :
                                                        <Button
                                                            icon={largePlusIcon}
                                                            variant="secondary"
                                                            borderRadius="lg"
                                                            size="lg"
                                                            className="w-100"
                                                            type="filled"
                                                            onClick={() => {
                                                                searchParams.set('addGame', gameId)
                                                                setSearchParams(searchParams)
                                                            }}
                                                            label="Add to Library"
                                                        />
                                                    }
                                                </UserGuardLoginModal>
                                                {gameById.buyUrl ?
                                                    <Button
                                                        icon={amazonIcon}
                                                        label="Buy on Amazon"
                                                        borderRadius="lg"
                                                        size="lg"
                                                        variant="secondary"
                                                        className="mt-3"
                                                        type="default"
                                                        to={gameById.buyUrl}
                                                        target="_blank"
                                                    />
                                                : null}
                                            </div>
                                            : null}
                                        </div>
                                    </div>
                                : null}
                                {tab === 'overview' ?
                                    <Overview/>
                                : tab === 'images' ?
                                    <ImagesTab/>
                                : tab === 'videos' ?
                                    <VideosTab/>
                                : tab === 'reviews' ?
                                    <ReviewsTab/>
                                : tab === 'plays' ?
                                    <PlaysTab/>
                                : tab === 'rules' ?
                                    <RulesTab />
                                : <Overview/> }
                        </div>
                        <FooterUser/>
                    </div>
                    {window.innerWidth >= 800 && gameById.image ?
                        <CoverImage img={gameById.image}/>
                    : null }
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