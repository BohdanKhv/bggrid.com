import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyLibrary } from '../features/library/librarySlice'
import {Avatar, Button, ErrorInfo, HorizontalScroll, IconButton, InputSearch, Image, Icon, Skeleton, Modal, TabContent} from '../components'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { closeIcon, editIcon, gamesIcon, linkIcon, diceIcon, searchIcon, starFillIcon, weightIcon, usersIcon, usersFillIcon, libraryIcon, arrowLeftShortIcon, plusIcon, largePlusIcon, patchPlusIcon } from '../assets/img/icons'
import { tagsEnum } from '../assets/constants'
import { numberFormatter } from '../assets/utils'
import { getMyPlays, resetPlay } from '../features/play/playSlice'
import PlayItem from './PlayItem'
import UpdateLogPlay from './game/UpdateLogPlay'
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
                        placeholder="What did you play?"
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
                                        searchParams.set('logPlay', searchItem.game._id)
                                        searchParams.delete('sg')
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
                                        searchParams.set('logPlay', item._id)
                                        searchParams.delete('sg')
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
            placeholder="What did you play?"
            value={searchValue}
            clearable
            onChange={(e) => setSearchValue(e.target.value)}
            searchable
            searchChildren={
                <div className="py-2">
                    {searchValue.length == 0 &&
                    suggestions.length == 0 && library.length == 0?
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
                                        searchParams.set('logPlay', item.game._id)
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
                                        searchParams.set('logPlay', item._id)
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


const PlaysPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const {library, isLoading: libraryLoading} = useSelector((state) => state.library)
    const { plays, isLoading, loadingId, hasMore } = useSelector((state) => state.play)
    const [feedType, setFeedType] = useState(null)
    const [tags, setTags] = useState(null)
    const [selectedGame, setSelectedGame] = useState(null)
    const user = useSelector((state) => state.auth.user)

    const getData = () => {
        dispatch(getMyPlays({ tags, selectedGame }))
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = 'Plays'

        if (document.querySelector('.header-title')) document.querySelector('.header-title').innerText = 'Play logs'
        return () => {
            if (document.querySelector('.header-title')) document.querySelector('.header-title').innerText = ''
        }
    }, [])

    useEffect(() => {
        const promise = dispatch(getMyPlays({ tags, selectedGame, tagged: feedType === 'tagged' ? true : false })) 
        return () => {
            promise && promise.abort()
            dispatch(resetPlay())
        }
    }, [tags, selectedGame, feedType])

    const observer = useRef();
    const lastElementRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                const promise = getData();
        
                return () => {
                    promise && promise.abort();
                    dispatch(resetPlay());
                    observer.current && observer.current.disconnect();
                }
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore]);

    return (
        <>
            <main className="page-body">
            <UpdateLogPlay/>
                <div className="animation-slide-in flex flex-1 flex-sm-col container">
                        {window.innerWidth <= 800 && user ? (
                            <div className="flex flex-1 pt-6 pt-sm-3 justify-between px-sm-3 pb-3 sticky top-0 z-3 bg-main">
                                <div className="title-1 bold">
                                    Plays
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
                        ) : null}
                        {window.innerWidth <= 800 ?
                        <div className="py-1 py-sm-0 mx-sm-1">
                            <HorizontalScroll
                                contentClassName="align-start gap-0"
                            >
                                {library
                                .slice(0, 10)
                                .map((item) => (
                                    <div className={`pointer h-100 w-max-75-px animation-fade-in border-radius-sm hover-opacity-100 transition-duration clickable flex-shrink-0${selectedGame ? selectedGame === item?.game?._id ? "" : " opacity-25" : " bg-tertiary-hover"}`}
                                        key={item._id}
                                        onClick={() => {
                                            if (selectedGame === item?.game?._id) {
                                                setSelectedGame(null)
                                            } else {
                                                setSelectedGame(item?.game?._id)
                                            }
                                        }}
                                    >
                                        <div className="flex flex-col px-3 align-center">
                                            <Avatar
                                                img={item?.game?.thumbnail}
                                                size="lg"
                                                label={item.game.name}
                                            />
                                            <div className="fs-12 text-center text-ellipsis-1 pt-2 weight-500">
                                                {item.game.name}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </HorizontalScroll>
                        </div>
                        : null}
                        <div className="flex flex-1">
                            <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="pt-3 ps-4 ps-sm-3 pt-sm-0 border-bottom">
                                <div>
                                    <TabContent
                                        items={[
                                            {label: 'Plays'},
                                            {label: 'Tagged'},
                                        ]}
                                        classNameContainer="w-100 flex-1"
                                        classNameItem="flex-1"
                                        activeTabName={feedType || 'plays'}
                                        setActiveTabName={(e) => {
                                            setFeedType(e)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="pt-3 px-sm-3">
                                <div className="flex gap-2">
                                    {['All', 'Wins', 'Losses'].map((item, index) => (
                                        <Button
                                            key={index}
                                            label={item}
                                            variant={(!tags && item === 'All') || tags === item.toLowerCase() ? "filled" : "outline"}
                                            type="secondary"
                                            onClick={() => {
                                                setTags(item.toLowerCase())
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                            {selectedGame ?
                            <div className="px-sm-3 pt-3 pt-sm-3">
                                    <HorizontalScroll>
                                        <IconButton
                                            icon={closeIcon}
                                            onClick={() => {
                                                setSelectedGame(null)
                                            }}
                                            type="secondary"
                                            variant="default"
                                            size="sm"
                                        />
                                        <Avatar
                                            img={library.find(l => l?.game?._id === selectedGame)?.game?.thumbnail}
                                            label={library.find(l => l?.game?._id === selectedGame)?.game?.name}
                                            size="xs"
                                            onClick={() => setSelectedGame(null)}
                                        />
                                        <div className="border-left py-3"/>
                                        <Button
                                            icon={diceIcon}
                                            variant="secondary"
                                            type="outline"
                                            className="flex-shrink-0"
                                            label="Play"
                                            onClick={() => {
                                                searchParams.set('logPlay', selectedGame)
                                                setSearchParams(searchParams)
                                            }}
                                        />
                                        <Button
                                            icon={editIcon}
                                            variant="secondary"
                                            type="outline"
                                            className="flex-shrink-0"
                                            label="Review"
                                            onClick={() => {
                                                searchParams.set('addGame', selectedGame)
                                                setSearchParams(searchParams)
                                            }}
                                        />
                                        <Button
                                            icon={linkIcon}
                                            variant="secondary"
                                            type="outline"
                                            className="flex-shrink-0"
                                            label="Details"
                                            onClick={() => navigate(`/g/${selectedGame}/overview`)}
                                        />
                                    </HorizontalScroll>
                            </div>
                            : null
                            }
                            <div>
                                {plays.length === 0 && isLoading ?
                                    <div className="flex flex-col gap-5 py-5 px-sm-3 px-4">
                                        <div className="flex gap-2">
                                            <Skeleton height="56" width="56" animation="wave" rounded/>
                                            <div className="flex flex-col gap-2 flex-1">
                                                <Skeleton height="34" width={225} animation="wave"/>
                                                <Skeleton height="18" width={250} animation="wave"/>
                                                <Skeleton height="200" animation="wave"/>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Skeleton height="56" width="56" animation="wave" rounded/>
                                            <div className="flex flex-col gap-2 flex-1">
                                                <Skeleton height="34" width={225} animation="wave"/>
                                                <Skeleton height="18" width={250} animation="wave"/>
                                                <Skeleton height="200" animation="wave"/>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Skeleton height="56" width="56" animation="wave" rounded/>
                                            <div className="flex flex-col gap-2 flex-1">
                                                <Skeleton height="34" width={225} animation="wave"/>
                                                <Skeleton height="18" width={250} animation="wave"/>
                                                <Skeleton height="200" animation="wave"/>
                                            </div>
                                        </div>
                                    </div>
                                : plays.length > 0 && !isLoading ? (
                                    <div className="flex flex-col px-sm-0">
                                    {plays
                                    .map((item, index, arr) =>
                                        <div
                                            key={item._id}
                                            ref={arr.length === index + 1 ? lastElementRef : undefined}
                                        >
                                            <PlayItem item={item}
                                            showOptions={feedType !== 'tagged'}
                                            />
                                        </div>
                                    )}
                                    </div>
                                ) : isLoading ? (
                                    <ErrorInfo isLoading/>
                                ) : (
                                    plays.length === 0 && 
                                    <div className="mt-3 mx-sm-3"><ErrorInfo
                                    label={selectedGame ? `No plays found for "${library.find(l => l?.game?._id === selectedGame)?.game?.name}"` : "No plays found."}
                                    secondary="Once you start logging plays, they will appear here."
                                    />
                                    </div>
                                )}
                            </div>
                        </div>
                        {window.innerWidth > 800 &&
                        <div className="flex flex-col w-set-300-px flex-1 gap-3 py-4 ps-5">
                            <div className="flex">
                                <SearchGames/>
                            </div>
                            <div className="flex flex-col bg-secondary border-radius overflow-hidden pb-2">
                                <div className="fs-20 bold py-3 px-4">
                                    Your library
                                </div>
                                { library.length == 0 && !libraryLoading ?
                                    <div className="mt-3">
                                        <ErrorInfo
                                            label="Library is empty"
                                            secondary="Add games to your library to log plays"
                                            onClick={() => navigate('/discover')}
                                            btnLabel="Discover games"
                                        />
                                    </div>
                                : library.length > 0 && !libraryLoading && (
                                    library
                                    .slice(0, 10)
                                    .map((item) => (
                                        <div className={`pointer align-center px-4 animation-fade-in hover-opacity-100 transition-duration clickable flex-shrink-0${selectedGame ? selectedGame === item?.game?._id ? "" : " opacity-25" : " bg-tertiary-hover"}`}
                                            key={item._id}
                                            onClick={() => {
                                                if (selectedGame === item?.game?._id) {
                                                    setSelectedGame(null)
                                                } else {
                                                    setSelectedGame(item?.game?._id)
                                                }
                                            }}
                                        >
                                            <div className="flex py-2 gap-3 align-center">
                                                <Avatar
                                                    img={item?.game?.thumbnail}
                                                    label={item.game.name}
                                                />
                                                <div className="fs-14 text-ellipsis-2 weight-500">
                                                    {item.game.name}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        }
                        </div>
                </div>
            </main>
        </>
    )
}

export default PlaysPage