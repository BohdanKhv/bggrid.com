import React, { useEffect } from 'react'
import { Avatar, Button, ErrorInfo } from '../components'
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
                <div className="fs-14">
                    Fried request from <Link
                        to={`/u/${item.user?.username}`}
                        className="text-underlined-hover bold"
                    >{item.user?.username}</Link>
                </div>
                <div className="pt-1">
                    <Button
                        label="Accept"
                        variant="filled"
                        type="primary"
                        borderRadius="md"
                        onClick={() => {
                            dispatch(acceptFriendRequest(item.friendRequest._id))
                        }}
                    />
                    <Button
                        label="Delete"
                        variant="default"
                        type="secondary"
                        borderRadius="md"
                        onClick={() => {
                            dispatch(removeFriend(item.friendRequest._id))
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
                        {notifications.length === 0 ?
                            <ErrorInfo
                                icon={bellIcon}
                                label="You're all caught up!"
                                secondary="You have no new notifications."
                            />
                        :
                        <div className="flex align-center gap-2 px-sm-3 overflow-hidden">
                            {notifications.map((notification, index) => (
                                <div
                                    key={notification._id}
                                >
                                    {notification.type === 'friendRequest' ?
                                        <FriendRequestNotification item={item}/>
                                    : notification.type === 'library' ?
                                        <LibraryNotification item={item}/>
                                    : notification.type === 'play' ?
                                        <PlayNotification item={item}/>
                                    : notification.type === 'system' ?
                                        <SystemNotification item={item}/>
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