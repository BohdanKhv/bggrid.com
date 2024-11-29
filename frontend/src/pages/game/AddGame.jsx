import { useState, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Avatar, Button, ErrorInfo, IconButton, Image, Input, Modal, Range } from "../../components"
import { Link, useSearchParams } from "react-router-dom"
import { getGameCard } from "../../features/game/gameSlice"
import { closeIcon, linkIcon, upArrowRightIcon } from "../../assets/img/icons"
import { tagsEnum } from "../../assets/constants"
import { addGameToLibrary, removeGameFromLibrary, updateGameInLibrary } from "../../features/library/librarySlice"


const AddGame = () => {
    const dispatch = useDispatch()

    const [rating, setRating] = useState(0)
    const [tags, setTags] = useState([])
    const [comment, setComment] = useState('')

    
    const [searchParam, setSearchParam] = useSearchParams()
    const { gameCard, loadingId } = useSelector(state => state.game)
    const { library, isLoading: libraryIsLoading, loadingId: libraryLoadingId, msg } = useSelector(state => state.library)

    const isInLibrary = useMemo(() => {
        return library.find(i => i?.game?._id === gameCard?._id)
    }, [library, gameCard])


    useEffect(() => {
        let promise;
        if (searchParam.get("addGame")) {
            promise = dispatch(getGameCard(searchParam.get("addGame")))
        }

        return () => {
            promise && promise?.abort()
            setRating(0)
            setTags([])
            setComment('')
        }
    }, [searchParam.get("addGame")])

    useEffect(() => {
        if (msg === 'success') {
            searchParam.delete("addGame")
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

    const addToLibrary = () => {
        dispatch(addGameToLibrary({
            gameId: gameCard._id,
            rating: rating / 10,
            tags,
            comment
        }))
    }

    const updateLibrary = () => {
        dispatch(updateGameInLibrary({
            gameId: gameCard._id,
            rating: rating / 10,
            tags,
            comment
        }))
    }

    return (
        <Modal
            modalIsOpen={searchParam.get("addGame")}
            onClickOutside={() => {
                searchParam.delete("addGame")
                setSearchParam(searchParam)
            }}
            onClose={() => {
                searchParam.delete("addGame")
                setSearchParam(searchParam)
            }}
            noAction={libraryIsLoading}
            actionBtnText={
                isInLibrary ? "Update Library" : "Add to Library"
            }
            label={
                <div className="flex align-center gap-2 overflow-hidden">
                    <Avatar
                        img={gameCard?.thumbnail}
                        size="sm"
                    />
                    <div className="flex flex-col overflow-hidden">
                        <Link to={`/g/${gameCard?._id}`} className="text-ellipsis-1 text-underlined-hover fs-18">{gameCard?.name}</Link>
                        <div className="fs-12 text-secondary">
                            {isInLibrary ? "Update your library" : "Add to your library"}
                        </div>
                    </div>
                </div>
            }
            onSubmit={isInLibrary ? updateLibrary : addToLibrary}
            disabledAction={libraryIsLoading}
            isLoading={libraryLoadingId === `${gameCard?._id}`}
            actionDangerBtnText={isInLibrary ? "Remove" : null}
            onSubmitDanger={() => {
                dispatch(removeGameFromLibrary(gameCard._id))
            }}
        >
            {loadingId === 'addGame' ?
                <ErrorInfo isLoading />
            : gameCard ?
            <>
                <div className="flex flex-col gap-4">
                    <div>
                        <div className={`fs-54 bold mb-3${rating / 10 == 0 ? " text-secondary" : rating / 10 >= 4 && rating / 10 < 5 ? " text-success" : rating / 10 > 0 && rating / 10 < 3 ? " text-danger" : rating / 10 >= 3 && rating / 10 < 4 ? " text-warning" : rating / 10 == 5 ? " text-primary" : ""}`}>
                            {rating / 10} {
                                    rating / 10 == 10 ?
                                    "Perfect"
                                    : rating / 10 > 7 ?
                                    "Great"
                                    : rating / 10 > 4 ?
                                    "Good"
                                    : rating / 10 > 0 ?
                                    "Poor"
                                    : "Not rated"
                                }
                        </div>
                        <div className="flex align-center pos-relative">
                            <div className="fs-16 weight-500 pos-absolute left-0 px-4 text-secondary mask-right pointer-events-none">
                                <span className="bold me-3 ms-1">
                                    {`0`}
                                </span>
                                Slide to rate {`> > > > > > >`}
                            </div>
                            <div className="fs-16 bold pos-absolute right-0 px-4 me-1 text-secondary pointer-events-none">
                                5
                            </div>
                            <Range
                                value={rating}
                                onChange={setRating}
                                min={0}
                                max={50}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {tagsEnum.map((i) => (
                            <Button
                                label={i}
                                key={i}
                                onClick={() => {
                                    if (tags.includes(i)) {
                                        setTags(tags.filter(j => j !== i))
                                    } else {
                                        setTags([...tags, i])
                                    }
                                }}
                                variant={tags.includes(i) ? "filled" : "outline"}
                                type="secondary"
                            />
                        ))}
                    </div>
                    <Input
                        value={comment}
                        onChange={(e) => {
                            setComment(e.target.value.slice(0, 500))
                        }}
                        wrapColumn
                        type="textarea"
                        maxLength={500}
                        placeholder="Write your review in less than 500 characters..."
                    />
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

export default AddGame