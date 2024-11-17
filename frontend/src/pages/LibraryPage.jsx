import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyLibrary } from '../features/library/librarySlice'
import {Avatar, Button, ErrorInfo, HorizontalScroll, IconButton, InputSearch, Image} from '../components'
import { useSearchParams } from 'react-router-dom'
import { closeIcon, gamesIcon, searchIcon } from '../assets/img/icons'
import { tagsEnum } from '../assets/constants'

const LibraryItem = ({ item }) => {

    const [searchParams, setSearchParams] = useSearchParams()

    return (
        <div className="flex gap-3 bg-secondary-hover border-radius p-3 transition-duration pointer"
            onClick={() => {
                searchParams.set('addGame', item.game._id)
                setSearchParams(searchParams)
            }}
        >
            <Image
                img={item?.game?.thumbnail}
                classNameContainer="w-set-100-px h-set-150-px border-radius"
                classNameImg="border-radius"
            />
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
                        <div className="pt-6 pb-3 pt-sm-3 title-1 bold px-sm-2">
                            Library
                        </div>
                        <div className="flex gap-2 align-center">
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
                        <div className="pt-3 pt-sm-0 px-sm-3">
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
                        <div className="sticky top-0 bg-main py-3">
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
                                        className="animation-fade-in"
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
                                        className="animation-fade-in"
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
                        <div className="pb-6 pt-2 px-sm-3">
                            {library.length > 0 && !isLoading ? (
                                <div className="flex flex-col">
                                {library
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