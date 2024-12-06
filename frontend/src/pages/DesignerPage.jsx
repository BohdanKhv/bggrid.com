import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Avatar, Button, Dropdown, ErrorInfo, IconButton, Image, TabContent } from '../components'
import { shareIcon, leftArrowIcon, moreIcon, listIcon, gridIcon } from '../assets/img/icons'
import { getDesignerById, resetDesigner } from '../features/designer/designerSlice'
import GameItemCol from './game/GameItemCol'
import GameItem from './game/GameItem'


const DesignerGames = () => {

    const { designerById, isLoading } = useSelector(state => state.designer)

    return (
        <div>
            { !isLoading && !designerById?.games?.length ?
                <ErrorInfo
                    label="No games found"
                    secondary="This designer has no games"
                />
            :
                <div className="grid flex-wrap animation-slide-in h-fit-content grid-xl-cols-5 grid-lg-cols-4 grid-md-cols-3 grid-sm-cols-2 grid-cols-4">
                    {designerById?.games?.map((i, inx, arr) => (
                        <div
                            key={i._id}
                        >
                            <GameItem
                                item={i}
                            />
                        </div>
                    ))}
                </div>
            }
            {isLoading ?
                <ErrorInfo isLoading/>
            : null}
        </div>
    )
}


const DesignerPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { designerId, tab } = useParams()

    const { designerById, isLoading, msg } = useSelector(state => state.designer)

    useEffect(() => {
        window.scrollTo(0, 0)
        if (!designerId) return

        const promise = dispatch(getDesignerById(designerId))

        return () => {
            promise && promise.abort()
            dispatch(resetDesigner())
        }
    }, [designerId])

    useEffect(() => {
        document.title = designerById?.name || 'Designer'
    }, [designerById])


    return (
        <div
            className="h-min-100 offset-header-sm"
        >
            {isLoading ?
                <div className="h-min-100 justify-center align-center flex">
                    <ErrorInfo
                        isLoading
                    />
                </div>
            : designerById ? 
                <div className="flex flex-col h-min-100 container px-sm-3 animation-slide-in">
                    {window.innerWidth < 800 ?
                        <div className="flex justify-between bg-main py-3 sticky top-0 z-9">
                            <div className="flex align-center gap-3">
                                <IconButton
                                    icon={leftArrowIcon}
                                    variant="secondary"
                                    type="text"
                                    onClick={() => navigate(-1)}
                                />
                                <div className="fs-14 weight-600">
                                    {designerById.name}
                                </div>
                            </div>
                            <Dropdown
                                customDropdown={
                                    <IconButton
                                        icon={moreIcon}
                                        variant="secondary"
                                        type="text"
                                    />
                                }
                            >
                                <div className="flex flex-col">
                                    <Button
                                        className="justify-start"
                                        icon={shareIcon}
                                        variant="secondary"
                                        borderRadius="sm"
                                        label="Share"
                                        type="text"
                                        onClick={() => {
                                            navigator.share({
                                                title: designerById.name,
                                                text: `Check out this boardgames designer on BGGRID!`,
                                                url: window.location.href
                                            })
                                        }}
                                    />
                                </div>
                            </Dropdown>
                        </div>
                    : null }
                    <div className="flex flex-col mt-6 pos-relative mt-sm-0 mb-3">
                        <div className="z-3 w-max-600-px bg-translucent-blur border-radius bg-sm-main">
                        <div className="flex gap-4 align-center">
                            <div>
                                <div className="fs-24 weight-600 text-ellipsis-2 d-sm-none">
                                    {designerById.name}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    {/* <div>
                        <TabContent
                            items={[
                                {label: 'Games'},
                            ]}
                            activeTabName={tab || 'games'}
                            setActiveTabName={(e) => {
                                navigate(`/p/${designerId}/${e}`)
                            }}
                        />
                    </div> */}
                    {/* {tab === 'games' ? */}
                        <DesignerGames/>
                    {/* : <DesignerGames/> } */}
                    <div className="flex gap-3 px-4">
                </div>
            </div>
            : msg === '404' ?
            <div className="h-min-100 justify-center align-center flex">
                    <ErrorInfo
                        code="404"
                        info="Designer not found"
                    />
                </div>
            : 
                <div className="h-min-100 justify-center align-center flex">
                    <ErrorInfo
                        label="Oh no!"
                        secondary="Something went wrong"
                    />
                </div>
            }
        </div>
    )
}

export default DesignerPage