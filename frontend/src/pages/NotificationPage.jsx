import React, { useEffect, useState } from 'react'
import { Avatar, Button, ErrorInfo, HorizontalScroll } from '../components'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { acceptFriendRequest, removeFriend } from '../features/friend/friendSlice';
import { DateTime } from 'luxon';
import PlayItem from './PlayItem';
import { bellIcon } from '../assets/img/icons';


const FriendRequestNotification = ({item}) => {
    const dispatch = useDispatch();

    return (
        <div className="flex gap-3">
            <Avatar
                img={item.user?.avatar}
                name={item.user?.username}
                rounded
            />
            <div className="flex flex-col">
                <div className="fs-16 weight-500">
                    <Link
                        to={`/u/${item.user?.username}`}
                        className="text-underlined-hover bold"
                    >@{item.user?.username}</Link>
                    <span className="fs-12 text-secondary"> sent you a friend request</span>
                </div>
                <div className="pt-2 flex gap-2">
                    <Button
                        label="Accept"
                        variant="filled"
                        type="primary"
                        onClick={() => {
                            dispatch(acceptFriendRequest(item.friendRequest))
                        }}
                    />
                    <Button
                        label="Delete"
                        variant="default"
                        type="secondary"
                        onClick={() => {
                            dispatch(removeFriend(item.friendRequest))
                        }}
                    />
                </div>
            </div>
        </div>
    )
}


const LibraryNotification = ({item}) => {
    return (
        <div className="px-sm-3 border-bottom show-on-hover-parent border-secondary transition-duration animation-slide-in display-on-hover-parent">
            <div className="flex gap-3 py-5 py-sm-3">
                <Avatar
                    img={item?.user?.avatar}
                    avatarColor={item?.user?.username?.length}
                    name={item?.user?.username}
                    size="lg"
                />
                <div className="flex flex-col justify-between flex-1">
                    <div className="flex justify-between">
                        <div className="flex flex-col">
                            <div className="fs-12 text-secondary">
                                {item?.title}
                            </div>
                        </div>
                        <div className="fs-12 text-secondary">
                            {DateTime.fromISO(item?.createdAt).toRelative()}
                        </div>
                    </div>
                    <div className="fs-12 text-secondary">
                        {item?.message}
                    </div>
                </div>
            </div>
        </div>
    )
}


const PlayNotification = ({item}) => {
    return (
        <div className="px-sm-3 border-bottom show-on-hover-parent border-secondary transition-duration animation-slide-in display-on-hover-parent">
            <div className="flex gap-3 py-5 py-sm-3">
                <Avatar
                    img={item?.user?.avatar}
                    avatarColor={item?.user?.username?.length}
                    name={item?.user?.username}
                    size="lg"
                />
                <div className="flex flex-col justify-between flex-1">
                    <div className="flex justify-between">
                        <div className="flex flex-col">
                            <div className="fs-12 text-secondary">
                                {item?.title}
                            </div>
                        </div>
                        <div className="fs-12 text-secondary">
                            {DateTime.fromISO(item?.createdAt).toRelative()}
                        </div>
                    </div>
                    <div className="fs-12 text-secondary">
                        {item?.message}
                    </div>
                </div>
            </div>
        </div>
    )
}

const SystemNotification = ({item}) => {
    return (
        <div className="flex flex-col">
            <div className="fs-14 weight-600">
                {item.title}
            </div>
            <div className="fs-12 text-secondary">
                {item.message}
            </div>
        </div>
    )
}

const NotificationPage = () => {
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    const [type, setType] = useState('All');

    const { notifications } = useSelector(state => state.notification);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Notifications';
    }, []);


    return (
        <div>
            <main className="page-body">
                <div className="animation-slide-in">
                    <div className="container">
                        <div className="flex pt-6 pb-3 pt-sm-3 justify-between px-sm-3 pb-3">
                            <div className="title-1 bold">
                                Notifications
                            </div>
                            {window.innerWidth < 800 && (
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
                            )}
                        </div>
                        <div  className="px-sm-3 py-3 sticky top-0 z-3 bg-main">
                            <HorizontalScroll className="flex-1">
                                {['All', 'Friend Requests', 'Library', 'Plays', 'System'].map((a) => (
                                    <Button
                                        key={a}
                                        label={a}
                                        variant="secondary"
                                        className="animation-fade-in flex-shrink-0"
                                        type={type === a ? 'filled' : 'default'}
                                        onClick={() => {
                                            if (type == a) {
                                                setType(null)
                                            } else {
                                                setType(a)
                                            }
                                        }}
                                    />
                                ))}
                            </HorizontalScroll>
                        </div>
                        {notifications.length === 0 ?
                            <ErrorInfo
                                icon={bellIcon}
                                label="You're all caught up!"
                                secondary="You have no new notifications."
                            />
                        :
                        <div className="flex align-center gap-2 px-sm-3 overflow-hidden py-3">
                            {notifications.map((notification, index) => (
                                <div
                                    key={notification._id}
                                >
                                    {notification.type === 'friendRequest' ?
                                        <FriendRequestNotification item={notification}/>
                                    : notification.type === 'library' ?
                                        <LibraryNotification item={notification}/>
                                    : notification.type === 'play' ?
                                        <PlayNotification item={notification}/>
                                    : notification.type === 'system' ?
                                        <SystemNotification item={notification}/>
                                    : null}
                                </div>
                            ))}
                        </div>
                        }
                    </div>
                </div>
            </main>
        </div>
    )
}

export default NotificationPage