import React, { useMemo } from 'react'
import { Button, HorizontalScroll, Icon, IconButton, Image } from '../../components'
import { checkIcon, clockIcon, editIcon, largePlusIcon, libraryIcon, linkIcon, diceIcon, patchPlusIcon, starFillIcon, usersIcon, weightIcon } from '../../assets/img/icons'
import { Link, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { numberFormatter } from '../../assets/utils'

const GameItemCol = ({item}) => {

    const [searchParams, setSearchParams] = useSearchParams()
    const { library } = useSelector(state => state.library)

    const isInLibrary = useMemo(() => {
        return library.find(i => i?.game?._id === item?._id)
    }, [library, item])

    return (
        <div className="border-radius px-4 px-sm-3 pt-4 transition-duration animation-slide-in  display-on-hover-parent">
            <div className="flex justify-between">
            <div className="flex gap-3">
                <Image
                    img={item.thumbnail}
                    classNameContainer="w-set-100-px h-set-100-px border-radius"
                    classNameImg="border-radius"
                />
                <div className="flex flex-col justify-between">
                    <Link className="fs-16 weight-600 pointer text-underlined-hover"
                        to={`/g/${item._id}`}
                        target='_blank'
                    >
                        {item.name}
                    </Link>
                    <div className="fs-12 text-secondary">
                        {item.yearPublished}
                    </div>
                    <div className="flex gap-2 align-center mt-3">
                        {isInLibrary ?
                        <div className="fs-12 text-primary weight-600 pe-2 flex">
                            In Library
                        </div>
                        : 
                            <Button
                                label="Add"
                                icon={largePlusIcon}
                                variant="secondary"
                                type="outline"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    searchParams.set('addGame', item._id)
                                    setSearchParams(searchParams)
                                }}
                            />
                        }
                        <Button
                            label="Log Play"
                            icon={diceIcon}
                            variant="primary"
                            type="filled"
                            className="display-on-hover display-on-hover-sm-block"
                            onClick={(e) => {
                                e.stopPropagation()
                                searchParams.set('logPlay', item._id)
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
                        {item.avgRating.toFixed(1)}
                        <Icon
                            icon={starFillIcon}
                            className="ms-1"
                            size="sm"
                        />
                    </div>
                    <span className="fs-12 opacity-75 pt-2 weight-500">
                        {numberFormatter(item.numRatings)} reviews
                    </span>
                </div>
                <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2">
                    <div className="fs-14 bold flex align-center">
                        {item.gameWeight.toFixed(1)}<span className="weight-500 text-secondary"></span>
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
                <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2">
                    <div className="fs-14 bold flex align-center">
                        {item.ComMinPlaytime}{item.ComMaxPlaytime !== item.ComMinPlaytime ? `-${item.ComMaxPlaytime}` : ""} Min
                    </div>
                    <span className="fs-12 opacity-75 pt-2 weight-500">
                        Playtime
                    </span>
                </div>
                <div className="flex flex-col pe-4 align-center justify-center w-min-100-px border-right pe-sm-2">
                    <div className="fs-14 bold flex align-center">
                        {item.MinPlayers}{item.MaxPlayers > item.MinPlayers ? `-${item.MaxPlayers}` : ''}
                    </div>
                    <span className="fs-12 opacity-75 pt-2 weight-500">
                        Players
                    </span>
                </div>
                <div className="flex flex-col pe-4 align-center justify-center w-min-100-px">
                    <div className="fs-14 bold flex align-center">
                        {item.mfgAgeRec}+
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