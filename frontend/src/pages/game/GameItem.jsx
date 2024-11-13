import React, { useMemo } from 'react'
import { Button, IconButton, Image } from '../../components'
import { checkIcon, largePlusIcon, patchPlusIcon } from '../../assets/img/icons'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const GameItem = ({item}) => {

    const [searchParams, setSearchParams] = useSearchParams()
    const { library } = useSelector(state => state.library)

    const isInLibrary = useMemo(() => {
        return library.some(i => i?.game?._id === item?._id)
    }, [library, item])

    return (
        <div className={`flex flex-col pointer border-radius transition-duration h-100 pos-relative${window.innerWidth > 800 ? " display-on-hover-parent" : ""}`}>
            <IconButton
                icon={isInLibrary ? checkIcon : largePlusIcon}
                variant="filled"
                type={isInLibrary ? "success" : "secondary"}
                borderRadius="md"
                className="pos-absolute top-0 right-0 m-2 box-shadow-lg display-on-hover border border-w-2"
                dataTooltipContent={isInLibrary ? "In library" : "Add to library"}
                onClick={() => {
                    searchParams.set("addGame", item._id)
                    setSearchParams(searchParams)
                }}
            />
            <Image
                alt={item.name}
                img={item.thumbnail}
                classNameImg="w-100 h-100 object-cover border-radius"
                classNameContainer="border-radius bg-secondary w-100 bg-hover-after flex-1 h-set-300-px h-sm-set-250-px"
            />
            <div className="flex flex-col gap-1 pb-4">
                <div className="bold text-secondary fs-12 px-2 pt-2">{item.yearPublished}</div>
                <div className="fs-16 px-2 weight-600 text-ellipsis-2">{item.name}</div>
                <div className="fs-14 px-2 text-ellipsis-2">
                    {item.description}
                </div>
            </div>
        </div>
    )
}

export default GameItem