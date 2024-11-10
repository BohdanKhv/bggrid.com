import React, { useMemo, useState } from 'react'
import { Button, FilterDropdown, HorizontalScroll, IconButton, InputSearch, Modal } from '../components'
import { useSearchParams } from 'react-router-dom'
import { closeIcon, searchIcon, toggleSortIcon } from '../assets/img/icons'
import { categoriesEnum, typeEnum } from '../assets/constants'

const SearchPage = () => {

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
                                className="mt-2"
                            >
                                <Button
                                    icon={toggleSortIcon}
                                    variant="default"
                                    label={filtersCount > 0 ? `Filters (${filtersCount})` : undefined}
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
                                                className={`text-capitalize justify-start clickable${temp.type?.toLocaleLowerCase() === type.type?.toLocaleLowerCase() ? " border-color-text" : ""}`}
                                                type="primary"
                                            />
                                        ))}
                                    </div>
                                </FilterDropdown>
                            </HorizontalScroll>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SearchPage