import { useState, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Avatar, Button, CheckBox, ErrorInfo, HorizontalScroll, Icon, IconButton, Image, Input, InputSearch, Modal, ProgressBar, Range, Skeleton } from "../../components"
import { Link, useSearchParams } from "react-router-dom"
import { getGameCard } from "../../features/game/gameSlice"
import { closeIcon, linkIcon, searchIcon, trashIcon, upArrowRightIcon, userIcon } from "../../assets/img/icons"
import { tagsEnum } from "../../assets/constants"
import { createPlay } from "../../features/play/playSlice"
import { DateTime } from "luxon"
import { resetUser, searchUsers } from "../../features/user/userSlice"
// import { playGame } from "../../features/library/librarySlice"


const LogPlay = () => {
    const dispatch = useDispatch()

    const [searchValue, setSearchValue] = useState('')

    const [comment, setComment] = useState('')
    const [playTimeMinutes, setPlayTimeMinutes] = useState(0)
    const { user } = useSelector(state => state.auth)
    const [players, setPlayers] = useState([{
        user: user,
        name: user.firstName ? `${user.firstName} ${user.lastName}` : user?.username,
        username: user?.username,
        avatar: user?.avatar,
        score: 0,
        color: '',
        winner: false
    }])
    const [playDate, setPlayDate] = useState(DateTime.now().toISO())
    const [step, setStep] = useState(1)

    const { users, isLoading } = useSelector(state => state.user)
    const [searchParam, setSearchParam] = useSearchParams()
    const { gameCard, loadingId } = useSelector(state => state.game)
    const { library, isLoading: libraryIsLoading, loadingId: libraryLoadingId } = useSelector(state => state.library)
    const { loadingId: loadingIdPlay, msg: playMsg } = useSelector(state => state.play)

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
        }
    }, [searchParam.get("logPlay")])

    useEffect(() => {
        if (playMsg === 'success') {
            searchParam.delete("logPlay")
            setSearchParam(searchParam)
            setStep(1)
            setPlayers([{
                user: user?._id,
                name: user.firstName ? `${user.firstName} ${user.lastName}` : user?.username,
                username: user?.username,
                avatar: user?.avatar,
                score: 0,
                color: '',
                winner: false
            }])
            setPlayTimeMinutes(0)
            setComment('')
        }
    }, [playMsg])

    useEffect(() => {
        if (gameCard && isInLibrary) {
            setComment('') 
        }

        return () => {
            setComment('')
            setStep(1)
            setPlayTimeMinutes(0)
            setPlayers([{
                user: user,
                name: user.firstName ? `${user.firstName} ${user.lastName}` : user?.username,
                username: user?.username,
                avatar: user?.avatar,
                score: 0,
                color: '',
                winner: false
            }])
        }
    }, [gameCard, isInLibrary])

    useEffect(() => {
        let promise = null;

        if (searchValue.length > 0) {
            dispatch(searchUsers(searchValue.slice(1)))
        }

        return () => {
            promise?.abort()
            dispatch(resetUser())
        }
    }, [searchValue])

    const onSubmit = () => {
        const currentDate = new Date(playDate);
        const now = new Date();
        currentDate.setHours(now.getHours());
        currentDate.setMinutes(now.getMinutes());

        dispatch(createPlay({
            gameId: gameCard._id,
            comment,
            playTimeMinutes,
            players: players.map(i => ({
                user: i.user?._id,
                name: i.name,
                score: i.score,
                color: i.color,
                winner: i.winner
            })),
            // playDate: currentDate
        }))
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
                !libraryIsLoading && !gameCard ? 'Log play' :
                <div className="flex align-center gap-2 overflow-hidden">
                    <Avatar
                        img={gameCard?.thumbnail}
                        size="sm"
                    />
                    <div className="flex flex-col overflow-hidden">
                        <Link to={`/g/${gameCard?._id}`} className="text-ellipsis-1 text-underlined-hover fs-18">{gameCard?.name}</Link>
                        <div className="fs-12 text-secondary">
                            Log play
                        </div>
                    </div>
                </div>
            }
            noAction={libraryIsLoading || !gameCard}
            classNameContent="p-0 scrollbar-none overflow-y-visible overflow-y-sm-auto"
            actionBtnText={step === 1 ? 'Next' : 'Save'}
            onSubmit={step === 1 ? () => setStep(2) : onSubmit}
            disabledAction={libraryIsLoading}
            isLoading={libraryLoadingId === `${gameCard?._id}` || loadingIdPlay === 'create'}
            actionDangerBtnText={step === 2 ? 'Back' : undefined}
            onSubmitDanger={step === 2 ? () => setStep(1) : undefined}
        >
            {loadingId === 'addGame' ?
                <ErrorInfo isLoading />
            :
            !gameCard && !loadingId ?
                <ErrorInfo label="Game not found" secondary="We couldn't find the game you are looking for." />
            : gameCard && !loadingId ?
            <>
            <div className="sticky top-0 z-3">
                <ProgressBar
                    type="text"
                    size="2"
                    value={step === 1 ? 50 : 100}
                />
            </div>
            {loadingId === 'addGame' ?
                <ErrorInfo isLoading />
            : gameCard ?
            <>
            {step === 1 ?
                <div className="flex flex-col pt-4 pb-2 gap-4">
                    <div className="flex flex-col">
                        <div className="mx-4">
                            <InputSearch
                                className="flex-1 py-1 ps-4"
                                placeholder="Search users or add non-user player"
                                value={searchValue}
                                clearable
                                onChange={(e) => setSearchValue(e.target.value)}
                                onSubmit={(e) => {
                                    setSearchValue('')
                                    setPlayers([...players, {
                                        name: searchValue.trim(),
                                        score: 0,
                                        color: '',
                                        winner: false
                                    }])
                                }}
                                searchable
                                searchChildren={
                                    <div className="py-2">
                                        { searchValue.length === 0 && users.length === 0 ?
                                        <div className="fs-12 text-center text-secondary px-3 py-3">
                                            Search for users or add non-user players
                                        </div>
                                        : !searchValue.startsWith("@") && searchValue.length ?
                                        <div className="flex justify-between align-center">
                                            <div
                                                onClick={(e) => {
                                                    setSearchValue('')
                                                    setPlayers([...players, {
                                                        name: searchValue.trim(),
                                                        score: 0,
                                                        color: '',
                                                        winner: false
                                                    }])
                                                }}
                                                className="fs-16 flex align-center py-3 gap-3 px-2 pointer bg-tertiary-hover flex-1 overflow-hidden"
                                            >
                                                <div className="flex gap-2 align-center">
                                                    <Avatar
                                                        icon={userIcon}
                                                        defaultColor
                                                        name={searchValue}
                                                        size="sm"
                                                        rounded
                                                    />
                                                    <div className="flex flex-col">
                                                        <div className="fs-14 text-ellipsis-1">
                                                            {searchValue}
                                                        </div>
                                                        <div className="fs-12 text-secondary">
                                                            (non-user) player
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null}
                                        { users.length === 0 && isLoading ?
                                        <div className="px-3 flex flex-col gap-3 py-1">
                                            <Skeleton
                                                height="50"
                                                animation="wave"
                                                className="border-radius"
                                            />
                                        </div>
                                        : users.length === 0 && !isLoading ?
                                        null
                                        : !isLoading &&
                                        users.length ?
                                        users
                                        .map(i => (
                                            <div className="flex justify-between align-center"
                                                key={i._id}
                                            >
                                                <div
                                                    onClick={(e) => {
                                                        setSearchValue('')
                                                        setPlayers([...players, {
                                                            user: i,
                                                            name: i.firstName ? `${i.firstName} ${i.lastName}` : i.username,
                                                            username: i.username,
                                                            score: 0,
                                                            color: '',
                                                            winner: false
                                                        }])
                                                    }}
                                                    className="fs-16 flex align-center py-3 gap-3 px-2 pointer bg-tertiary-hover flex-1 overflow-hidden"
                                                >
                                                    <div className="flex gap-2 align-center">
                                                        <Avatar
                                                            img={i.avatar}
                                                            rounded
                                                            avatarColor={i.username.length}
                                                            name={i.username}
                                                            alt={i.username}
                                                            size="sm"
                                                        />
                                                        <div className="flex flex-col">
                                                            <div className="fs-14 text-ellipsis-1 weight-500">
                                                                @{i?.username}
                                                            </div>
                                                            <div className="fs-12 text-secondary">
                                                                {i?.firstName} {i?.lastName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : null}
                                    </div>
                                }
                            />
                        </div>
                        <div>
                            {players.length ?
                            players.map((i, index) => (
                            <div className="my-2 mx-4 bg-secondary border-radius animation-slide-in show-on-hover-parent"
                                key={index}
                            >
                                <div
                                    className="fs-16 flex py-3 gap-3 px-2 flex-1 overflow-hidden justify-between align-center"
                                >
                                    <div className="flex gap-2 align-center">
                                        <Avatar
                                            icon={userIcon}
                                            avatarColor={i.name.length}
                                            name={searchValue}
                                            img={i?.user?.avatar}
                                            size="sm"
                                            rounded
                                        />
                                        <div className="flex flex-col">
                                            <div className="fs-14 text-ellipsis-1 weight-600">
                                                {i.name}
                                            </div>
                                            <div className="fs-12 text-secondary">
                                                {i.user ? `@${i.username}` : '(non-user) player'}
                                            </div>
                                        </div>
                                    </div>
                                    {i.user === user?._id || i?.user?._id === user?._id ? <div className="fs-12 weight-600 px-4 show-on-hover">YOU</div> :
                                    <Button
                                        icon={trashIcon}
                                        variant="link"
                                        className="mx-2 weight-400 show-on-hover"
                                        muted
                                        onClick={() => {
                                            setPlayers(players.filter((_, j) => j !== index))
                                        }}
                                    />
                                    }
                                </div>
                                <div className="px-2 pb-2">
                                    <div className="flex gap-2">
                                        {/* <div className="flex-1">
                                            <Input
                                                type="text"
                                                placeholder="Color/Team"
                                                value={i.color}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => {
                                                    const newPlayers = [...players]
                                                    newPlayers[index].color = e.target.value
                                                    setPlayers(newPlayers)
                                                }}
                                            />
                                        </div> */}
                                        <div className="flex-1 flex gap-3">
                                            {/* <div className="flex-1">
                                                <Input
                                                    type="text"
                                                    placeholder="Team/Color"
                                                    max={1000}
                                                    className="bg-main border-radius"
                                                    value={i.color || ''}
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => {
                                                        if (e.target.value > 10000) return
                                                        const newPlayers = [...players]
                                                        newPlayers[index].color = e.target.value
                                                        setPlayers(newPlayers)
                                                    }}
                                                />
                                            </div> */}
                                            <div className="flex-1">
                                                <Input
                                                    type="number"
                                                    placeholder="Score"
                                                    max={1000}
                                                    className="bg-main border-radius border-children-none"
                                                    value={i.score || ''}
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => {
                                                        if (e.target.value > 10000) return
                                                        const newPlayers = [...players]
                                                        newPlayers[index].score = e.target.value
                                                        setPlayers(newPlayers)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <CheckBox
                                            label="Winner"
                                            checked={i.winner}
                                            className="px-4 py-3 bg-main border-radius"
                                            onClick={() => {
                                                const newPlayers = [...players]
                                                newPlayers[index].winner = !i.winner
                                                setPlayers(newPlayers)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            ))
                            : <div className="fs-12 text-secondary px-2 text-center py-4">
                                No players added yet
                            </div>
                            }
                        </div>
                    </div>
                </div>
            : step === 2 && players.length > 0 &&
                <div className="flex flex-col gap-4 p-3">
                    {/* <Input
                        label="Play Date"
                        value={playDate}
                        onChange={(e) => setPlayDate(e.target.value)}
                        wrapColumn
                        maxDate={new Date()}
                        minDate={new Date('2020-01-01')}
                        type="date"
                    /> */}
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
                                    {[{value: 20, label: '20 min'}, {value: 30, label: '30 min'}, {value: 45, label: '45 min'}, {value: 60, label: '1 hour'}, {value: 90, label: '1 h 30 min'}, {value: 120, label: '2 hours'}, {value: 180, label: '2 h 30 min'}].map(i => (
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
                        onChange={(e) => setComment(e.target.value.slice(0, 500))}
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
            </>
            : null
            }
        </Modal>
    )
}

export default LogPlay