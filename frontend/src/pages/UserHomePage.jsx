import { useEffect, useState } from 'react'
import { Avatar, Button, ErrorInfo, HorizontalScroll, Icon, IconButton, Image, InputSearch, Modal, Skeleton } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { arrowLeftShortIcon, arrowRightShortIcon, bellIcon, clockIcon, diceIcon, rightArrowIcon, searchIcon, usersIcon } from '../assets/img/icons'
import { getSuggestions } from '../features/game/gameSlice'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { setSearchHistory } from '../features/local/localSlice'
import FriendsModal from './friend/FriendsModal'
import { getHomeFeed } from '../features/feed/feedSlice'
import HorizontalScrollControlled from '../components/ui/HorizontalScrollControlled'
import { typeEnum } from '../assets/constants'


const PlayItem = ({ item }) => {
    const { user } = useSelector((state) => state.auth)

    const [searchParams, setSearchParams] = useSearchParams()

    return  (
        <div className="flex flex-col gap-3"
            onClick={() => {
                searchParams.set('logPlay', item.game._id)
                setSearchParams(searchParams)
            }}
        >
            <Image img={item?.game?.thumbnail} classNameContainer="h-set-200-px border-radius overflow-hidden"/>
            <div className="flex align-center pos-relative flex-1">
                <div className="fs-14 bold text-ellipsis-2 flex-1">
                    {item?.game?.name}
                </div>
            </div>
            {item.lastPlayDate ?
            <div className="flex justify-between">
                <div className="fs-12 text-secondary">
                    Last played: 
                </div>
                <div className="fs-12 text-secondary">{DateTime.now().diff(DateTime.fromISO(item.lastPlayDate), ['days']).days > 1 ? DateTime.fromISO(item.lastPlayDate).toFormat('LLL dd') :
                    DateTime.fromISO(item.lastPlayDate).toRelative().replace(' days', 'd').replace(' day', 'd').replace(' hours', 'h').replace(' hour', 'h').replace(' minutes', 'm').replace(' minute', 'm').replace(' seconds', 's').replace(' second', 's')}
                </div>
            </div>
            :
            <div className="flex gap-2">
                {item?.players?.find((player) => player.user === user._id && player.winner) ?
                    <div className="tag-success fs-12 px-2 py-1 border-radius-sm">
                        Winner
                    </div>
                : null}
                {item.playTimeMinutes ?
                    <div className="tag-secondary fs-12 px-2 py-1 border-radius-sm">
                        {item.playTimeMinutes} min
                    </div>
                : null}
            </div>
            }
        </div>
    )
}

const GameItem = ({ item }) => {
    const { user } = useSelector((state) => state.auth)

    const [searchParams, setSearchParams] = useSearchParams()

    return  (
        <div className="flex flex-col gap-3"
            onClick={() => {
                searchParams.set('addGame', item._id)
                setSearchParams(searchParams)
            }}
        >
            <Image img={item?.thumbnail} classNameContainer="h-set-200-px border-radius overflow-hidden"/>
            <div className="flex align-center pos-relative flex-1">
                <div className="fs-14 bold text-ellipsis-2 flex-1">
                    {item?.name}
                </div>
            </div>
            <div className="flex gap-2">
                {item?.players?.find((player) => player.user === user._id && player.winner) ?
                    <div className="tag-success fs-12 px-2 py-1 border-radius-sm">
                        Winner
                    </div>
                : null}
                {item.playTimeMinutes ?
                    <div className="tag-secondary fs-12 px-2 py-1 border-radius-sm">
                        {item.playTimeMinutes} min
                    </div>
                : null}
            </div>
        </div>
    )
}

const HomeFeed = () => {
    const dispatch = useDispatch()

    const { home, isLoading, hasMore } = useSelector((state) => state.feed)

    useEffect(() => {
        if (home) return

        const promise = dispatch(getHomeFeed())

        return () => {
            promise.abort()
        }
    }, [])

    return (
        <>
        {isLoading ?
            <div className="flex flex-col gap-6 py-6 overflow-hidden py-sm-4">
                <div className="flex flex-col gap-3">
                    <Skeleton animation="wave" width="100" height="30"/>
                    <div className="flex gap-3">
                        <Skeleton animation="wave" height="300"/>
                        <Skeleton animation="wave" height="300"/>
                        <Skeleton animation="wave" height="300"/>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <Skeleton animation="wave" width="100" height="30"/>
                    <div className="flex gap-3">
                        <Skeleton animation="wave" height="300"/>
                        <Skeleton animation="wave" height="300"/>
                        <Skeleton animation="wave" height="300"/>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <Skeleton animation="wave" width="100" height="30"/>
                    <div className="flex gap-3">
                        <Skeleton animation="wave" height="300"/>
                        <Skeleton animation="wave" height="300"/>
                        <Skeleton animation="wave" height="300"/>
                    </div>
                </div>
            </div>
        :
            <div className="py-6 flex flex-col gap-6 gap-sm-3 overflow-hidden px-sm-4 py-sm-4">
                <div>
                    <div className="fs-24 flex align-center gap-4 weight-500 transition-slide-right-hover-parent pb-4">
                        Your stats in the last 30 days
                    </div>
                    <div className="flex gap-3 overflow-x-auto scrollbar-none">
                        <div className="flex flex-col gap-2 flex-1 bg-secondary p-4 border-radius w-min-100-px">
                            <div className="fs-20 weight-600">
                                {home?.playStats?.totalPlays || 0}
                            </div>
                            <div className="fs-14 text-secondary">
                                plays
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-1 bg-secondary p-4 border-radius w-min-100-px">
                            <div className="fs-20 weight-600">
                                {home?.playStats?.totalWins || 0}
                            </div>
                            <div className="fs-14 text-secondary">
                                wins
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-1 bg-secondary p-4 border-radius w-min-100-px">
                            <div className="fs-20 weight-600">
                                {home?.playStats?.totalPlayTime || 0} min
                            </div>
                            <div className="fs-14 text-secondary">
                                total playtime
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-1 bg-secondary p-4 border-radius w-min-100-px">
                            <div className="fs-20 weight-600">
                                {home?.playStats?.avgPlayTime.toFixed() || 0} min
                            </div>
                            <div className="fs-14 text-secondary">
                                avg. playtime
                            </div>
                        </div>
                    </div>
                </div>
                {home?.recentlyPlayed?.length ?
                    <HorizontalScrollControlled
                        label={
                            <Link className="fs-24 flex align-center gap-4 weight-500 transition-slide-right-hover-parent pointer"
                                to="/plays"
                            >
                                <div>
                                    Recently played
                                </div>
                                    <Icon
                                        icon={rightArrowIcon}
                                        className="transition-slide-right-hover"
                                        size="sm"
                                    />
                            </Link>
                        }
                        maxVisibleItems={window.innerWidth < 800 ? 2 : 5}
                        items={home.recentlyPlayed.map((item, i) => (
                            <PlayItem key={i} item={item}/>
                        ))}
                    />
                : null}
                {home?.mostPlayed?.length ?
                    <HorizontalScrollControlled
                        label={
                            <div className="fs-24 flex align-center gap-4 weight-500 transition-slide-right-hover-parent">
                                Most played games
                            </div>
                        }
                        maxVisibleItems={window.innerWidth < 800 ? 2 : 5}
                        items={home.mostPlayed.map((item, i) => (
                            <PlayItem key={i} item={item}/>
                        ))}
                    />
                : null}
                {home?.recommended?.length ?
                    <HorizontalScrollControlled
                        label={
                            <div className="fs-24 flex align-center gap-4 weight-500 transition-slide-right-hover-parent">
                                Games for you
                            </div>
                        }
                        maxVisibleItems={window.innerWidth < 800 ? 2 : 5}
                        items={home.recommended.map((item, i) => (
                            <GameItem key={i} item={item} />
                        ))}
                    />
                : null}
                {home?.mostPlayed?.length ?
                    <HorizontalScrollControlled
                        label={
                            <div className="fs-24 flex align-center gap-4 weight-500 transition-slide-right-hover-parent">
                                Most popular games
                            </div>
                        }
                        maxVisibleItems={window.innerWidth < 800 ? 2 : 5}
                        items={home.mostPlayed.map((item, i) => (
                            <GameItem key={i} item={item.game}/>
                        ))}
                    />
                : null}
            </div>
        }
        </>
    )
}


const SearchGames = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const [searchValue, setSearchValue] = useState(searchParams.get('s') || '')

    const { suggestions, loadingId } = useSelector((state) => state.game)
    const { searchHistory } = useSelector((state) => state.local)
    const { library } = useSelector((state) => state.library)

    useEffect(() => {
        let promise;

        if (searchValue.length > 3) {
            promise = dispatch(getSuggestions(searchValue))
        }

        return () => {
            promise?.abort()
        }
    }, [searchValue])

    const highlightText = (text, query) => {
        if (!query) {
            return text;
        }
    
        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);
    
        return parts.map((part, index) =>
            regex.test(part) ? <strong key={index} className="text-primary">{part}</strong> : part
        );
    };

    return (
        window.innerWidth < 800 ?
        <>
            <Modal
                modalIsOpen={searchParams.get('sg') === 'true'}
                closeModal={() => {
                    searchParams.delete('sg')
                    setSearchParams(searchParams.toString())
                }}
                classNameContent="p-0"
                headerNone
                noAction
            >
                <div className="border-bottom align-center flex">
                    <IconButton
                        icon={arrowLeftShortIcon}
                        variant="link"
                        size="lg"
                        type="secondary"
                        onClick={() => {
                            searchParams.delete('sg')
                            setSearchParams(searchParams.toString())
                        }}
                    />
                    <InputSearch
                        className="flex-1 py-1"
                        placeholder="What do you wanna play?"
                        value={searchValue}
                        clearable
                        autoFocus
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
                <div className="py-4">
                    {library && library
                    .filter((item) => item.game.name.toLowerCase().includes(searchValue.toLowerCase()))
                    .length > 0 ?
                    <>
                        <div className="fs-20 pb-3 bold px-3">
                            Your library
                        </div>
                        {library
                        .filter((item) => item.game.name.toLowerCase().includes(searchValue.toLowerCase()))
                        .slice(0, 10)
                        .map((searchItem, i) => (
                            <div className="flex justify-between align-center bg-secondary-hover"
                                key={i}
                            >
                                <Link
                                    key={searchItem}
                                    to={`/g/${searchItem._id}`}
                                    className="fs-14 flex align-center px-4 py-2 gap-3 pointer flex-1 overflow-hidden clickable opacity-75-active"
                                >
                                    <div className="flex gap-3 align-center">
                                        <Image
                                            img={searchItem.game.thumbnail}
                                            alt={searchItem.game.name}
                                            classNameContainer="w-set-50-px h-set-50-px border-radius-sm overflow-hidden"
                                        />
                                        <div className="flex flex-col">
                                            <div className="fs-14 weight-500 text-ellipsis-2">
                                                {highlightText(searchItem.game.name, searchValue)}
                                            </div>
                                            <div className="fs-12 text-secondary">
                                                {searchItem.game.yearPublished}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </>
                    : null}
                    {suggestions && suggestions.length > 0 ?
                    <>
                        <div className="fs-20 py-3 bold px-3">
                            Search results
                        </div>
                        {suggestions
                        .map((searchItem, i) => (
                            <div className="flex justify-between align-center bg-secondary-hover"
                                key={searchItem._id}
                            >
                                <Link
                                    key={searchItem}
                                    to={`/g/${searchItem._id}`}
                                    className="fs-14 flex align-center px-4 py-2 gap-3 pointer flex-1 overflow-hidden clickable opacity-75-active"
                                >
                                    <div className="flex gap-3 align-center">
                                        <Image
                                            img={searchItem.thumbnail}
                                            alt={searchItem.name}
                                            classNameContainer="w-set-50-px h-set-50-px border-radius-sm overflow-hidden"
                                        />
                                        <div className="flex flex-col">
                                            <div className="fs-14 weight-500 text-ellipsis-2">
                                                {highlightText(searchItem.name, searchValue)}
                                            </div>
                                            <div className="fs-12 text-secondary">
                                                {searchItem.yearPublished}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </>
                    :
                        loadingId === 'suggestions' ?
                            <ErrorInfo isLoading/>
                        :
                        library.filter((item) => item.game.name.toLowerCase().includes(searchValue.toLowerCase())).length === 0 ?
                            <ErrorInfo
                                label="No games found"
                                secondary={`Nothing matched your search for "${searchValue}"`}
                            />
                    : null}
                </div>
            </Modal>
            <div className="border border-radius-lg py-2 px-3 flex align-center gap-2 fs-12 weight-600 flex-1"
                onClick={() => {
                    searchParams.set('sg', true)
                    setSearchParams(searchParams)
                }}
            >
                <Icon
                    icon={searchIcon}
                    size="sm"
                    className="fill-secondary"
                />
                {searchValue.length ? `${searchValue}` : 'Search games'}
            </div>
            </>
        :
        <div className="border flex border-radius-lg flex-1 w-max-400-px w-100 flex-1">
        <InputSearch
            icon={searchIcon}
            className="flex-1 py-1"
            placeholder="Search games"
            value={searchValue}
            clearable
            onChange={(e) => setSearchValue(e.target.value)}
            onSubmit={() => {
                if (searchValue !== "" && !searchHistory.includes(searchValue.trim())) {
                    dispatch(setSearchHistory([...new Set([searchValue.trim(), ...searchHistory])]))
                }
            }}
            searchable={searchValue.length > 3 || searchHistory.length > 0}
            searchChildren={
                <div className="py-2">
                    {searchValue.length > 2 ?
                    <div className="flex justify-between align-center">
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                setSearchValue(searchValue)
                            }}
                            className="fs-16 flex align-center px-4 py-3 gap-3 text-secondary pointer bg-secondary-hover flex-1 overflow-hidden"
                        >
                            <Icon icon={searchIcon} className="fill-secondary"/><span className="text-ellipsis-1 text-primary">{searchValue}<span className="text-secondary"> - search games</span></span>
                        </div>
                    </div>
                    : searchParams.get('s') && searchParams.get('s').length ?
                        <div className="flex justify-between align-center">
                            <div
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSearchValue('')
                                }}
                                className="fs-16 flex align-center px-4 py-3 gap-3 text-secondary text-center pointer bg-secondary-hover flex-1 overflow-hidden"
                            >
                                <Icon icon={searchIcon} className="fill-secondary"/><span className="text-ellipsis-1">
                                    Show all</span>
                            </div>
                        </div>
                    : null}
                    {library && library
                    .filter((item) => item.game.name.toLowerCase().includes(searchValue.toLowerCase()))
                    .length > 0 ?
                    <>
                        <div className="fs-14 px-4 py-2 flex align-center gap-3 text-secondary weight-600">
                            Your library
                        </div>
                        {library
                        .filter((item) => item.game.name.toLowerCase().includes(searchValue.toLowerCase()))
                        .slice(0, 5)
                        .map((searchItem, i) => (
                            <div className="flex justify-between align-center bg-secondary-hover"
                                key={i}
                            >
                                <Link
                                    key={searchItem}
                                    to={`/g/${searchItem.game._id}`}
                                    className="fs-14 flex align-center px-4 py-2 gap-3 text-secondary pointer flex-1 overflow-hidden"
                                >
                                    <Avatar 
                                        img={searchItem.game.thumbnail}
                                        name={searchItem.game.name}
                                        rounded
                                        size="xs"
                                    />
                                    <span className="text-ellipsis-1">{searchItem.game.name}</span>
                                </Link>
                            </div>
                        ))}
                    </>
                    : null}
                    {searchHistory && searchHistory.length > 0 && searchValue.length === 0 ?
                    <>
                        <div className="fs-14 px-4 py-2 flex align-center gap-3 text-secondary weight-600">
                            Search history
                        </div>
                        {searchHistory
                        .slice(0, 5)
                        .map((searchItem, i) => (
                            <div className="flex justify-between align-center bg-secondary-hover"
                                key={i}
                            >
                                <div
                                    key={searchItem}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSearchValue(searchItem)
                                    }}
                                    className="fs-14 flex align-center px-4 py-2 gap-3 text-secondary pointer flex-1 overflow-hidden"
                                >
                                    <Icon icon={clockIcon} className="fill-secondary"/><span className="text-ellipsis-1">{searchItem}</span>
                                </div>
                                <Button
                                    label="Remove"
                                    variant="link"
                                    className="mx-3"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        dispatch(setSearchHistory(searchHistory.filter((item) => item !== searchItem)))
                                    }}
                                />
                            </div>
                        ))}
                    </>
                    : null}
                    {suggestions && suggestions.length > 0 ?
                    <>
                        <div className="fs-14 px-4 py-2 flex align-center gap-3 text-secondary weight-600">
                            Search results
                        </div>
                        {suggestions
                        .map((item, i) => (
                            <div className="flex justify-between align-center bg-secondary-hover"
                                key={i}
                            >
                                <Link
                                    key={item._id}
                                    to={`/g/${item._id}`}
                                    className="fs-14 flex align-center px-4 py-2 gap-3 text-secondary pointer flex-1 overflow-hidden"
                                >
                                    <Avatar 
                                        img={item.thumbnail}
                                        name={item.name}
                                        rounded
                                        size="xs"
                                    />
                                    <span className="text-ellipsis-1">
                                        {highlightText(item.name, searchValue)} ({item.yearPublished})
                                    </span>
                                </Link>
                            </div>
                        ))}
                    </>
                    : null}
            </div>
        }
        />
    </div>
    )
}

const UserHomepage = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { friends } = useSelector((state) => state.friend)
    const { library } = useSelector((state) => state.library)
    const [searchParams, setSearchParams] = useSearchParams()
    const { notifications } = useSelector((state) => state.notification)

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = 'Home'
    }, [])

    return (
        <div>
            <FriendsModal
                friends={friends}
            />
            <main className="page-body">
                <div className="animation-slide-in">
                    <div className="container">
                        <div className="flex pt-3 pt-sm-3 justify-between px-sm-3 pb-3 gap-3">
                            <SearchGames/>
                            <div className="justify-end flex align-center flex-no-wrap gap-3">
                                <IconButton
                                    notify
                                    notifyCount={friends?.filter((friend) => friend.pending).length}
                                    icon={usersIcon}
                                    variant="text"
                                    type="secondary"
                                    onClick={() => {
                                        searchParams.set('friends', true)
                                        setSearchParams(searchParams)
                                    }}
                                />
                                {window.innerWidth < 800 && (
                                    <>
                                        <IconButton
                                            icon={bellIcon}
                                            variant="text"
                                            type="secondary"
                                            to="/notifications"
                                            notify
                                            notifyCount={notifications.filter(notification => !notification.read).length || 1}
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
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="pb-3 px-sm-3">
                            <HorizontalScroll>
                                {typeEnum
                                .slice(0, 15)
                                .map((item, i) => (
                                    <Link
                                        key={i}
                                        to={`/discover?type=${item.type}`}
                                        className="flex justify-between transition-slide-right-hover-parent align-center transition-opacity-hover-parent gap-1 bg-secondary border-radius px-4 py-3 pointer w-set-150-px"
                                    >
                                        <div className="flex align-center gap-4">
                                            <Icon icon={item.icon} size="lg"/>
                                            <div className="fs-14 weight-500">
                                                {item.type}
                                            </div>
                                        </div>
                                        <Icon
                                            icon={rightArrowIcon}
                                            size="sm"
                                            className="transition-slide-right-hover transition-opacity-hover"
                                        />
                                    </Link>
                            ))}
                            </HorizontalScroll>
                        </div>
                        {library && library?.length > 0 ?
                            <div className="grid grid-cols-4 px-sm-3 grid-sm-cols-2 gap-3">
                                {[...library]
                                .sort((a, b) => DateTime.fromISO(b.createdAt) - DateTime.fromISO(a.createdAt))
                                .slice(0, 8)
                                .map((item) => (
                                    <div
                                        key={item._id}
                                        className="bg-secondary bg-tertiary-hover border-radius flex overflow-hidden pointer display-on-hover-parent"
                                        onClick={() => {
                                            searchParams.set('logPlay', item.game._id)
                                            setSearchParams(searchParams)
                                        }}
                                    >
                                        <Image
                                            img={item?.game?.thumbnail}
                                            classNameContainer="w-set-50-px h-set-50-px"
                                        />
                                        <div className="flex align-center pos-relative flex-1">
                                            <div className="ps-3 pe-2 fs-14 bold text-ellipsis-2 flex-1">
                                                {item?.game?.name}
                                            </div>
                                            <div className="pos-absolute flex align-center right-0 mx-2">
                                                <Icon
                                                    icon={diceIcon}
                                                    className="display-on-hover bg-main box-shadow border-radius-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        : null}
                        <HomeFeed/>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default UserHomepage