import React, { useState } from 'react'
import { Button, Collapse, Dropdown, Icon, InputSearch, TabContent } from '../components'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { checkIcon, searchIcon } from '../assets/img/icons'
import { categoriesEnum, mechanicsEnum } from '../assets/constants'

const ItemCard = () => {
    return (
        <div className="flex flex-col pointer border-radius transition-duration">
            <div className="border-radius bg-secondary h-100 w-100 bg-hover-after h-min-200-px">
                <img src="https://via.placeholder.com/300" alt="Game Thumbnail" className="w-100 h-auto object-cover border-radius" />
            </div>
            <div className="flex flex-col gap-1">
                <div className="bold text-secondary fs-12 px-2 pt-2">Publisher</div>
                <div className="fs-16 px-2 weight-600 text-ellipsis-2">Game Title</div>
                <div className="fs-14 px-2 text-ellipsis-2">Game Description</div>
            </div>
        </div>
    )
}

const Items = () => {
    const { games, isLoading, loadingId, msg } = useSelector((state) => state.game)

    return (
        <div className="grid grid-cols-5 flex-wrap animation-slide-in h-fit-content gap-4">
            {[...Array(10).keys()].map((i) => (
                <div
                    key={i}
                >
                    <ItemCard
                        item={i}
                    />
                </div>
            ))}
        </div>
    )
}

const Filters = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const [tempSearch, setTempSearch] = useState({
        catSearch: '',
    })

    return (
        <div className="flex flex-col gap-3 w-min-300-px">
            <div className="fs-20 bold">Filters</div>
            <div className="flex flex-col">
                <div className="border-bottom"/>
                    <Collapse
                        classNameContainer="p-3 opacity-75 hover-opacity-100"
                        customLabel={
                            <div className="flex flex-col">
                                <div className="fs-16 weight-600">
                                    Categories
                                </div>
                            </div>
                        }
                    >
                        <div className="flex flex-col gap-1 flex-wrap gap-2 px-sm-2">
                            {categoriesEnum
                            .map((cat) => (
                                <div
                                    key={cat}
                                    onClick={() => {
                                        if (searchParams.get('category')?.toLocaleLowerCase() === cat.toLocaleLowerCase()) {
                                            searchParams.delete('category')
                                            setSearchParams(searchParams)
                                        } else {
                                            searchParams.set('category', cat)
                                            setSearchParams(searchParams)
                                        }
                                    }}
                                    className={`p-3 flex overflow-hidden border-radius pointer bg-secondary-hover weight-600 fs-14 transition-duration${searchParams.get('category')?.toLocaleLowerCase() === cat?.toLocaleLowerCase() ? " bg-secondary" : " opacity-75 hover-opacity-100"}`}
                                >
                                    <div className="text-ellipsis-1 flex-grow-1 gap-2">
                                        {cat}
                                    </div>
                                    {searchParams.get('category')?.toLocaleLowerCase() === cat?.toLocaleLowerCase() ? (
                                        <Icon
                                            icon={checkIcon}
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </Collapse>
                    <div className="border-bottom"/>
                    <Collapse
                        classNameContainer="p-3 opacity-75 hover-opacity-100"
                        customLabel={
                            <div className="flex flex-col">
                                <div className="fs-16 weight-600">
                                    Mechanics
                                </div>
                            </div>
                        }
                    >
                        <div className="flex flex-col gap-1 flex-wrap gap-2 px-sm-2">
                            {mechanicsEnum
                            .map((cat) => (
                                <div
                                    key={cat}
                                    onClick={() => {
                                        if (searchParams.get('mechanics')?.toLocaleLowerCase() === cat.toLocaleLowerCase()) {
                                            searchParams.delete('mechanics')
                                            setSearchParams(searchParams)
                                        } else {
                                            searchParams.set('mechanics', cat)
                                            setSearchParams(searchParams)
                                        }
                                    }}
                                    className={`p-3 flex overflow-hidden border-radius pointer bg-secondary-hover weight-600 fs-14 transition-duration${searchParams.get('mechanics')?.toLocaleLowerCase() === cat?.toLocaleLowerCase() ? " bg-secondary" : " opacity-75 hover-opacity-100"}`}
                                >
                                    <div className="text-ellipsis-1 flex-grow-1 gap-2">
                                        {cat}
                                    </div>
                                    {searchParams.get('mechanics')?.toLocaleLowerCase() === cat?.toLocaleLowerCase() ? (
                                        <Icon
                                            icon={checkIcon}
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </Collapse>
                <div className="border-bottom"/>
            </div>
        </div>
    )
}

const BrowsePage = () => {
    const navigate = useNavigate()

    const { pathname } = useLocation()
    const [search, setSearch] = useState('')
    const [searchParams, setSearchParamsSet] = useSearchParams()

    return (
        <>
        {/* <div className="w-100 h-min-400-px pos-absolute top-0 pointer-events-none user-select-none z-0" style={{
            background: "linear-gradient(rgba(66, 144, 243, 0.2) 0%, rgba(206, 127, 243, 0.1) 52.58%, rgba(248, 236, 215, 0) 100%)"
        }}></div> */}
        <main className="page-body mx-auto w-max-md">
            <div className="container px-sm-2 py-6">
                <div className="pt-sm-3 pb-4">
                    <div className="py-3 title-1 bold px-sm-2">
                        Search
                    </div>
                    {/* <div className="border-bottom">
                        <TabContent
                            items={
                                [
                                    {label: 'Discover'},
                                    {label: 'Browse'},
                                ]
                            }
                            activeTabName={pathname.split('/')[1]}
                            setActiveTabName={e => {
                                navigate(`/${e}`)
                            }}
                        />
                    </div> */}
                </div>
                <div className="border border-radius-lg w-max-300-px">
                    <InputSearch
                        icon={searchIcon}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onSearch={() => setSearchParamsSet({ search })}
                        placeholder="Search board games"
                        clearable
                    />
                </div>
                <div className="flex gap-5 mt-5">
                    <div className="flex-1">
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
                        <Items/>
                    </div>
                    <Filters/>
                </div>
            </div>
        </main>
        </>
    )
}

export default BrowsePage