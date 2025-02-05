import { useState, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Avatar, Button, CheckBox, ErrorInfo, HorizontalScroll, Icon, IconButton, Image, Input, InputSearch, Modal, ProgressBar, Range, Skeleton } from "../../components"
import { Link, useSearchParams } from "react-router-dom"
import { getGameCard } from "../../features/game/gameSlice"
import { closeIcon, linkIcon, searchIcon, trashIcon, upArrowRightIcon, userIcon } from "../../assets/img/icons"
import { tagsEnum } from "../../assets/constants"
import { createPlay, deletePlay, getPlayById, updatePlay } from "../../features/play/playSlice"
import { DateTime } from "luxon"
import { resetUser, searchUsers } from "../../features/user/userSlice"


const UpdateLogPlay = () => {
    const dispatch = useDispatch()

    const [searchValue, setSearchValue] = useState('')

    const { users, isLoading } = useSelector(state => state.user)
    const [comment, setComment] = useState('')
    const [playTimeMinutes, setPlayTimeMinutes] = useState(0)
    const { user } = useSelector(state => state.auth)
    const [players, setPlayers] = useState([])
    const [step, setStep] = useState(1)

    const [searchParam, setSearchParam] = useSearchParams()
    const { loadingId: loadingIdPlay, msg: playMsg, playById } = useSelector(state => state.play)
    const { follow } = useSelector(state => state.follow)

    useEffect(() => {
        if (playMsg === 'success') {
            searchParam.delete("updatePlay")
            setSearchParam(searchParam)
            setStep(1)
            setPlayers([])
            setPlayTimeMinutes(0)
            setComment('')
        }
    }, [playMsg])

    const onSubmit = () => {
        dispatch(updatePlay({
            playId: playById._id,
            comment,
            playTimeMinutes,
            players: players.map(i => ({
                user: i.user?._id,
                name: i.name,
                score: i.score,
                color: i.color,
                winner: i.winner
            }))
        }))
    }

    useEffect(() => {
        if (playById?._id) {
            const n = [...playById.players]
            setPlayers(n || [])
            setComment(playById.comment || '')
            setPlayTimeMinutes(playById.playTimeMinutes || 0)
        }

        return () => {
            setPlayers([])
            setComment('')
            setPlayTimeMinutes(0)
            setStep(1)
        }
    }, [playById])

    useEffect(() => {
        let promise;
        if (searchParam.get("updatePlay") && searchParam.get("updatePlay") !== playById?._id) {
            promise = dispatch(getPlayById(searchParam.get("updatePlay")))
        }

        return () => {
            promise && promise?.abort()
        }
    }, [searchParam.get("updatePlay")])

    const handleDelete = () => {
        dispatch(deletePlay(playById._id))
    }

    useEffect(() => {
        let promise = null;

        if (searchValue.length) {
            dispatch(searchUsers(searchValue.slice(1)))
        }

        return () => {
            promise?.abort()
        }
    }, [searchValue])

    return (
        <Modal
            modalIsOpen={searchParam.get("updatePlay")}
            onClickOutside={() => {
                searchParam.delete("updatePlay")
                setSearchParam(searchParam)
            }}
            onClose={() => {
                searchParam.delete("updatePlay")
                setSearchParam(searchParam)
            }}
            label={
                playById?.game ?
                <div className="flex align-center gap-2 overflow-hidden">
                    <Avatar
                        img={playById?.game?.thumbnail}
                        size="sm"
                    />
                    <div className="flex flex-col overflow-hidden">
                        <Link to={`/g/${playById?.game?._id}`} className="text-ellipsis-1 text-underlined-hover fs-18">{playById?.game?.name}</Link>
                        <div className="fs-12 text-secondary">
                            Log play
                        </div>
                    </div>
                </div>
                : 'Log Play'
            }
            minWith="500px"
            maxWith="500px"
            noAction={!playById}
            classNameContent="p-0 scrollbar-none overflow-y-visible overflow-y-sm-auto"
            actionBtnText={step === 1 ? 'Next' : 'Save'}
            onSubmit={step === 1 ? () => setStep(2) : onSubmit}
            disabledAction={loadingIdPlay === `update-${searchParam.get("updatePlay")}` || loadingIdPlay === `delete-${searchParam.get("updatePlay")}`}
            isLoading={loadingIdPlay === `update-${playById?._id}`}
            actionDangerBtnText={step === 2 ? 'Back' : 'Delete'}
            onSubmitDanger={step === 2 ? () => setStep(1) : handleDelete}
        >
            {loadingIdPlay === 'get-one' ?
                <ErrorInfo isLoading />
            :
            <>
            {playById ?
            <>
            <div className="sticky top-0 z-3">
                <ProgressBar
                    type="text"
                    size="2"
                    value={step === 1 ? 50 : 100}
                />
            </div>
            {step === 1 ?
                <div className="flex flex-col pt-4 gap-4 pb-2">
                    <div className="flex flex-col">
                        <div className="mx-4 mx-sm-3">
                            <InputSearch
                                className="flex-1 py-1 ps-4"
                                placeholder="Search users or add non-user player"
                                value={searchValue}
                                clearable
                                closeOnSelect
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
                                        : searchValue.length ?
                                        <div className="flex justify-between align-center">
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation()
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
                                        : !isLoading &&
                                        users.length ?
                                        users
                                        .map(i => (
                                            <div className="flex justify-between align-center"
                                                key={i._id}
                                            >
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setSearchValue('')
                                                        setPlayers([...players, {
                                                            user: i,
                                                            name: `${i.firstName} ${i.lastName}`,
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
                            <div className="my-2 mx-4 mx-sm-3 bg-secondary border-radius animation-slide-in show-on-hover-parent"
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
                                                {i.user ? `@${i.user.username}` : '(non-user) player'}
                                            </div>
                                        </div>
                                    </div>
                                    {i.user === user?._id || i.user?._id === user?._id ? <div className="fs-12 weight-600 px-4 show-on-hover">YOU</div> :
                                    <Button
                                        icon={trashIcon}
                                        variant="link"
                                        className="mx-2 weight-400 show-on-hover"
                                        onClick={() => {
                                            setPlayers(players.filter((_, j) => j !== index))
                                        }}
                                    />
                                    }
                                </div>
                                <div className="px-2 pb-2">
                                    <div className="flex gap-2">
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
                                                    className="bg-main border-radius border-children-none"
                                                    max={1000}
                                                    value={i.score || ''}
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => {
                                                        if (e.target.value > 10000) return
                                                        setPlayers(prevPlayers => {
                                                            const updatedPlayers = [...prevPlayers]
                                                            updatedPlayers[index] = { ...updatedPlayers[index], score: e.target.value }
                                                            return updatedPlayers
                                                        })
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <CheckBox
                                            label="Winner"
                                            checked={i.winner}
                                            className="px-4 py-3 bg-main border-radius"
                                            onClick={() => {
                                                setPlayers(prevPlayers => {
                                                    const updatedPlayers = [...prevPlayers]
                                                    updatedPlayers[index] = { ...updatedPlayers[index], winner: !i.winner }
                                                    return updatedPlayers
                                                })
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
                                    {[
                                        {value: 20, label: '20 min'}, {value: 30, label: '30 min'}, {value: 45, label: '45 min'}, {value: 60, label: '1 hour'}, {value: 90, label: '1 h 30 min'}, {value: 120, label: '2 hours'}, {value: 150, label: '2 h 30 min'}, {value: 180, label: '3 hours'}, {value: 240, label: '4 hours'}
                                    ].map(i => (
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
                label="Play not found"
                secondary="Unfortunately I could not find the play you are looking for."
            />
            }
            </>
            }
        </Modal>
    )
}

export default UpdateLogPlay