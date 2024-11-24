import React, { useMemo } from 'react'
import { Avatar, Button } from '../../components'
import { removeFriend, sendFriendRequest } from '../../features/friend/friendSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


const FriendItem = ({item}) => {
    const dispatch = useDispatch()

    const { loadingId } = useSelector((state) => state.friend)
    const { friends } = useSelector((state) => state.friend)

    const isFriend = useMemo(() => {
        return friends.find((friend) => friend?.friend?._id === item?._id)
    }, [friends, item])

    return (
        <div className="flex justify-between align-center">
        <div
            className="fs-14 flex align-center justify-between px-4 py-2 gap-3 flex-1 overflow-hidden"
        >
            <div className="flex gap-3 align-center">
                <Avatar
                    img={item.avatar}
                    rounded
                    avatarColor={item.username.length}
                    name={item.username}
                    alt={item.username}
                    classNameContainer="w-set-50-px h-set-50-px border-radius-sm overflow-hidden"
                />
                <div className="flex flex-col">
                    <Link
                        target='_blank'
                        to={`/u/${item?.username}`}
                        className="fs-14 weight-500 text-ellipsis-2 text-underlined-hover pointer">
                        @{item?.username}
                    </Link>
                    <div className="fs-12 text-secondary">
                        {item?.firstName} {item?.lastName}
                    </div>
                </div>
            </div>
            {isFriend ?
                isFriend.pending ?
                    <Button
                        label="Pending"
                        variant="default"
                        type="secondary"
                        borderRadius="md"
                        disabled={loadingId}
                        onClick={(e) => {
                            dispatch(removeFriend(isFriend?._id))
                        }}
                    />
                :
                    <Button
                        label="Friend"
                        variant="default"
                        type="secondary"
                        borderRadius="md"
                        disabled={loadingId}
                        onClick={(e) => {
                            dispatch(removeFriend(isFriend?._id))
                        }}
                    />
            :
                <Button
                    label="Add friend"
                    variant="filled"
                    borderRadius="md"
                    type="primary"
                    disabled={loadingId}
                    onClick={(e) => {
                        dispatch(sendFriendRequest(item?._id))
                    }}
                />
            }
        </div>
    </div>
    )
}

export default FriendItem