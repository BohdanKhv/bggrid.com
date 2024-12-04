import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Button, ErrorInfo, HorizontalScroll, Icon, IconButton, Skeleton } from '../components'
import { arrowRightShortIcon, closeIcon, diceIcon, largePlusIcon, linkIcon, plusIcon, rightArrowIcon, starEmptyIcon, starFillIcon, starsIcon, usersIcon } from '../assets/img/icons'
import UserSearchModal from './friend/UserSearchModal'
import { Link, useSearchParams } from 'react-router-dom'
import FriendsModal from './friend/FriendsModal'
import { resetFeed, getCommunityFeed } from '../features/feed/feedSlice'
import PlayItem from './PlayItem'
import FriendItem from './friend/FriendItem'
import { DateTime } from 'luxon'


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
                    <div className="pt-4">
                        <div className="flex align-center gap-2 pt-1">
                            <div className="flex align-center gap-2">
                                <span className={`fs-14 weight-600 text-warning`}>{item.rating || 0}</span>
                                <div className="flex gap-1 align-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Icon icon={starFillIcon} size="sm" className={`text-warning ${i + 1 <= item.rating ? 'fill-warning' : 'fill-secondary'}`}/>
                                    ))}
                                </div>
                            </div>
                            {window.innerWidth > 800 && (
                            <div className="flex align-center gap-1">
                                {item.tags.map((tag, index) => (
                                    <div key={index} className="px-2 py-1 bg-secondary border-radius weight-500 flex align-center fs-12 weight-500">{tag}</div>
                                ))}
                            </div>
                            )}
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
    const { friends } = useSelector((state) => state.friend)
    const { feed, hasMore, isLoading, isError } = useSelector((state) => state.feed)

    const [type, setType] = useState(null)

    const getData = () => {
        dispatch(getCommunityFeed(!type ? 'all' : type))
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = 'Community'
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
        <div>
            <UserSearchModal/>
            <FriendsModal friends={friends}/>
            <main className="page-body">
                <div className="animation-slide-in">
                    <div className="container">
                        {window.innerWidth <= 800 && user ? (
                            <div className="flex pt-6 pt-sm-3 justify-between px-sm-3 pb-3">
                                <div className="title-1 bold">
                                    Community
                                </div>
                                <div className="justify-end flex align-center flex-no-wrap gap-3">
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
                            <HorizontalScroll
                                className="align-start gap-0 flex-1"
                                contentClassName="gap-0"
                            >
                                <div className={`pointer h-100 w-max-75-px animation-fade-in border-radius-sm hover-opacity-100 transition-duration clickable flex-shrink-0`}
                                    onClick={() => {
                                        searchParams.set('su', 'true')
                                        setSearchParams(searchParams.toString())
                                    }}
                                >
                                    <div className="flex flex-col p-2 align-center">
                                        <Avatar
                                            icon={plusIcon}
                                            rounded
                                            sizeSm="md"
                                            defaultColor
                                            size="lg"
                                        />
                                        <div className="fs-12 text-center text-ellipsis-1 pt-2 weight-500">
                                            Add
                                        </div>
                                    </div>
                                </div>
                                <div className={`pointer h-100 w-max-75-px animation-fade-in border-radius-sm hover-opacity-100 transition-duration clickable flex-shrink-0`}
                                    onClick={() => {
                                        searchParams.set('friends', 'true')
                                        setSearchParams(searchParams.toString())
                                    }}
                                >
                                    <div className="flex flex-col p-2 align-center pos-relative">
                                        {friends.filter((item) => item.pending).length > 0 ? <span className="fs-14 flex align-center justify-center w-set-25-px h-set-25-px z-3 bg-danger border-radius-50 border-radius pos-absolute top-0 right-0">{friends.filter((item) => item.pending).length}</span> : null}
                                        <Avatar
                                            icon={usersIcon}
                                            sizeSm="md"
                                            rounded
                                            defaultColor
                                            size="lg"
                                        />
                                        <div className="fs-12 text-center text-ellipsis-1 pt-2 weight-500">
                                            Friends
                                        </div>
                                    </div>
                                </div>
                                {friends
                                .filter((item) => !item.pending)
                                .map((item) => (
                                        <Link className={`pointer h-100 w-max-75-px w-sm-max-50-px w-100 p-2 animation-fade-in border-radius-sm hover-opacity-100 transition-duration clickable flex-shrink-0 bg-secondary-hover`}
                                            key={item._id}
                                            to={`/u/${item.friend.username}`}
                                        >
                                            <div className="flex flex-col align-center text-ellipsis-1">
                                                <Avatar
                                                    img={item?.friend?.avatar}
                                                    rounded
                                                    sizeSm="md"
                                                    size="lg"
                                                    name={item.friend.username}
                                                    avatarColor={item.friend.username.length}
                                                    label={item.friend.username}
                                                />
                                                <div className="text-ellipsis-1">
                                                    <div className="fs-12 w-max-75-px w-sm-max-50-px text-center text-ellipsis pt-2 weight-500">
                                                        {item.friend.username}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                ))}
                            </HorizontalScroll>
                        </div>
                        : null}
                        <div className="flex gap-6">
                            <div className="flex-1 flex flex-col">
                            {window.innerWidth <= 800 && user ? (
                            <div className="sticky top-0 bg-main py-1 z-3 py-sm-0">
                                {friends.length > 0 && !isLoading && (
                                    <></>
                                )}
                            </div>
                            ) : null}
                            <div  className="px-sm-3 py-3 sticky top-0 z-3 bg-main">
                                <HorizontalScroll className="flex-1">
                                    <Button
                                        label="All"
                                        variant="secondary"
                                        className="animation-fade-in flex-shrink-0"
                                        type={type === null ? 'filled' : 'default'}
                                        onClick={() => {
                                            setType(null)
                                        }}
                                    />
                                    {['Plays', 'Library']
                                    .map((a) => (
                                        <Button
                                            key={a}
                                            label={a}
                                            variant="secondary"
                                            className="animation-fade-in flex-shrink-0"
                                            type={type === a ? 'filled' : 'default'}
                                            onClick={() => {
                                                if (type == a) {
                                                    setType(null)
                                                } else {
                                                    setType(a)
                                                }
                                            }}
                                        />
                                    ))}
                                </HorizontalScroll>
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
                                    <div className="border border-radius border-dashed mt-3">
                                        <ErrorInfo
                                            secondary={!hasMore ? "You're all caught up!" : "Oops! Something went wrong"}
                                        />
                                    </div>
                                }
                                { isLoading ?
                                    <div className="flex flex-col gap-5 py-5 px-sm-3">
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
                            <div className="flex flex-col w-set-300-px">
                                <div className="flex justify-between align-center py-3">
                                    <div className="fs-20 bold flex gap-3 align-center pointer transition-slide-right-hover-parent"
                                        onClick={() => {
                                            searchParams.set('friends', 'true')
                                            setSearchParams(searchParams.toString())
                                        }}
                                    >
                                        Friends {friends.filter((item) => item.pending).length > 0 ? <span className="fs-14 border-radius text-danger">{friends.filter((item) => item.pending).length}</span> : null}
                                        <Icon icon={rightArrowIcon} size="sm" className="transition-slide-right-hover"/>
                                    </div>
                                    <IconButton
                                        icon={largePlusIcon}
                                        variant="text"
                                        dataTooltipContent="Add a friend"
                                        type="secondary"
                                        onClick={() => {
                                            searchParams.set('su', 'true')
                                            setSearchParams(searchParams.toString())
                                        }}
                                    />
                                </div>
                                {/* { isLoading ?
                                    <div className="flex flex-col gap-2">
                                        <Skeleton height="48" animation="wave"/>
                                        <Skeleton height="48" animation="wave"/>
                                        <Skeleton height="48" animation="wave"/>
                                        <Skeleton height="48" animation="wave"/>
                                    </div>
                                : */}
                                {
                                friends.length === 0 ?
                                    <div className="border border-radius border-dashed animation-slide-in">
                                        <ErrorInfo
                                            secondary="Oops! No friends found"
                                        />
                                    </div>
                                :
                                friends.length > 0 && (
                                friends.map((item) => (
                                    <FriendItem
                                        key={item._id}
                                        item={item.friend}
                                    />
                                ))
                            )}
                            </div>
                        }
                    </div>
                </div>
            </div>
            </main>
        </div>
    )
}

export default CommunityPage