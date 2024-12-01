import { useEffect, useState } from 'react'
import { Avatar, Button, ErrorInfo, Icon, IconButton, Image, InputSearch, Modal } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { arrowLeftShortIcon, bellIcon, clockIcon, diceIcon, searchIcon, usersIcon } from '../assets/img/icons'
import { getSuggestions } from '../features/game/gameSlice'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { setSearchHistory } from '../features/local/localSlice'
import FriendsModal from './friend/FriendsModal'


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
                                            notifyCount={notifications.filter(notification => !notification.read).length || ""}
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
                    </div>
                </div>
            </main>
        </div>
    )
}

export default UserHomepage