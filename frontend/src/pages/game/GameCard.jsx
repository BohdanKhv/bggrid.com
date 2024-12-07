import { useState, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Avatar, Button, ErrorInfo, IconButton, Image, Input, Modal, Range } from "../../components"
import { Link, useSearchParams } from "react-router-dom"
import { getGameCard } from "../../features/game/gameSlice"
import { closeIcon, diceIcon, editIcon, largePlusIcon, linkIcon, upArrowRightIcon } from "../../assets/img/icons"
import { tagsEnum } from "../../assets/constants"
import { addGameToLibrary, removeGameFromLibrary, updateGameInLibrary } from "../../features/library/librarySlice"
import MobileModal from "../../components/ui/MobileModal"
import UserGuardLoginModal from "../auth/UserGuardLoginModal"


const GameCard = () => {
    const dispatch = useDispatch()

    const [rating, setRating] = useState(0)
    const [tags, setTags] = useState([])
    const [comment, setComment] = useState('')

    
    const [searchParam, setSearchParam] = useSearchParams()
    const { user } = useSelector(state => state.auth)
    const { gameCard, loadingId } = useSelector(state => state.game)
    const { library, isLoading: libraryIsLoading, loadingId: libraryLoadingId, msg } = useSelector(state => state.library)

    const isInLibrary = useMemo(() => {
        return library.find(i => i?.game?._id === gameCard?._id)
    }, [library, gameCard])


    useEffect(() => {
        let promise;
        if (searchParam.get("gameCard")) {
            promise = dispatch(getGameCard(searchParam.get("gameCard")))
        }

        return () => {
            promise && promise?.abort()
            setRating(0)
            setTags([])
            setComment('')
        }
    }, [searchParam.get("gameCard")])

    useEffect(() => {
        if (msg === 'success') {
            searchParam.delete("gameCard")
            setSearchParam(searchParam)
            setRating(0)
            setTags([])
            setComment('')
        }
    }, [msg])

    useEffect(() => {
        if (gameCard && isInLibrary) {
            setRating(isInLibrary.rating * 10 || 0)
            setTags(isInLibrary.tags || [])
            setComment(isInLibrary.comment || '') 
        }
    }, [gameCard, isInLibrary])

    return (
        searchParam.get("gameCard") &&
        window.innerWidth <= 800 ?
        <MobileModal
            isOpen={searchParam.get("gameCard")}
            onClose={() => {
                searchParam.delete("gameCard")
                setSearchParam(searchParam)
            }}
            hideClose
        >
            {loadingId === 'addGame' ?
                <ErrorInfo isLoading />
            : gameCard ?
            <>
                <div className="flex align-center gap-2 overflow-hidden pos-relative p-3">
                    <img
                        src={gameCard?.thumbnail}
                        alt={gameCard?.name}
                        draggable="false"
                        className="z-0 border-radius object-cover object-center pos-absolute left-0 blur-20 w-100 h-100"
                    />
                    <Image
                        img={gameCard?.thumbnail}
                        classNameContainer="w-set-150-px"
                        size="sm"
                    />
                    <div className="z-3">
                        <div className="fs-20 text-shadow-hard text-white weight-600 text-ellipsis-2">
                            {gameCard?.name}
                        </div>
                        <div className="fs-12 text-white pt-1 text-shadow-hard">
                            {gameCard?.yearPublished}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col z-3">
                            {user ?
                            <>
                            <Button
                                size="lg"
                                borderRadius="none"
                                className="justify-start w-100"
                                label={isInLibrary ? "Update Library" : "Add to Library"}
                                icon={isInLibrary ? editIcon : largePlusIcon}
                                variant="secondary"
                                type="default"
                                onClick={() => {
                                    searchParam.set('addGame', gameCard._id)
                                    setSearchParam(searchParam)
                                }}
                            />
                        <Button
                            size="lg"
                            borderRadius="none"
                            className="justify-start w-100"
                            label="Log a Play"
                            icon={diceIcon}
                            variant="secondary"
                            type="default"
                            onClick={(e) => {
                                searchParam.delete("gameCard")
                                searchParam.set('logPlay', gameCard._id)
                                setSearchParam(searchParam)
                            }}
                        />
                        </>
                        : 
                        <Button
                            size="lg"
                            borderRadius="none"
                            className="justify-start"
                            label="Log in to add to Library"
                            icon={linkIcon}
                            variant="secondary"
                            type="default"
                            to={`/login`}
                        />}
                    <Button
                        size="lg"
                        borderRadius="none"
                        className="justify-start"
                        label="Open Game Page"
                        icon={linkIcon}
                        variant="secondary"
                        type="default"
                        to={`/g/${gameCard._id}`}
                    />
                </div>
            </>
            : <ErrorInfo
                label="Game not found"
                secondary="Unfortunately I could not find the game you are looking for."
            />
            }
        </MobileModal>
        : 
        <Modal
            modalIsOpen={searchParam.get("gameCard")}
            onClose={() => {
                searchParam.delete("gameCard")
                setSearchParam(searchParam)
            }}
            maxWith="500px"
            minWith="500px"
            noAction
            headerNone
            classNameContent="overflow-hidden border-radius-lg"
        >
            {loadingId === 'addGame' ?
                <ErrorInfo isLoading />
            : gameCard ?
            <>
                <img
                    src={gameCard?.thumbnail}
                    alt={gameCard?.name}
                    draggable="false"
                    className="z-0 border-radius object-cover object-center pos-absolute left-0 blur-20 w-100 h-100 top-0 mask-top"
                />
                <div className="flex gap-4">
                    <div className="flex align-center gap-2 overflow-hidden pos-relative">
                        <Image
                            img={gameCard?.thumbnail}
                            classNameContainer="w-set-150-px box-shadow-lg h-min-150-px"
                            size="sm"
                        />
                    </div>
                    <div className="z-3 flex-1">
                        <div>
                            <div className="fs-24 weight-600 text-ellipsis-2">
                                {gameCard?.name}
                            </div>
                            <div className="fs-12 pt-1">
                                {gameCard?.yearPublished}
                            </div>
                        </div>
                        <div className="flex flex-col z-3 overflow-hidden border-radius mt-4">
                            {user ?
                            <>
                            <Button
                                size="lg"
                                borderRadius="none"
                                className="justify-start w-100"
                                label={isInLibrary ? "Update Library" : "Add to Library"}
                                icon={isInLibrary ? editIcon : largePlusIcon}
                                variant="secondary"
                                type="default"
                                onClick={() => {
                                    searchParam.set('addGame', gameCard._id)
                                    setSearchParam(searchParam)
                                }}
                            />
                            <Button
                                size="lg"
                                borderRadius="none"
                                className="justify-start w-100"
                                label="Log a Play"
                                icon={diceIcon}
                                variant="secondary"
                                type="default"
                                onClick={(e) => {
                                    searchParam.delete("gameCard")
                                    searchParam.set('logPlay', gameCard._id)
                                    setSearchParam(searchParam)
                                }}
                            />
                            </>
                            : 
                            <Button
                                size="lg"
                                borderRadius="none"
                                className="justify-start"
                                label="Log in to add to Library"
                                icon={linkIcon}
                                variant="secondary"
                                type="default"
                                to={`/login`}
                            />}
                            <Button
                                size="lg"
                                borderRadius="none"
                                className="justify-start"
                                label="Go to Game Page"
                                icon={linkIcon}
                                variant="secondary"
                                type="default"
                                to={`/g/${gameCard._id}`}
                            />
                        </div>
                    </div>
                </div>
            </>
            : <ErrorInfo
                label="Game not found"
                secondary="Unfortunately I could not find the game you are looking for."
            />
            }
        </Modal>
    )
}

export default GameCard