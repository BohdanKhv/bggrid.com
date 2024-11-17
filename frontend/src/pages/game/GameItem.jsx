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
        <Link className={`flex flex-col flex-sm-row gap-sm-2 border-radius transition-duration pos-relative bg-secondary-hover p-2 mb-4 m-sm-0 ${window.innerWidth > 800 ? " display-on-hover-parent transition-slide-right-hover-parent" : ""}`}
            onClick={(e) => {
                e.preventDefault()
                searchParams.set("addGame", item._id)
                setSearchParams(searchParams)
            }}
        >
            <div className={`pointer`}>
                { window.innerWidth > 800 ?
                    <IconButton
                        icon={isInLibrary ? checkIcon : largePlusIcon}
                        variant="filled"
                        type={isInLibrary ? "success" : "primary"}
                        className="pos-absolute top-0 right-0 m-3 box-shadow-lg display-on-hover border-none transition-slide-right-hover outline-white"
                        dataTooltipContent={isInLibrary ? "In library" : "Add to library"}
                    />
                    : null }
                <Image
                    alt={item.name}
                    img={item.thumbnail}
                    classNameImg="w-100 h-100 object-cover border-radius"
                    classNameContainer="border-radius bg-secondary bg-hover-after flex-1 h-sm-set-250-px h-set-250-px h-sm-set-100-px w-sm-set-75-px"
                />
            </div>
            <div
                className="flex flex-col pb-4 pointer"
            >
                <div className="flex justify-between align-center pt-2">
                    <div className="fs-12 px-2 weight-600 text-secondary">{item.yearPublished}</div>
                    {isInLibrary ? <span className="text-success px-2 py-1 border-radius fs-12 bold">In Library</span> : null}
                </div>
                <div className="fs-16 pt-1 pt-sm-0 px-2 weight-500 text-ellipsis-2">{item.name}</div>
                {/* <div className="flex gap-2 pt-2 flex-wrap">
                    <div className="flex fs-12 gap-1 text-nowrap tag-secondary px-2 py-1 border-radius-sm">
                        <Icon icon={weightIcon}/> <strong>{item.gameWeight.toFixed(1)}</strong>
                    </div>
                    <div className="flex fs-12 gap-1 text-nowrap tag-secondary px-2 py-1 border-radius-sm">
                        <Icon icon={usersIcon}/> <strong>{item.MinPlayers}{item.MaxPlayers > item.MinPlayers ? `-${item.MaxPlayers}` : ''}</strong>
                    </div>
                    {item.ComMinPlaytime ?
                    <div className="flex fs-12 gap-1 text-nowrap tag-secondary px-2 py-1 border-radius-sm">
                        <Icon icon={clockIcon}/> <strong>{item.ComMinPlaytime}</strong>
                    </div>
                    : null}
                </div> */}
            </div>
        </Link>
    )
}

export default GameItem