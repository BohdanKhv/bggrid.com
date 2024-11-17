import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyLibrary } from '../features/library/librarySlice'
import {Avatar, Button, ErrorInfo, HorizontalScroll, IconButton, InputSearch, Image, Icon} from '../components'
import { Link, useSearchParams } from 'react-router-dom'
import { closeIcon, editIcon, gamesIcon, linkIcon, diceIcon, searchIcon, starFillIcon, weightIcon, usersIcon, usersFillIcon } from '../assets/img/icons'
import { tagsEnum } from '../assets/constants'
import { numberFormatter } from '../assets/utils'

const LibraryItem = ({ item }) => {

    const [searchParams, setSearchParams] = useSearchParams()

    return (
        <div className="border-radius px-4 pt-4 transition-duration animation-slide-in">
            <div className="flex justify-between"
                onClick={(e) => {
                    e.stopPropagation()
                    searchParams.set('play', item.game._id)
                    setSearchParams(searchParams)
                }}
            >
            <div className="flex gap-3">
                <Image
                    img={item?.game?.thumbnail}
                    classNameContainer="w-set-100-px h-set-100-px border-radius"
                    classNameImg="border-radius"
                />
                <div className="flex flex-col justify-between">
                    <Link className="fs-16 weight-600 pointer text-underlined-hover"
                        to={`/g/${item.game._id}`}
                        target='_blank'
                    >
                        {item.game.name}
                    </Link>
                    <div className="fs-12 text-secondary">
                        {item.game.yearPublished}
                    </div>
                    <div className="flex gap-2 align-center mt-3">
                        <Button
                            label="Review"
                            icon={editIcon}
                            variant="secondary"
                            type="outline"
                            onClick={(e) => {
                                e.stopPropagation()
                                searchParams.set('addGame', item.game._id)
                                setSearchParams(searchParams)
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
            <HorizontalScroll
                className="mt-5 border-bottom pb-4"
            >
                <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2">
                    <div className="fs-14 bold flex align-center">
                        {item?.game?.avgRating.toFixed(1)}
                        <Icon
                            icon={starFillIcon}
                            className="ms-1"
                            size="sm"
                        />
                    </div>
                    <span className="fs-12 opacity-75 pt-2 weight-500">
                        {numberFormatter(item?.game?.numRatings)} reviews
                    </span>
                </div>
                <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2">
                    <div className="fs-14 bold flex align-center">
                        {item?.game?.gameWeight.toFixed(1)}
                        <Icon
                            icon={weightIcon}
                            className="ms-1"
                            size="sm"
                        />
                    </div>
                    <span className="fs-12 opacity-75 pt-2 weight-500">
                        Weight
                    </span>
                </div>
                {item?.game?.ComMinPlaytime ?
                <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2">
                    <div className="fs-14 bold flex align-center">
                        {item?.game?.ComMinPlaytime}{item?.game?.ComMaxPlaytime !== item?.game?.ComMinPlaytime ? `-${item?.game?.ComMaxPlaytime}` : ""} Min
                    </div>
                    <span className="fs-12 opacity-75 pt-2 weight-500">
                        Playtime
                    </span>
                </div>
                : null}
                <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2">
                    <div className="fs-14 bold flex align-center">
                        {item?.game?.MinPlayers}{item?.game?.MaxPlayers > item?.game?.MinPlayers ? `-${item?.game?.MaxPlayers}` : ''}
                        <Icon
                            icon={usersFillIcon}
                            className="ms-1"
                            size="sm"
                        />
                    </div>
                    <span className="fs-12 opacity-75 pt-2 weight-500">
                        Players
                    </span>
                </div>
                <div className="flex flex-col pe-4 align-center justify-center w-min-100-px">
                    <div className="fs-14 bold flex align-center">
                        {item?.game?.mfgAgeRec}+
                    </div>
                    <span className="fs-12 opacity-75 pt-2 weight-500">
                        Age
                    </span>
                </div>
            </HorizontalScroll>
        </div>
    )
}

const LibraryPage = () => {
    const dispatch = useDispatch()

    const [searchParams, setSearchParams] = useSearchParams()
    const { library, isLoading, msg } = useSelector((state) => state.library)
    const [searchValue, setSearchValue] = useState('')
    const [tags, setTags] = useState([])

    const { user } = useSelector((state) => state.auth)

    const currentLibrary = useMemo(() => {
        return library
    }, [library])

    useEffect(() => {
        const promise = dispatch(getMyLibrary())

        if (document.querySelector('.header-title')) document.querySelector('.header-title').innerText = 'Library'
        return () => {
            if (document.querySelector('.header-title')) document.querySelector('.header-title').innerText = ''
            promise.abort()
        }
    }, [])

    return (
        <div>
            <main className="page-body">
                <div className="animation-slide-in">
                    <div className="container">
                        <div className="pt-6 pb-3 pt-sm-3 title-1 bold px-sm-3">
                            Library
                        </div>
                        <div className="flex gap-2 align-center px-sm-3">
                            <Avatar
                                icon={user.avatar}
                                rounded
                                size="xs"
                                name={user.username}
                                avatarColor="1"
                            />
                            <div className="fs-14 weight-600">
                                {user.username} <span className="text-secondary"> • {library.length} games</span>
                            </div>
                        </div>
                        <div className="pt-3 px-sm-3">
                            <div className="flex flex-col gap-3">
                                <div className="border flex border-radius-lg flex-1 w-max-400-px">
                                    <InputSearch
                                        icon={searchIcon}
                                        className="flex-1 py-1"
                                        placeholder="Search in library"
                                        value={searchValue}
                                        clearable
                                        onChange={(e) => setSearchValue(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="sticky top-0 bg-main py-3 px-sm-3">
                            <HorizontalScroll>
                                {tags.length > 0 ? (
                                    <IconButton
                                        icon={closeIcon}
                                        variant="secondary"
                                        type="default"
                                        onClick={() => setTags([])}
                                    />
                                ) : 
                                    <Button
                                        label="All"
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
                        <div className="pb-6 pt-2">
                            {library.length > 0 && !isLoading ? (
                                <div className="flex flex-col">
                                {library
                                .filter((item) => item.game.name.toLowerCase().includes(searchValue.toLowerCase()))
                                .filter((item) => {
                                    if (tags.length === 0) return true
                                    return tags.some((tag) => item.tags.includes(tag))
                                })
                                .map((item) =>
                                    <LibraryItem key={item._id} item={item} />
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
                                    searchParams.set('sg', true)
                                    setSearchParams(searchParams)
                                }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default LibraryPage