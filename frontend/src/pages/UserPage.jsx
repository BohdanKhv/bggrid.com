import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Button, ConfirmAction, Dropdown, ErrorInfo, HorizontalScroll, Icon, IconButton, Image, Skeleton, TabContent } from '../components'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getUserProfile } from '../features/user/userSlice'
import { followUser, unfollowUser } from '../features/follow/followSlice'
import FollowersModal from './follow/FollowersModal'
import { arrowDownShortIcon, arrowUpShortIcon, closeIcon, diceIcon, leftArrowIcon, libraryIcon, starFillIcon, userAddIcon } from '../assets/img/icons'
import { DateTime } from 'luxon'
import { tagsDetailedEnum, tagsEnum } from '../assets/constants'
import { getPlaysByUsername, resetPlay } from '../features/play/playSlice'
import PlayItem from './PlayItem'
import FollowingModal from './follow/FollowingModal'
import FollowSearchModal from './follow/FollowSearchModal'
import UserGuardLoginModal from './auth/UserGuardLoginModal'
import { Helmet, HelmetProvider } from 'react-helmet-async';


const PlayTab = () => {
    const dispatch = useDispatch()

    const { username } = useParams()

    const { plays, isLoading, isError, hasMore } = useSelector((state) => state.play)

    const getData = () => {
        dispatch(getPlaysByUsername(username))
    }

    useEffect(() => {
            dispatch(resetPlay())
        getData()

        return () => {
            dispatch(resetPlay())
        }
    }, [username])

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
        {plays.length === 0 && !hasMore ?
            <ErrorInfo
                secondary="Once they start playing games, they will appear here"
            />
        :
            <div className="flex gap-6">
                <div className="flex-1">
                    {plays.map((item, index, arr) => (
                        <div
                            ref={arr.length === index + 1 ? lastElementRef : null}
                            key={item._id}
                        >
                            <PlayItem
                                item={item}
                                hideUpdate
                            />
                        </div>
                    ))}
                </div>
            </div>
        }
        {plays.length === 0 && isLoading ?
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
        : isLoading ?
            <ErrorInfo isLoading/>
            :
            null
        }
        </>
    )
}

const LibraryItem = ({ item, index, hideInfo }) => {

    const [searchParams, setSearchParams] = useSearchParams()

    const { user } = useSelector((state) => state.auth)

    return (
        <div className="border-radius px-sm-3 transition-duration animation-slide-in">
            <div className="border-bottom">
                <div className="flex gap-3 flex-1 py-3">
                    <Image
                        img={item?.game?.thumbnail}
                        classNameContainer="w-set-50-px h-set-50-px border-radius"
                        classNameImg="border-radius"
                    />
                    <div className="flex flex-col justify-between flex-1">
                        <div className="flex justify-between gap-3">
                            <div className="flex flex-col">
                                <div className="flex gap-2 align-center">
                                    <Link className="fs-16 text-underlined-hover w-fit-content text-ellipsis-2 h-fit-content"
                                        to={`/g/${item.game._id}`}
                                        >
                                        {item.game.name}
                                    </Link>
                                </div>
                            </div>
                            <span className="text-secondary weight-400 fs-12 text-nowrap flex-shrink-0">
                                {DateTime.now().diff(DateTime.fromISO(item.updatedAt), ['days']).days > 1 ? DateTime.fromISO(item.updatedAt).toFormat('LLL dd') :
                                DateTime.fromISO(item.updatedAt).toRelative().replace(' hours', 'h').replace(' hour', 'h').replace(' minutes', 'm').replace(' minute', 'm').replace(' days', 'd').replace(' day', 'd')}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex align-center align-sm-start gap-2 pt-1 flex-sm-col">
                                <div className="flex align-center gap-2">
                                    <span className={`fs-14 weight-600 text-warning`}>{item.rating || 0}</span>
                                    <div className="flex gap-1 align-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Icon icon={starFillIcon} size="xs" className={`text-warning ${i + 1 <= item.rating ? 'fill-warning' : 'fill-secondary'}`}
                                                key={i}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex align-center gap-1 flex-sm-wrap pt-2">
                                {item.tags.map((tag, index) => (
                                    <div key={index} className="px-2 py-1 bg-secondary border-radius weight-500 flex align-center fs-12 weight-500">
                                        <span className="me-2">
                                            {tagsDetailedEnum.find((t) => t.label === tag)?.icon}
                                        </span>
                                        {tag}</div>
                                ))}
                            </div>
                            {item.comment ?
                                <div className="fs-14 pt-2">
                                    {item.comment}
                                </div>
                            : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const UserPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { username, tab } = useParams()
    const { userById, isLoading, msg } = useSelector(state => state.user)
    const { follow, loadingId } = useSelector((state) => state.follow)
    const [searchParams, setSearchParams] = useSearchParams()
    const { user } = useSelector((state) => state.auth)
    const [tags, setTags] = useState(searchParams.get('tag') ? [searchParams.get('tag')] : '')
    const [sortBy, setSortBy] = useState('dateAdded')
    const [sortOrder, setSortOrder] = useState('desc')

    const uniqueTags = useMemo(() => {
        return userById?.library?.reduce((acc, item) => {
            item.tags.forEach((tag) => {
                if (!acc.includes(tag)) acc.push(tag)
            })
            return acc
        }, [])
    }, [userById?.library])

    useEffect(() => {
        window.scrollTo(0, 0)

        const promise = dispatch(getUserProfile(username))
        return () => {
            promise.abort()
            dispatch(resetPlay())
        }
    }, [username])

    return (
        <HelmetProvider>
        {isLoading ? 
        <div className="h-min-100 flex align-center justify-center">
            <ErrorInfo isLoading />
        </div>
        : userById && !isLoading ?
        <div>
            {user &&
                <FollowSearchModal
                    useModel
                />
            }
            {tab === 'followers' ?
                <FollowersModal />
            : tab === 'following' ?
                <FollowingModal />
            : null
            }
            <main className="page-body">
                <div className="animation-slide-in">
                    <div className="container">
                        {window.innerWidth < 800 ?
                            <div className="flex justify-between bg-main py-3 sticky top-0 z-9 px-3">
                                <div className="flex align-center gap-3">
                                    <IconButton
                                        icon={leftArrowIcon}
                                        variant="secondary"
                                        type="text"
                                        to={user ? "/community" : "/"}
                                    />
                                    <div className="fs-14 weight-600">
                                        {userById?.username}
                                    </div>
                                </div>
                            </div>
                        : null}
                        <div className="py-6 pt-sm-0 mt-sm-0 pb-3 pt-sm-3 pb-sm-3 mb-sm-0 py-sm-0 m-3">
                            <div className="flex flex-sm-col gap-6 gap-sm-3 align-center align-sm-start">
                                <div className="flex gap-sm-3 w-sm-100 align-center">
                                    <div className="flex justify-center align-center">
                                        <Avatar
                                            img={userById?.avatar}
                                            name={userById ? `${userById?.username}` : null}
                                            rounded
                                            defaultColor
                                            size="xxl"
                                            sizeSm="lg"
                                        />
                                    </div>
                                    {window.innerWidth <= 800 ?
                                    <div className="flex gap-5 flex-1 justify-center">
                                        <Link className="flex flex-col justify-center align-center fs-14 gap-1 weight-600 pointer"
                                            to={`/u/${username}/library`}
                                        >
                                            {userById?.library?.length || 0} <span className="weight-400 ps-1">games</span>
                                        </Link>
                                        <Link className="flex flex-col justify-center align-center fs-14 gap-1 weight-600 pointer"
                                            to={`/u/${username}/followers`}
                                        >
                                            {userById?.followers || 0} <span className="weight-400 ps-1">followers</span>
                                        </Link>
                                        <Link className="flex flex-col justify-center align-center fs-14 gap-1 weight-600 pointer"
                                            to={`/u/${username}/following`}
                                        >
                                            {userById?.following || 0} <span className="weight-400 ps-1">following</span>
                                        </Link>
                                    </div>
                                    : null}
                                </div>
                                <div className="flex flex-1 flex-col gap-4 w-sm-100">
                                    <div>
                                        <Helmet>
                                            <title>
                                                {`${userById?.firstName || ''} ${userById?.lastName || ''} - ${userById?.username}`}
                                            </title>
                                            <link
                                                rel="canonical"
                                                href={`https://bggrid.com/u/${username}`}
                                            />
                                        </Helmet>
                                        {(userById?.firstName || userById?.lastName) && (
                                            <div className="fs-24 fs-sm-18">
                                                {`${userById?.firstName} ${userById?.lastName}`}
                                                <meta name="description" content={`${userById?.firstName} ${userById?.lastName || ''} - ${userById?.username}`} />
                                            </div>
                                        )}
                                        <div className="fs-16 fs-sm-12 text-secondary">
                                            @{userById?.username}
                                        </div>
                                        {window.innerWidth > 800 ?
                                            <div className="pt-4 flex gap-3">
                                                <Link className="flex justify-center align-center fs-16 gap-1 weight-600 pointer"
                                                    to={`/u/${username}/library`}
                                                >
                                                    {userById?.library?.length || 0} <span className="weight-400 ps-1">games</span>
                                                </Link>
                                                <Link className="flex justify-center align-center fs-16 gap-1 weight-600 pointer"
                                                    to={`/u/${username}/followers`}
                                                >
                                                    {userById?.followers || 0} <span className="weight-400 ps-1">followers</span>
                                                </Link>
                                                <Link className="flex justify-center align-center fs-16 gap-1 weight-600 pointer"
                                                    to={`/u/${username}/following`}
                                                >
                                                    {userById?.following || 0} <span className="weight-400 ps-1">following</span>
                                                </Link>
                                            </div>
                                        : null}
                                    </div>
                                    {userById?._id === user?._id ?
                                        <div className="flex gap-2 w-100">
                                            <Button
                                                label="Edit profile"
                                                variant="secondary"
                                                to="/settings"
                                                className="flex-shrink-0 flex-grow-sm-1"
                                                borderRadius="lg"
                                            />
                                            <Button
                                                label="Share profile"
                                                variant="secondary"
                                                onClick={() => {
                                                    navigator.share({
                                                        title: userById.username,
                                                        text: `Check out ${userById.username}'s profile on BGGRID!`,
                                                        url: window.location
                                                    })
                                                }}
                                                className="flex-shrink-0 flex-grow-sm-1"
                                                borderRadius="lg"
                                            />
                                            <Button
                                                icon={userAddIcon}
                                                variant="secondary"
                                                type="default"
                                                onClick={() => {
                                                    searchParams.set('su', true)
                                                    setSearchParams(searchParams.toString())
                                                }}
                                            />
                                        </div>
                                    : null}
                                    {
                                    user?._id === userById?._id ?
                                    null
                                    :
                                    <div className="flex gap-2">
                                        {userById.isFollowing ?
                                            <Button
                                                label="Unfollow"
                                                variant="secondary"
                                                type="default"
                                                className="flex-shrink-0 flex-grow-sm-1"
                                                borderRadius="lg"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    dispatch(unfollowUser(userById._id))
                                                }}
                                                disabled={loadingId}
                                            />
                                        :
                                        <div className="flex-shrink-0 flex-grow-sm-1">
                                            <UserGuardLoginModal>
                                                <Button
                                                    label="Follow"
                                                    variant="secondary"
                                                    type="filled"
                                                    className="w-100"
                                                    borderRadius="lg"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        dispatch(followUser(userById._id))
                                                    }}
                                                    disabled={loadingId}
                                                />
                                            </UserGuardLoginModal>
                                        </div>
                                        }
                                        <Button
                                            label="Share profile"
                                            variant="secondary"
                                            onClick={() => {
                                                navigator.share({
                                                    title: userById.username,
                                                    text: `Check out ${userById.username}'s profile on BGGRID!`,
                                                    url: window.location
                                                })
                                            }}
                                            className="flex-shrink-0 flex-grow-sm-1"
                                            borderRadius="lg"
                                        />
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 border-bottom justify-center pt-sm-0">
                            <TabContent
                                classNameContainer="w-sm-100 flex-grow-sm-1"
                                classNameItem="flex-1"
                                items={[
                                    {label: 'Library', icon: libraryIcon},
                                    {label: 'Plays', icon: diceIcon},
                                ]}
                                activeTabName={tab || 'library'}
                                setActiveTabName={(e) => {
                                    navigate(`/u/${username}/${e}`)
                                }}
                            />
                        </div>
                        {!tab || ['library', 'following', 'followers'].includes(tab?.toLocaleLowerCase()) ?
                            <div className="flex flex-col">
                                {userById?.library?.length > 0 ?
                                    <div className="pb-3">
                                    {uniqueTags.length > 0 ?
                                        <div className="sticky top-0 bg-main py-3 px-sm-3 z-3">
                                            <HorizontalScroll>
                                                {tags.length > 0 ? (
                                                    <IconButton
                                                        icon={closeIcon}
                                                        variant="secondary"
                                                        type="default"
                                                        onClick={() => {
                                                            searchParams.delete('tag')
                                                            setSearchParams(searchParams.toString())
                                                            setTags([])
                                                        }}
                                                    />
                                                ) : 
                                                    <Button
                                                        label="All"
                                                        variant="secondary"
                                                        className="animation-fade-in flex-shrink-0"
                                                        type={'filled'}
                                                    />
                                                }
                                                {uniqueTags
                                                .filter((tag) => tags.length === 0 || tags.includes(tag))
                                                .map((tag) => (
                                                    <Button
                                                        key={tag}
                                                        icon={tagsDetailedEnum.find((t) => t.label === tag)?.icon}
                                                        label={tag}
                                                        variant="secondary"
                                                        className="animation-fade-in flex-shrink-0"
                                                        type={tags.includes(tag) ? 'filled' : 'default'}
                                                        onClick={() => {
                                                            if (tags.includes(tag)) {
                                                                setTags(tags.filter((t) => t !== tag))
                                                                searchParams.delete('tag')
                                                                setSearchParams(searchParams.toString())
                                                            } else {
                                                                setTags([...tags, tag])
                                                                searchParams.set('tag', [...tags, tag].join(','))
                                                                setSearchParams(searchParams.toString())
                                                            }
                                                        }}
                                                    />
                                                ))}
                                            </HorizontalScroll>
                                        </div>
                                    : null}
                                    <div className="px-sm-3 py-sm-0 flex justify-between align-center">
                                        <Dropdown
                                            label="Relevance"
                                            classNameContainer="p-0 border-none bold"
                                            widthUnset
                                            customDropdown={
                                                <>
                                                <Button
                                                    type="secondary"
                                                    variant="link"
                                                    label={
                                                        <>
                                                        <span className="weight-400">Sort by: </span>
                                                        <strong>
                                                            {sortBy === 'dateAdded' ? 'Date Added' : sortBy === 'rating' ? 'Rating' : 'Plays'} {sortOrder === 'asc' ? '↓' : '↑'}
                                                        </strong>
                                                        </>
                                                    }
                                                />
                                                </>
                                            }
                                        >
                                            <Button
                                                borderRadius="sm"
                                                label="Date Added"
                                                className="justify-start"
                                                variant="text"
                                                iconRight={sortBy === 'dateAdded' ? sortOrder === 'asc' ? arrowDownShortIcon : arrowUpShortIcon : null}
                                                onClick={() => {
                                                    setSortBy('dateAdded')
                                                    if (sortOrder === 'asc') setSortOrder('desc')
                                                    else setSortOrder('asc')
                                                }}
                                            />
                                            <Button
                                                borderRadius="sm"
                                                className="justify-start"
                                                variant="text"
                                                label="Rating"
                                                iconRight={sortBy === 'rating' ? sortOrder === 'asc' ? arrowDownShortIcon : arrowUpShortIcon : null}
                                                onClick={() => {
                                                    setSortBy('rating')
                                                    if (sortOrder === 'asc') setSortOrder('desc')
                                                    else setSortOrder('asc')
                                                }}
                                            />
                                            <Button
                                                borderRadius="sm"
                                                className="justify-start"
                                                variant="text"
                                                label="Plays"
                                                iconRight={sortBy === 'plays' ? sortOrder === 'asc' ? arrowDownShortIcon : arrowUpShortIcon : null}
                                                onClick={() => {
                                                    setSortBy('plays')
                                                    if (sortOrder === 'asc') setSortOrder('desc')
                                                    else setSortOrder('asc')
                                                }}
                                            />
                                        </Dropdown>
                                    </div>
                                    {
                                    userById?.library
                                    .filter((item) => {
                                        if (tags.length === 0) return true
                                        return tags?.some((tag) => item.tags.includes(tag))
                                    }).length === 0 ?
                                        <ErrorInfo
                                            label="No games found"
                                            secondary="Try removing some filters"
                                        />
                                    : userById?.library
                                    .filter((item) => {
                                        if (tags.length === 0) return true
                                        return tags?.some((tag) => item.tags.includes(tag))
                                    })
                                    .sort((a, b) => {
                                        if (sortBy === 'dateAdded') {
                                            return sortOrder === 'asc' ? DateTime.fromISO(a.createdAt) - DateTime.fromISO(b.createdAt) : DateTime.fromISO(b.createdAt) - DateTime.fromISO(a.createdAt)
                                        } else if (sortBy === 'rating') {
                                            return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating
                                        } else {
                                            return sortOrder === 'asc' ? a.plays - b.plays : b.plays - a.plays
                                        }
                                    })
                                    .map((item, index) => (
                                        <LibraryItem
                                            key={item._id}
                                            item={item}
                                            index={index}
                                        />
                                    ))}
                                    </div>
                                :
                                    <ErrorInfo
                                        label="Oops, it's empty here"
                                        secondary={`Once ${userById?.username} adds games to their library, they will appear here`}
                                    />
                                }
                            </div>
                        : tab === 'plays' ?
                            <div className="flex flex-col">
                                <PlayTab/>
                            </div>
                        : null}
                    </div>
                </div>
            </main>
        </div>
        : msg === '404' ?
            <div className="h-100 flex align-center justify-center h-min-100">
                <ErrorInfo code="404" info="Oops, user not found"/>
            </div>
        : <div className="h-100 flex align-center justify-center h-min-100">
            <ErrorInfo label="Oops, looks like something went wrong" info={msg} />
        </div>}
        </HelmetProvider>
    )
}

export default UserPage