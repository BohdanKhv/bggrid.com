import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyLibrary } from '../features/library/librarySlice'
import {Avatar, Button, ErrorInfo, HorizontalScroll, IconButton, InputSearch, Image, Icon, Skeleton, Modal} from '../components'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { closeIcon, editIcon, gamesIcon, linkIcon, diceIcon, searchIcon, starFillIcon, weightIcon, usersIcon, usersFillIcon, libraryIcon, arrowLeftShortIcon, plusIcon } from '../assets/img/icons'
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
                        placeholder="What did you play?"
                        value={searchValue}
                        clearable
                        autoFocus
                        onChange={(e) => setSearchValue(e.target.value)}
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
                            <div className="flex justify-between align-center bg-secondary-hover"
                                key={searchItem._id}
                            >
                                <div
                                    onClick={() => {
                                        searchParams.set('logPlay', searchItem.game._id)
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
                            <div className="flex justify-between align-center bg-secondary-hover"
                                key={item._id}
                            >
                                <div
                                    onClick={() => {
                                        searchParams.set('logPlay', item._id)
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
            <div className={`pointer h-100 w-max-75-px w-100 h-100 animation-fade-in border-radius-sm hover-opacity-100 transition-duration clickable flex-shrink-0`}
                onClick={() => {
                    searchParams.set('sg', true)
                    setSearchParams(searchParams)
                }}
            >
                <div className="flex flex-col align-center h-100 justify-between">
                    <div className="flex align-center justify-center flex-1">
                        <Avatar
                            icon={plusIcon}
                            rounded
                            sizeSm="md"
                            defaultColor
                            size="lg"
                        />
                    </div>
                    <div className="fs-12 text-center text-ellipsis-1 pt-2 weight-500 pb-2">
                        Add
                    </div>
                </div>
            </div>
            </>
        :
        <div className="border flex border-radius-lg flex-1 w-max-400-px w-100 flex-1">
        <InputSearch
            icon={searchIcon}
            className="flex-1 py-1"
            placeholder="What did you play?"
            value={searchValue}
            clearable
            onChange={(e) => setSearchValue(e.target.value)}
            searchable={searchValue.length || searchHistory.length > 0 || library.length > 0}
            searchChildren={
                <div className="py-2">
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
                            <div className="flex justify-between align-center bg-secondary-hover"
                                key={i}
                            >
                                <div
                                    key={item._id}
                                    onClick={() => {
                                        searchParams.set('logPlay', item.game._id)
                                        setSearchParams(searchParams)
                                    }}
                                    className="fs-14 flex align-center px-4 py-2 gap-3 text-secondary pointer flex-1 overflow-hidden"
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
                            <div className="flex justify-between align-center bg-secondary-hover"
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
        const promise = dispatch(getMyPlays({ tags, selectedGame }))
        return () => {
            promise && promise.abort()
            dispatch(resetPlay())
        }
    }, [tags, selectedGame])

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
        <div>
            <UpdateLogPlay/>
            <main className="page-body">
                <div className="animation-slide-in">
                    <div className="container">
                        {window.innerWidth <= 800 && user ? (
                            <div className="flex pt-6 pt-sm-3 justify-between px-sm-3 pb-3">
                                <div className="title-1 bold">
                                    Plays
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
                        ) : null}
                        {window.innerWidth <= 800 ?
                        <div className="sticky top-0 bg-main py-1 z-3 py-sm-0 overflow-x-hidden">
                            {
                            library.length == 0 && !libraryLoading ? null
                            : library.length > 0 && !libraryLoading && (
                                <HorizontalScroll
                                    contentClassName="align-start gap-0"
                                >
                                    <SearchGames/>
                                    {library.map((item) => (
                                        <div className={`pointer h-100 w-max-75-px animation-fade-in border-radius-sm hover-opacity-100 transition-duration clickable flex-shrink-0${selectedGame ? selectedGame === item?.game?._id ? "" : " opacity-25" : " bg-secondary-hover"}`}
                                            key={item._id}
                                            onClick={() => {
                                                if (selectedGame === item?.game?._id) {
                                                    setSelectedGame(null)
                                                } else {
                                                    setSelectedGame(item?.game?._id)
                                                }
                                            }}
                                        >
                                            <div className="flex flex-col p-2 align-center">
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
                            )}
                        </div>
                        : null}
                        <div className="flex gap-6">
                            <div className="flex-1 flex flex-col">
                            <div>
                                <div className="py-3 px-sm-3">
                                    <div className="flex">
                                        <HorizontalScroll className="flex-1">
                                            {selectedGame || tags ?
                                                <IconButton
                                                    icon={closeIcon}
                                                    variant="secondary"
                                                    className="animation-fade-in flex-shrink-0"
                                                    size="sm"
                                                    type={tags === null ? 'filled' : 'default'}
                                                    onClick={() => {
                                                        setSelectedGame(null)
                                                        setTags(null)
                                                    }}
                                                />
                                            : null}
                                            <Button
                                                size="sm"
                                                borderRadius="lg"
                                                label="All"
                                                variant="secondary"
                                                className="animation-fade-in flex-shrink-0"
                                                type={tags === null ? 'filled' : 'default'}
                                                onClick={() => setTags(null)}
                                            />
                                            {['Wins', 'Losses']
                                            .map((tag) => (
                                                <Button
                                                    key={tag}
                                                    size="sm"
                                                    borderRadius="lg"
                                                    label={tag}
                                                    variant="secondary"
                                                    className="animation-fade-in flex-shrink-0"
                                                    type={tags === tag ? 'filled' : 'default'}
                                                    onClick={() => {
                                                        if (tags == tag) {
                                                            setTags(null)
                                                        } else {
                                                            setTags(tag)
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </HorizontalScroll>
                                    </div>
                                        {selectedGame ?
                                        <div className="pt-3 flex gap-2 overflow-auto">
                                            <Avatar
                                                img={library.find(l => l?.game?._id === selectedGame)?.game?.thumbnail}
                                                label={library.find(l => l?.game?._id === selectedGame)?.game?.name}
                                                size="sm"
                                            />
                                            <div className="border-left my-2"/>
                                            <Button
                                                icon={linkIcon}
                                                variant="secondary"
                                                type="outline"
                                                className="flex-shrink-0"
                                                label="Details"
                                                onClick={() => navigate(`/g/${selectedGame}/overview`)}
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
                                        </div>
                                        : null }
                                </div>
                            </div>
                            <div>
                                {plays.length === 0 && isLoading ?
                                    <div className="flex flex-col gap-5 py-5 px-sm-3">
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
                                    <div className="flex flex-col">
                                    {plays
                                    .map((item, index, arr) =>
                                        <div
                                            key={item._id}
                                            ref={arr.length === index + 1 ? lastElementRef : undefined}
                                        >
                                            <PlayItem item={item}/>
                                        </div>
                                    )}
                                    </div>
                                ) : isLoading ? (
                                    <ErrorInfo isLoading/>
                                ) : (
                                    plays.length === 0 && 
                                    <div className="border border-radius border-dashed mt-3 mx-sm-3"><ErrorInfo
                                    label={selectedGame ? `No plays found for "${library.find(l => l?.game?._id === selectedGame)?.game?.name}"` : "No plays found."}
                                    secondary="Once you start logging plays, they will appear here."
                                    />
                                    </div>
                                )}
                            </div>
                        </div>
                        {window.innerWidth > 800 &&
                        <div className="flex flex-col w-set-300-px flex-1">
                            <div className="fs-20 bold py-3">
                                Library
                            </div>
                            { library.length == 0 && !libraryLoading ?
                                <div className="border border-radius border-dashed mt-3">
                                    <ErrorInfo label="Library is empty"
                                        secondary="Add games to your library to log plays" icon={libraryIcon}
                                    />
                                </div>
                            : library.length > 0 && !libraryLoading && (
                                library.map((item) => (
                                    <div className={`pointer align-center animation-fade-in border-radius-sm hover-opacity-100 transition-duration clickable flex-shrink-0${selectedGame ? selectedGame === item?.game?._id ? "" : " opacity-25" : " bg-secondary-hover"}`}
                                        key={item._id}
                                        onClick={() => {
                                            if (selectedGame === item?.game?._id) {
                                                setSelectedGame(null)
                                            } else {
                                                setSelectedGame(item?.game?._id)
                                            }
                                        }}
                                    >
                                        <div className="flex p-2 gap-3 align-center">
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
                        }
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default PlaysPage