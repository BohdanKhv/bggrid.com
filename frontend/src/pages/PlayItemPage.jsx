import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Avatar, Button, IconButton, Icon, Skeleton, Dropdown, HorizontalScroll, Image} from '../components'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { editIcon, leftArrowIcon, shareIcon, moreIcon, trashIcon } from '../assets/img/icons'
import UpdateLogPlay from './game/UpdateLogPlay'
import { DateTime } from 'luxon'
import { getPlayById } from '../features/play/playSlice'
import UserIsMeGuard from './auth/UserIsMeGuard'
import { addCommaToNumber } from '../assets/utils'
import { Helmet, HelmetProvider } from 'react-helmet-async';


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
        <HelmetProvider>
            <main className="page-body">
                <UpdateLogPlay/>
                <div className="animation-slide-in container">
                        <div className="flex justify-between py-3 px-sm-3 sticky top-0 z-3 bg-main">
                            <div className="flex gap-2 align-center">
                                <IconButton
                                    icon={leftArrowIcon}
                                    onClick={() => {
                                        if (window.history.state && window.history.state.idx > 0) {
                                            navigate(-1); // Go back to the previous page
                                        } else {
                                            navigate(playById ? `/u/${playById?.user?.username}/plays` : "/")
                                        }
                                    }}
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
                            <Helmet>
                                <title>
                                    @{playById.user.username} played {playById.game.name} {playById.playTimeMinutes ? ` for ${playById.playTimeMinutes} min` : ""} {playById.players.find(player => player._id === playById?.user?._id && player.winner) ? 'and won!' : ''} - BGGRID
                                </title>
                                <meta name="description" content={`${playById.user.username} played ${playById.game.name} with ${playById.players.length} players`} />
                                <link rel="canonical"
                                    href={`${window.location.origin}/u/${playById.user.username}/plays/${playById._id}`}
                                />
                            </Helmet>
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
                                                {playById.players.find(player => player._id === playById?.user?._id && player.winner) ?
                                                    <div className="flex flex-col text-nowrap fs-12 bold tag-success border-radius p-2 flex-shrink-0">
                                                        🥇 You won!
                                                    </div>
                                                : 
                                                    <div className="flex flex-col text-nowrap fs-12 bold tag-secondary border-radius p-2 flex-shrink-0">
                                                        🎲 Played
                                                    </div>
                                                }
                                                {playById.playTimeMinutes ?
                                                    <div className="flex flex-col text-nowrap fs-12 bold tag-secondary border-radius p-2 flex-shrink-0">
                                                        ⌛ {playById.playTimeMinutes} min
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
                                        </div>
                                        {playById.comment ?
                                            <div className="fs-14 pt-3">
                                                {playById.comment}
                                            </div>
                                        : null}
                                        {playById.image ?
                                            <div className="pt-3">
                                                <Image
                                                    img={playById?.image?.image}
                                                    classNameImg="border-radius"
                                                    bigDisplay
                                                    classNameContainer="border h-set-200-px border-radius"
                                                />
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
                                            <IconButton
                                                icon={shareIcon}
                                                size="sm"
                                                dataTooltipContent="Share"
                                                muted
                                                type="secondary"
                                                variant="text"
                                                onClick={() => {
                                                    navigator.share({
                                                        title: "Check out play on BGGRID",
                                                        text: playById.comment || `Played ${playById.game.name} for ${playById.playTimeMinutes} min`,
                                                        url: `${window.location.origin}/u/${playById.user.username}/plays/${playById._id}`,
                                                    })
                                                }}
                                            />
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
                                            {playById.players.find(player => player._id === playById?.user?._id && player.winner) ?
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
                                            <div className="fs-14 bold text-end">
                                                {playById.game.name}
                                            </div>
                                        </div>
                                        <div className="justify-between flex-shrink-0 flex gap-2 border-bottom mx-4 py-4">
                                            <div className="fs-14 text-secondary">
                                                Playtime:
                                            </div>
                                            <div className="fs-14 bold text-end">
                                                {playById.playTimeMinutes ? `${playById.playTimeMinutes} min` : '--'}
                                            </div>
                                        </div>
                                        <div className="justify-between flex-shrink-0 flex gap-2 border-bottom mx-4 py-4">
                                            <div className="fs-14 text-secondary">
                                                Players:
                                            </div>
                                            <div className="fs-14 bold text-end">
                                                {playById.players.length || "--"}
                                            </div>
                                        </div>
                                        <div className="justify-between flex-shrink-0 flex gap-2 mx-4 py-4">
                                            <div className="fs-14 text-secondary">
                                                Date:
                                            </div>
                                            <div className="fs-14 bold text-end">
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
        </HelmetProvider>
    )
}

export default PlayItemPage