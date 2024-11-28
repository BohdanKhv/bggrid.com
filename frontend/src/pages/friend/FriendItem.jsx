import React, { useMemo } from 'react'
import { Avatar, Button } from '../../components'
import { acceptFriendRequest, removeFriend, sendFriendRequest } from '../../features/friend/friendSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


const FriendItem = ({ item, showRemoveButton }) => {
    const dispatch = useDispatch()

    const { loadingId } = useSelector((state) => state.friend)
    const { friends } = useSelector((state) => state.friend)

    const isFriend = useMemo(() => {
        return friends.find((friend) => friend?.friend?._id === item?._id)
    }, [friends, item])

    return (
        <div className="flex justify-between align-center">
            <div
                className="fs-14 flex align-center justify-between py-1 gap-3 flex-1 overflow-hidden"
            >
            <div className="flex gap-3 align-center flex-1 overflow-hidden">
                <Avatar
                    img={item.avatar}
                    rounded
                    avatarColor={item.username.length}
                    name={item.username}
                    alt={item.username}
                    classNameContainer="w-set-50-px h-set-50-px border-radius-sm overflow-hidden"
                />
                <div className="flex flex-col text-ellipsis-1">
                    <Link
                        target='_blank'
                        to={`/u/${item?.username}`}
                        className="fs-14 weight-500 text-ellipsis text-underlined-hover pointer">
                        {item?.username}
                    </Link>
                    <div className="fs-12 text-secondary text-ellipsis">
                        {item?.firstName} {item?.lastName}
                    </div>
                </div>
            </div>
            {isFriend ?
                isFriend.pending && !isFriend.myRequest ?
                    <div className="flex gap-2 align-center justify-center">
                        <Button
                        size="sm"
                            label="Decline"
                            borderRadius="sm"
                            variant="secondary"
                            type="default"
                            className="flex-shrink-0"
                            onClick={(e) => {
                                e.preventDefault()
                                dispatch(removeFriend(isFriend._id))
                            }}
                            disabled={loadingId}
                        />
                        <Button
                        size="sm"
                            label="Accept"
                            variant="primary"
                            type="filled"
                            className="flex-shrink-0"
                            borderRadius="sm"
                            onClick={(e) => {
                                e.preventDefault()
                                dispatch(acceptFriendRequest(isFriend._id))
                            }}
                            disabled={loadingId}
                        />
                    </div>
                :
                isFriend.pending && isFriend.myRequest ?
                    <Button
                        size="sm"
                        label="Cancel"
                        variant="default"
                        type="secondary"
                        className="flex-shrink-0"
                        borderRadius="sm"
                        disabled={loadingId}
                        onClick={(e) => {
                            dispatch(removeFriend(isFriend?._id))
                        }}
                    />
                : showRemoveButton &&
                    <Button
                        size="sm"
                        label="Remove"
                        variant="default"
                        type="secondary"
                        borderRadius="sm"
                        disabled={loadingId}
                        onClick={(e) => {
                            dispatch(removeFriend(isFriend?._id))
                        }}
                    />
            :
                <Button
                    size="sm"
                    label="Add friend"
                    variant="filled"
                    borderRadius="sm"
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