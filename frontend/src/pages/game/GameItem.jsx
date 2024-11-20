import React, { useMemo } from 'react'
import { Button, Icon, IconButton, Image } from '../../components'
import { checkIcon, clockIcon, historyIcon, largePlusIcon, libraryIcon, patchPlusIcon, starEmptyIcon, starFillIcon, usersIcon, weightIcon } from '../../assets/img/icons'
import { Link, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { numberFormatter } from '../../assets/utils'

const GameItem = ({item}) => {

    const [searchParams, setSearchParams] = useSearchParams()
    const { library } = useSelector(state => state.library)

    const isInLibrary = useMemo(() => {
        return library.find(i => i?.game?._id === item?._id)
    }, [library, item])

    return (
        <Link className={`flex flex-col pos-relative flex-sm-row gap-sm-2 border-radius p-2 show-on-hover-parent box-shadow-hover transition-duration pos-relative mb-4 m-sm-0 ${window.innerWidth > 800 ? " display-on-hover-parent transition-slide-right-hover-parent" : ""}`}
            onClick={(e) => {
                e.preventDefault()
                searchParams.set("addGame", item._id)
                setSearchParams(searchParams)
            }}
        >
            <div className={`pointer pos-relative`}>
                { window.innerWidth > 800 ?
                    <IconButton
                        icon={isInLibrary ? checkIcon : largePlusIcon}
                        variant="filled"
                        type={isInLibrary ? "success" : "secondary"}
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
                <div className="display-on-hover">
                    <div className="pos-absolute bottom-0 w-100">
                            <div className="bg-main p-2">
                            <div className="flex flex-col flex-1 flex-wrap z-1">
                                <div className="flex fs-12 gap-2 py-2 align-center text-nowrap">
                                    <Icon icon={starEmptyIcon}/> <strong>{item.avgRating.toFixed(1)}</strong> {numberFormatter(item.numRatings)} reviews
                                </div>
                                <div className="flex fs-12 gap-2 py-2 align-center text-nowrap">
                                    <Icon icon={weightIcon}/> <strong>{item.gameWeight.toFixed(1)}</strong> weight
                                </div>
                                <div className="flex fs-12 gap-2 py-2 align-center text-nowrap">
                                    <Icon icon={usersIcon}/> <strong>{item.MinPlayers}{item.MaxPlayers > item.MinPlayers ? `-${item.MaxPlayers}` : ''}</strong> players
                                </div>
                                {item.ComMinPlaytime ?
                                <div className="flex fs-12 gap-2 py-2 align-center text-nowrap">
                                    <Icon icon={historyIcon}/> <strong>{item.ComMinPlaytime}</strong> min
                                </div>
                                : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="flex flex-col pb-4 pointer"
            >
                <div className="flex justify-between align-center pt-2">
                    <div className="fs-12 weight-600 text-main">{item.yearPublished}</div>
                    {isInLibrary ? <span className="text-success py-1 border-radius fs-12 bold">In Library</span> : null}
                </div>
                <div className="fs-16 pt-1 pt-sm-0 weight-500 text-ellipsis-2">{item.name}</div>
            </div>
        </Link>
    )
}

export default GameItem