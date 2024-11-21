import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyLibrary } from '../features/library/librarySlice'
import {Avatar, Button, ErrorInfo, HorizontalScroll, IconButton, InputSearch, Image, Icon} from '../components'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { closeIcon, editIcon, gamesIcon, linkIcon, diceIcon, searchIcon, starFillIcon, weightIcon, usersIcon, usersFillIcon } from '../assets/img/icons'
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
                        <div className="flex justify-between px-sm-3">
                            <div className="pt-6 pb-3 pt-sm-3 title-1 bold">
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
                        <div className="sticky top-0 bg-main py-1 z-3 py-sm-0">
                            {library.length > 0 && !libraryLoading && (
                                <HorizontalScroll
                                    contentClassName="align-start gap-0"
                                >
                                    {library.map((item) => (
                                        <div className={`pointer h-100 animation-fade-in border-radius-sm hover-opacity-100 transition-duration clickable flex-shrink-0${selectedGame ? selectedGame === item?.game?._id ? "" : " opacity-25" : " bg-secondary-hover"}`}
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
                                                    rounded
                                                    label={item.game.name}
                                                />
                                                <div className="fs-12 text-center text-ellipsis-1 w-max-75-px pt-2 weight-500">
                                                    {item.game.name}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </HorizontalScroll>
                            )}
                        </div>
                        <div>
                            <div className="pt-3 px-sm-3">
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
                                        <Button
                                            icon={linkIcon}
                                            variant="secondary"
                                            type="outline"
                                            className="flex-shrink-0"
                                            label="Details"
                                            onClick={() => navigate(`/g/${selectedGame}/edit`)}
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
                            {plays.length > 0 && !isLoading ? (
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
                                plays.length === 0 && <ErrorInfo
                                label="No plays found"
                                secondary="Once you start logging plays, they will appear here."
                                icon={diceIcon}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default PlaysPage