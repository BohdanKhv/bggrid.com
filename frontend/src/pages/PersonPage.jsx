import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Avatar, Button, Dropdown, ErrorInfo, IconButton, Image, TabContent } from '../components'
import { shareIcon, leftArrowIcon, moreIcon, listIcon, gridIcon } from '../assets/img/icons'
import { getPersonById, resetPerson } from '../features/person/personSlice'
import GameItemCol from './game/GameItemCol'
import GameItem from './game/GameItem'


const PersonGames = () => {

    const { personById, isLoading } = useSelector(state => state.person)

    return (
        <div>
            { !isLoading && !personById?.games?.length ?
                <ErrorInfo
                    label="No games found"
                    secondary="This person has no games"
                />
            :
                <div className="grid flex-wrap animation-slide-in h-fit-content grid-xl-cols-5 grid-lg-cols-4 grid-md-cols-3 grid-sm-cols-2 grid-cols-4">
                    {personById?.games?.map((i, inx, arr) => (
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


const PersonPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { personId, tab } = useParams()

    const { personById, isLoading, msg } = useSelector(state => state.person)

    useEffect(() => {
        window.scrollTo(0, 0)
        if (!personId) return

        const promise = dispatch(getPersonById(personId))

        return () => {
            promise && promise.abort()
            dispatch(resetPerson())
        }
    }, [personId])

    useEffect(() => {
        document.title = personById?.name || 'Person'
    }, [personById])


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
            : personById ? 
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
                                    {personById.name}
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
                                                title: personById.name,
                                                text: `Check out this boardgames person on BGGRID!`,
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
                                    {personById.name}
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
                                navigate(`/p/${personId}/${e}`)
                            }}
                        />
                    </div> */}
                    {/* {tab === 'games' ? */}
                        <PersonGames/>
                    {/* : <PersonGames/> } */}
                    <div className="flex gap-3 px-4">
                </div>
            </div>
            : msg === '404' ?
            <div className="h-min-100 justify-center align-center flex">
                    <ErrorInfo
                        code="404"
                        info="Person not found"
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

export default PersonPage