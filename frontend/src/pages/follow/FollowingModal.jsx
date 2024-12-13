import React, { useMemo, useState } from 'react'
import { Avatar, Button, ErrorInfo, InputSearch, Modal } from '../../components'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { searchIcon, usersIcon } from '../../assets/img/icons'
import { getFollowers, getFollowing } from '../../features/follow/followSlice'
import FollowItem from './FollowItem'

const FollowingModal = ({ follow, hideSearch }) => {

    const [searchParams, setSearchParams] = useSearchParams()
    const { loadingId, isLoading } = useSelector((state) => state.follow)
    const [searchValue, setSearchValue] = useState('')

    const { user } = useSelector((state) => state.auth)

    return (
        <Modal
            modalIsOpen={searchParams.get('follow') === 'true'}
            onClickOutside={() => {
                searchParams.delete('follow')
                setSearchParams(searchParams.toString())
            }}
            onClose={() => {
                searchParams.delete('follow')
                setSearchParams(searchParams.toString())
            }}
            classNameContent="p-0"
            noAction
            label="Follow"
        >
            <div className="py-2 px-4">
                {follow && follow.length > 0 ?
                <>
                    {follow
                    .map((item) => (
                        <FollowItem
                            item={item.friend || item}
                            key={item._id}
                            showRemoveButton
                        />
                    ))}
                </>
                :
                    isLoading ?
                        <ErrorInfo isLoading/>
                    :
                    follow.length === 0 && searchValue.length < 3 ?
                        <ErrorInfo
                            label="Oops! No follow found"
                            secondary="Search for follow by username, first name, or last name"
                            onClick={() => {
                                if (!user) return
                                searchParams.set('su', 'true')
                                searchParams.delete('follow')
                                setSearchParams(searchParams.toString())
                            }}
                            btnLabel={hideSearch ? null : user ? "Find follow" : 'Login to find follow'}
                        />
                    :
                    follow.length === 0 ?
                        <ErrorInfo
                            secondary={`Nothing matched your search for "${searchValue}"`}
                        />
                : null}
            </div>
        </Modal>
    )
}

export default FollowingModal