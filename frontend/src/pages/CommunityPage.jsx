import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Button, ErrorInfo, HorizontalScroll, Icon, IconButton, Skeleton } from '../components'
import { getMyFriends, removeFriend } from '../features/friend/friendSlice'
import { arrowRightShortIcon, closeIcon, diceIcon, largePlusIcon, linkIcon, plusIcon, rightArrowIcon } from '../assets/img/icons'
import UserSearchModal from './friend/UserSearchModal'
import { Link, useSearchParams } from 'react-router-dom'
import FriendsModal from './friend/FriendsModal'
import { resetFeed, getCommunityFeed } from '../features/feed/feedSlice'
import PlayItem from './PlayItem'


const CommunityPage = () => {
    const dispatch = useDispatch()

    const [searchParams, setSearchParams] = useSearchParams()

    const { user } = useSelector((state) => state.auth)
    const { friends, isLoading, loadingId } = useSelector((state) => state.friend)
    const { feed, hasMore, isLoading: isLoadingFeed } = useSelector((state) => state.feed)

    const [type, setType] = useState(null)

    const getData = () => {
        dispatch(getCommunityFeed(!type ? 'all' : type))
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = 'Community'

        const promise = dispatch(getMyFriends())
        const promise2 = getData()

        return () => {
            promise && promise.abort()
            promise2 && promise2.abort()
        }
    }, [])

    const observer = useRef();
    const lastElementRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                const promise = getData();
        
                return () => {
                    promise && promise.abort();
                    dispatch(resetFeed());
                    observer.current && observer.current.disconnect();
                }
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoadingFeed, hasMore]);

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
                            <div className="col-8 col-sm-12 flex flex-col">
                            {window.innerWidth <= 800 && user ? (
                            <div className="sticky top-0 bg-main py-1 z-3 py-sm-0">
                                {friends.length > 0 && !isLoading && (
                                    <></>
                                )}
                            </div>
                            ) : null}
                            <div className="pt-3 px-sm-3">
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
                                    {feed.length > 0 && !isLoadingFeed ?
                                        <div className="flex flex-col">
                                            {feed
                                            .map((item, index, arr) =>
                                                <div
                                                    key={item._id}
                                                    ref={arr.length === index + 1 ? lastElementRef : undefined}
                                                >
                                                    {item.type === 'play' ?
                                                        <PlayItem item={item}/>
                                                    : 'library' }
                                                </div>
                                            )}
                                        </div>
                                    :
                                        feed.length === 0 && !isLoadingFeed &&
                                        <div className="border border-radius border-dashed mt-3">
                                            <ErrorInfo
                                                secondary={!hasMore ? "You're all caught up!" : "Oops! Something went wrong"}
                                            />
                                        </div>
                                    }
                                    { isLoadingFeed ?
                                        <ErrorInfo isLoadingFeed/>
                                    : null }
                                </div>
                            </div>
                        </div>
                        {window.innerWidth > 800 &&
                            <div className="flex flex-col col-4">
                                <div className="flex justify-between align-center py-3">
                                    <div className="fs-20 bold flex gap-3 align-center pointer transition-slide-right-hover-parent"
                                        onClick={() => {
                                            searchParams.set('friends', 'true')
                                            setSearchParams(searchParams.toString())
                                        }}
                                    >
                                        Friends
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
                                        <div className={`align-center flex justify-between align-center border-radius-sm hover-opacity-100 transition-duration flex-shrink-0`}
                                            key={item._id}
                                        >
                                        <div className="flex gap-3 py-2 align-center flex-1">
                                            <Avatar
                                                img={item.friend?.avatar}
                                                name={item.friend.username}
                                                size="md"
                                                avatarColor={item.friend.username.length}
                                                rounded
                                            />
                                            <div className="flex flex-col">
                                                {item.friend.firstName && item.friend.lastName ?
                                                    <Link className="fs-14 weight-500 text-ellipsis-1 text-underlined-hover"
                                                        to={`/u/${item.friend.username}`}
                                                    >
                                                        @{item.friend.username}
                                                    </Link>
                                                : null}
                                                <div className="fs-12 text-secondary text-ellipsis-1 weight-500">
                                                    {item.friend.firstName} {item.friend.lastName}  
                                                </div>
                                            </div>
                                        </div>
                                        {item.pending && !item.myRequest &&
                                            <div className="flex gap-2 align-center justify-center">
                                                <Button
                                                    label="Decline"
                                                    borderRadius="md"
                                                    variant="secondary"
                                                    type="default"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        dispatch(removeFriend(item._id))
                                                    }}
                                                    disabled={loadingId}
                                                />
                                                <Button
                                                    label="Accept"
                                                    variant="primary"
                                                    type="filled"
                                                    borderRadius="md"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        dispatch(acceptFriendRequest(item._id))
                                                    }}
                                                    disabled={loadingId}
                                                    />
                                            </div>
                                        }
                                    </div>
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