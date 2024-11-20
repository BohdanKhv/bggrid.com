import { useState, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button, ErrorInfo, HorizontalScroll, IconButton, Image, Input, Modal, Range } from "../../components"
import { useSearchParams } from "react-router-dom"
import { getGameCard } from "../../features/game/gameSlice"
import { closeIcon, linkIcon, upArrowRightIcon } from "../../assets/img/icons"
import { tagsEnum } from "../../assets/constants"
// import { playGame } from "../../features/library/librarySlice"


const LogPlay = () => {
    const dispatch = useDispatch()

    const [comment, setComment] = useState('')
    const [playTimeMinutes, setPlayTimeMinutes] = useState(0)
    const [players, setPlayers] = useState([])
    const [playDate, setPlayDate] = useState(new Date())

    
    const [searchParam, setSearchParam] = useSearchParams()
    const { gameCard, loadingId } = useSelector(state => state.game)
    const { library, isLoading: libraryIsLoading, loadingId: libraryLoadingId, msg } = useSelector(state => state.library)

    const isInLibrary = useMemo(() => {
        return library.find(i => i?.game?._id === gameCard?._id)
    }, [library, gameCard])


    useEffect(() => {
        let promise;
        if (searchParam.get("logPlay")) {
            promise = dispatch(getGameCard(searchParam.get("logPlay")))
        }

        return () => {
            promise && promise?.abort()
            setComment('')
        }
    }, [searchParam.get("logPlay")])

    useEffect(() => {
        if (msg === 'success') {
            searchParam.delete("logPlay")
            setSearchParam(searchParam)
        }
    }, [msg])

    useEffect(() => {
        if (gameCard && isInLibrary) {
            setComment(isInLibrary.comment || '') 
        }
    }, [gameCard, isInLibrary])

    const onSubmit = () => {
        // dispatch(playGameToLibrary({
        //     gameId: gameCard._id,
        //     rating: rating / 10,
        //     tags,
        //     comment
        // }))
    }

    return (
        <Modal
            modalIsOpen={searchParam.get("logPlay")}
            onClickOutside={() => {
                searchParam.delete("logPlay")
                setSearchParam(searchParam)
            }}
            headerNone
            noAction={libraryIsLoading}
            actionBtnText="Log Play"
            onSubmit={onSubmit}
            disabledAction={libraryIsLoading}
            isLoading={libraryLoadingId === `${gameCard?._id}`}
        >
            {loadingId === 'addGame' ?
                <ErrorInfo isLoading />
            : gameCard ?
            <>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                        <div>
                            <div className="fs-24 weight-600 text-ellipsis-1">
                                {gameCard?.name}
                            </div>
                        </div>
                        <IconButton
                            icon={closeIcon}
                            onClick={() => {
                                searchParam.delete("logPlay")
                                setSearchParam(searchParam)
                            }}
                            variant="text"
                        />
                    </div>
                    <Input
                        label="When did you play?"
                        value={playDate}
                        onChange={(e) => setPlayDate(e.target.value)}
                        wrapColumn
                        maxDate={new Date()}
                        minDate={new Date('2020-01-01')}
                        type="date"
                    />
                    <div className="flex gap-2 flex-col">
                            <div className="fs-14 weight-600 pb-2">
                                Playtime
                            </div>
                                {/* <input
                                    type="number"
                                    className="border border-radius-lg py-2 px-4 w-max-50-px"
                                    placeholder="Minutes"
                                    value={playTimeMinutes}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => {
                                        if (e.target.value < 0) return
                                        if (e.target.value > 10000) return
                                        setPlayTimeMinutes(e.target.value)
                                    }}
                                /> */}
                                <HorizontalScroll>
                                    {[{value: 20, label: '20 min'}, {value: 30, label: '30 min'}, {value: 45, label: '45 min'}, {value: 60, label: '1 hour'}, {value: 90, label: '1 hour 30 min'}, {value: 120, label: '2 hours'}].map(i => (
                                        <Button
                                            key={i.value}
                                            label={`${i.label}`}
                                            type="secondary"
                                            className="flex-shrink-0"
                                            onClick={() => setPlayTimeMinutes(i.value)}
                                            variant={`${playTimeMinutes === i.value ? 'filled' : 'outline'}`}
                                        />
                                    ))}
                                </HorizontalScroll>
                    </div>
                    <Input
                        label="Comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        wrapColumn
                        type="textarea"
                        placeholder="Write a comment in less than 500 characters..."
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

export default LogPlay