import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Button, Dropdown, ErrorInfo, FilterDropdown, HorizontalScroll, Icon, IconButton, Image, InputSearch, Modal } from '../components'
import { Link, useSearchParams } from 'react-router-dom'
import { arrowLeftShortIcon, clockIcon, closeIcon, filterIcon, gridIcon, listIcon, searchIcon, toggleSortIcon } from '../assets/img/icons'
import { mechanicsEnum, themesEnum, typeEnum } from '../assets/constants'
import { useDispatch, useSelector } from 'react-redux'
import { getGames, getSuggestions, resetGame } from '../features/game/gameSlice'
import GameItem from './game/GameItem'
import { setSearchHistory } from '../features/local/localSlice'
import GameItemCol from './game/GameItemCol'


const SearchPage = () => {
    const dispatch = useDispatch()

    const [searchParams, setSearchParams] = useSearchParams()
    const [searchValue, setSearchValue] = useState(searchParams.get('s') || '')
    const { suggestions, loadingId } = useSelector((state) => state.game)
    const { searchHistory } = useSelector((state) => state.local)
    const [listView, setListView] = useState(true)

    const filtersCount = useMemo(() => {
        let count = 0
        if (searchParams.get('type') && searchParams.get('type') !== '') count++
        if (searchParams.get('themes') && searchParams.get('themes') !== '') count++
        if (searchParams.get('mechanics') && searchParams.get('mechanics') !== '') count++
        if (searchParams.get('players') && searchParams.get('players') !== '') count++
        return count
    }, [searchParams])

    const [temp, setTemp] = useState({
        type: [],
        themes: [],
        mechanics: [],
        players: "0",
        sort: 'relevance',
        sortOrder: 'asc'
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

        promise = dispatch(getGames(q))

        return () => {
            promise && promise.abort()
            dispatch(resetGame())
        }
    }, [searchParams.get('s'), searchParams.get('hideInLibrary')])

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
        <div>
            <main className="page-body">
                <div className="animation-slide-in">
                    <div className="container">
                        {window.innerWidth < 800 ?
                        <div className="pt-6 pb-3 pt-sm-3 title-1 bold px-sm-3">
                            Discover Games
                        </div>
                        : null}
                        <div className="pb-6 pt-3 pt-sm-0">
                            <div className="flex flex-col gap-3 px-sm-3">
                                <div className="border flex border-radius-lg flex-1 w-max-400-px">
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
                                                        className="fs-16 flex align-center px-4 py-3 gap-3 text-secondary pointer bg-secondary-hover flex-1 overflow-hidden"
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
                                                            className="fs-16 flex align-center px-4 py-3 gap-3 text-center pointer bg-secondary-hover flex-1 overflow-hidden weight-500"
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
                                                        <div className="flex justify-between align-center bg-secondary-hover"
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
                                        searchable={searchValue.length || searchHistory.length > 0}
                                        searchChildren={
                                            <div className="py-2">
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
                                                        className="fs-16 flex align-center px-4 py-3 gap-3 text-secondary pointer bg-secondary-hover flex-1 overflow-hidden"
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
                                                            className="fs-16 flex align-center px-4 py-3 gap-3 text-center pointer bg-secondary-hover flex-1 overflow-hidden weight-500"
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
                                                        <div className="flex justify-between align-center bg-secondary-hover"
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
                                                                    {highlightText(item.name, searchValue)} ({item.year})
                                                                </span>
                                                            </Link>
                                                        </div>
                                                    ))}
                                                </>
                                                : null}
                                        </div>
                                    }
                                    />
                                }
                                </div>
                            </div>
                            <div className="py-3 top-0 z-3 sticky px-sm-3 bg-main">
                                <HorizontalScroll
                                    noControllers
                                >
                                    {filtersCount > 0 ?
                                        <Button
                                            icon={closeIcon}
                                            label={`Clear all${filtersCount ? ` (${filtersCount})` : ''}`}
                                            className="flex-shrink-0 border-color-text"
                                            type="secondary"
                                            onClick={() => {
                                                searchParams.delete('type')
                                                searchParams.delete('mechanics')
                                                searchParams.delete('themes')
                                                searchParams.delete('players')
                                                setSearchParams(searchParams.toString())
                                                setTemp({ type: [], mechanics: [], themes: [], players: "0" })
                                            }}
                                        />
                                    : null}
                                    {/* <Button
                                        icon={filterIcon}
                                        variant="default"
                                        label={filtersCount > 0 ? `Filters (${filtersCount})` : `Filters`}
                                        className={`flex-shrink-0${filtersCount > 0 ? ' border-color-text' : ''}`}
                                        muted={searchParams?.toString() === ''}
                                        type="secondary"
                                        onClick={() => setOpen(true)}
                                    /> */}
                                    <Button
                                        label="Hide in Library"
                                        variant={searchParams.get('hideInLibrary') ? "filled" : "default"}
                                        onClick={() => {
                                            if (searchParams.get('hideInLibrary')) {
                                                searchParams.delete('hideInLibrary')
                                            } else {
                                                searchParams.set('hideInLibrary', 'true')
                                            }
                                            setSearchParams(searchParams.toString())
                                        }}
                                        className="flex-shrink-0"
                                        type="secondary"
                                    />
                                    <FilterDropdown
                                        label="Types"
                                        mobileDropdown
                                        applied={searchParams.get('type') ? searchParams.get('type').split(',') : []}
                                        onClear={() => {
                                            searchParams.delete('type')
                                            setSearchParams(searchParams.toString())
                                            setTemp({ ...temp, type: [] })
                                        }}
                                        onApply={() => {
                                            searchParams.set('type', temp.type.join(','))
                                            setSearchParams(searchParams.toString())
                                        }}
                                    >
                                        <div className="flex flex-col gap-1">
                                            {typeEnum.map((type) => (
                                                <Button
                                                    key={type.name}
                                                    onClick={() => {
                                                        if (temp.type.includes(type.name)) {
                                                            setTemp({ ...temp, type: temp.type.filter((t) => t !== type.name) })
                                                        } else {
                                                            setTemp({ ...temp, type: [...temp.type, type.name] })
                                                        }
                                                    }}
                                                    size="sm"
                                                    borderRadius="sm"
                                                    label={<><span className="pe-2">{type.icon}</span>{type.name}</>}
                                                    variant={temp.type.includes(type.name)  ? "filled" : "outline"}
                                                    type="secondary"
                                                    className={`text-capitalize justify-start clickable`}
                                                />
                                            ))}
                                        </div>
                                    </FilterDropdown>
                                    <FilterDropdown
                                        label="Mechanics"
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
                                        <div className="flex flex-wrap gap-1 w-max-300-px">
                                            {mechanicsEnum.map((m) => (
                                                <Button
                                                    key={m.name}
                                                    onClick={() => {
                                                        if (temp.mechanics.includes(m.name)) {
                                                            setTemp({ ...temp, mechanics: temp.mechanics.filter((mech) => mech !== m.name) })
                                                        } else {
                                                            setTemp({ ...temp, mechanics: [...temp.mechanics, m.name] })
                                                        }
                                                    }}
                                                    size="sm"
                                                    borderRadius="sm"
                                                    label={<><span className="pe-2">{m.icon}</span>{m.name}</>}
                                                    variant={temp.mechanics.includes(m.name) ? "filled" : "outline"}
                                                    type="secondary"
                                                    className={`text-capitalize justify-start clickable`}
                                                />
                                            ))}
                                        </div>
                                    </FilterDropdown>
                                    <FilterDropdown
                                        label="Themes"
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
                                        <div className="flex flex-wrap gap-1 w-max-300-px">
                                            {themesEnum.map((theme) => (
                                                <Button
                                                    key={theme.name}
                                                    onClick={() => {
                                                        if (temp.themes.includes(theme.name)) {
                                                            setTemp({ ...temp, themes: temp.themes.filter((theme) => theme !== theme.name) })
                                                        } else {
                                                            setTemp({ ...temp, themes: [...temp.themes, theme.name] })
                                                        }
                                                    }}
                                                    size="sm"
                                                    borderRadius="sm"
                                                    label={<><span className="pe-2">{theme.icon}</span>{theme.name}</>}
                                                    variant={temp.themes.includes(theme.name) ? "filled" : "outline"}
                                                    type="secondary"
                                                    className={`text-capitalize justify-start clickable`}
                                                />
                                            ))}
                                        </div>
                                    </FilterDropdown>
                                    <FilterDropdown
                                        label="Players"
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
                                        <div className="grid grid-cols-2 gap-2">
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
                                                    smSize="lg"
                                                    label={`${p}`}
                                                    variant={temp.players?.toLocaleLowerCase() === p?.toLocaleLowerCase() ? "filled" : "outline"}
                                                    type="secondary"
                                                    className={`text-capitalize justify-start clickable`}
                                                />
                                            ))}
                                        </div>
                                    </FilterDropdown>
                                </HorizontalScroll> 
                            </div>
                            <div className="px-sm-3 flex justify-between align-center">
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
                                                <strong>Relevance</strong>
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
                                            searchParams.set('sort', 'relevance')
                                            setSearchParams(searchParams.toString())
                                            setTemp({ ...temp, sort: 'relevance', sortOrder: temp.sort === 'relevance' ? temp.sortOrder === 'asc' ? 'desc' : 'asc' : 'asc' })
                                        }}
                                    />
                                    <Button
                                        borderRadius="sm"
                                        className="justify-start"
                                        variant="text"
                                        label={"New Releases" + (temp.sort === 'new-releases' ? ` ${temp.sortOrder === 'asc' ? '↓' : '↑'}` : '')}
                                        onClick={() => {
                                            searchParams.set('sort', 'new-releases')
                                            setSearchParams(searchParams.toString())
                                            setTemp({ ...temp, sort: 'new-releases', sortOrder: temp.sort === 'new-releases' ? temp.sortOrder === 'asc' ? 'desc' : 'asc' : 'asc' })
                                        }}
                                    />
                                    <Button
                                        borderRadius="sm"
                                        className="justify-start"
                                        variant="text"
                                        label={"Most Popular" + (temp.sort === 'most-popular' ? ` ${temp.sortOrder === 'asc' ? '↓' : '↑'}` : '')}
                                        onClick={() => {
                                            searchParams.set('sort', 'most-popular')
                                            setSearchParams(searchParams.toString())
                                            setTemp({ ...temp, sort: 'most-popular', sortOrder: temp.sort === 'most-popular' ? temp.sortOrder === 'asc' ? 'desc' : 'asc' : 'asc' })
                                        }}
                                    />
                                    <Button
                                        borderRadius="sm"
                                        className="justify-start"
                                        variant="text"
                                        label={"Complexity" + (temp.sort === 'complexity' ? ` ${temp.sortOrder === 'asc' ? '↓' : '↑'}` : '')}
                                        onClick={() => {
                                            searchParams.set('sort', 'complexity')
                                            setSearchParams(searchParams.toString())
                                            setTemp({ ...temp, sort: 'complexity', sortOrder: temp.sort === 'complexity' ? temp.sortOrder === 'asc' ? 'desc' : 'asc' : 'asc' })
                                        }}
                                    />
                                </Dropdown>
                                <IconButton
                                    icon={listView ? listIcon : gridIcon}
                                    onClick={() => setListView(!listView)}
                                    className="border-radius"
                                    variant="secondary"
                                    type="text"
                                    dataTooltipContent={listView ? "List view" : "Grid view"}
                                />
                            </div>
                            <div>
                                {msg === 'No games found' ?
                                    <ErrorInfo
                                        label="No results found"
                                        secondary='Unfortunately I could not find any results matching your search.'
                                    />
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
                                {isLoading ?
                                    <ErrorInfo isLoading/>
                                : null}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SearchPage