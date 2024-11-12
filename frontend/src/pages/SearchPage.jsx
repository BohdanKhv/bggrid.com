import React, { useEffect, useMemo, useState } from 'react'
import { Button, Dropdown, ErrorInfo, FilterDropdown, HorizontalScroll, IconButton, InputSearch, Modal } from '../components'
import { useSearchParams } from 'react-router-dom'
import { closeIcon, filterIcon, searchIcon, toggleSortIcon } from '../assets/img/icons'
import { categoriesEnum, typeEnum } from '../assets/constants'
import { useDispatch, useSelector } from 'react-redux'
import { getGames } from '../features/game/gameSlice'

const ItemCard = ({item}) => {
    return (
        <div className="flex flex-col pointer border-radius transition-duration h-100">
            <div className="border-radius bg-secondary h-100 w-100 bg-hover-after flex-1">
                <img src={item.thumbnail} alt="Game Thumbnail" className="w-100 h-100 object-cover border-radius" />
            </div>
            <div className="flex flex-col gap-1 pb-4">
                <div className="bold text-secondary fs-12 px-2 pt-2">{item.YearPublished}</div>
                <div className="fs-16 px-2 weight-600 text-ellipsis-2">{item.Name}</div>
                <div className="fs-14 px-2 text-ellipsis-2">
                    {item.Description}
                </div>
            </div>
        </div>
    )
}

const Items = () => {
    const { games, isLoading, loadingId, msg } = useSelector((state) => state.game)

    return (
        isLoading ?
            <ErrorInfo isLoading/>
        : msg === 'No games found' ?
            <ErrorInfo
                label="No games found"
                secondary={`Nothing matched your search.`}
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
                        <Button
                            type="secondary"
                            variant="link"
                            label="Relevance"
                        />
                    }
                >
                    <Button
                        borderRadius="sm"
                        label="Relevance"
                        variant="text"
                    />
                </Dropdown>
            </div>
            <div className="grid grid-cols-3 flex-wrap animation-slide-in h-fit-content gap-4">
                {games.map((i) => (
                    <div
                        key={i}
                        className="h-100"
                    >
                        <ItemCard
                            item={i}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}

const SearchPage = () => {
    const dispatch = useDispatch()

    const [searchParams, setSearchParams] = useSearchParams()
    const [searchValue, setSearchValue] = useState('')

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
        const promise = dispatch(getGames())

        window.scrollTo(0, 0)
        document.title = 'Search Games'

        return () => {
            promise.abort()
        }
    }, [])

    return (
        <div>
            <main className="page-body">
                <div className="animation-slide-in">
                    <div className="container">
                        <div className="py-3 title-1 bold px-sm-2">
                            Search Games
                        </div>
                        <div className="pb-6 pt-5 pt-sm-0 px-sm-3">
                            <div className="border border-radius-lg">
                                <InputSearch
                                    icon={searchIcon}
                                    placeholder="Search Games"
                                    value={searchValue}
                                    clearable
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <HorizontalScroll
                                noControllers
                                className="mt-4"
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
                                                variant="outline"
                                                className={`text-capitalize justify-start clickable${temp.type?.toLocaleLowerCase() === type.type?.toLocaleLowerCase() ? " border-color-text outline outline-text outline-w-3" : ""}`}
                                                type="primary"
                                            />
                                        ))}
                                    </div>
                                </FilterDropdown>
                            </HorizontalScroll>
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