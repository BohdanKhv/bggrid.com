import { useState, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Avatar, Button, ErrorInfo, HorizontalScroll, IconButton, Image, Input, Modal, ProgressBar, Range } from "../../components"
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
    const [step, setStep] = useState(1)

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
            onClose={() => {
                searchParam.delete("logPlay")
                setSearchParam(searchParam)
            }}
            label={
                <div className="flex align-center gap-2 overflow-hidden">
                    <Avatar
                        img={gameCard?.thumbnail}
                        size="sm"
                    />
                    <div className="flex flex-col overflow-hidden">
                        <div className="text-ellipsis-1 fs-18">{gameCard?.name}</div>
                        <div className="fs-12 text-secondary">
                            Log play
                        </div>
                    </div>
                </div>
            }
            noAction={libraryIsLoading}
            classNameContent="p-0"
            actionBtnText={step === 1 ? 'Next' : 'Save'}
            onSubmit={step === 1 ? () => setStep(2) : onSubmit}
            disabledAction={libraryIsLoading}
            isLoading={libraryLoadingId === `${gameCard?._id}`}
            actionDangerBtnText={step === 2 ? 'Back' : undefined}
            onSubmitDanger={step === 2 ? () => setStep(1) : undefined}
        >
            <div>
                <ProgressBar
                    type="primary"
                    size="2"
                    value={step === 1 ? 50 : 100}
                />
            </div>
            {loadingId === 'addGame' ?
                <ErrorInfo isLoading />
            : gameCard ?
            <>
            {step === 1 ?
                <div className="flex flex-col">
                    
                </div>
            :
                <div className="flex flex-col gap-4 p-3">
                    <Input
                        label="Play Date"
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
                }
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