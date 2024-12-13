import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyLibrary } from '../features/library/librarySlice'
import {Avatar, Button, ErrorInfo, HorizontalScroll, IconButton, InputSearch, Image, Icon, Dropdown} from '../components'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { closeIcon, editIcon, gamesIcon, linkIcon, diceIcon, searchIcon, starFillIcon, weightIcon, usersIcon, usersFillIcon, bellIcon, rightArrowIcon, moreIcon, upArrowRightIcon, listIcon, gridIcon, arrowUpShortIcon, arrowDownShortIcon, largePlusIcon, libraryIcon, shareIcon, uploadIcon, sendIcon, infoIcon } from '../assets/img/icons'
import { tagsEnum } from '../assets/constants'
import { numberFormatter } from '../assets/utils'
import GameSearchModal from './game/GameSearchModal'
import UpdateLogPlay from './game/UpdateLogPlay'
import { DateTime } from 'luxon'
import MobileModal from '../components/ui/MobileModal'

const LibraryItem = ({ item, index, hideInfo }) => {

    const [searchParam, setSearchParam] = useSearchParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [open, setOpen] = useState(false)

    const { user } = useSelector((state) => state.auth)

    return (
        <>
        {window.innerWidth <= 800 && open ?
        <MobileModal
            isOpen={open}
            onClose={() => {
                setOpen(false)
            }}
            hideClose
        >
            <div className="flex align-center gap-2 overflow-hidden pos-relative p-3">
                <img
                    src={item?.game?.thumbnail}
                    alt={item?.name}
                    draggable="false"
                    className="z-0 border-radius object-cover object-center pos-absolute left-0 blur-20 w-100 h-100"
                />
                <Image
                    img={item?.game?.image}
                    classNameContainer="w-set-100-px h-set-100-px"
                    classNameImg="object-cover"
                    size="sm"
                />
                <div className="z-3 flex flex-col overflow-hidden">
                    <div className="fs-20 text-shadow-hard text-white weight-600 text-ellipsis-2">
                        {item?.game?.name}
                    </div>
                    <div className="fs-12 text-white pt-1 text-shadow-hard">
                        {item?.game?.year}
                    </div>
                    <div className="flex overflow-x-auto pt-2 gap-2">
                        {item.tags.map((tag, index) => (
                            <div key={index} className="px-2 py-1 flex-shrink-0 bg-secondary border-radius weight-500 flex align-center fs-12 weight-500">{tag}</div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-col z-3">
                <Button
                    smSize="xl"
                    size="lg"
                    borderRadius="none"
                    className="justify-start w-100"
                    label="Update library"
                    icon={libraryIcon}
                    variant="secondary"
                    type="default"
                    onClick={() => {
                        searchParam.set('addGame', item?.game?._id)
                        setSearchParam(searchParam)
                    }}
                />
                <Button
                    smSize="xl"
                    size="lg"
                    borderRadius="none"
                    className="justify-start w-100"
                    label="Log a play"
                    icon={diceIcon}
                    variant="secondary"
                    type="default"
                    onClick={(e) => {
                        searchParam.set('logPlay', item?.game?._id)
                        setSearchParam(searchParam)
                    }}
                />
            <Button
                smSize="xl"
                size="lg"
                borderRadius="none"
                className="justify-start"
                label="Game page"
                icon={gamesIcon}
                variant="secondary"
                type="default"
                to={`/g/${item?.game?._id}`}
            />
            {/* <Button
                smSize="xl"
                size="lg"
                borderRadius="none"
                className="justify-start"
                label="Game rules"
                icon={infoIcon}
                variant="secondary"
                disabled
                type="default"
                to={`/g/${item?.game?._id}/rules`}
            /> */}
            <Button
                smSize="xl"
                size="lg"
                borderRadius="none"
                className="justify-start"
                label="Share my review"
                disabled
                icon={sendIcon}
                variant="secondary"
                type="default"
            />
        </div>
        </MobileModal>
        : null }
        <div className="border-bottom border-secondary px-sm-3 transition-duration animation-slide-in show-on-hover-parent hide-on-hover-parent">
            <div className="flex justify-between"
            >
                <div className="flex gap-3 flex-1 py-3 align-center pe-4">
                    {window.innerWidth > 800 ?
                    <div
                        className="flex justify-center align-center opacity-50 hover-opacity-100 w-set-50-px"
                        onClick={(e) => {
                            e.stopPropagation()
                            searchParams.set('logPlay', item.game._id)
                            setSearchParams(searchParams)
                        }}
                    >
                        <div>
                            <Icon
                                icon={diceIcon}
                                className="show-on-hover pointer"
                            />
                            <div className="hide-on-hover text-center fs-12 text-secondary">
                                {index + 1}
                            </div>
                        </div>
                    </div>
                    : 
                    <div
                        className="flex justify-center align-center opacity-50 hover-opacity-100 w-set-25-px"
                        onClick={(e) => {
                            e.stopPropagation()
                            searchParams.set('logPlay', item.game._id)
                            setSearchParams(searchParams)
                        }}
                    >
                        <div>
                            <Icon
                                icon={diceIcon}
                                size="sm"
                                dataTooltipContent={`Play ${item.game.name}`}
                            />
                        </div>
                    </div>}
                    <Image
                        img={item?.game?.thumbnail}
                        classNameContainer="w-set-50-px h-set-50-px border-radius-sm"
                        classNameImg="border-radius-sm"
                    />
                    <div className="flex flex-col justify-between flex-1">
                        <div className="flex justify-between gap-3">
                            <div className="flex flex-col">
                                <div className="flex gap-2">
                                    <Link className="fs-16 text-underlined-hover w-fit-content text-ellipsis-1 h-fit-content"
                                        to={`/g/${item.game._id}`}
                                    >
                                        {item.game.name}
                                    </Link>
                                    </div>
                                    <div className="flex align-center gap-2 pointer pt-1"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            searchParams.set('addGame', item.game._id)
                                            setSearchParams(searchParams)
                                        }}>
                                        <div className="flex align-center gap-2">
                                            <span className={`fs-14 weight-600 text-warning`}>{item.rating || 0}</span>
                                            <div className="flex gap-1 align-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Icon key={i} icon={starFillIcon} size="xs" className={`text-warning ${i + 1 <= item.rating ? 'fill-warning' : 'fill-secondary'}`}/>
                                                ))}
                                            </div>
                                        </div>
                                        {window.innerWidth > 800 && (
                                        <div className="flex align-center gap-1">
                                            {item.tags.map((tag, index) => (
                                                <div key={index} className="px-2 py-1 bg-secondary border-radius weight-500 flex align-center fs-12 weight-500">{tag}</div>
                                            ))}
                                        </div>
                                        )}
                                    </div>
                                </div>
                                {window.innerWidth > 800 ? 
                                <Dropdown
                                    classNameDropdown="p-0"
                                    customDropdown={
                                        <IconButton
                                            icon={moreIcon}
                                            className="display-on-hover display-on-hover-sm-block"
                                            variant="secondary"
                                            type="link"
                                            muted
                                            size="sm"
                                        />
                                    }
                                >
                                    <div className="flex flex-col overflow-hidden border-radius">
                                        <Button
                                            size="lg"
                                            borderRadius="none"
                                            className="justify-start w-100"
                                            label="Update library"
                                            icon={libraryIcon}
                                            variant="secondary"
                                            type="default"
                                            onClick={() => {
                                                searchParam.set('addGame', item?.game?._id)
                                                setSearchParam(searchParam)
                                            }}
                                        />
                                        <Button
                                            size="lg"
                                            borderRadius="none"
                                            className="justify-start w-100"
                                            label="Log a play"
                                            icon={diceIcon}
                                            variant="secondary"
                                            type="default"
                                            onClick={(e) => {
                                                searchParam.set('logPlay', item?.game?._id)
                                                setSearchParam(searchParam)
                                            }}
                                        />
                                        <Button
                                            size="lg"
                                            borderRadius="none"
                                            className="justify-start"
                                            label="Game page"
                                            icon={linkIcon}
                                            variant="secondary"
                                            type="default"
                                            to={`/g/${item?.game?._id}`}
                                        />
                                        {/* <Button
                                            size="lg"
                                            borderRadius="none"
                                            className="justify-start"
                                            label="Game rules"
                                            icon={linkIcon}
                                            disabled
                                            variant="secondary"
                                            type="default"
                                            to={`/g/${item?.game?._id}/rules`}
                                        /> */}
                                        <Button
                                            smSize="xl"
                                            size="lg"
                                            borderRadius="none"
                                            className="justify-start"
                                            label="Share my review"
                                            icon={sendIcon}
                                            variant="secondary"
                                            type="default"
                                            disabled
                                        />
                                    </div>
                                </Dropdown>
                                :
                                <IconButton
                                    icon={moreIcon}
                                    className="display-on-hover display-on-hover-sm-block"
                                    variant="secondary"
                                    type="link"
                                    muted
                                    size="sm"
                                    onClick={(e) => {
                                        setOpen(true)
                                    }}
                                />
                                }
                                </div>
                            <div className="flex justify-between gap-3 pt-1">
                                <div className="fs-12 text-secondary text-ellipsis-1">
                                    Last played: {item.lastPlayDate ? DateTime.now().diff(DateTime.fromISO(item.lastPlayDate), ['days']).days > 1 ? DateTime.fromISO(item.lastPlayDate).toFormat('LLL dd') :
                                    DateTime.fromISO(item.lastPlayDate).toRelative().replace(' days', 'd').replace(' day', 'd').replace(' hours', 'h').replace(' hour', 'h').replace(' minutes', 'm').replace(' minute', 'm').replace(' seconds', 's').replace(' second', 's') : 'never'}
                                </div>
                                <div className="fs-12 text-secondary">
                                    {item.totalPlays || 0} plays
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const LibraryPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const [selectedLibraryItem, setSelectedLibraryItem] = useState(null)
    const { library, isLoading, msg } = useSelector((state) => state.library)
    const [searchValue, setSearchValue] = useState('')
    const [tags, setTags] = useState([])
    const [sortBy, setSortBy] = useState('dateAdded')
    const [sortOrder, setSortOrder] = useState('desc')

    const { user } = useSelector((state) => state.auth)

    const currentLibrary = useMemo(() => {
        return library
    }, [library])

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = 'Library'

        if (document.querySelector('.header-title')) document.querySelector('.header-title').innerText = 'Library'
        return () => {
            if (document.querySelector('.header-title')) document.querySelector('.header-title').innerText = ''
        }
    }, [])

    return (
        <>
            <main className="page-body">
                <div className="animation-slide-in flex flex-1 flex-sm-col container">
                    <div className="flex flex-1 overflow-hidden">
                        <div className="flex-1 flex flex-col border-left border-right overflow-hidden border-bottom border-sm-none">
                            {window.innerWidth < 800 && (
                                <div className="flex pt-6 pt-sm-3 justify-between px-sm-3">
                                    <div className="title-1 bold">
                                        Library
                                    </div>
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
                                </div>
                            )}
                            {window.innerWidth <= 800 && (
                            <div className="px-sm-3 overflow-hidden pt-3">
                                <HorizontalScroll>
                                    <div className="justify-between flex-shrink-0 flex gap-2 bg-secondary border-radius px-3 py-2">
                                        <div className="fs-12 text-secondary">
                                        Games:
                                        </div>
                                        <div className="fs-12 text-end weight-500 text-nowrap">
                                        {library.length}
                                        </div>
                                    </div>
                                    <div className="justify-between flex-shrink-0 flex gap-2 bg-secondary border-radius px-3 py-2">
                                        <div className="fs-12 text-secondary">
                                            Plays:
                                        </div>
                                        <div className="fs-12 text-end weight-500 text-nowrap">
                                        {library.reduce((acc, item) => acc + (item.totalPlays || 0), 0)}
                                        </div>
                                    </div>
                                    <div className="justify-between flex-shrink-0 flex gap-2 bg-secondary border-radius px-3 py-2">
                                        <div className="fs-12 text-secondary">
                                            Playtime:
                                        </div>
                                        <div className="fs-12 text-end weight-500 text-nowrap">
                                            {library.reduce((acc, item) => acc + (item.totalPlayTime || 0), 0)} Min
                                        </div>
                                    </div>
                                    <div className="justify-between flex-shrink-0 flex gap-2 bg-secondary border-radius px-3 py-2">
                                        <div className="fs-12 text-secondary">
                                            Win Rate:
                                        </div>
                                        <div className="fs-12 text-end weight-500 text-nowrap">
                                            {(library.reduce((acc, item) => acc + (item.totalWins || 0), 0) / library.reduce((acc, item) => acc + (item.totalPlays || 0), 0) * 100 || 0).toFixed(2)}%
                                        </div>
                                    </div>
                                </HorizontalScroll>
                            </div>
                            )}
                            {window.innerWidth <= 800 && (
                            <div className="pt-3 px-sm-3 border-bottom px-4 pb-4">
                                <div className="flex flex-col gap-3">
                                    <div className="border flex border-radius-lg flex-1">
                                        <InputSearch
                                            icon={searchIcon}
                                            className="flex-1 py-1"
                                            placeholder="Search Your Library"
                                            value={searchValue}
                                            clearable
                                            onChange={(e) => setSearchValue(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            )}
                            <div className="flex flex-col overflow-hidden sticky-sm z-3">
                            <div className="bg-main py-3 px-sm-3 px-4 border-bottom border-sm-none">
                                <HorizontalScroll>
                                    {tags.length > 0 ? (
                                        <IconButton
                                            icon={closeIcon}
                                            variant="secondary"
                                            size="sm"
                                            type="default"
                                            onClick={() => setTags([])}
                                        />
                                    ) : 
                                        <Button
                                            label="All"
                                            size="sm"
                                            borderRadius="lg"
                                            variant="secondary"
                                            className="animation-fade-in flex-shrink-0"
                                            type={'filled'}
                                        />
                                    }
                                    {tagsEnum
                                    .filter((tag) => tags.length === 0 || tags.includes(tag))
                                    .sort((a, b) => 
                                        // sort if tag is in tags
                                        tags.includes(a) ? -1 : tags.includes(b) ? 1 : 0
                                    )
                                    .map((tag) => (
                                        <Button
                                            key={tag}
                                            label={tag}
                                            size="sm"
                                            borderRadius="lg"
                                            variant="secondary"
                                            className="animation-fade-in flex-shrink-0"
                                            type={tags.includes(tag) ? 'filled' : 'default'}
                                            onClick={() => {
                                                if (tags.includes(tag)) {
                                                    setTags(tags.filter((t) => t !== tag))
                                                } else {
                                                    setTags([...tags, tag])
                                                }
                                            }}
                                        />
                                    ))}
                                </HorizontalScroll>
                            </div>
                            </div>
                            <div className="px-sm-3 px-4 pt-3 flex justify-between align-center">
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
                                                <strong>
                                                    {sortBy === 'dateAdded' ? 'Date Added' : sortBy === 'rating' ? 'Rating' : 'Plays'} {sortOrder === 'asc' ? '↓' : '↑'}
                                                </strong>
                                                </>
                                            }
                                        />
                                        </>
                                    }
                                >
                                    <Button
                                        borderRadius="sm"
                                        label="Date Added"
                                        className="justify-start"
                                        variant="text"
                                        iconRight={sortBy === 'dateAdded' ? sortOrder === 'asc' ? arrowDownShortIcon : arrowUpShortIcon : null}
                                        onClick={() => {
                                            setSortBy('dateAdded')
                                            if (sortOrder === 'asc') setSortOrder('desc')
                                            else setSortOrder('asc')
                                        }}
                                    />
                                    <Button
                                        borderRadius="sm"
                                        className="justify-start"
                                        variant="text"
                                        label="Rating"
                                        iconRight={sortBy === 'rating' ? sortOrder === 'asc' ? arrowDownShortIcon : arrowUpShortIcon : null}
                                        onClick={() => {
                                            setSortBy('rating')
                                            if (sortOrder === 'asc') setSortOrder('desc')
                                            else setSortOrder('asc')
                                        }}
                                    />
                                    <Button
                                        borderRadius="sm"
                                        className="justify-start"
                                        variant="text"
                                        label="Plays"
                                        iconRight={sortBy === 'plays' ? sortOrder === 'asc' ? arrowDownShortIcon : arrowUpShortIcon : null}
                                        onClick={() => {
                                            setSortBy('plays')
                                            if (sortOrder === 'asc') setSortOrder('desc')
                                            else setSortOrder('asc')
                                        }}
                                    />
                                </Dropdown>
                            </div>
                            <div className="pb-6">
                                {library.length > 0 && !isLoading ? (
                                    <div className="flex flex-col">
                                    {library
                                    .filter((item) => item.game.name.toLowerCase().includes(searchValue.toLowerCase()))
                                    .filter((item) => {
                                        if (tags.length === 0) return true
                                        return tags.some((tag) => item.tags.includes(tag))
                                    })
                                    .sort((a, b) => {
                                        if (sortBy === 'dateAdded') {
                                            return sortOrder === 'asc' ? DateTime.fromISO(a.createdAt) - DateTime.fromISO(b.createdAt) : DateTime.fromISO(b.createdAt) - DateTime.fromISO(a.createdAt)
                                        } else if (sortBy === 'rating') {
                                            return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating
                                        } else {
                                            return sortOrder === 'asc' ? a.plays - b.plays : b.plays - a.plays
                                        }
                                    })
                                    .map((item, index) =>
                                        <LibraryItem
                                            key={item._id} item={item} hideInfo index={index}
                                        />
                                    )}
                                    
                                    {library
                                    .filter((item) => item.game.name.toLowerCase().includes(searchValue.toLowerCase()))
                                    .filter((item) => {
                                        if (tags.length === 0) return true
                                        return tags.some((tag) => item.tags.includes(tag))
                                    })
                                    .length === 0 && (
                                        <ErrorInfo
                                            label="No games found"
                                            secondary="Try searching for something else"
                                        />
                                    )}
                                    </div>
                                ) : isLoading ? (
                                    <ErrorInfo isLoading/>
                                ) : (
                                    library.length === 0 && <ErrorInfo
                                    label="Your library is empty"
                                    btnLabel="Add games"
                                    icon={gamesIcon}
                                    onClick={() => {
                                        navigate('/discover')
                                    }}
                                    />
                                )}
                            </div>
                        </div>
                    {window.innerWidth > 800 && (
                    <div className="flex flex-col gap-3">
                        <div className="pt-3 ms-3 sticky top-0 z-3">
                            <div className="flex flex-col gap-3">
                                <div className="border flex border-radius-lg flex-1">
                                    <InputSearch
                                        icon={searchIcon}
                                        className="flex-1 py-1"
                                        placeholder="Search Your Library"
                                        value={searchValue}
                                        clearable
                                        onChange={(e) => setSearchValue(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    <div className="flex flex-col w-set-300-px border border-radius overflow-hidden ms-4 mb-4 h-fit-content">
                        <div className="fs-20 bold py-3 px-4">
                            Your Library
                        </div>
                        <div className="justify-between flex-shrink-0 flex gap-2 border-bottom mx-4 py-4">
                            <div className="fs-14 text-secondary">
                                Games:
                            </div>
                            <div className="fs-14 text-end weight-500 text-nowrap">
                                {library.length}
                            </div>
                        </div>
                        <div className="justify-between flex-shrink-0 flex gap-2 border-bottom mx-4 py-4">
                            <div className="fs-14 text-secondary">
                                Plays:
                            </div>
                            <div className="fs-14 text-end weight-500 text-nowrap">
                            {library.reduce((acc, item) => acc + (item.totalPlays || 0), 0)}
                            </div>
                        </div>
                        <div className="justify-between flex-shrink-0 flex gap-2 border-bottom mx-4 py-4">
                            <div className="fs-14 text-secondary">
                                Playtime:
                            </div>
                            <div className="fs-14 text-end weight-500 text-nowrap">
                                {library.reduce((acc, item) => acc + (item.totalPlayTime || 0), 0)} Min
                            </div>
                        </div>
                        <div className="justify-between flex-shrink-0 flex gap-2 mx-4 py-4">
                            <div className="fs-14 text-secondary">
                                Win Rate:
                            </div>
                            <div className="fs-14 text-end weight-500 text-nowrap">
                                {(library.reduce((acc, item) => acc + (item.totalWins || 0), 0) / library.reduce((acc, item) => acc + (item.totalPlays || 0), 0) * 100 || 0).toFixed(2)}%
                            </div>
                        </div>
                    </div>
                    </div>
                    )}
                    </div>
                </div>
            </main>
        </>
    )
}

export default LibraryPage