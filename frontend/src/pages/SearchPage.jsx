import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Button, Dropdown, ErrorInfo, FilterDropdown, HorizontalScroll, Icon, IconButton, Image, InputSearch, Modal, Skeleton } from '../components'
import { Link, useSearchParams } from 'react-router-dom'
import { arrowLeftShortIcon, clockIcon, closeIcon, filterIcon, gridIcon, leftArrowIcon, listIcon, searchIcon, toggleSortIcon } from '../assets/img/icons'
import { mechanicsEnum, themesEnum, typeEnum } from '../assets/constants'
import { useDispatch, useSelector } from 'react-redux'
import { getGames, getSuggestions, resetGame } from '../features/game/gameSlice'
import GameItem from './game/GameItem'
import { setSearchHistory } from '../features/local/localSlice'
import GameItemCol from './game/GameItemCol'
import { addCommaToNumber, numberFormatter } from '../assets/utils'


const SearchPage = () => {
    const dispatch = useDispatch()

    const [searchParams, setSearchParams] = useSearchParams()
    const [searchValue, setSearchValue] = useState(searchParams.get('s') || '')
    const { user } = useSelector((state) => state.auth)
    const { suggestions, loadingId } = useSelector((state) => state.game)
    const { searchHistory } = useSelector((state) => state.local)
    const [listView, setListView] = useState(window.innerWidth > 800 ? false : true)
    const [mechanicsLimit, setMechanicsLimit] = useState(10)

    const filtersCount = useMemo(() => {
        let count = 0
        if (searchParams.get('types') && searchParams.get('types') !== '') count++
        if (searchParams.get('themes') && searchParams.get('themes') !== '') count++
        if (searchParams.get('mechanics') && searchParams.get('mechanics') !== '') count++
        if (searchParams.get('players') && searchParams.get('players') !== '') count++
        if ((searchParams.get('minWeight') && searchParams.get('minWeight') !== '') || (searchParams.get('maxWeight') && searchParams.get('maxWeight') !== '')) count++
        return count
    }, [searchParams])

    const [temp, setTemp] = useState({
        types: searchParams.get('types') ? searchParams.get('types').split(',') : [],
        themes: searchParams.get('themes') ? searchParams.get('themes').split(',') : [],
        mechanics: searchParams.get('mechanics') ? searchParams.get('mechanics').split(',') : [],
        players: searchParams.get('players') || "0",
        sort: searchParams.get('sort') || 'relevance',
        sortOrder: searchParams.get('sortOrder') || 'asc',
        minWeight: searchParams.get('minWeight') || 1,
        maxWeight: searchParams.get('maxWeight') || 5,
    })

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = 'Discover Games'
    }, [])

    useEffect(() => {
        let promise;

        if (searchValue.length) {
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

    const { games, isLoading, isError, hasMore, msg } = useSelector((state) => state.game)

    const getData = () => {
        let q = '&'


        if (searchParams.get('s')) q += `s=${searchParams.get('s')}`  
        if (searchParams.get('hideInLibrary')) q += `&hideInLibrary=${searchParams.get('hideInLibrary')}`

        dispatch(getGames(q))
    }

    useEffect(() => {
        let promise;
        let q = '&'

        if (searchParams.get('s')) q += `s=${searchParams.get('s')}`  
        if (searchParams.get('hideInLibrary')) q += `&hideInLibrary=${searchParams.get('hideInLibrary')}`
        if (searchParams.get('types')) q += `&types=${searchParams.get('types')}`
        if (searchParams.get('mechanics')) q += `&mechanics=${searchParams.get('mechanics')}`
        if (searchParams.get('themes')) q += `&themes=${searchParams.get('themes')}`
        if (searchParams.get('players')) q += `&players=${searchParams.get('players')}`
        if (searchParams.get('sort')) q += `&sort=${searchParams.get('sort')}`
        if (searchParams.get('sortOrder')) q += `&sortOrder=${searchParams.get('sortOrder')}`
        if (searchParams.get('minWeight')) q += `&minWeight=${searchParams.get('minWeight')}`
        if (searchParams.get('maxWeight')) q += `&maxWeight=${searchParams.get('maxWeight')}`

        promise = dispatch(getGames(q))

        return () => {
            promise && promise.abort()
            dispatch(resetGame())
        }
    }, [searchParams.get('s'), searchParams.get('hideInLibrary'), searchParams.get('types'), searchParams.get('mechanics'), searchParams.get('themes'), searchParams.get('players'), searchParams.get('sort'), searchParams.get('sortOrder'), searchParams.get('minWeight'), searchParams.get('maxWeight')])

    const observer = useRef();
    const lastElementRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isError) {
                const promise = getData();
        
                return () => {
                    promise && promise.abort();
                    dispatch(resetGame());
                    observer.current && observer.current.disconnect();
                }
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore, isError]);


    return (
        <>
            <main className="page-body flex-1">
                <div className="animation-slide-in container flex-1 flex h-100">
                    <div className="overflow-hidden flex-1">
                        {window.innerWidth < 800 ?
                            <div className="flex py-3 justify-between px-sm-3 sticky-sm top-0 z-3 bg-main">
                                <div className="title-1 bold">
                                    Games
                                </div>
                                {user ?
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
                                : null}
                            </div>
                        : null}
                        <div className="pb-6 pt-sm-0">
                            <div className="px-4 pt-3 pt-sm-0 bg-main flex flex-col px-sm-3">
                                    {
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
                                            <div className="align-center flex">
                                                <InputSearch
                                                    className="flex-1 py-1 m-2"
                                                    placeholder="What do you wanna play?"
                                                    value={searchValue}
                                                    clearable
                                                    autoFocus
                                                    onChange={(e) => setSearchValue(e.target.value)}
                                                    onSubmit={() => { 
                                                        if (searchValue === '') searchParams.delete('s')
                                                        else searchParams.set('s', searchValue)
                                                        searchParams.delete('sg')
                                                        setSearchParams(searchParams.toString())
                                                        if (searchValue !== "" && !searchHistory.includes(searchValue.trim())) {
                                                            dispatch(setSearchHistory([...new Set([searchValue.trim(), ...searchHistory])]))
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    label="Cancel"
                                                    variant="link"
                                                    className="me-5 ms-3"
                                                    type="secondary"
                                                    onClick={() => {
                                                        searchParams.delete('sg')
                                                        setSearchParams(searchParams.toString())
                                                    }}
                                                />
                                            </div>
                                            <div className="pb-4">
                                                {searchValue.length ?
                                                <div className="flex justify-between align-center">
                                                    <div
                                                        onClick={(e) => {
                                                            setSearchValue(searchValue)
                                                            searchParams.set('s', searchValue)
                                                            searchParams.delete('sg')
                                                            if (searchValue === '') searchParams.delete('s')
                                                            setSearchParams(searchParams.toString())
                                                            if (searchValue !== "" && !searchHistory.includes(searchValue.trim())) {
                                                                dispatch(setSearchHistory([...new Set([searchValue.trim(), ...searchHistory])]))
                                                            }
                                                        }}
                                                        className="fs-16 flex align-center px-4 py-3 gap-3 text-secondary pointer bg-tertiary-hover flex-1 overflow-hidden"
                                                    >
                                                        <Icon icon={searchIcon} className="fill-secondary"/><span className="text-ellipsis-1 text-primary weight-600">{searchValue}<span className="text-secondary"> - search games</span></span>
                                                    </div>
                                                </div>
                                                : searchParams.get('s') && searchParams.get('s').length ?
                                                    <div className="flex justify-between align-center">
                                                        <div
                                                            onClick={(e) => {
                                                                setSearchValue('')
                                                                searchParams.delete('s')
                                                                searchParams.delete('sg')
                                                                setSearchParams(searchParams.toString())
                                                            }}
                                                            className="fs-16 flex align-center px-4 py-3 gap-3 text-center pointer bg-tertiary-hover flex-1 overflow-hidden weight-500"
                                                        >
                                                            <Icon icon={searchIcon} className="fill-secondary"/><span className="text-ellipsis-1">
                                                                Show all</span>
                                                        </div>
                                                    </div>
                                                : null}
                                                {searchHistory && searchHistory.length > 0 && searchValue.length === 0 ?
                                                <>
                                                    <div className="fs-14 px-4 py-2 flex align-center gap-3 text-secondary weight-600">
                                                        Search history
                                                    </div>
                                                    {searchHistory
                                                    .slice(0, 5)
                                                    .map((searchItem) => (
                                                        <div className="flex justify-between align-center bg-tertiary-hover"
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
                                                                className="fs-14 flex align-center px-4 py-2 gap-3 pointer flex-1 overflow-hidden weight-500"
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
                                                    .map((searchItem, i) => (
                                                        <div className="flex justify-between align-center bg-tertiary-hover"
                                                            key={searchItem._id}
                                                        >
                                                            <Link
                                                                key={searchItem}
                                                                to={`/g/${searchItem._id}`}
                                                                className="fs-14 flex align-center px-4 py-2 gap-3 pointer flex-1 overflow-hidden clickable opacity-75-active"
                                                            >
                                                                <div className="flex gap-3 align-center">
                                                                    <Avatar
                                                                        img={searchItem.thumbnail}
                                                                        alt={searchItem.name}
                                                                        rounded
                                                                        classNameContainer="border-none"
                                                                        size="sm"
                                                                    />
                                                                    <div className="flex flex-col">
                                                                        <div className="fs-14 weight-500 text-ellipsis-2">
                                                                            {highlightText(searchItem.name, searchValue)}
                                                                        </div>
                                                                        <div className="fs-12 text-secondary">
                                                                            {searchItem.year}
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
                                                    : null}
                                            </div>
                                            </Modal>
                                            <div className="border border-radius-lg py-2 px-3 flex align-center gap-2 fs-12 weight-600 flex-1 search-input-mobile"
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
                                    <div className="flex gap-3 align-center">
                                    <InputSearch
                                        icon={searchIcon}
                                        placeholder="Search in over 160,000 games"
                                        className="p-3 bg-secondary flex-1 py-1 border-radius-lg"
                                        classNameFocus="border-radius-bottom-none"
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
                                        searchable
                                        searchChildren={
                                            <div className="py-2">
                                                {!searchValue.length && !searchParams.get('s')?.length && !suggestions?.length && !searchHistory?.length ?
                                                <div className="px-4 py-4 text-center text-secondary fs-14">
                                                    Try searching for games by name
                                                </div>
                                                : null
                                                }
                                                {searchValue.length ?
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
                                                        className="fs-16 flex align-center px-4 py-3 gap-3 text-secondary pointer bg-tertiary-hover flex-1 overflow-hidden"
                                                    >
                                                        <Icon icon={searchIcon} className="fill-secondary"/><span className="text-ellipsis-1 text-primary weight-600">{searchValue}<span className="text-secondary"> - search games</span></span>
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
                                                            className="fs-16 flex align-center px-4 py-3 gap-3 text-center pointer bg-tertiary-hover flex-1 overflow-hidden weight-500"
                                                        >
                                                            <Icon icon={searchIcon} className="fill-secondary"/><span className="text-ellipsis-1">
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
                                                        <div className="flex justify-between align-center bg-tertiary-hover"
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
                                                                className="fs-14 flex align-center px-4 py-2 gap-3 pointer flex-1 overflow-hidden weight-500"
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
                                                    .map((item) => (
                                                        <div className="flex justify-between align-center bg-tertiary-hover"
                                                            key={item._id}
                                                        >
                                                            <Link
                                                                key={item._id}
                                                                to={`/g/${item._id}`}
                                                                className="fs-14 flex align-center px-4 py-2 gap-3 pointer flex-1 overflow-hidden"
                                                            >
                                                                <Avatar
                                                                    img={item.thumbnail}
                                                                    alt={item.name}
                                                                    rounded
                                                                    size="xs"
                                                                    classNameContainer="border-none"
                                                                />
                                                                <span className="text-ellipsis-1">
                                                                    {highlightText(item.name, searchValue)} ({item.year ? item.year : '--'})
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
                                }
                            <div className="flex flex-col overflow-hidden">
                            <div className="py-3 bg-main overflow-hidden">
                                <HorizontalScroll
                                    noControllers
                                >
                                    {filtersCount > 0 ?
                                        <Button
                                            icon={closeIcon}
                                            label={`Clear all${filtersCount ? ` (${filtersCount})` : ''}`}
                                            type="secondary"
                                            onClick={() => {
                                                searchParams.delete('types')
                                                searchParams.delete('mechanics')
                                                searchParams.delete('themes')
                                                searchParams.delete('players')
                                                searchParams.delete('minWeight')
                                                searchParams.delete('maxWeight')
                                                setSearchParams(searchParams.toString())
                                                setTemp({ types: [], mechanics: [], themes: [], players: "0" })
                                            }}
                                            className={`text-capitalize border-color-text flex-shrink-0 clickable`}
                                        />
                                    : null}
                                    <FilterDropdown
                                        label="🎲 Types"
                                        mobileDropdown
                                        applied={searchParams.get('types') ? searchParams.get('types').split(',') : []}
                                        onClear={() => {
                                            searchParams.delete('types')
                                            setSearchParams(searchParams.toString())
                                            setTemp({ ...temp, types: [] })
                                        }}
                                        onApply={() => {
                                            searchParams.set('types', temp.types.join(','))
                                            setSearchParams(searchParams.toString())
                                        }}
                                    >
                                        <div className="flex flex-wrap gap-1 w-max-400-px">
                                            {typeEnum.map((type) => (
                                                <Button
                                                    key={type.name}
                                                    onClick={() => {
                                                        if (temp.types.includes(type.name)) {
                                                            setTemp({ ...temp, types: [...temp.types.filter((t) => t !== type.name)] })
                                                        } else {
                                                            setTemp({ ...temp, types: [...temp.types, type.name] })
                                                        }
                                                    }}
                                                    borderRadius="sm"
                                                    label={<><span className="pe-2">{type.icon}</span>{type.name}</>}
                                                    variant={temp.types.includes(type.name)  ? "filled" : "outline"}
                                                    type="secondary"
                                                    className={`text-capitalize flex-auto clickable`}
                                                />
                                            ))}
                                        </div>
                                    </FilterDropdown>
                                    <FilterDropdown
                                        label="🔧 Mechanics"
                                        mobileDropdown
                                        applied={searchParams.get('mechanics') ? searchParams.get('mechanics').split(',') : []}
                                        onClear={() => {
                                            searchParams.delete('mechanics')
                                            setSearchParams(searchParams.toString())
                                            setTemp({ ...temp, mechanics: [] })
                                        }}
                                        onApply={() => {
                                            searchParams.set('mechanics', temp.mechanics.join(','))
                                            setSearchParams(searchParams.toString())
                                        }}
                                    >
                                        <div className="flex flex-wrap gap-1 w-max-400-px overflow-y-auto scrollbar-none"
                                            style={{ maxHeight: '50vh'}}
                                        >
                                            {mechanicsEnum
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .slice(0, mechanicsLimit)
                                            .map((m) => (
                                                <Button
                                                    key={m.name}
                                                    onClick={() => {
                                                        if (temp.mechanics.includes(m.name)) {
                                                            setTemp({ ...temp, mechanics: [...temp.mechanics.filter((mech) => mech !== m.name)] })
                                                        } else {
                                                            setTemp({ ...temp, mechanics: [...temp.mechanics, m.name] })
                                                        }
                                                    }}
                                                    borderRadius="sm"
                                                    label={<>{m.name}<span className="text-secondary fs-12 ms-1">{numberFormatter(m.count)}</span></>}
                                                    variant={temp.mechanics.includes(m.name) ? "filled" : "outline"}
                                                    type="secondary"
                                                    className={`text-capitalize flex-auto clickable`}
                                                />
                                            ))}
                                            {mechanicsEnum.length > mechanicsLimit ?
                                                <Button
                                                    label="Show more"
                                                    variant="default"
                                                    type="secondary"
                                                    borderRadius="sm"
                                                    onClick={() => setMechanicsLimit(mechanicsLimit + 10)}
                                                    className="flex-auto"
                                                />
                                            : null}
                                        </div>
                                    </FilterDropdown>
                                    <FilterDropdown
                                        label="🎨 Themes"
                                        mobileDropdown
                                        applied={searchParams.get('themes') ? searchParams.get('themes').split(',') : []}
                                        onClear={() => {
                                            searchParams.delete('themes')
                                            setSearchParams(searchParams.toString())
                                            setTemp({ ...temp, themes: [] })
                                        }}
                                        onApply={() => {
                                            searchParams.set('themes', temp.themes.join(','))
                                            setSearchParams(searchParams.toString())
                                        }}
                                    >
                                        <div className="flex flex-wrap gap-1 w-max-400-px">
                                            {themesEnum
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .map((theme) => (
                                                <Button
                                                    key={theme.name}
                                                    onClick={() => {
                                                        if (temp.themes.includes(theme.name)) {
                                                            console.log('temp.themes', temp.themes)
                                                            setTemp({ ...temp, themes: [...temp.themes.filter((t) => t !== theme.name)] })
                                                        } else {
                                                            setTemp({ ...temp, themes: [...temp.themes, theme.name] })
                                                        }
                                                    }}
                                                    borderRadius="sm"
                                                    label={<><span className="pe-2">{theme.icon}</span>{theme.name}</>}
                                                    variant={temp.themes.includes(theme.name) ? "filled" : "outline"}
                                                    type="secondary"
                                                    className={`text-capitalize flex-auto clickable`}
                                                />
                                            ))}
                                        </div>
                                    </FilterDropdown>
                                    <FilterDropdown
                                        label="👥 Players"
                                        mobileDropdown
                                        applied={searchParams.get('players') ? [searchParams.get('players').replaceAll('-', ' ')] : []}
                                        onClear={() => {
                                            searchParams.delete('players')
                                            setSearchParams(searchParams.toString())
                                        }}
                                        onApply={() => {
                                            searchParams.set('players', temp.players)
                                            setSearchParams(searchParams.toString())
                                        }}
                                    >
                                        <div className="flex flex-wrap w-max-400-px gap-1">
                                            {[
                                                '1-2',
                                                '2-4',
                                                '4-6',
                                                '6-8',
                                                '8+',
                                            ].map((p) => (
                                                <Button
                                                    key={p}
                                                    onClick={() => {
                                                        setTemp({ ...temp, players: p })
                                                    }}
                                                    borderRadius="sm"
                                                    label={`${p}`}
                                                    variant={temp.players?.toLocaleLowerCase() === p?.toLocaleLowerCase() ? "filled" : "outline"}
                                                    type="secondary"
                                                    className={`text-capitalize flex-auto clickable`}
                                                />
                                            ))}
                                        </div>
                                    </FilterDropdown>
                                    <FilterDropdown
                                        label="🏋️‍♂️ Complexity"
                                        mobileDropdown
                                        applied={searchParams.get('minWeight') || searchParams.get('maxWeight') ? [searchParams.get('minWeight'), searchParams.get('maxWeight')] : []}
                                        onClear={() => {
                                            searchParams.delete('minWeight')
                                            searchParams.delete('maxWeight')
                                            setSearchParams(searchParams.toString())
                                        }}
                                        onApply={() => {
                                            searchParams.set('minWeight', temp.minWeight)
                                            searchParams.set('maxWeight', temp.maxWeight)
                                            setSearchParams(searchParams.toString())
                                        }}
                                    >
                                        <div className="flex flex-wrap w-max-400-px gap-1">
                                            {[
                                                '1-2',
                                                '2-3',
                                                '3-4',
                                                '4-5',
                                            ].map((p) => (
                                                <Button
                                                    key={p}
                                                    onClick={() => {
                                                        setTemp({ ...temp, minWeight: p.split('-')[0], maxWeight: p.split('-')[1] })
                                                    }}
                                                    borderRadius="sm"
                                                    label={
                                                        <span className="flex gap-2 align-center">
                                                            <span className="fs-24">
                                                                {p.split('-')[0] == 1 ? `🤓` : p.split('-')[0] == 2 ? `🤔` : p.split('-')[0] == 3 ? `🤕` : `🤯`}
                                                            </span>
                                                            <span className="bold">
                                                                {p}
                                                            <br/>
                                                            <span className="weight-400 fs-12">
                                                                {p.split('-')[0] == 1 ? 'Easy' : p.split('-')[0] == 2 ? 'Medium' : p.split('-')[0] == 3 ? 'Heavy' : 'Extreme'}
                                                            </span>
                                                            </span>
                                                        </span>
                                                    }
                                                    variant={temp.minWeight === p.split('-')[0] && temp.maxWeight === p.split('-')[1] ? "filled" : "outline"}
                                                    type="secondary"
                                                    className="text-capitalize flex-auto clickable h-auto px-2"
                                                />
                                            ))}
                                        </div>
                                    </FilterDropdown>
                                </HorizontalScroll> 
                            </div>
                            </div>
                            </div>
                            <div className="px-4 px-sm-3 flex justify-between align-center">
                                <Dropdown
                                    label="Relevance"
                                    classNameContainer="p-0 border-none bold"
                                    widthUnset
                                    closeOnSelect
                                    customDropdown={
                                        <>
                                        <Button
                                            type="secondary"
                                            variant="link"
                                            label={
                                                <>
                                                <span className="weight-400">Sort by: </span>
                                                <strong>
                                                    {temp.sort === 'relevance' ? 'Relevance' : temp.sort === 'new-releases' ? 'Year published' : temp.sort === 'most-popular' ? 'Rating' : 'Complexity'} {temp.sortOrder === 'asc' ? '↓' : '↑'}
                                                </strong>
                                                </>
                                            }
                                        />
                                        </>
                                    }
                                >
                                    <Button
                                        borderRadius="sm"
                                        label="Relevance"
                                        className="justify-start"
                                        variant="text"
                                        onClick={() => {
                                            setTemp({ ...temp, sort: 'relevance', sortOrder: temp.sort === 'relevance' ? temp.sortOrder === 'asc' ? 'desc' : 'asc' : 'asc' })
                                            searchParams.set('sort', 'relevance')
                                            searchParams.set('sortOrder', temp.sort === 'relevance' ? temp.sortOrder === 'asc' ? 'desc' : 'asc' : 'asc')
                                            setSearchParams(searchParams.toString())
                                        }}
                                    />
                                    <Button
                                        borderRadius="sm"
                                        className="justify-start"
                                        variant="text"
                                        label={"Year published" + (temp.sort === 'new-releases' ? ` ${temp.sortOrder === 'asc' ? '↓' : '↑'}` : '')}
                                        onClick={() => {
                                            setTemp({ ...temp, sort: 'new-releases', sortOrder: temp.sort === 'new-releases' ? temp.sortOrder === 'asc' ? 'desc' : 'asc' : 'asc' })
                                            searchParams.set('sort', 'new-releases')
                                            searchParams.set('sortOrder', temp.sort === 'new-releases' ? temp.sortOrder === 'asc' ? 'desc' : 'asc' : 'asc')
                                            setSearchParams(searchParams.toString())
                                        }}
                                    />
                                    <Button
                                        borderRadius="sm"
                                        className="justify-start"
                                        variant="text"
                                        label={"Rating" + (temp.sort === 'most-popular' ? ` ${temp.sortOrder === 'asc' ? '↓' : '↑'}` : '')}
                                        onClick={() => {
                                            setTemp({ ...temp, sort: 'most-popular', sortOrder: temp.sort === 'most-popular' ? temp.sortOrder === 'asc' ? 'desc' : 'asc' : 'asc' })
                                            searchParams.set('sort', 'most-popular')
                                            searchParams.set('sortOrder', temp.sort === 'most-popular' ? temp.sortOrder === 'asc' ? 'desc' : 'asc' : 'asc')
                                            setSearchParams(searchParams.toString())
                                        }}
                                    />
                                    <Button
                                        borderRadius="sm"
                                        className="justify-start"
                                        variant="text"
                                        label={"Complexity" + (temp.sort === 'complexity' ? ` ${temp.sortOrder === 'asc' ? '↓' : '↑'}` : '')}
                                        onClick={() => {
                                            setTemp({ ...temp, sort: 'complexity', sortOrder: temp.sort === 'complexity' ? temp.sortOrder === 'asc' ? 'desc' : 'asc' : 'asc' })
                                            searchParams.set('sort', 'complexity')
                                            searchParams.set('sortOrder', temp.sort === 'complexity' ? temp.sortOrder === 'asc' ? 'desc' : 'asc' : 'asc')
                                            setSearchParams(searchParams.toString())
                                        }}
                                    />
                                </Dropdown>
                                <IconButton
                                    icon={listView ? listIcon : gridIcon}
                                    onClick={() => setListView(!listView)}
                                    className="border-radius"
                                    variant="secondary"
                                    type="text"
                                    muted
                                    dataTooltipContent={listView ? "List view" : "Grid view"}
                                />
                            </div>
                            <div className="px-2 px-sm-0">
                                {msg === 'No games found' || (games.length === 0 && !isLoading) ?
                                    <div className="mx-sm-3 my-3">
                                        <ErrorInfo
                                            label="No games found"
                                            secondary='Unfortunately I could not find any results matching your search.'
                                        />
                                    </div>
                                :
                                <>
                                {listView ?
                                    <div className="flex flex-col">
                                        {games.map((i, inx, arr) => (
                                            <div
                                                ref={inx === arr.length - 1 ? lastElementRef : null}
                                                key={i._id}
                                            >
                                                <GameItemCol
                                                    key={i._id}
                                                    item={i}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                :
                                    <div className="grid flex-wrap animation-slide-in h-fit-content grid-xl-cols-5 grid-lg-cols-4 grid-md-cols-3 grid-sm-cols-2 grid-cols-4">
                                        {games.map((i, inx, arr) => (
                                            <div
                                                ref={inx === arr.length - 1 ? lastElementRef : null}
                                                key={i._id}
                                            >
                                            <GameItem
                                                    item={i}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                }
                                </>}
                                {isLoading && games.length === 0 ?
                                listView ?
                                    <div className="flex flex-col p-sm-2">
                                        {[...Array(5)].map((i, inx) => (
                                            <div
                                                key={inx}
                                                className="border-bottom mb-4 pb-4"
                                            >
                                                <Skeleton
                                                    key={inx}
                                                    height={92}
                                                    className="mb-3"
                                                    animation="wave"
                                                />
                                                <HorizontalScroll>
                                                    <Skeleton
                                                        height={40}
                                                        width={100}
                                                        animation="wave"
                                                    />
                                                    <Skeleton
                                                        height={40}
                                                        width={100}
                                                        animation="wave"
                                                    />
                                                    <Skeleton
                                                        height={40}
                                                        width={100}
                                                        animation="wave"
                                                    />
                                                    <Skeleton
                                                        height={40}
                                                        width={100}
                                                        animation="wave"
                                                    />
                                                </HorizontalScroll>
                                            </div>
                                        ))}
                                    </div>
                                : 
                                    <div className="grid flex-wrap animation-slide-in h-fit-content grid-xl-cols-5 grid-lg-cols-4 grid-md-cols-3 grid-sm-cols-2 grid-cols-4">
                                        {[...Array(20)].map((i, inx) => (
                                            <div
                                                key={inx}
                                                className="m-2"
                                            >
                                                <Skeleton
                                                    height={248}
                                                    animation="wave"
                                                />
                                                <Skeleton
                                                    height={15}
                                                    width="50"
                                                    className="mt-2"
                                                    animation="wave"
                                                />
                                                <Skeleton
                                                    className="mt-1"
                                                    height={20}
                                                    animation="wave"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                : isLoading ?
                                    <ErrorInfo isLoading/>
                                : null}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default SearchPage