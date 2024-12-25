import React, { useMemo } from 'react'
import { Button, Icon, IconButton, Image } from '../../components'
import { checkIcon, clockIcon, historyIcon, largePlusIcon, libraryIcon, patchPlusIcon, starEmptyIcon, starFillIcon, usersIcon, weightIcon } from '../../assets/img/icons'
import { Link, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { numberFormatter } from '../../assets/utils'
import UserGuardLoginModal from '../auth/UserGuardLoginModal'

const GameItem = ({item}) => {

    const [searchParams, setSearchParams] = useSearchParams()
    const { library } = useSelector(state => state.library)

    const isInLibrary = useMemo(() => {
        return library.find(i => i?.game?._id === item?._id)
    }, [library, item])

    return (
        <Link className={`flex flex-col pos-relative gap-sm-2 border-radius p-2 show-on-hover-parent bg-secondary-hover transition-duration pos-relative mb-4 m-sm-0 display-on-hover-parent transition-slide-right-hover-parent`}
            to={`/g/${item._id}`}
        >
            <div className={`pointer pos-relative`}>
                { window.innerWidth > 800 ?
                    <UserGuardLoginModal>
                        <IconButton
                            icon={isInLibrary ? checkIcon : largePlusIcon}
                            variant="filled"
                            type={isInLibrary ? "success" : "secondary"}
                            className={`pos-absolute top-0 right-0 m-3 box-shadow-lg border-none outline-white${window.innerWidth > 800 ? " display-on-hover transition-slide-right-hover" : ""}`}
                            dataTooltipContent={isInLibrary ? "In library" : "Add to library"}
                        />
                    </UserGuardLoginModal>
                    : null }
                <Image
                    alt={item.name}
                    img={item.image}
                    classNameImg="w-100 h-100 object-cover border-radius"
                    classNameContainer="border-radius bg-secondary bg-hover-after flex-1 h-sm-set-250-px h-set-250-px"
                />
                <div className="display-on-hover">
                    <div className="pos-absolute top-0 h-100 w-100">
                    <div className="bg-main p-2 border-radius m-1"
                    onClick={(e) => {
                        e.preventDefault()
                        searchParams.set("addGame", item._id)
                        setSearchParams(searchParams)
                    }}>
                            <div className="flex flex-col flex-1 flex-wrap z-1">
                                    <div className="flex fs-12 gap-2 py-2 align-center text-nowrap">
                                    <Icon size="sm" icon={weightIcon}/> <strong>{item.complexityWeight?.toFixed(1) || '--'}</strong>
                                    </div>
                                    <div className="flex fs-12 gap-2 py-2 align-center text-nowrap">
                                    <Icon size="sm" icon={usersIcon}/> <strong>{item.minPlayers ? <>{item.minPlayers}{item.maxPlayers > item.minPlayers ? `-${item.maxPlayers}` : ''}</> : "--" }</strong>
                                    </div>
                                {item.minPlaytime ?
                                    <div className="flex fs-12 gap-2 py-2 align-center text-nowrap">
                                    <Icon size="sm" icon={historyIcon}/> <strong>{item.minPlaytime || "--"}</strong>
                                    </div>
                                : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="flex flex-col pointer"
            >
                <div className="flex justify-between align-center pt-2">
                    <div className="fs-12 weight-600 text-main">{item.year}</div>
                    {isInLibrary ? <span className="text-success py-1 border-radius fs-12 bold">In Library</span> : null}
                </div>
                <div className="fs-16 pt-1 pt-sm-0 weight-500 text-ellipsis-2">{item.name}</div>
            </div>
        </Link>
    )
}

export default GameItem