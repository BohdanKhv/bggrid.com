import React, { useMemo } from 'react'
import { Avatar, Button } from '../../components'
import { followUser, unfollowUser } from '../../features/follow/followSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


const FollowItem = ({ item }) => {
    const dispatch = useDispatch()

    const { loadingId } = useSelector((state) => state.follow)
    const { follow } = useSelector((state) => state.follow)
    const { user } = useSelector((state) => state.auth)


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
            {user?._id === item?._id ?
                <div className="fs-12 text-secondary px-3">You</div>
            : user.isFollowing ?
                <Button
                    size="sm"
                    label="Unfollow"
                    variant="filled"
                    borderRadius="sm"
                    type="primary"
                    disabled={loadingId}
                    onClick={(e) => {
                        dispatch(unfollowUser(item?._id))
                    }}
                />
            :
                <Button
                    size="sm"
                    label="Follow"
                    variant="filled"
                    borderRadius="sm"
                    type="primary"
                    disabled={loadingId}
                    onClick={(e) => {
                        dispatch(followUser(item?._id))
                    }}
                />
            }
        </div>
    </div>
    )
}

export default FollowItem