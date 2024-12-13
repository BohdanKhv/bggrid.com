import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Button, ErrorInfo, HorizontalScroll, Icon, IconButton, Skeleton } from '../components'
import { arrowRightShortIcon, closeIcon, diceIcon, largePlusIcon, linkIcon, plusIcon, rightArrowIcon, starEmptyIcon, starFillIcon, starsIcon, usersIcon } from '../assets/img/icons'
import { Link, useSearchParams } from 'react-router-dom'
import { resetFeed, getCommunityFeed } from '../features/feed/feedSlice'
import PlayItem from './PlayItem'
import { DateTime } from 'luxon'


const LibraryItem = ({ item }) => {
    return (
        <div className="px-sm-3 border-bottom show-on-hover-parent border-secondary transition-duration animation-slide-in display-on-hover-parent">
            <div className="flex gap-3 py-5 py-sm-3">
                <Avatar
                    img={item?.game?.image}
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
                        <div className="flex align-center gap-2 pt-2 flex-sm-col align-sm-start">
                            <div className="flex align-center gap-2">
                                <span className={`fs-16 weight-600 text-warning`}>{item.rating || 0}</span>
                                <div className="flex gap-1 align-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Icon icon={starFillIcon} size="sm" className={`text-warning ${i + 1 <= item.rating ? 'fill-warning' : 'fill-secondary'}`}/>
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
        </div>
    )
}


const CommunityPage = () => {
    const dispatch = useDispatch()

    const [searchParams, setSearchParams] = useSearchParams()

    const { user } = useSelector((state) => state.auth)
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
                        <div className="flex gap-6">
                            <div className="flex-1 flex flex-col">
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
                                    <div className="border border-radius border-dashed mt-3 mx-sm-3">
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
                    </div>
                </div>
            </div>
            </main>
        </div>
    )
}

export default CommunityPage