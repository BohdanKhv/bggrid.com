import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Button, ErrorInfo, InputSearch, Modal, Skeleton } from '../../components'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { searchIcon, usersIcon } from '../../assets/img/icons'
import { getFollowers, resetFollow } from '../../features/follow/followSlice'
import FollowItem from './FollowItem'

const FollowersModal = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { userById } = useSelector((state) => state.user)
    const { follow, isLoading, isError, hasMore } = useSelector((state) => state.follow)

    const getData = () => {
        dispatch(getFollowers(userById._id))
    }

    const observer = useRef();
    const lastElementRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isError && !isLoading) {
                const promise = getData();
        
                return () => {
                    promise && promise.abort();
                    dispatch(resetFollow());
                    observer.current && observer.current.disconnect();
                }
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore, isError]);

    useEffect(() => {
        getData()

        return () => {
            dispatch(resetFollow())
        }
    }, [])

    return (
        <Modal
            modalIsOpen={true}
            onClickOutside={() => {
                navigate(`/u/${userById.username}`)
            }}
            onClose={() => {
                navigate(`/u/${userById.username}`)
            }}
            minWith="400px"
            with="400px"
            maxWith="400px"
            classNameContent="p-0"
            noAction
            label="Followers"
        >
            <div className="py-2 px-4">
                {follow.length === 0 && !isLoading ?
                    <ErrorInfo
                        secondary="No followers"
                    />
                : follow
                .map((item) => (
                    <div
                        key={item._id}
                        ref={lastElementRef}
                    >
                        <FollowItem
                            item={item.friend || item}
                        />
                    </div>
                ))}
                { isError ?
                    <ErrorInfo
                        label="Oh no!"
                        secondary="Something went wrong"
                    />
                : isLoading ?
                    <div className="flex flex-col">
                        <Skeleton
                            height="50"
                            animation="wave"
                        />
                    </div>
                : null }
            </div>
        </Modal>
    )
}

export default FollowersModal