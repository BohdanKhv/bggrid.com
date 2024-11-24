import React, { useMemo, useState } from 'react'
import { Avatar, Button, ErrorInfo, InputSearch, Modal } from '../../components'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { searchIcon, usersIcon } from '../../assets/img/icons'
import { removeFriend } from '../../features/friend/friendSlice'
import FriendItem from './FriendItem'

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
            onClose={() => {
                searchParams.delete('friends')
                setSearchParams(searchParams.toString())
            }}
            classNameContent="p-0"
            noAction
            label="Friends"
        >
            {/* <div className="border border-radius bg-secondary m-2">
                <InputSearch
                    icon={searchIcon}
                    placeholder="Search friends"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div> */}
            <div className="py-2">
                {friends && friends.length > 0 ?
                <>
                    {friends
                    .map((item) => (
                        <FriendItem
                            item={item.friend}
                            key={item._id}
                        />
                    ))}
                </>
                :
                    isLoading ?
                        <ErrorInfo isLoading/>
                    :
                    friends.length === 0 && searchValue.length < 3 ?
                        <ErrorInfo
                            label="Oops! No friends found"
                            secondary="Search for friends by username, first name, or last name"
                            onClick={() => {
                                searchParams.set('su', 'true')
                                searchParams.delete('friends')
                                setSearchParams(searchParams.toString())
                            }}
                            btnLabel="Find friends"
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