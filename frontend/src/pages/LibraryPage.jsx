import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyLibrary } from '../features/library/librarySlice'
import {Avatar, Button, ErrorInfo, HorizontalScroll, IconButton, InputSearch, Image, Icon, Dropdown, Modal} from '../components'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { closeIcon, editIcon, gamesIcon, linkIcon, diceIcon, searchIcon, starFillIcon, weightIcon, usersIcon, usersFillIcon, bellIcon, rightArrowIcon, moreIcon, upArrowRightIcon, listIcon, gridIcon, arrowUpShortIcon, arrowDownShortIcon, largePlusIcon, libraryIcon, shareIcon, uploadIcon, sendIcon, infoIcon } from '../assets/img/icons'
import { tagsDetailedEnum, tagsEnum } from '../assets/constants'
import { numberFormatter } from '../assets/utils'
import GameSearchModal from './game/GameSearchModal'
import UpdateLogPlay from './game/UpdateLogPlay'
import { DateTime } from 'luxon'
import MobileModal from '../components/ui/MobileModal'
import { getSuggestions } from '../features/game/gameSlice'



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
                <div className="align-center flex">
                    <InputSearch
                        className="flex-1 py-1 m-2"
                        placeholder="Search games"
                        value={searchValue}
                        clearable
                        autoFocus
                        onChange={(e) => setSearchValue(e.target.value)}
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
                    {library && library
                    .filter((item) => item.game.name.toLowerCase().includes(searchValue.toLowerCase()))
                    .length > 0 ?
                    <>
                        <div className="fs-20 pb-3 bold px-3 pt-4">
                            Your library
                        </div>
                        {library
                        .filter((item) => item.game.name.toLowerCase().includes(searchValue.toLowerCase()))
                        .slice(0, 10)
                        .map((searchItem, i) => (
                            <div className="flex justify-between align-center bg-tertiary-hover"
                                key={searchItem._id}
                            >
                                <div
                                    onClick={() => {
                                        searchParams.set('addGame', searchItem.game._id)
                                        setSearchParams(searchParams)
                                    }}
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
                                                {searchItem.game.year}
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                        .map((item, i) => (
                            <div className="flex justify-between align-center bg-tertiary-hover"
                                key={item._id}
                            >
                                <div
                                    onClick={() => {
                                        searchParams.set('addGame', item._id)
                                        setSearchParams(searchParams)
                                    }}
                                    className="fs-14 flex align-center px-4 py-2 gap-3 pointer flex-1 overflow-hidden clickable opacity-75-active"
                                >
                                    <div className="flex gap-3 align-center">
                                        <Image
                                            errIcon={gamesIcon}
                                            img={item.thumbnail}
                                            alt={item.name}
                                            classNameContainer="w-set-50-px h-set-50-px border-radius-sm overflow-hidden"
                                        />
                                        <div className="flex flex-col">
                                            <div className="fs-14 weight-500 text-ellipsis-2">
                                                {highlightText(item.name, searchValue)}
                                            </div>
                                            <div className="fs-12 text-secondary">
                                                {item.year}
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
            <IconButton
                icon={largePlusIcon}
                variant="text"
                type="secondary"
                dataTooltipContent="Search games"
                onClick={() => {
                    searchParams.set('sg', 'true')
                    setSearchParams(searchParams)
                }}
            />
            </>
        :
        <div className="flex border-radius-lg flex-1 w-max-400-px w-100 flex-1">
        <InputSearch
            icon={searchIcon}
            className="p-3 bg-secondary border-none flex-1 py-1 border-radius-lg"
            classNameFocus="border-radius-bottom-none"
            placeholder="Search games"
            value={searchValue}
            clearable
            onChange={(e) => setSearchValue(e.target.value)}
            searchable
            searchChildren={
                <div className="py-2">
                    {searchValue.length == 0 && searchHistory.length == 0 &&
                    suggestions.length == 0 &&
                    library
                    .filter((item) => item.game.name.toLowerCase().includes(searchValue.toLowerCase()))
                    .length == 0 && searchValue.length == 0 ?
                        <div className="fs-14 px-4 py-2 gap-3 text-secondary weight-600 text-center">
                            Type to search
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
                        .map((item, i) => (
                            <div className="flex justify-between align-center bg-tertiary-hover"
                                key={i}
                            >
                                <div
                                    key={item._id}
                                    className="fs-14 flex align-center px-4 py-2 gap-3 text-secondary pointer flex-1 overflow-hidden"
                                    onClick={() => {
                                        searchParams.set('addGame', item.game._id)
                                        setSearchParams(searchParams)
                                    }}
                                >
                                    <Avatar 
                                        img={item.game.thumbnail}
                                        name={item.game.name}
                                        rounded
                                        size="xs"
                                    />
                                    <span className="text-ellipsis-1">{item.game.name}</span>
                                </div>
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
                            <div className="flex justify-between align-center bg-tertiary-hover"
                                key={item._id}
                            >
                                
                                <div
                                    key={item._id}
                                    onClick={() => {
                                        searchParams.set('addGame', item._id)
                                        setSearchParams(searchParams)
                                    }}
                                    className="fs-14 flex align-center px-4 py-2 gap-3 text-secondary pointer flex-1 overflow-hidden"
                                >
                                    <Avatar
                                        img={item.thumbnail}
                                        name={item.name}
                                        rounded
                                        size="xs"
                                    />
                                    <span className="text-ellipsis-1">
                                        {highlightText(item.name, searchValue)} ({item.year})
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

const LibraryItem = ({ item, index, tags, setTags }) => {

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
                            <div className="flex flex-col flex-1">
                                <div className="flex gap-2">
                                    <Link className="fs-16 text-underlined-hover w-fit-content text-ellipsis-1 h-fit-content"
                                        to={`/g/${item.game._id}`}
                                    >
                                        {item.game.name}
                                    </Link>
                                    </div>
                                    <div className="flex flex-col gap-1 pointer pt-1 flex-1">
                                        <div className="flex align-center gap-2"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                searchParams.set('addGame', item.game._id)
                                                setSearchParams(searchParams)
                                            }}
                                        >
                                            <span className={`fs-14 weight-500 text-warning`}>{item.rating || 0}</span>
                                            <div className="flex gap-1 align-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Icon key={i} icon={starFillIcon} size="xs" className={`text-warning ${i + 1 <= item.rating ? 'fill-warning' : 'fill-secondary'}`}/>
                                                ))}
                                            </div>
                                        </div>
                                        {window.innerWidth > 800 && (
                                        <HorizontalScroll
                                            contentClassName="gap-1"
                                        >
                                            {item.tags.map((tag, index) => (
                                                <div key={index}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        if (tags.includes(tag)) {
                                                            setTags(tags.filter((t) => t !== tag))
                                                        } else {
                                                            setTags([...tags, tag])
                                                        }
                                                    }}
                                                    className={`px-1 border-radius flex-shrink-0 weight-500 flex align-center fs-10 weight-500 border bg-secondary${tags.includes(tag) ? " border-color-text" : " border-secondary"}`}>
                                                        <span className="me-2">
                                                            {tagsDetailedEnum.find((t) => t.label === tag)?.icon}
                                                        </span>
                                                        {tag}
                                                    </div>
                                            ))}
                                        </HorizontalScroll>
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
    const [searchLibrary, setSearchLibrary] = useState(false)

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
                        <div className="flex-1 flex flex-col overflow-x-hidden">
                            {window.innerWidth < 800 && (
                                <div className="flex pt-6 pt-sm-3 justify-between px-sm-3">
                                    <div className="title-1 bold">
                                        Library
                                    </div>
                                    <div className="justify-end flex align-center flex-no-wrap gap-3">
                                        <SearchGames/>
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
                            {/* {window.innerWidth <= 800 && (
                            <div className="pt-3 px-sm-3 px-4">
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-1">
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
                            )} */}
                            <div className="flex flex-col overflow-hidden sticky-sm z-3">
                            <div className="bg-main py-3 px-sm-3 px-4">
                                {searchLibrary ?
                                    <div className="flex gap-2">
                                        <IconButton
                                            icon={closeIcon}
                                            variant="secondary"
                                            size="sm"
                                            dataTooltipContent="Cancel"
                                            type="default"
                                            onClick={() => {
                                                setSearchValue('')
                                                setSearchLibrary(false)
                                            }}
                                        />
                                        <InputSearch
                                            className="flex-1 border-none h-auto"
                                            placeholder="Search Your Library"
                                            value={searchValue}
                                            autoFocus
                                            clearable
                                            onChange={(e) => setSearchValue(e.target.value)}
                                        />
                                    </div>
                                :
                                    <HorizontalScroll>
                                        <IconButton
                                            icon={searchIcon}
                                            variant="secondary"
                                            size="sm"
                                            type="default"
                                            dataTooltipContent="Search Your Library"
                                            onClick={() => {
                                                setSearchLibrary(true)
                                            }}
                                        />
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
                                        {tagsDetailedEnum
                                        .map((tag) => (
                                            <Button
                                                key={tag.label}
                                                icon={tag.icon}
                                                label={tag.label}
                                                size="sm"
                                                borderRadius="lg"
                                                variant="secondary"
                                                className="animation-fade-in flex-shrink-0"
                                                type={tags.includes(tag.label) ? 'filled' : 'default'}
                                                onClick={() => {
                                                    if (tags.includes(tag.label)) {
                                                        setTags(tags.filter((t) => t !== tag.label))
                                                    } else {
                                                        setTags([...tags, tag.label])
                                                    }
                                                }}
                                            />
                                        ))}
                                    </HorizontalScroll>
                                }
                            </div>
                            </div>
                            <div className="px-sm-3 px-4 pt-sm-0 flex justify-between align-center">
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
                            <div className="pb-6 flex flex-col overflow-x-hidden">
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
                                            tags={tags}
                                            setTags={setTags}
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
                                    secondary="Once you add games, they will appear here."
                                    onClick={() => {
                                        navigate('/discover')
                                    }}
                                    />
                                )}
                            </div>
                        </div>
                    {window.innerWidth > 800 && (
                    <div className="flex flex-col gap-3">
                        <div className="pt-3 ms-5 sticky top-0 z-3">
                            <SearchGames/>
                        </div>
                    <div className="flex flex-col w-set-300-px bg-secondary border-radius overflow-hidden ms-5 mb-4 h-fit-content">
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