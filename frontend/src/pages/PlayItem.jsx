import { DateTime } from 'luxon'
import { Avatar, Button, Dropdown, Icon, IconButton, Image } from '../components'
import { Link, useSearchParams } from 'react-router-dom'
import { awardIcon, editIcon, instagramIcon, moreHorizontalIcon, moreIcon, shareIcon, trashIcon } from '../assets/img/icons'
import { addCommaToNumber } from '../assets/utils'
import { useDispatch, useSelector } from 'react-redux'
import { deletePlay } from '../features/play/playSlice'
import UserIsMeGuard from './auth/UserIsMeGuard'
import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas';
import { logoNameSvg } from '../assets/img/logo'

const DownloadItem = ({ item, setIsDownloading }) => {
    const imageRef = useRef(null);

    const handleShareOnInstagram = () => {
        const elm = imageRef.current;
        html2canvas(elm, {
            backgroundColor: "transparent",
            allowTaint: false,
            useCORS: true,
            scale: 1,
            dpi: 300,
        })
        // .then(canvas => {
        //     const link = document.createElement('a');
        //     link.download = 'test.png';
        //     link.href = canvas.toDataURL('image/png');
        //     link.click();
        // })
        // .catch(err => {
        //     setIsDownloading(false);
        // })
        // .finally(() => {
        //     setIsDownloading(false);
        // });
        .then(canvas => {
            // Convert canvas to Blob
            return new Promise((resolve, reject) => {
                canvas.toBlob(blob => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Canvas toBlob failed'));
                    }
                }, 'image/png');
            });
        })
        .then(blob => {
            if (navigator.share) {
                // Create a File from the Blob for sharing
                const file = new File([blob], `${item.game.name}-play-${DateTime.fromISO(item.createdAt).toFormat('yyyy-MM-dd')}.png`, { type: 'image/png' });
                navigator.share({
                    title: "Check out my play on BGGRID",
                    text: item.comment,
                    files: [file],
                })
                .then(() => console.log('Sharing successful'))
                .catch(err => console.error('Sharing failed:', err));
            } else {
                console.log('Web Share API is not supported in this browser.');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            setIsDownloading(false);
        })
        .finally(() => {
            setIsDownloading(false);
        });
    };

    useEffect(() => {
            setTimeout(() => {
                handleShareOnInstagram()
            }, 500)
        }, [])

    return (
        <div ref={imageRef} className={`z-99 pos-absolute animation-none-child px-sm-3 bg-main w-set-400-px p-3 border-radius`}
            style={{
                transform: 'scale(3)',
                left: '-400%',
            }}
        >
            <div className="flex gap-3">
                <div className="flex flex-col justify-between flex-1">
                    <div className="flex gap-2 justify-between">
                        <div className="flex flex-col justify-between flex-1">
                            <div className="flex justify-between gap-2 align-center flex-1">
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
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="w-max-75-px"
                                >
                                    {logoNameSvg}
                                </div>
                            </div>
                            <div className="flex fs-12 gap-2 text-secondary pt-1">
                                Played <Link to={`/g/${item.game._id}`} className="fs-12 text-main bold pointer text-ellipsis-1 text-underlined-hover">{item.game.name}</Link> <span className="text-nowrap flex-shrink-0">{item?.playTimeMinutes ? `for ${item.playTimeMinutes} min` : null}</span>
                            </div>
                        </div>
                    </div>
                    {item.comment ?
                        <div className="fs-14 pt-3">
                            {item.comment}
                        </div>
                    : null}
                    <div className="flex flex-col border border-radius overflow-hidden mt-3">
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
                    <span className="weight-400 text-secondary fs-12 text-wrap-nowrap pt-2">
                        {DateTime.fromISO(item.createdAt).toFormat('HH:mm a')} · {DateTime.fromISO(item.createdAt).toFormat('dd LLL, yy')}
                    </span>
                </div>
            </div>
        </div>
    )
}


const PlayItem = ({ item, hideUpdate }) => {
    const dispatch = useDispatch()

    const { loadingId } = useSelector(state => state.play)
    const [searchParams, setSearchParams] = useSearchParams()
    const [isDownloading, setIsDownloading] = useState(false)

    return (
        <>
        {isDownloading ? <DownloadItem item={item} setIsDownloading={setIsDownloading} /> : null}
        <div  className={`px-sm-3 bg-main border-bottom show-on-hover-parent border-secondary transition-duration display-on-hover-parent animation-slide-in`}>
            <div className="flex gap-3 pt-5 pt-sm-3 pb-2">
                <Avatar
                    img={item?.game?.thumbnail}
                    avatarColor={item?.game?.name?.length}
                    name={item?.game?.name}
                    bigDisplay
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex fs-12 gap-2 text-secondary pt-1">
                                Played <Link to={`/g/${item.game._id}`} className="fs-12 text-main bold pointer text-ellipsis-1 text-underlined-hover">{item.game.name}</Link> <span className="text-nowrap flex-shrink-0">{item?.playTimeMinutes ? `for ${item.playTimeMinutes} min` : null}</span>
                            </div>
                        </div>
                        <UserIsMeGuard id={item.user._id}>
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
                                <Button
                                    smSize="xl"
                                    size="lg"
                                    borderRadius="none"
                                    className="justify-start"
                                    label="Share"
                                    icon={shareIcon}
                                    isLoading={isDownloading}
                                    displayTextOnLoad
                                    variant="text"
                                    type="default"
                                    onClick={() => {
                                        setIsDownloading(true)
                                    }}
                                />
                            </div>
                        </Dropdown>
                        </UserIsMeGuard>
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
                    <div className="flex justify-between pt-1 align-center">
                        <span className="weight-400 text-secondary fs-12 text-wrap-nowrap">
                            {DateTime.fromISO(item.createdAt).toFormat('HH:mm a')} · {DateTime.fromISO(item.createdAt).toFormat('dd LLL, yy')}
                        </span>
                        <IconButton
                            icon={shareIcon}
                            size="xs"
                            dataTooltipContent="Share"
                            isLoading={isDownloading}
                            muted
                            type="secondary"
                            variant="text"
                            onClick={() => {
                                setIsDownloading(true)
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default PlayItem