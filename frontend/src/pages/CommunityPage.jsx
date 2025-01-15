import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Button, ErrorInfo, HorizontalScroll, Icon, IconButton, Skeleton, TabContent } from '../components'
import { arrowRightShortIcon, closeIcon, diceIcon, largePlusIcon, libraryIcon, linkIcon, plusIcon, rightArrowIcon, searchIcon, starEmptyIcon, starFillIcon, starsIcon, startHalfFillIcon, usersIcon } from '../assets/img/icons'
import FollowSearchModal from './follow/FollowSearchModal'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetFeed, getCommunityFeed, getCommunityFeedForYou } from '../features/feed/feedSlice'
import PlayItem from './PlayItem'
import FollowItem from './follow/FollowItem'
import { DateTime } from 'luxon'
import { getFollowing, resetFollow } from '../features/follow/followSlice'
import { tagsDetailedEnum } from '../assets/constants'


const LibraryItem = ({ item }) => {
    const navigate = useNavigate()

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
        <div className="px-sm-3 border-bottom show-on-hover-parent border-secondary transition-duration animation-slide-in display-on-hover-parent">
            <div className="flex gap-3 py-5 py-sm-3">
                <Avatar
                    img={item?.game?.thumbnail}
                    avatarColor={item?.game?.name?.length}
                    name={item?.game?.name}
                    size="lg"
                    onClick={() => navigate(`/g/${item.game._id}`)}
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex fs-12 gap-2 text-secondary pt-2">
                                Added <Link to={`/g/${item.game._id}`} className="fs-12 text-main bold pointer text-ellipsis-1 text-underlined-hover">{item.game.name}</Link> <span className="flex-shrink-0">to their library</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col gap-2 pt-3">
                            <div className="flex align-center gap-2">
                                <span className={`fs-14 weight-600 ${!item.rating ? "text-secondary" : "text-warning"}`}>{item.rating || 0}</span>
                                <div className="flex gap-1 align-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Icon icon={getStarIcon(item.rating, i)} key={i} size="xs" className={`text-warning ${!item.rating ? 'fill-secondary' : 'fill-warning'}`}/>
                                    ))}
                                </div>
                            </div>
                            {item.tags.length > 0 ?
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
                            : null}
                        </div>
                        {item.comment ?
                            <div className="fs-14 pt-3">
                                {item.comment}
                            </div>
                        : null}
                    </div>
                    <span className="weight-400 text-secondary fs-12 text-wrap-nowrap pt-3">
                        {DateTime.fromISO(item.createdAt).toFormat('HH:mm a')} · {DateTime.fromISO(item.createdAt).toFormat('dd LLL, yy')}
                    </span>
                </div>
            </div>
        </div>
    )
}


const CommunityPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()

    const [tab, setTab] = useState('following')

    const { user } = useSelector((state) => state.auth)
    const { follow, isLoading: followingIsLoading } = useSelector((state) => state.follow)
    const { feed, hasMore, isLoading, isError } = useSelector((state) => state.feed)

    const [feedType, setFeedType] = useState(tab === 'for-you' ? 'for-you' : tab === 'following' ? 'following' : 'following')
    const [type, setType] = useState(null)

    const getData = () => {
        dispatch(getCommunityFeed(!type ? 'all' : type))
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = 'Community'

        dispatch(resetFollow())
        const promise = dispatch(getFollowing(user._id))
        return () => {
            promise && promise.abort()
            dispatch(resetFollow())
        }
    }, [])

    useEffect(() => {
        console.log('d')
        let promise;
        if (feedType === 'for-you') {
            promise = dispatch(getCommunityFeedForYou(!type ? 'all' : type))
        } else {
            dispatch(getCommunityFeed(!type ? 'all' : type))
        }
        return () => {
            promise && promise.abort()
            dispatch(resetFeed())
        }
    }, [type, feedType])

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
                                    <FollowSearchModal/>
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
                        <div className="flex flex-1">
                            <div className="flex-1 flex flex-col  overflow-hidden border-sm-none">
                                <div className="pt-3 ps-sm-3 ps-4 pt-sm-0 border-bottom">
                                        <TabContent
                                            items={[
                                                {label: 'Following'},
                                                {label: 'For You'},
                                            ]}
                                            classNameContainer="w-100"
                                            classNameItem="flex-1"
                                            activeTabName={feedType.replace('-', ' ') || 'following'}
                                            setActiveTabName={(e) => {
                                                navigate(`/community/${e.replace(' ', '-').toLowerCase()}`)
                                                setFeedType(e.replace(' ', '-').toLowerCase())
                                            }}
                                        />
                                </div>
                            <div>
                                <div className="pt-3 px-sm-3">
                                    <div className="flex gap-2">
                                        {['All', 'Plays', 'Library'].map((item, index) => (
                                            <Button
                                                key={index}
                                                label={item}
                                                variant={(!type && item === 'All') || type === item.toLowerCase() ? "filled" : "outline"}
                                                type="secondary"
                                                onClick={() => {
                                                    setType(item.toLowerCase())
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {feed.length > 0 ?
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
                                { isLoading && feed.length === 0 ?
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
                                : isLoading ?
                                    <ErrorInfo isLoading />
                                : null }
                            </div>
                        </div>
                        {window.innerWidth > 800 &&
                        <>
                            <div className="flex flex-col w-set-300-px flex-1 gap-3 py-4 ps-5">
                                <div>
                                    <FollowSearchModal/>
                                </div>
                                <div className="py-3 px-4 bg-secondary border-radius h-fit-content">
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