import React, { useEffect, useState } from 'react'
import { Icon, IconButton, InputSearch, Modal, Image, ErrorInfo, Avatar, Button } from '../../components'
import { Link, useSearchParams } from 'react-router-dom'
import { arrowLeftShortIcon, gamesIcon, leftArrowIcon, searchIcon, userIcon } from '../../assets/img/icons'
import { useDispatch, useSelector } from 'react-redux'
import { searchUsers } from '../../features/user/userSlice'
import { sendFriendRequest } from '../../features/friend/friendSlice'
import FriendItem from './FriendItem'

const UserSearchModal = () => {
    const dispatch = useDispatch()

    const { users, isLoading } = useSelector((state) => state.user)

    const { friends, loadingId } = useSelector((state) => state.friend)

    const [searchParams, setSearchParams] = useSearchParams()
    const [searchValue, setSearchValue] = useState('')

    useEffect(() => {
        let promise;

        if (searchValue.length > 0) {
            promise = dispatch(searchUsers(`?q=${searchValue}`))
        }

        return () => {
            promise?.abort()
        }
    }, [searchValue])

    return (
        <>
        <Modal
            modalIsOpen={searchParams.get('su') === 'true'}
            onClickOutside={() => {
                searchParams.delete('su')
                setSearchParams(searchParams.toString())
            }}
            onClose={() => {
                searchParams.delete('su')
                setSearchParams(searchParams.toString())
            }}
            classNameContent="p-0"
            headerNone={window.innerWidth <= 800}
            noAction
            label="Search users"
        >
            <div className="border-sm-bottom align-center flex">
                {window.innerWidth <= 800 ?
                    <IconButton
                        icon={arrowLeftShortIcon}
                        variant="link"
                        size="lg"
                        type="secondary"
                        onClick={() => {
                            searchParams.delete('su')
                            setSearchParams(searchParams.toString())
                        }}
                    />
                : null}
                <InputSearch
                    className="flex-1 py-1 border border-sm-none my-4 mx-3 m-sm-0 border-radius-md"
                    placeholder="Search users"
                    value={searchValue}
                    icon={window.innerWidth > 800 ? searchIcon : null}
                    clearable
                    autoFocus
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            <div className="pb-4 px-4">
                {users && users.length > 0 ?
                <>
                    {users
                    .map((searchItem) => (
                        <FriendItem
                            item={searchItem}
                            key={searchItem._id}
                            showRemoveButton
                        />
                    ))}
                </>
                :
                    isLoading ?
                        <ErrorInfo isLoading/>
                    :
                    users.length === 0 && searchValue.length < 3 ?
                        <ErrorInfo
                            secondary="Search for users by username, first name, or last name"
                        />
                    :
                    users.length === 0 ?
                        <ErrorInfo
                            secondary={`Nothing matched your search for "${searchValue}"`}
                        />
                : null}
            </div>
        </Modal>
        </>
    )
}

export default UserSearchModal