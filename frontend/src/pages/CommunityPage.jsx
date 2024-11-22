import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Button, ErrorInfo, HorizontalScroll, IconButton } from '../components'
import { getMyFriends } from '../features/friend/friendSlice'
import { closeIcon, diceIcon, largePlusIcon, linkIcon } from '../assets/img/icons'
import { resetPlay } from '../features/play/playSlice'


const CommunityPage = () => {
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth)
    const { friends, isLoading } = useSelector((state) => state.friends)
    const { plays, hasMore, isLoading: isLoadingPlays } = useSelector((state) => state.play)
    const [tag, setTag] = useState('Plays')
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
                                    <HorizontalScroll
                                        contentClassName="align-start gap-0"
                                    >
                                        {friends.map((item) => (
                                            <div className={`pointer h-100 animation-fade-in border-radius-sm hover-opacity-100 transition-duration clickable flex-shrink-0${selectedFriend ? selectedFriend === item?.game?._id ? "" : " opacity-25" : " bg-secondary-hover"}`}
                                                key={item._id}
                                                onClick={() => {
                                                    if (selectedFriend === item?.game?._id) {
                                                        setSelectedFriend(null)
                                                    } else {
                                                        setSelectedFriend(item?.game?._id)
                                                    }
                                                }}
                                            >
                                                <div className="flex flex-col p-2 align-center">
                                                    <Avatar
                                                        img={item?.game?.thumbnail}
                                                        size="lg"
                                                        rounded
                                                        label={item.game.name}
                                                    />
                                                    <div className="fs-12 text-center text-ellipsis-1 w-max-75-px pt-2 weight-500">
                                                        {item.game.name}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </HorizontalScroll>
                                )}
                            </div>
                            ) : null}
                            <div className="pt-3 px-sm-3">
                                <div className="flex">
                                    <HorizontalScroll className="flex-1">
                                        {selectedFriend ?
                                            <IconButton
                                                icon={closeIcon}
                                                variant="secondary"
                                                className="animation-fade-in flex-shrink-0"
                                                type={tag === null ? 'filled' : 'default'}
                                                onClick={() => {
                                                    setSelectedFriend(null)
                                                    setTag(null)
                                                }}
                                            />
                                        : null}
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
                                    {selectedFriend ?
                                    <div className="pt-3 flex gap-2 overflow-auto">
                                        <Button
                                            icon={linkIcon}
                                            variant="secondary"
                                            type="outline"
                                            className="flex-shrink-0"
                                            label="Details"
                                            onClick={() => navigate(`/u/${selectedFriend}`)}
                                        />
                                    </div>
                                    : null }
                                <div>
                                    {plays.length > 0 && !isLoading ? (
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
                                    ) : isLoading ? (
                                        <ErrorInfo isLoading/>
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
                                    <div className="fs-20 bold">
                                        Friends <span className="text-secondary weight-400 fs-14">({friends.length})</span>
                                    </div>
                                    <Button
                                        icon={largePlusIcon}
                                        label="Add"
                                        variant="secondary"
                                        type="default"
                                    />
                                </div>
                                {
                                friends.length === 0 && !isLoading ?
                                <div className="border border-radius border-dashed">
                                    <ErrorInfo
                                        secondary="Oops! No friends found"
                                        />
                                    </div>
                                :
                                friends.length > 0 && !isLoading && (
                                    friends.map((item) => (
                                        <div className={`pointer h-100 animation-fade-in border-radius-sm hover-opacity-100 transition-duration clickable flex-shrink-0${selectedFriend ? selectedFriend === item?.game?._id ? "" : " opacity-25" : " bg-secondary-hover"}`}
                                            key={item._id}
                                            onClick={() => {
                                                if (selectedFriend === item?.game?._id) {
                                                    setSelectedFriend(null
                                                    )
                                                }
                                                else {
                                                    setSelectedFriend(item?.game?._id)
                                                }
                                            }
                                        }
                                    >
                                        <div className="flex flex-col p-2 align-center">
                                            <Avatar
                                                img={item?.avatar}
                                                size="lg"
                                                rounded
                                                label={item.username}
                                            />
                                            <div className="fs-12 text-center text-ellipsis-1 w-max-75-px pt-2 weight-500">
                                                {item.username}
                                            </div>
                                        </div>
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