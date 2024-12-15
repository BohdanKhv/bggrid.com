import React, { useEffect, useState } from 'react'
import { Icon, IconButton, InputSearch, Modal, Image, ErrorInfo, Avatar, Button } from '../../components'
import { Link, useSearchParams } from 'react-router-dom'
import { arrowLeftShortIcon, gamesIcon, leftArrowIcon, searchIcon, userIcon } from '../../assets/img/icons'
import { useDispatch, useSelector } from 'react-redux'
import FollowItem from './FollowItem'
import { searchUsers } from '../../features/user/userSlice'

const FollowSearchModal = () => {
    const dispatch = useDispatch()

    const { users, isLoading } = useSelector((state) => state.user)

    const [searchParams, setSearchParams] = useSearchParams()
    const [searchValue, setSearchValue] = useState('')

    useEffect(() => {
        let promise;

        if (searchValue.length > 0) {
            promise = dispatch(searchUsers(`${searchValue}&checkIsFollowing=true`))
        }

        return () => {
            promise?.abort()
        }
    }, [searchValue])

    return (
        <>
        {window.innerWidth < 800 ?
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
                        <FollowItem
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
                    users.length === 0 && !searchValue.length ?
                        <ErrorInfo
                            secondary="Search for users by username, first name, or last name"
                        />
                    :
                    users.length === 0 && searchValue.length ?
                        <ErrorInfo
                            secondary={`Nothing matched your search for "${searchValue}"`}
                        />
                : null}
            </div>
        </Modal>
        </>
        :
        <div className="flex border-radius-lg flex-1 w-max-400-px w-100 flex-1">
        <InputSearch
            icon={searchIcon}
            className="p-3 bg-secondary border-none flex-1 py-1 border-radius-lg"
            classNameFocus="border-radius-bottom-none"
            placeholder="Search users"
            value={searchValue}
            clearable
            onChange={(e) => setSearchValue(e.target.value)}
            searchable
            searchChildren={
                <div className="py-2 px-3">
                {searchValue.length === 0 && users.length === 0 ?
                    <div className="fs-14 px-4 py-2 gap-3 text-secondary weight-600 text-center">
                        Type to search
                    </div>
                :
                    users && users.length > 0 ?
                <>
                    {users
                    .map((searchItem) => (
                        <FollowItem
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
                    users.length === 0 && !searchValue.length ?
                        <ErrorInfo
                            secondary="Search for users by username, first name, or last name"
                        />
                    :
                    users.length === 0 && searchValue.length ?
                        <ErrorInfo
                            secondary={`Nothing matched your search for "${searchValue}"`}
                        />
                : null}
            </div>
            }
            />
        </div>
        }
    </>
    )
}

export default FollowSearchModal