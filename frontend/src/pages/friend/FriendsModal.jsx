import React, { useState } from 'react'
import { Avatar, Button, ErrorInfo, InputSearch, Modal } from '../../components'
import { Link, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { searchIcon } from '../../assets/img/icons'

const FriendsModal = ({ friends }) => {

    const [searchParams, setSearchParams] = useSearchParams()
    const { loadingId, isLoading } = useSelector((state) => state.friend)
    const [searchValue, setSearchValue] = useState('')

    return (
        <Modal
            modalIsOpen={searchParams.get('friends') === 'true'}
            onClickOutside={() => {
                searchParams.delete('friends')
                setSearchParams(searchParams.toString())
            }}
            classNameContent="p-0"
            noAction
            label="Friends"
        >
            <div className="border border-radius bg-secondary m-2">
                <InputSearch
                    icon={searchIcon}
                    placeholder="Search friends"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            <div className="py-4">
                {friends && friends.length > 0 ?
                <>
                    <div className="fs-20 pb-3 bold px-3">
                        Search results
                    </div>
                    {friends
                    .map((item) => (
                        <div className="flex justify-between align-center bg-secondary-hover"
                            key={item.friend?._id}
                        >
                            <div
                                className="fs-14 flex align-center justify-between px-4 py-2 gap-3 flex-1 overflow-hidden"
                            >
                                <div className="flex gap-3 align-center">
                                    <Avatar
                                        img={item?.friend.avatar}
                                        rounded
                                        avatarColor={item?.friend.username.length}
                                        name={item?.friend.username}
                                        alt={item?.friend.username}
                                        classNameContainer="w-set-50-px h-set-50-px border-radius-sm overflow-hidden"
                                    />
                                    <div className="flex flex-col">
                                        <Link
                                            target='_blank'
                                            to={`/u/${item.friend?.username}`}
                                            className="fs-14 weight-500 text-ellipsis-2 text-underlined-hover pointer">
                                            @{item.friend?.username}
                                        </Link>
                                        <div className="fs-12 text-secondary">
                                            {item.friend?.firstName} {item.friend?.lastName}
                                        </div>
                                    </div>
                                </div>
                                {friends.find((friend) => friend?.friend?._id === item.friend?._id) ?
                                    friends.find((friend) => friend?.friend?._id === item.friend?._id).status === 'pending' ?
                                        <div className="fs-14 text-secondary weight-500 px-4">
                                            Pending
                                        </div>
                                    :
                                    <div className="fs-14 text-secondary weight-500 px-4">
                                        Friends 
                                    </div>
                                :
                                    <Button
                                        label="Add friend"
                                        variant="filled"
                                        type="primary"
                                        isLoading={loadingId === `send-${item.friend?._id}`}
                                        disabled={loadingId}
                                        onClick={(e) => {
                                            dispatch(sendFriendRequest(item.friend?._id))
                                        }}
                                    />
                                }
                            </div>
                        </div>
                    ))}
                </>
                :
                    isLoading ?
                        <ErrorInfo isLoading/>
                    :
                    friends.length === 0 && searchValue.length < 3 ?
                        <ErrorInfo
                            secondary="Search for friends by username, first name, or last name"
                        />
                    :
                    friends.length === 0 ?
                        <ErrorInfo
                            secondary={`Nothing matched your search for "${searchValue}"`}
                        />
                : null}
            </div>
        </Modal>
    )
}

export default FriendsModal