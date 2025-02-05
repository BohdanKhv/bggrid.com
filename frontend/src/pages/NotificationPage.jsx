import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Avatar, Button, ErrorInfo, HorizontalScroll, Icon, IconButton } from '../components'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import PlayItem from './PlayItem';
import { bellIcon, rightArrowIcon, settingsIcon } from '../assets/img/icons';
import { getMyNotification, readNotifications, resetNotifications } from '../features/notification/notificationSlice';


const NotificationItem = ({item}) => {
    const navigate = useNavigate();

    return (
        <div className="flex gap-3 px-3 bg-secondary-hover border-radius pointer border-radius-sm-none"
            onClick={() => {
                if (item.link) {
                    navigate(item.link);
                }
            }}
        >
            <div className="py-4">
                <Avatar
                    img={item?.sender?.avatar}
                    name={item?.sender?.username}
                    rounded
                    avatarColor={item.sender?.username?.length}
                />
            </div>
            <div className="flex justify-between gap-2 flex-1 border-bottom align-center border-secondary">
                <div className="flex flex-col flex-1 py-4 flex-1">
                    <div className="fs-16">
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
                {item.link && (
                    <Icon
                        icon={rightArrowIcon}
                        size="sm"
                        className="fill-secondary"
                    />
                )}
            </div>
        </div>
    )
}

const NotificationPage = () => {
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    const [type, setType] = useState('All');

    const { notifications, hasMore, isLoading, isError } = useSelector(state => state.notification);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Notifications';

        const promise = dispatch(getMyNotification());
        dispatch(readNotifications());

        return () => {
            promise && promise.abort();
            dispatch(resetNotifications());
        }
    }, []);


    const observer = useRef();
    const lastElementRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isError) {
                const promise = dispatch(getMyNotification())
        
                return () => {
                    promise && promise.abort();
                    observer.current && observer.current.disconnect();
                }
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore, isError]);

    return (
        <>
            <main className="page-body flex-1">
                <div className="animation-slide-in container flex flex-1">
                    <div className="flex-1 px-4 px-sm-0 pb-4">
                        <div className="flex py-3 pt-sm-3 justify-between px-sm-3 pb-3 sticky-sm top-0 z-3 bg-main">
                            <div className="title-1 bold">
                                Notifications
                            </div>
                            {window.innerWidth < 800 && (
                                <div className="justify-end flex align-center flex-no-wrap gap-3">
                                    <IconButton
                                        icon={settingsIcon}
                                        size="md"
                                        variant="secondary"
                                        type="text"
                                        to="/settings/notifications"
                                    />
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
                        {
                        !isLoading &&
                        notifications.length === 0 ?
                            <div>
                                <ErrorInfo
                                    secondary="You have no notifications."
                                />
                            </div>
                        :
                        <div>
                            {notifications.map((notification, index) => (
                                <div
                                    key={notification._id}
                                    ref={notifications.length === index + 1 ? lastElementRef : null}
                                >
                                    <NotificationItem item={notification}/>
                                </div>
                            ))}
                        </div>
                        }
                        {isLoading && (
                            <ErrorInfo isLoading/>
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}

export default NotificationPage