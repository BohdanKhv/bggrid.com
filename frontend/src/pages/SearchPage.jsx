import React, { useEffect, useMemo, useState } from 'react'
import { Button, Dropdown, ErrorInfo, FilterDropdown, HorizontalScroll, IconButton, Image, InputSearch, Modal } from '../components'
import { useSearchParams } from 'react-router-dom'
import { closeIcon, filterIcon, searchIcon, toggleSortIcon } from '../assets/img/icons'
import { categoriesEnum, typeEnum } from '../assets/constants'
import { useDispatch, useSelector } from 'react-redux'
import { getGames } from '../features/game/gameSlice'
import GameItem from './game/GameItem'


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
            <div className="grid grid-cols-4 grid-md-cols-3 grid-sm-cols-2 flex-wrap animation-slide-in h-fit-content gap-4">
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
                        <div className="pt-6 pb-3 title-1 bold px-sm-2">
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