import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Avatar, Button, IconButton, Icon, Skeleton, Dropdown, HorizontalScroll} from '../components'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { editIcon, arrowLeftShortIcon, shareIcon, moreIcon, trashIcon } from '../assets/img/icons'
import UpdateLogPlay from './game/UpdateLogPlay'
import { DateTime } from 'luxon'
import { getPlayById } from '../features/play/playSlice'
import UserIsMeGuard from './auth/UserIsMeGuard'
import { addCommaToNumber } from '../assets/utils'


const PlayItemPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { playId } = useParams()

    const [searchParams, setSearchParams] = useSearchParams()
    const { loadingId, playById } = useSelector((state) => state.play)
    const user = useSelector((state) => state.auth.user)

    useEffect(() => {
        window.scrollTo(0, 0)

        const promise = dispatch(getPlayById(playId))

        return () => {
            promise && promise.abort()
        }
    }, [playId])

    return (
        <>
            <main className="page-body">
                <UpdateLogPlay/>
                <div className="animation-slide-in container">
                        <div className="flex justify-between py-3 px-sm-3 sticky top-0 z-3 bg-main">
                            <div className="flex gap-2 align-center">
                                <IconButton
                                    icon={arrowLeftShortIcon}
                                    onClick={() => navigate(`/u/${user?.username}/plays`) }
                                    type="secondary"
                                    variant="text"
                                />
                                <div className="fs-20 bold">
                                    Play
                                </div>
                            </div>
                            {window.innerWidth <= 800 && user ? (
                                <div className="justify-end flex align-center flex-no-wrap gap-3">
                                    <div
                                        onClick={() => {
                                            document.querySelector('.open-navbar-button').click()
                                        }}
                                    >
                                        <Avatar
                                            img={`${user?.avatar}`}
                                            name={user ? `${user?.email}` : null}
                                            rounded
                                            avatarColor="1"
                                            size="sm"
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        {loadingId === 'get-one' ?
                            <div className="flex flex-col gap-3 py-3 px-sm-3">
                                <div className="flex gap-2">
                                    <Skeleton height="38" width="38" animation="wave" rounded/>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <Skeleton height="18" width={225} animation="wave"/>
                                        <Skeleton height="12" width={250} animation="wave"/>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 flex-1">
                                    <Skeleton height="200" animation="wave"/>
                                </div>
                            </div>
                        : playById &&
                        <div className="flex animation-slide-in flex-sm-col px-sm-3">
                            <div className={`flex-1 bg-main show-on-hover-parent border-secondary display-on-hover-parent`}>
                                {window.innerWidth < 800 &&
                                    <div className="flex gap-3 py-2">
                                        <Avatar
                                            img={playById?.game?.thumbnail}
                                            avatarColor={playById?.game?.name?.length}
                                            name={playById?.game?.name}
                                            bigDisplay
                                            size="lg"
                                        />
                                        <div>
                                            <div className="flex fs-20 gap-2 text-secondary pb-2">
                                                <Link to={`/g/${playById.game._id}`} className="text-main bold pointer text-ellipsis-1 text-underlined-hover">{playById.game.name}</Link>
                                            </div>
                                            <HorizontalScroll>
                                                {playById.players.find(player => player._id === user._id && player.winner) ?
                                                    <div className="flex flex-col text-nowrap fs-12 bold tag-success border-radius p-2 flex-shrink-0">
                                                            🥇 You won!
                                                    </div>
                                                : 
                                                    <div className="flex flex-col text-nowrap fs-12 bold bg-tertiary border-radius p-2 flex-shrink-0">
                                                            🎲 Played
                                                    </div>
                                                }
                                                {playById.playTimeMinutes ?
                                                    <div className="flex flex-col text-nowrap fs-12 bold tag-success border-radius p-2 flex-shrink-0">
                                                            {playById.playTimeMinutes} min
                                                    </div>
                                                : null}
                                            </HorizontalScroll>
                                        </div>
                                    </div>
                                }
                                <div className="flex gap-3 pt-3 pt-sm-3 pb-2">
                                    <div className="flex flex-col justify-between flex-1">
                                        <div className="flex gap-2 justify-between">
                                            <div className="flex flex-col justify-between flex-1">
                                                <div className="flex gap-2 align-center flex-1">
                                                    <div className="flex gap-2 flex-1 align-center">
                                                        <Avatar
                                                            img={playById?.user?.avatar}
                                                            rounded
                                                            avatarColor={playById?.user?.username?.length}
                                                            name={playById?.user?.username}
                                                        />
                                                        <div className="flex flex-col flex-1">
                                                            <div className="flex gap-2 justify-between">
                                                                <div className="flex flex-col flex-1">
                                                                    {playById.user.firstName ?
                                                                        <>
                                                                            <div className="fs-14 bold text-ellipsis-1 me-1">
                                                                                {playById.user.firstName} {playById.user.lastName}
                                                                            </div>
                                                                        </>
                                                                    : null}
                                                                    <Link to={`/u/${playById.user.username}`} className="text-secondary weight-400 fs-12 text-underlined-hover w-fit-content">@{playById.user.username}</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                                <Dropdown
                                                    classNameDropdown="p-0"
                                                    mobileDropdown
                                                    dropdownLabel="Actions"
                                                    customDropdown={
                                                        <Icon
                                                            icon={moreIcon}
                                                            size="xs"
                                                            className="opacity-50 py-1 hover-opacity-100"
                                                        />
                                                }>
                                                    <div className="flex flex-col overflow-hidden border-radius">
                                                        <UserIsMeGuard id={playById.user._id}>
                                                            <Button
                                                                smSize="xl"
                                                                size="lg"
                                                                borderRadius="none"
                                                                className="justify-start"
                                                                label="Edit"
                                                                icon={editIcon}
                                                                disabled={loadingId}
                                                                variant="text"
                                                                type="default"
                                                                onClick={() => {
                                                                    searchParams.set('updatePlay', playById._id)
                                                                    setSearchParams(searchParams)
                                                                }}
                                                            />
                                                            <Button
                                                                smSize="xl"
                                                                size="lg"
                                                                borderRadius="none"
                                                                className="justify-start"
                                                                label="Delete"
                                                                disabled={loadingId}
                                                                icon={trashIcon}
                                                                variant="text"
                                                                type="default"
                                                                onClick={() => {
                                                                    dispatch(deletePlay(playById._id))
                                                                }}
                                                            />
                                                        </UserIsMeGuard>
                                                        <Button
                                                            smSize="xl"
                                                            size="lg"
                                                            borderRadius="none"
                                                            className="justify-start"
                                                            label="Share"
                                                            icon={shareIcon}
                                                            displayTextOnLoad
                                                            variant="text"
                                                            type="default"
                                                            onClick={() => {
                                                                navigator.share({
                                                                    title: 'Play',
                                                                    text: `${playById?.user?.username} played ${playById.game.name} with ${playById.players.length} players`,
                                                                    url: `${window.location.origin}/u/${playById.user.username}/plays/${playById._id}`
                                                                })
                                                            }}
                                                        />
                                                    </div>
                                                </Dropdown>
                                        </div>
                                        {playById.comment ?
                                            <div className="fs-14 pt-3">
                                                {playById.comment}
                                            </div>
                                        : null}
                                        <div className="flex flex flex-col border border-radius overflow-hidden mt-4">
                                            <div className="fs-12 bold py-1 text-center border-bottom bg-secondary">
                                                Players
                                            </div>
                                            {playById?.players.length &&
                                            [...playById?.players]
                                            .sort((a, b) => b.score - a.score)
                                            ?.map((player, index) => (
                                                <div className="flex justify-between align-center px-3 py-2"
                                                    key={index}
                                                >
                                                    <div className="flex gap-2 align-center">
                                                        <Avatar
                                                            img={player?.user?.avatar}
                                                            size="xs"
                                                            rounded
                                                            avatarColor={player?.name?.length}
                                                            name={player?.name}
                                                        />
                                                        {player.winner ?
                                                            <Icon icon="🥇" size="sm"/>
                                                        : null}
                                                        <div className={`flex flex-col`}>
                                                            {player.user ?
                                                                <Link to={`/u/${player.user.username}`} className="fs-14 weight-500 pointer text-underlined-hover text-ellipsis-1">
                                                                    @{player.user.username}
                                                                </Link>
                                                            : 
                                                                <div className="fs-14 weight-500 pointer text-ellipsis-1">
                                                                    {player.name}
                                                                </div>
                                                            }
                                                            {player.color ?
                                                                <div className="fs-12 text-secondary">
                                                                    {player.color}
                                                                </div>
                                                            : null}
                                                        </div>
                                                    </div>
                                                    <div className={`fs-14 ${!player.score ? ' opacity-50' : " bold" }`}>
                                                        {addCommaToNumber(player.score || 0)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between pt-4 align-center">
                                            <span className="weight-400 text-secondary fs-14 text-wrap-nowrap">
                                                {DateTime.fromISO(playById.createdAt).toFormat('HH:mm a')} · {DateTime.fromISO(playById.createdAt).toFormat('dd LLL, yy')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {window.innerWidth > 800 &&
                                <div className="flex flex-col w-set-300-px gap-3 order-sm-1">
                                    <div className="flex flex-col bg-secondary border-radius overflow-hidden ms-5 mb-4 h-fit-content">
                                        <div className="justify-between flex-shrink-0 flex gap-2 border-bottom mx-4 py-4">
                                            <Avatar
                                                img={playById?.game?.thumbnail}
                                                avatarColor={playById?.game?.name?.length}
                                                name={playById?.game?.name}
                                                bigDisplay
                                                size="lg"
                                            />
                                            {playById.players.find(player => player._id === user._id && player.winner) ?
                                                <div className="flex flex-col justify-between flex-1 tag-success border-radius p-3 align-center justify-center">
                                                    <div className="fs-14 bold">
                                                        🥇 You won!
                                                    </div>
                                                </div>
                                            : 
                                                <div className="flex flex-col justify-between flex-1 bg-tertiary border-radius p-3 align-center justify-center">
                                                    <div className="fs-14 bold">
                                                        🎲 Played
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        <div className="justify-between flex-shrink-0 flex gap-2 border-bottom mx-4 py-4">
                                            <div className="fs-14 text-secondary">
                                                Game:
                                            </div>
                                            <div className="fs-14 bold">
                                                {playById.game.name}
                                            </div>
                                        </div>
                                        <div className="justify-between flex-shrink-0 flex gap-2 border-bottom mx-4 py-4">
                                            <div className="fs-14 text-secondary">
                                                Playtime:
                                            </div>
                                            <div className="fs-14 bold">
                                                {playById.playTimeMinutes ? `${playById.playTimeMinutes} min` : '--'}
                                            </div>
                                        </div>
                                        <div className="justify-between flex-shrink-0 flex gap-2 border-bottom mx-4 py-4">
                                            <div className="fs-14 text-secondary">
                                                Players:
                                            </div>
                                            <div className="fs-14 bold">
                                                {playById.players.length || "--"}
                                            </div>
                                        </div>
                                        <div className="justify-between flex-shrink-0 flex gap-2 mx-4 py-4">
                                            <div className="fs-14 text-secondary">
                                                Date:
                                            </div>
                                            <div className="fs-14 bold">
                                                {DateTime.fromISO(playById.createdAt).toFormat('dd LLL, yy')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        }
                    </div>
            </main>
        </>
    )
}

export default PlayItemPage