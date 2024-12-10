import React, { useMemo } from 'react'
import { Button, HorizontalScroll, Icon, IconButton, Image } from '../../components'
import { checkIcon, clockIcon, editIcon, largePlusIcon, libraryIcon, linkIcon, diceIcon, patchPlusIcon, starFillIcon, usersIcon, weightIcon, gamesIcon } from '../../assets/img/icons'
import { Link, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { numberFormatter } from '../../assets/utils'
import UserGuardLoginModal from '../auth/UserGuardLoginModal'

const GameItemCol = ({item}) => {

    const [searchParams, setSearchParams] = useSearchParams()
    const { library } = useSelector(state => state.library)

    const isInLibrary = useMemo(() => {
        return library.find(i => i?.game?._id === item?._id)
    }, [library, item])

    return (
        <div className="border-radius px-sm-3 px-sm-3 pt-4 transition-duration animation-slide-in  display-on-hover-parent">
            <div className="flex justify-between">
            <div className="flex gap-3">
                <Image
                    img={item.image}
                    errIcon={gamesIcon}
                    classNameContainer="w-set-100-px h-set-100-px border-radius"
                    classNameImg="border-radius"
                />
                <div className="flex flex-col">
                    <Link className="fs-16 weight-600 pointer text-underlined-hover"
                        to={`/g/${item._id}`}
                    >
                        {item.name} {item.year ? <span className="fs-14 weight-500">({item.year})</span> : null}
                    </Link>
                    {item.publishers
                    .filter(pub => ['self-published', 'unknown'].indexOf(pub.name.toLowerCase()) === -1)
                    .length ?
                        <div className="fs-12 weight-500 opacity-50 hover-opacity-100">
                            {item.publishers.slice(0, 1).map((pub, i) => (
                                <Link key={i}
                                    to={`/p/${pub._id}`}
                                    className="text-underlined-hover"
                                >
                                    {pub.name}
                                </Link>
                            ))}
                        </div>
                    : null}
                    <div className="flex align-center gap-2 pt-2">
                        <div className="flex gap-1 align-center">
                            <span className={`fs-14 weight-500`}>{((item?.rating || 0) / 2).toFixed(1)}</span>
                            <Icon icon={starFillIcon} size="xs"/>
                        </div>
                        <span className={`fs-12 weight-400 text-secondary`}>{numberFormatter(item.numRatings || 0)} reviews</span>
                    </div>
                    <div className="flex gap-2 align-center mt-3">
                        {isInLibrary ?
                        <div className="fs-12 text-secondary weight-600 pe-2 flex">
                            In Library
                        </div>
                        : 
                            <UserGuardLoginModal>
                                <Button
                                    label="Add to Library"
                                    icon={largePlusIcon}
                                    variant="secondary"
                                    type="filled"
                                    onClick={(e) => {
                                        searchParams.set('addGame', item._id)
                                        setSearchParams(searchParams)
                                    }}
                                />
                            </UserGuardLoginModal>
                        }
                        {/* <UserGuardLoginModal>
                            <Button
                                label="Log a Play"
                                icon={diceIcon}
                                variant="secondary"
                                type="filled"
                                className="display-on-hover display-on-hover-sm-block"
                                onClick={(e) => {
                                    searchParams.set('logPlay', item._id)
                                    setSearchParams(searchParams)
                                }}
                            />
                        </UserGuardLoginModal> */}
                    </div>
                </div>
            </div>
        </div>
            <HorizontalScroll
                className="mt-5 border-bottom pb-4"
            >
                <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2">
                    <div className="fs-14 bold flex align-center">
                        {item?.complexityWeight ?
                        <>
                        {item?.complexityWeight?.toFixed(1)}<span className="text-secondary">/5</span>
                        </>
                        : "--"}
                    </div>
                    <span className="fs-12 opacity-75 pt-2 weight-500">
                        Weight
                    </span>
                </div>
                <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2">
                    <div className="fs-14 bold flex align-center">
                        {item.minPlaytime ?
                        <>
                        {item.minPlaytime}{item.maxPlaytime !== item.minPlaytime ? `-${item.maxPlaytime}` : ""} Min
                        </>
                        : "--"}
                    </div>
                    <span className="fs-12 opacity-75 pt-2 weight-500">
                        Playtime
                    </span>
                </div>
                <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2">
                    <div className="fs-14 bold flex align-center">
                        {item.minPlayers ?
                        <>
                        {item.minPlayers}{item.maxPlayers > item.minPlayers ? `-${item.maxPlayers}` : ''}
                        </>
                        : "--"}
                    </div>
                    <span className="fs-12 opacity-75 pt-2 weight-500">
                        Players
                    </span>
                </div>
                <div className="flex flex-col pe-4 align-center justify-center w-min-100-px">
                    <div className="fs-14 bold flex align-center">
                        {item.minAge ?
                        <>
                        {item.minAge}+
                        </>
                        : "--"}
                    </div>
                    <span className="fs-12 opacity-75 pt-2 weight-500">
                        Age
                    </span>
                </div>
            </HorizontalScroll>
        </div>
    )
}

export default GameItemCol