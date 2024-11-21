import { DateTime } from 'luxon'
import { Avatar, Icon, Image } from '../components'
import { Link } from 'react-router-dom'
import { awardIcon } from '../assets/img/icons'

const PlayItem = ({ item }) => {

    return (
        <div className="px-3 border-bottom border-secondary transition-duration animation-slide-in display-on-hover-parent">
            <div className="flex gap-3 py-5">
                <Avatar
                    img={item?.user?.avatar}
                    rounded
                    defaultColor
                    name={item?.user?.username}
                />
                <div className="flex flex-col justify-between flex-1">
                    <div className="flex flex-col justify-between flex-1">
                        <div className="flex gap-2 justify-between">
                            <div className="flex gap-2">
                                <div target="_blank" to={`/u/${item.user.username}`} className="fs-14 bold text-ellipsis-1">
                                    {item.user.firstName} {item.user.lastName}
                                </div>
                                <span className="fs-14 weight-400 text-secondary">·</span>
                                <Link className="text-secondary weight-400 fs-12 text-underlined-hover">@{item.user.username}</Link>
                            </div>
                            <span className="weight-400 text-secondary fs-12 text-wrap-nowrap">{
                                // if more than 1 day, show the date
                                // if less than 1 day, show relative time
                                DateTime.now().diff(DateTime.fromISO(item.playDate), ['days']).days > 1 ? DateTime.fromISO(item.playDate).toFormat('LLL dd') :
                            DateTime.fromISO(item.playDate).toRelative().replace(' day', 'd').replace(' days', 'd').replace(' hours', 'h').replace(' hour', 'h').replace(' minutes', 'm').replace(' minute', 'm').replace(' seconds', 's').replace(' ago', '')}</span>
                        </div>
                        <div className="flex fs-14 gap-2 text-secondary pt-1">
                            Played <Link target="_blank" to={`/g/${item.game._id}`} className="fs-14 text-main bold pointer text-ellipsis-1 text-underlined-hover">{item.game.name}</Link> {item?.playTimeMinutes ? `for ${item.playTimeMinutes} min` : null}
                        </div>
                    </div>
                    {item.comment ?
                        <div className="fs-14 pt-3">
                            {item.comment}
                        </div>
                    : null}
                    <div className="flex gap-2 flex flex-col border border-radius overflow-hidden mt-3">
                        {item?.players.length &&
                        [...item?.players]
                        .sort((a, b) => b.score - a.score)
                        ?.map((player, index) => (
                            <div className="flex justify-between align-center bg-tertiary-hover p-3"
                                key={index}
                            >
                                <div className="flex gap-2 align-center">
                                    <Avatar
                                        img={player?.user?.avatar}
                                        size="xs"
                                        avatarColor={player?.name?.length}
                                        name={player?.name}
                                    />
                                    <div className="flex flex-col">
                                        <div className="flex gap-1 align-center">
                                            {player.winner ?
                                                <Icon icon={awardIcon} size="sm"/>
                                            : null}
                                            {player.user ?
                                                <Link target="_blank" to={`/u/${player.user.username}`} className="fs-14 weight-600 pointer text-underlined-hover text-ellipsis-1">
                                                    @{player.user.username}
                                                </Link>
                                            : 
                                                <div className="fs-14 weight-600 pointer text-ellipsis-1">
                                                    {player.name}
                                                </div>
                                            }
                                        </div>
                                        {player.color ?
                                            <div className="fs-12 text-secondary">
                                                {player.color}
                                            </div>
                                        : null}
                                    </div>
                                </div>
                                <div className={`fs-14 w-set-20-px text-center ${player.winner && player.score ? " text-success" : player.score ? " text-warning" : " text-danger"}`}>
                                    {player.score ? player.score : '-'}
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