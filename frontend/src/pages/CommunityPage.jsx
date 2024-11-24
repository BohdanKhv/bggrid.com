import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Button, ErrorInfo, HorizontalScroll, Icon, IconButton } from '../components'
import { getMyFriends } from '../features/friend/friendSlice'
import { arrowRightShortIcon, closeIcon, diceIcon, largePlusIcon, linkIcon, plusIcon, rightArrowIcon } from '../assets/img/icons'
import { resetPlay } from '../features/play/playSlice'
import UserSearchModal from './friend/UserSearchModal'
import { Link, useSearchParams } from 'react-router-dom'
import FriendsModal from './friend/FriendsModal'


const CommunityPage = () => {
    const dispatch = useDispatch()

    const [searchParams, setSearchParams] = useSearchParams()
    const { user } = useSelector((state) => state.auth)
    const { friends, isLoading } = useSelector((state) => state.friend)
    const { plays, hasMore, isLoading: isLoadingPlays } = useSelector((state) => state.play)
    const [tag, setTag] = useState(null)
    const [selectedFriend, setSelectedFriend] = useState(null)

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = 'Community'

        const promise = dispatch(getMyFriends())

        return () => {
            promise.abort()
            dispatch(resetPlay())
        }
    }, [])

    const getData = () => {
    }

    const observer = useRef();
    const lastElementRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                // const promise = getData();
        
                return () => {
                    // promise && promise.abort();
                    dispatch(resetPlay());
                    observer.current && observer.current.disconnect();
                }
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoadingPlays, hasMore]);

    return (
        <div>
            <UserSearchModal/>
            <FriendsModal friends={friends}/>
            <main className="page-body">
                <div className="animation-slide-in">
                    <div className="container">
                        <div className="flex justify-between px-sm-3">
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
                                        {tag ?
                                            <IconButton
                                                icon={closeIcon}
                                                variant="secondary"
                                                className="animation-fade-in flex-shrink-0"
                                                type={tag === null ? 'filled' : 'default'}
                                                onClick={() => {
                                                    setTag(null)
                                                }}
                                            />
                                        :
                                        <Button
                                            label="All"
                                            variant="secondary"
                                            className="animation-fade-in flex-shrink-0"
                                            type={tag === null ? 'filled' : 'default'}
                                            onClick={() => {
                                                setTag(null)
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
                                                type={tag === a ? 'filled' : 'default'}
                                                onClick={() => {
                                                    if (tag == a) {
                                                        setTag(null)
                                                    } else {
                                                        setTag(a)
                                                    }
                                                }}
                                            />
                                        ))}
                                    </HorizontalScroll>
                                </div>
                                <div>
                                    {plays.length > 0 && !isLoadingPlays ? (
                                        <div className="flex flex-col">
                                        {plays
                                        .map((item, index, arr) =>
                                            <div
                                                key={item._id}
                                                ref={arr.length === index + 1 ? lastElementRef : undefined}
                                            >
                                                <PlayItem item={item}/>
                                            </div>
                                        )}
                                        </div>
                                    ) : isLoadingPlays ? (
                                        <ErrorInfo isLoadingPlays/>
                                    ) : (
                                        plays.length === 0 && 
                                        <div className="border border-radius border-dashed mt-3"><ErrorInfo
                                            secondary="When your friends play games, their plays will show up here."
                                        />
                                        </div>
                                    )}
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
                                    <ErrorInfo isLoading/>
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
                                        <Link className={`pointer align-center border-radius-sm hover-opacity-100 transition-duration clickable flex-shrink-0 bg-secondary-hover`}
                                            key={item._id}
                                            to={`/u/${item.friend.username}`}
                                    >
                                        <div className="flex gap-3 p-2 align-center">
                                            <Avatar
                                                img={item.friend?.avatar}
                                                name={item.friend.username}
                                                size="md"
                                                avatarColor={item.friend.username.length}
                                                rounded
                                            />
                                            <div className="flex flex-col">
                                                {item.friend.firstName && item.friend.lastName ?
                                                    <div className="fs-14 weight-500 text-ellipsis-1">
                                                        @{item.friend.username}
                                                    </div>
                                                : null}
                                                <div className="fs-12 text-secondary text-ellipsis-1 weight-500">
                                                    {item.friend.firstName} {item.friend.lastName}  
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
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