import React, { useEffect, useState } from 'react'
import { Avatar, Button, ErrorInfo, HorizontalScroll } from '../components'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { acceptFriendRequest, removeFriend } from '../features/friend/friendSlice';
import { DateTime } from 'luxon';
import PlayItem from './PlayItem';
import { bellIcon } from '../assets/img/icons';
import { readNotifications } from '../features/notification/notificationSlice';


const NotificationItem = ({item}) => {
    return (
        <div className="flex gap-3 px-3 bg-secondary-hover border-radius">
            <div className="py-4">
                <Avatar
                    img={item.sender?.avatar}
                    name={item.sender?.username}
                    rounded
                />
            </div>
            <div className="flex flex-col flex-1 border-bottom py-4">
                <div className="fs-16 pt-2">
                    <Link
                        to={`/u/${item.sender?.username}`}
                        className="bold mx-1 fs-16 text-underlined-hover"
                        >@{item.sender?.username}</Link>
                    <span className="fs-14">
                        {item.message}
                    </span>
                    <span className="fs-14 text-secondary px-1">
                        {DateTime.now().diff(DateTime.fromISO(item.createdAt), ['days']).days > 1 ? DateTime.fromISO(item.createdAt).toFormat('LLL dd') :
                        DateTime.fromISO(item.createdAt).toRelative().replace(' days', 'd').replace(' day', 'd').replace(' hours', 'h').replace(' hour', 'h').replace(' minutes', 'm').replace(' minute', 'm').replace(' seconds', 's').replace(' second', 's')}
                    </span>
                </div>
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

        dispatch(readNotifications());
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
                        <div>
                            <ErrorInfo
                                secondary="You have no new notifications."
                            />
                            </div>
                        :
                        <div>
                            {notifications.map((notification, index) => (
                                <div
                                    key={notification._id}
                                >
                                    <NotificationItem item={notification}/>
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