import { useEffect, useState } from 'react'
import { Avatar, Button, Icon, IconButton, Image, InputSearch } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { clockIcon, diceIcon, searchIcon, usersIcon } from '../assets/img/icons'
import { getSuggestions } from '../features/game/gameSlice'
import { useSearchParams } from 'react-router-dom'
import { setSearchHistory } from '../features/local/localSlice'
import FriendsModal from './friend/FriendsModal'


const SearchGames = () => {
    const dispatch = useDispatch()

    const [searchParams, setSearchParams] = useSearchParams()
    const [searchValue, setSearchValue] = useState(searchParams.get('s') || '')

    const { suggestions } = useSelector((state) => state.game)
    const { searchHistory } = useSelector((state) => state.local)

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

        <div className="border flex border-radius-lg flex-1 w-max-400-px w-100 flex-1">
        <InputSearch
            icon={searchIcon}
            className="flex-1 py-1"
            placeholder="Search games"
            value={searchValue}
            clearable
            onChange={(e) => setSearchValue(e.target.value)}
            onSubmit={() => {
                if (searchValue === '') searchParams.delete('s')
                else searchParams.set('s', searchValue)
                setSearchParams(searchParams.toString())
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
                                setSearchValue(searchValue)
                                searchParams.set('s', searchValue)
                                if (searchValue === '') searchParams.delete('s')
                                setSearchParams(searchParams.toString())
                                if (searchValue !== "" && !searchHistory.includes(searchValue.trim())) {
                                    dispatch(setSearchHistory([...new Set([searchValue.trim(), ...searchHistory])]))
                                }
                            }}
                            className="fs-16 flex align-center px-4 py-3 gap-3 text-secondary pointer bg-secondary-hover flex-1 overflow-hidden"
                        >
                            <Icon icon={searchIcon}/><span className="text-ellipsis-1 text-primary">{searchValue}<span className="text-secondary"> - search games</span></span>
                        </div>
                    </div>
                    : searchParams.get('s') && searchParams.get('s').length ?
                        <div className="flex justify-between align-center">
                            <div
                                onClick={(e) => {
                                    setSearchValue('')
                                    searchParams.delete('s')
                                    setSearchParams(searchParams.toString())
                                }}
                                className="fs-16 flex align-center px-4 py-3 gap-3 text-secondary text-center pointer bg-secondary-hover flex-1 overflow-hidden"
                            >
                                <Icon icon={searchIcon}/><span className="text-ellipsis-1">
                                    Show all</span>
                            </div>
                        </div>
                    : null}
                    {searchHistory && searchHistory.length > 0 ?
                    <>
                        <div className="fs-14 px-4 py-2 flex align-center gap-3 text-secondary weight-600">
                            Search history
                        </div>
                        {searchHistory
                        .slice(0, 5)
                        .map((searchItem) => (
                            <div className="flex justify-between align-center bg-secondary-hover"
                                key={searchItem}
                            >
                                <div
                                    key={searchItem}
                                    onClick={(e) => {
                                        setSearchValue(searchItem)
                                        searchParams.set('s', searchItem)
                                        if (searchItem === '') searchParams.delete('s')
                                        setSearchParams(searchParams.toString())
                                    }}
                                    className="fs-14 flex align-center px-4 py-2 gap-3 text-secondary pointer flex-1 overflow-hidden"
                                >
                                    <Icon icon={clockIcon}/><span className="text-ellipsis-1">{searchItem}</span>
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
                            Search history
                        </div>
                        {suggestions
                        .map((item) => (
                            <div className="flex justify-between align-center bg-secondary-hover"
                                key={item._id}
                            >
                                <div
                                    key={item._id}
                                    onClick={(e) => {
                                        setSearchValue(item.name)
                                        searchParams.set('s', item.name)
                                        if (item.name === '') searchParams.delete('s')
                                        setSearchParams(searchParams.toString())
                                        if (item.name !== "" && !searchHistory.includes(item.name.trim())) {
                                            dispatch(setSearchHistory([...new Set([item.name.trim(), ...searchHistory])]))
                                        }
                                    }}
                                    className="fs-14 flex align-center px-4 py-2 gap-3 text-secondary pointer flex-1 overflow-hidden"
                                >
                                    <Icon icon={searchIcon}/><span className="text-ellipsis-1">
                                        {highlightText(item.name, searchValue)} ({item.yearPublished})
                                    </span>
                                </div>
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
                        <div className="flex pt-3 pt-sm-3 justify-between px-sm-3 pb-3">
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
                                )}
                            </div>
                        </div>
                        {library && library?.length > 0 ?
                            <div className="grid grid-cols-4 grid-cols-sm-2 gap-3">
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