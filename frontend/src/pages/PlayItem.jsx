import { DateTime } from 'luxon'
import { Avatar, Button, Dropdown, Icon, IconButton, Image } from '../components'
import { Link, useSearchParams } from 'react-router-dom'
import { awardIcon, editIcon, instagramIcon, moreHorizontalIcon, moreIcon, trashIcon } from '../assets/img/icons'
import { addCommaToNumber } from '../assets/utils'
import { useDispatch, useSelector } from 'react-redux'
import { deletePlay } from '../features/play/playSlice'
import UserIsMeGuard from './auth/UserIsMeGuard'

const PlayItem = ({ item, hideUpdate }) => {
    const dispatch = useDispatch()

    const { user } = useSelector(state => state.auth)
    const { loadingId } = useSelector(state => state.play)
    const [searchParams, setSearchParams] = useSearchParams()

    const handleShareOnInstagram = () => {

    }

    return (
        <div className="px-sm-3 border-bottom show-on-hover-parent border-secondary transition-duration animation-slide-in display-on-hover-parent">
            <div className="flex gap-3 py-5 py-sm-3">
                <Avatar
                    img={item?.game?.thumbnail}
                    avatarColor={item?.game?.name?.length}
                    name={item?.game?.name}
                    size="lg"
                />
                <div className="flex flex-col justify-between flex-1">
                    <div className="flex gap-2 justify-between">
                        <div className="flex flex-col justify-between flex-1">
                            <div className="flex gap-2 align-center flex-1">
                                <div className="flex gap-2 flex-1 align-center">
                                    <Avatar
                                        img={item?.user?.avatar}
                                        rounded
                                        size="sm"
                                        avatarColor={item?.user?.username?.length}
                                        name={item?.user?.username}
                                    />
                                    <div className="flex flex-col flex-1">
                                        <div className="flex gap-2 justify-between">
                                            <div className="flex flex-col flex-1">
                                                {item.user.firstName ?
                                                    <>
                                                        <div className="fs-14 bold text-ellipsis-1 me-1">
                                                            {item.user.firstName} {item.user.lastName}
                                                        </div>
                                                    </>
                                                : null}
                                                <Link to={`/u/${item.user.username}`} className="text-secondary weight-400 fs-12 text-underlined-hover">@{item.user.username}</Link>
                                            </div>
                                            <span className="weight-400 text-secondary fs-12 text-wrap-nowrap">{
                                                // if more than 1 day, show the date
                                                // if less than 1 day, show relative time
                                                DateTime.now().diff(DateTime.fromISO(item.createdAt), ['days']).days > 1 ? DateTime.fromISO(item.createdAt).toFormat('LLL dd') :
                                                DateTime.fromISO(item.createdAt).toRelative().replace(' days', 'd').replace(' day', 'd').replace(' hours', 'h').replace(' hour', 'h').replace(' minutes', 'm').replace(' minute', 'm').replace(' seconds', 's').replace(' second', 's')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex fs-12 gap-2 text-secondary pt-1">
                                Played <Link to={`/g/${item.game._id}`} className="fs-12 text-main bold pointer text-ellipsis-1 text-underlined-hover">{item.game.name}</Link> {item?.playTimeMinutes ? `for ${item.playTimeMinutes} min` : null}
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
                                <UserIsMeGuard id={item.user._id}>
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
                                            searchParams.set('updatePlay', item._id)
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
                                            dispatch(deletePlay(item._id))
                                        }}
                                    />
                                </UserIsMeGuard>
                                <Button
                                    smSize="xl"
                                    size="lg"
                                    borderRadius="none"
                                    className="justify-start"
                                    label="Post on Instagram"
                                    icon={instagramIcon}
                                    variant="text"
                                    type="default"
                                    onClick={() => {
                                        handleShareOnInstagram()
                                    }}
                                />
                            </div>
                        </Dropdown>
                    </div>
                    {item.comment ?
                        <div className="fs-14 pt-3">
                            {item.comment}
                        </div>
                    : null}
                    <div className="flex flex flex-col border border-radius overflow-hidden mt-3">
                        <div className="fs-12 bold py-1 text-center border-bottom bg-secondary">
                            Players
                        </div>
                        {item?.players.length &&
                        [...item?.players]
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
                </div>
            </div>
        </div>
    )
}

export default PlayItem