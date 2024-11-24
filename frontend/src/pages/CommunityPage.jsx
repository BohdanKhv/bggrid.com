import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Button, ErrorInfo, HorizontalScroll, Icon, IconButton, Skeleton } from '../components'
import { arrowRightShortIcon, closeIcon, diceIcon, largePlusIcon, linkIcon, plusIcon, rightArrowIcon, starEmptyIcon, starFillIcon, starsIcon } from '../assets/img/icons'
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
                        <div className="flex justify-between px-sm-3 pb-3">
                            <div className="pt-6 pt-sm-3 title-1 bold">
                                Community
                            </div>
                            {window.innerWidth <= 800 && user ? (
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
                            ) : null}
                        </div>
                        <div className="flex gap-6">
                            <div className="flex-1 flex flex-col">
                            {window.innerWidth <= 800 && user ? (
                            <div className="sticky top-0 bg-main py-1 z-3 py-sm-0">
                                {friends.length > 0 && !isLoading && (
                                    <></>
                                )}
                            </div>
                            ) : null}
                            <div className="px-sm-3">
                                <div className="flex">
                                    <HorizontalScroll className="flex-1">
                                        {type ?
                                            <IconButton
                                                icon={closeIcon}
                                                variant="secondary"
                                                className="animation-fade-in flex-shrink-0"
                                                type={type === null ? 'filled' : 'default'}
                                                onClick={() => {
                                                    setType(null)
                                                }}
                                            />
                                        :
                                        <Button
                                            label="All"
                                            variant="secondary"
                                            className="animation-fade-in flex-shrink-0"
                                            type={type === null ? 'filled' : 'default'}
                                            onClick={() => {
                                                setType(null)
                                            }}
                                        />
                                        }
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
                                <div className="pt-3">
                                    {feed.length > 0 && !isLoading ?
                                        <div className="flex flex-col">
                                            {feed
                                            .map((item, index, arr) =>
                                                <div
                                                    key={index}
                                                >
                                                    {item.type === 'play' ?
                                                        <PlayItem item={item.play}
                                                        />
                                                    : item.type === 'library' ?<LibraryItem
                                                        item={item.libraryItem}
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
                                    <div
                                        ref={lastElementRef}
                                    />
                                    { isLoading ?
                                        <ErrorInfo isLoading/>
                                    : null }
                                </div>
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
                                { isLoading ?
                                    <div className="flex flex-col gap-2">
                                        <Skeleton height="48" animation="wave"/>
                                        <Skeleton height="48" animation="wave"/>
                                        <Skeleton height="48" animation="wave"/>
                                        <Skeleton height="48" animation="wave"/>
                                    </div>
                                :
                                friends.length === 0 && !isLoading ?
                                    <div className="border border-radius border-dashed animation-slide-in">
                                        <ErrorInfo
                                            secondary="Oops! No friends found"
                                        />
                                    </div>
                                :
                                friends.length > 0 && !isLoading && (
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