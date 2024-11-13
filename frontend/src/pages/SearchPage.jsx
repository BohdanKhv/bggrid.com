import React, { useEffect, useMemo, useState } from 'react'
import { Button, Dropdown, ErrorInfo, FilterDropdown, HorizontalScroll, Icon, IconButton, Image, InputSearch, Modal } from '../components'
import { Link, useSearchParams } from 'react-router-dom'
import { clockIcon, closeIcon, filterIcon, searchIcon, toggleSortIcon } from '../assets/img/icons'
import { categoriesEnum, typeEnum } from '../assets/constants'
import { useDispatch, useSelector } from 'react-redux'
import { getGames, getSuggestions } from '../features/game/gameSlice'
import GameItem from './game/GameItem'
import { setSearchHistory } from '../features/local/localSlice'


const Items = () => {
    const { games, isLoading, loadingId, msg } = useSelector((state) => state.game)

    return (
        isLoading ?
            <ErrorInfo isLoading/>
        : msg === 'No games found' ?
            <ErrorInfo
                label="No results found"
                secondary='Unfortunately I could not find any results matching your search.'
            />
        :
        <>
            <div className="flex gap-2 pb-4 align-center flex-1">
                <div className="fs-14 text-secondary weight-500">
                    Sort by:
                </div>
                <Dropdown
                    label="Relevance"
                    classNameContainer="p-0 border-none bold"
                    widthUnset
                    customDropdown={
                        <>
                        <Button
                            type="secondary"
                            variant="link"
                            label="Alphabetical"
                        />
                        </>
                    }
                >
                    <Button
                        borderRadius="sm"
                        label="Relevance"
                        className="justify-start"
                        variant="text"
                    />
                    <Button
                        borderRadius="sm"
                        className="justify-start"
                        variant="text"
                        label="New Releases"
                    />
                    <Button
                        borderRadius="sm"
                        className="justify-start"
                        variant="text"
                        label="Most Popular"
                    />
                    <Button
                        borderRadius="sm"
                        className="justify-start"
                        variant="text"
                        label="Relevance"
                    />
                </Dropdown>
            </div>
            <div className="grid flex-wrap animation-slide-in h-fit-content gap-4 grid-xl-cols-5 grid-lg-cols-4 grid-md-cols-3 grid-sm-cols-2 grid-cols-5">
                {games.map((i) => (
                    <GameItem
                        key={i._id}
                        item={i}
                    />
                ))}
            </div>
        </>
    )
}

const SearchPage = () => {
    const dispatch = useDispatch()

    const [searchParams, setSearchParams] = useSearchParams()
    const [searchValue, setSearchValue] = useState(searchParams.get('s') || '')
    const { suggestions } = useSelector((state) => state.game)
    const { searchHistory } = useSelector((state) => state.local)

    const filtersCount = useMemo(() => {
        let count = 0
        if (searchParams.get('type') && searchParams.get('type') !== '') count++
        if (searchParams.get('themes') && searchParams.get('themes') !== '') count++
        if (searchParams.get('mechanics') && searchParams.get('mechanics') !== '') count++
        return count
    }, [searchParams])

    const [temp, setTemp] = useState({
        type: '',
        themes: [],
        mechanics: [],
    })

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = 'Search Games'
    }, [])

    useEffect(() => {
        let promise;
        let q = '?'

        if (searchParams.get('s')) q += `s=${searchParams.get('s')}`  

        promise = dispatch(getGames(q))

        return () => {
            promise && promise.abort()
        }
    }, [searchParams.get('s')])

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
        <div>
            <main className="page-body">
                <div className="animation-slide-in">
                    <div className="container">
                        <div className="pt-6 pb-3 title-1 bold px-sm-2">
                            Search Games
                        </div>
                        <div className="pb-6 pt-5 pt-sm-0 px-sm-3">
                            <div className="flex flex-col gap-3">
                                <div className="border flex border-radius-lg flex-1 w-max-400-px">
                                    <InputSearch
                                        className="flex-1 py-1"
                                        placeholder="Search"
                                        value={searchValue}
                                        clearable
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        autoFocus
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
                                                    .slice(0, searchHistory ? searchHistory.length : 3)
                                                    .map((searchItem) => (
                                                        <div className="flex justify-between align-center bg-secondary-hover">
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
                                                                onClick={() => {
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
                                                        <div className="flex justify-between align-center bg-secondary-hover">
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
                                    <Button
                                        icon={searchIcon}
                                        variant="filled"
                                        type="primary"
                                        className="m-1"
                                        onClick={() => {
                                            if (searchValue === '') searchParams.delete('s')
                                            else searchParams.set('s', searchValue)
                                            setSearchParams(searchParams.toString())
                                            if (searchValue !== "" && !searchHistory.includes(searchValue.trim())) {
                                                dispatch(setSearchHistory([...new Set([searchValue.trim(), ...searchHistory])]))
                                            }
                                        }}
                                    />
                                </div>
                                <HorizontalScroll
                                    noControllers
                                >
                                    <Button
                                        icon={filterIcon}
                                        variant="default"
                                        label={filtersCount > 0 ? `Filters (${filtersCount})` : `Filters`}
                                        className={`flex-shrink-0${filtersCount > 0 ? ' border-color-text' : ''}`}
                                        muted={searchParams?.toString() === ''}
                                        type="secondary"
                                        onClick={() => setOpen(true)}
                                    />
                                    <FilterDropdown
                                        label="Types"
                                        mobileDropdown
                                        applied={searchParams.get('type') ? [searchParams.get('type').replaceAll('-', ' ')] : []}
                                        onClear={() => {
                                            searchParams.delete('type')
                                            setSearchParams(searchParams.toString())
                                        }}
                                        onApply={() => {
                                            searchParams.set('type', temp.type)
                                            setSearchParams(searchParams.toString())
                                        }}
                                    >
                                        <div className="grid grid-cols-2 gap-2">
                                            {typeEnum.map((type) => (
                                                <Button
                                                    key={type.type}
                                                    onClick={() => {
                                                        setTemp({ ...temp, type: type.type })
                                                    }}
                                                    smSize="lg"
                                                    label={`${type.icon} ${type.type}`}
                                                    variant={temp.type?.toLocaleLowerCase() === type.type?.toLocaleLowerCase() ? "filled" : "outline"}
                                                    type="primary"
                                                    className={`text-capitalize justify-start clickable`}
                                                />
                                            ))}
                                        </div>
                                    </FilterDropdown>
                                </HorizontalScroll>
                            </div>
                            <div className="pt-4">
                                <Items />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SearchPage