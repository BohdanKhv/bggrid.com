import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Button, ErrorInfo, HorizontalScroll, Icon, IconButton, Skeleton, TabContent } from '../components'
import { arrowRightShortIcon, closeIcon, diceIcon, largePlusIcon, libraryIcon, linkIcon, plusIcon, rightArrowIcon, searchIcon, starEmptyIcon, starFillIcon, starsIcon, usersIcon } from '../assets/img/icons'
import FollowSearchModal from './follow/FollowSearchModal'
import { Link, useSearchParams } from 'react-router-dom'
import { resetFeed, getCommunityFeed } from '../features/feed/feedSlice'
import PlayItem from './PlayItem'
import FollowItem from './follow/FollowItem'
import { DateTime } from 'luxon'
import { getFollowing, resetFollow } from '../features/follow/followSlice'
import { tagsDetailedEnum } from '../assets/constants'


const LibraryItem = ({ item }) => {
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
                                <div className="flex gap-2 flex-1 align-center">
                                    <Avatar
                                        img={item?.user?.avatar}
                                        rounded
                                        size="sm"
                                        avatarColor={item?.user?.username?.length}
                                        name={item?.user?.username}
                                    />
                                    <div className="flex flex-col flex-1">
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
                            </div>
                            <div className="flex fs-12 gap-2 text-secondary pt-2">
                                Added <Link target="_blank" to={`/g/${item.game._id}`} className="fs-12 text-main bold pointer text-ellipsis-1 text-underlined-hover">{item.game.name}</Link> to their library
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col gap-2 pt-3">
                            <div className="flex align-center gap-2">
                                <span className={`fs-14 weight-600 text-warning`}>{item.rating || 0}</span>
                                <div className="flex gap-1 align-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Icon icon={starFillIcon} size="xs" className={`text-warning ${i + 1 <= item.rating ? 'fill-warning' : 'fill-secondary'}`}/>
                                    ))}
                                </div>
                            </div>
                            <div className="flex align-center gap-1 flex-sm-wrap">
                                {item.tags.map((tag, index) => (
                                    <div key={index} className="px-2 py-1 text-nowrap bg-secondary border-radius weight-500 flex align-center fs-12 weight-500">
                                        <span className="me-2">
                                            {tagsDetailedEnum.find((item) => item.label === tag)?.icon}
                                        </span>
                                        {tag}
                                    </div>
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
        </div>
    )
}


const CommunityPage = () => {
    const dispatch = useDispatch()

    const [searchParams, setSearchParams] = useSearchParams()

    const { user } = useSelector((state) => state.auth)
    const { follow, isLoading: followingIsLoading } = useSelector((state) => state.follow)
    const { feed, hasMore, isLoading, isError } = useSelector((state) => state.feed)

    const [type, setType] = useState(null)

    const getData = () => {
        dispatch(getCommunityFeed(!type ? 'all' : type))
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = 'Community'

        const promise = dispatch(getFollowing(user._id))
        return () => {
            promise && promise.abort()
            dispatch(resetFollow())
        }
    }, [])

    useEffect(() => {
        console.log('d')
        const promise = dispatch(getCommunityFeed(!type ? 'all' : type))
        return () => {
            promise && promise.abort()
            dispatch(resetFeed())
        }
    }, [type])

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

    return (
        <>
            <main className="page-body flex-1">
                <div className="animation-slide-in flex flex-1 h-100">
                    <div className="container flex-1 flex flex-col">
                        {window.innerWidth <= 800 && user ? (
                            <div className="flex pt-6 pt-sm-3 justify-between px-sm-3 pb-3 sticky-sm top-0 bg-main z-3">
                                <div className="title-1 bold">
                                    Community
                                </div>
                                <div className="justify-end flex align-center flex-no-wrap gap-3">
                                    <IconButton
                                        icon={largePlusIcon}
                                        variant="text"
                                        type="secondary"
                                        onClick={() => {
                                            searchParams.set('su', 'true')
                                            setSearchParams(searchParams.toString())
                                        }}
                                    />
                                    <div
                                        onClick={() => {
                                            document.querySelector('.open-navbar-button').click()
                                        }}
                                    >
                                        <Avatar
                                            img={`${user?.avatar}`}
                                            name={user ? `${user?.email}` : null}
                                            rounded
                                            avatarColor="1"
                                            size="sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        {window.innerWidth <= 800 ?
                        <div className="px-3">
                        <div>
                            <FollowSearchModal/>
                        </div>
                        {follow.length > 0 && !followingIsLoading ?
                            <HorizontalScroll
                                className="align-start gap-0 flex-1"
                                contentClassName="gap-0"
                            >
                                {/* <div className={`pointer h-100 w-max-75-px animation-fade-in border-radius-sm hover-opacity-100 transition-duration clickable flex-shrink-0`}
                                    onClick={() => {
                                        searchParams.set('friends', 'true')
                                        setSearchParams(searchParams.toString())
                                    }}
                                >
                                    <div className="flex flex-col p-2 align-center pos-relative">
                                        <Avatar
                                            icon={usersIcon}
                                            sizeSm="md"
                                            rounded
                                            defaultColor
                                            size="lg"
                                        />
                                        <div className="fs-12 text-center text-ellipsis-1 pt-2 weight-500">
                                            Following
                                        </div>
                                    </div>
                                </div> */}
                                {follow
                                .filter((item) => !item.pending)
                                .map((item) => (
                                        <Link className={`pointer h-100 w-max-75-px w-sm-max-50-px w-100 p-2 animation-fade-in border-radius-sm hover-opacity-100 transition-duration clickable flex-shrink-0 bg-secondary-hover`}
                                            key={item._id}
                                            to={`/u/${item.username}`}
                                        >
                                            <div className="flex flex-col align-center text-ellipsis-1">
                                                <Avatar
                                                    img={item?.avatar}
                                                    rounded
                                                    sizeSm="md"
                                                    size="lg"
                                                    name={item.username}
                                                    avatarColor={item.username.length}
                                                    label={item.username}
                                                />
                                                <div className="text-ellipsis-1">
                                                    <div className="fs-12 w-max-75-px w-sm-max-50-px text-center text-ellipsis pt-2 weight-500">
                                                        {item.username}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                ))}
                            </HorizontalScroll>
                        : null}
                        </div>
                        : null}
                        <div className="flex flex-1">
                            <div className="flex-1 flex flex-col  overflow-hidden border-sm-none">
                                <div className="pt-3 px-sm-3 px-4 pt-sm-0 border-bottom">
                                        <TabContent
                                            items={[
                                                {label: 'All', icon: starsIcon},
                                                {label: 'Plays', icon: diceIcon},
                                                {label: 'Library', icon: libraryIcon}
                                            ]}
                                            classNameContainer="w-100"
                                            classNameItem="flex-1"
                                            activeTabName={type || 'all'}
                                            setActiveTabName={(e) => {
                                                setType(e)
                                            }}
                                        />
                                </div>
                            <div>
                                {feed.length > 0 && !isLoading ?
                                    <div className="flex flex-col">
                                        {feed
                                        .map((item, index, arr) =>
                                            <div
                                                key={index}
                                                ref={index === arr.length - 1 ? lastElementRef : null}
                                            >
                                                {item.type === 'play' ?
                                                    <PlayItem item={item.item}
                                                        hideUpdate
                                                    />
                                                : item.type === 'library' ?<LibraryItem
                                                    item={item.item}
                                                /> : null}
                                            </div>
                                        )}
                                    </div>
                                :
                                    feed.length === 0 && !isLoading &&
                                        <ErrorInfo
                                            secondary={!hasMore ? "You're all caught up!" : "Oops! Something went wrong"}
                                        />
                                }
                                { isLoading ?
                                    <div className="flex flex-col px-4 gap-5 py-5 px-sm-3">
                                        <div className="flex gap-2">
                                            <Skeleton height="56" width="56" animation="wave" rounded/>
                                            <div className="flex flex-col gap-2 flex-1">
                                                <Skeleton height="34" width={225} animation="wave"/>
                                                <Skeleton height="18" width={250} animation="wave"/>
                                                <Skeleton height="200" animation="wave"/>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Skeleton height="56" width="56" animation="wave" rounded/>
                                            <div className="flex flex-col gap-2 flex-1">
                                                <Skeleton height="34" width={225} animation="wave"/>
                                                <Skeleton height="18" width={250} animation="wave"/>
                                                <Skeleton height="200" animation="wave"/>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Skeleton height="56" width="56" animation="wave" rounded/>
                                            <div className="flex flex-col gap-2 flex-1">
                                                <Skeleton height="34" width={225} animation="wave"/>
                                                <Skeleton height="18" width={250} animation="wave"/>
                                                <Skeleton height="200" animation="wave"/>
                                            </div>
                                        </div>
                                    </div>
                                : null }
                            </div>
                        </div>
                        {window.innerWidth > 800 &&
                        <>
                            <div className="flex flex-col w-set-300-px flex-1 gap-3 py-4 ps-5">
                                <div>
                                    <FollowSearchModal/>
                                </div>
                                <div className="py-3 px-4 border border-radius h-fit-content">
                                    <div className="flex justify-between align-center pb-3">
                                        <div className="fs-20 bold">
                                            Following 
                                        </div>
                                    </div>
                                    { followingIsLoading ?
                                        <div className="flex flex-col gap-2">
                                            <Skeleton height="48" animation="wave"/>
                                            <Skeleton height="48" animation="wave"/>
                                            <Skeleton height="48" animation="wave"/>
                                            <Skeleton height="48" animation="wave"/>
                                        </div>
                                    : follow.length === 0 ?
                                            <ErrorInfo
                                                secondary="Oops! You're not following anyone"
                                            />
                                    :
                                    follow.length > 0 && (
                                    follow.map((item) => (
                                        <FollowItem
                                            key={item._id}
                                            item={item}
                                        />
                                        ))
                                    )}
                                </div>
                            </div>
                            </>
                        }
                    </div>
                </div>
            </div>
            </main>
        </>
    )
}

export default CommunityPage