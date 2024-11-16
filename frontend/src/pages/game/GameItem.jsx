import React, { useMemo } from 'react'
import { Button, Icon, IconButton, Image } from '../../components'
import { checkIcon, clockIcon, largePlusIcon, libraryIcon, patchPlusIcon, usersIcon, weightIcon } from '../../assets/img/icons'
import { Link, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const GameItem = ({item}) => {

    const [searchParams, setSearchParams] = useSearchParams()
    const { library } = useSelector(state => state.library)

    const isInLibrary = useMemo(() => {
        return library.find(i => i?.game?._id === item?._id)
    }, [library, item])

    return (
        <div className={`flex flex-col border-radius transition-duration h-100 pos-relative`}
        >
            <div className={`pointer ${window.innerWidth > 800 && !isInLibrary ? " display-on-hover-parent transition-slide-right-hover-parent" : ""}`}
                onClick={() => {
                    searchParams.set("addGame", item._id)
                    setSearchParams(searchParams)
                }}>
                {isInLibrary ?
                    <Button
                        label="In Library"
                        icon={libraryIcon}
                        variant="filled"
                        borderRadius="sm"
                        size="xs"
                        className="pos-absolute top-0 right-0 px-2 m-2 box-shadow-lg display-on-hover border-none transition-slide-right-hover outline-white"
                        dataTooltipContent={isInLibrary ? "In library" : "Add to library"}
                    />
                :
                    <IconButton
                        icon={largePlusIcon}
                        variant="filled"
                        type={isInLibrary ? "success" : "secondary"}
                        borderRadius="md"
                        size="xs"
                        className="pos-absolute top-0 right-0 m-2 box-shadow-lg display-on-hover border-none transition-slide-right-hover outline-white"
                        dataTooltipContent={isInLibrary ? "In library" : "Add to library"}
                    />
                }
                <Image
                    alt={item.name}
                    img={item.thumbnail}
                    classNameImg="w-100 h-100 object-cover border-radius"
                    classNameContainer="border-radius bg-secondary w-100 bg-hover-after flex-1 h-sm-set-250-px h-set-250-px"
                />
            </div>
            <Link
                to={`/g/${item._id}`}
                className="flex flex-col gap-4 pb-4 pointer"
            >
                <div className="flex gap-2 pt-3 flex-wrap">
                    <div className="flex fs-12 gap-1 text-nowrap tag-secondary px-2 py-1 border-radius-sm">
                        <Icon icon={weightIcon}/> <strong>{item.gameWeight.toFixed(1)}<span className="weight-500 text-secondary">/5</span></strong>
                    </div>
                    <div className="flex fs-12 gap-1 text-nowrap tag-secondary px-2 py-1 border-radius-sm">
                        <Icon icon={usersIcon}/> <strong>{item.MinPlayers}{item.MaxPlayers > item.MinPlayers ? `-${item.MaxPlayers}` : ''}</strong>
                    </div>
                    <div className="flex fs-12 gap-1 text-nowrap tag-secondary px-2 py-1 border-radius-sm">
                        <Icon icon={clockIcon}/> <strong>{item.ComMinPlaytime}{item.ComMaxPlaytime !== item.ComMinPlaytime ? `-${item.ComMaxPlaytime}` : ""} Min</strong>
                    </div>
                </div>
                <div className="fs-16 px-2 weight-600 text-ellipsis-2">{item.name} <span className="fs-12 text-secondary">({item.yearPublished})</span></div>
                {/* <div className="fs-14 px-2 text-ellipsis-2">
                    {item.description}
                </div> */}
            </Link>
        </div>
    )
}

export default GameItem