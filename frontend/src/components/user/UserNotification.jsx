import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { bulkUpdateNotification, getNotifications, resetNotifications, updateNotificationToDismissed, updateNotificationToRead } from '../../features/notification/notificationSlice'
import { IconButton, FsModal, ErrorInfo, Banner, Icon, PwaNotification, Button, Menu, ContentBox } from '../'
import { arrowRightShortIcon, bellFillIcon, bellIcon, closeIcon, dotIcon, rightArrowIcon, rightArrowPointIcon, timeOffIcon } from '../../assets/img/icons'
import { ToastContainer, toast, Slide } from 'react-toastify';

const UserNotification = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { notifications, isLoading, loadingId } = useSelector((state) => state.notification)
    const unreadNotifications = useMemo(() => notifications.filter((notification) => !notification.read), [notifications])

    const [all, setAll] = useState(false)

    const [fsmOpen, setFsmOpen] = useState(false)

    useEffect(() => {
        if (all) {
        }
    }, [])

    useEffect(() => {
        let interval;

        if (all) {
            dispatch(getNotifications({all: true}))
        } else {
            dispatch(getNotifications())

            interval = setInterval(() => {
                if(fsmOpen || loadingId) return
                dispatch(getNotifications())
            }, 60000) // 1 minute
        }

        return () => interval && clearInterval(interval)
    }, [all])

    return (
        <div>
            <Menu
                open={fsmOpen}
                setOpen={setFsmOpen}
                menuButton={
                    <IconButton
                        notify={notifications.filter((notification) => !notification.read).length > 0}
                        // notifyCount={notifications.filter((notification) => !notification.dismissed).length}
                        notifyEmpty
                        icon={bellIcon}
                        onClick={() => setFsmOpen(!fsmOpen)}
                        dataTooltipContent="Notifications"
                        variant="text"
                    />
                }
            >
                <div className="p-2">
                    <div className="flex justify-between align-center flex-grow-1">
                        <div className="fs-16 weight-600">
                            Notifications
                        </div>
                        <IconButton
                            icon={closeIcon}
                            variant="text"
                            onClick={() => setFsmOpen(false)}
                        />
                    </div>
                </div>
                <div className="flex gap-2 px-4">
                    <ContentBox
                        title="Unread"
                        active={!all}
                        onClick={() => setAll(false)}
                    />
                    <ContentBox
                        title="All"
                        active={all}
                        onClick={() => setAll(true)}
                    />
                </div>
                <div className="overflow-hidden flex h-max-50-vh h-sm-max-100 h-min-150-px">
                    <div
                        className="overflow-y-auto flex-1"
                    >
                        {notifications && notifications?.length > 0 && notifications?.map((notification, index ) => (
                            <div
                                key={notification._id}
                                className={`py-4 pe-2 border-bottom`}
                            >
                                <div className="flex">
                                    
                                    <div>
                                        <Icon
                                            icon={!notification.read && dotIcon}
                                            size="lg"
                                            className={`fill-${notification.type === 0 ? '' : notification.type === 1 ? 'primary' : notification.type === 2 ? 'success' : notification.type === 3 ? 'warning' : 'danger'}`}
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col display-on-hover-parent">
                                        <div className="flex justify-between">
                                            <div className="fs-16 line-height-1 weight-500">
                                                {notification.title}
                                            </div>
                                        </div>
                                        {notification.body && notification.body.length > 0 &&
                                            <div className="fs-14 pt-1">
                                                {notification.body}
                                            </div>
                                        }
                                        <div className="pt-2">
                                            {notification.link &&
                                                    <Button
                                                        variant="link"
                                                        type="primary"
                                                        iconRight={arrowRightShortIcon}
                                                        label="Learn more"
                                                        className="bold"
                                                        onClick={() => {
                                                            navigate(notification.link)
                                                            setFsmOpen(false)
                                                        }}
                                                    />
                                            }
                                            <div className="flex justify-between align-center">
                                                <div className="opacity-50 fs-12">
                                                    {new Date(notification.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                                                </div>
                                                <div className="transition-duration display-on-hover">
                                                    <Button
                                                        variant="text"
                                                        size="sm"
                                                        type="primary"
                                                        disabled={loadingId === 'bulk'}
                                                        label="Dismiss"
                                                        muted
                                                        className="weight-600"
                                                        onClick={() => {
                                                            dispatch(updateNotificationToDismissed(notification._id))
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {notifications?.length > 0 &&
                            <div className="flex justify-between px-2 py-3 align-center gap-4">
                                <Button
                                    variant="text"
                                    type="primary"
                                    isLoading={loadingId === 'bulk'}
                                    label={`Dismiss all`}
                                    onClick={() => {
                                        dispatch(bulkUpdateNotification({ ids: notifications.map((notification) => notification._id), dismissed: true }))
                                    }}
                                />
                                {unreadNotifications.length > 0 &&
                                <Button
                                    variant="filled"
                                    type="primary"
                                    isLoading={loadingId === 'bulk'}
                                    label={`Mark (${unreadNotifications.length}) as read `}
                                    onClick={() => {
                                        dispatch(bulkUpdateNotification({ ids: notifications.map((notification) => notification._id), read: true }))
                                    }}
                                />
                                }
                            </div>
                        }
                        {isLoading ?
                            <ErrorInfo isLoading={isLoading} />
                        :
                            notifications.length === 0 &&
                            <div className="h-100 flex justify-center align-center">
                                <ErrorInfo
                                    label="You’re all up to date"
                                    secondary="There are no new notifications at the moment."
                                />
                            </div>
                        }
                    </div>
                </div>
            </Menu>
        </div>
    )
}

export default UserNotification