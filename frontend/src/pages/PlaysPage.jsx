import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyLibrary } from '../features/library/librarySlice'
import {Avatar, Button, ErrorInfo, HorizontalScroll, IconButton, InputSearch, Image, Icon, Skeleton} from '../components'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { closeIcon, editIcon, gamesIcon, linkIcon, diceIcon, searchIcon, starFillIcon, weightIcon, usersIcon, usersFillIcon, libraryIcon } from '../assets/img/icons'
import { tagsEnum } from '../assets/constants'
import { numberFormatter } from '../assets/utils'
import { getMyPlays, resetPlay } from '../features/play/playSlice'
import PlayItem from './PlayItem'
import UpdateLogPlay from './game/UpdateLogPlay'


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
                                                    type={tags === null ? 'filled' : 'default'}
                                                    onClick={() => {
                                                        setSelectedGame(null)
                                                        setTags(null)
                                                    }}
                                                />
                                            : null}
                                            <Button
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