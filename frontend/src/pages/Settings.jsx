import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, Button, ConfirmAction, Icon, IconButton, Input, Switch, TabContent } from '../components'
import { checkIcon, uploadIcon } from '../assets/img/icons'
import { updateUser } from '../features/auth/authSlice'
import Compressor from 'compressorjs'
import { DateTime } from 'luxon'
import { setTheme } from '../features/local/localSlice'
import { importBggCollection } from '../features/library/librarySlice'



const Account = () => {
    const dispatch = useDispatch()

    const { user, isLoading, loadingId, msg } = useSelector((state) => state.auth)
    const { loadingId: libraryLoadingId } = useSelector((state) => state.library)
    const { loadingId: playsLoadingId } = useSelector((state) => state.play)

    const avatarRef = useRef(null)
    const [avatar, setAvatar] = useState(user?.avatar)
    const [username, setUsername] = useState(user?.username)
    const [bggUsername, setBggUsername] = useState(user?.bggUsername)
    const [firstName, setFirstName] = useState(user?.firstName)
    const [lastName, setLastName] = useState(user?.lastName)
    const [bio, setBio] = useState(user?.bio)



    useEffect(() => {
        if (user) {
            setAvatar(user?.avatar ? `${user?.avatar}` : null)
            setBggUsername(user?.bggUsername || '')
            setUsername(user?.username || '')
            setFirstName(user?.firstName || '')
            setLastName(user?.lastName || '')
            setBio(user?.bio || '')
        }
    }, [user])

    return (
        <div className="flex flex-col gap-5 gap-sm-3 animation-slide-in">
            <div>
                <div className="flex gap-4 flex-col">
                    <div>
                        <div className="fs-20 bold">
                            Your Profile
                        </div>
                        <div className="fs-12 text-secondary pt-1">
                            This information will be visible to other users on the platform.
                        </div>
                    </div>
                    <div className="col-12 flex flex-col gap-5 gap-sm-3 col-sm-12">
                        <Input
                            // label="Profile Picture"
                            wrapColumn
                        >
                            <div className="flex gap-4">
                                <div
                                    className="pos-relative border border-radius-50 border-color-text"
                                >
                                    <Avatar
                                        img={avatar ? avatar : null}
                                        name={`${user?.email}`}
                                        rounded
                                        len={1}
                                        defaultColor
                                        size="xl"
                                    />
                                    <div className="pos-absolute border border-w-3 border-radius-50 border-color-main color-border-on-hover-text"
                                        style={{
                                            bottom: '-8px',
                                            right: '-8px',
                                        }}
                                    >
                                        <IconButton
                                            icon={uploadIcon}
                                            variant="default"
                                            type="secondary"
                                            className="border"
                                            isLoading={loadingId === 'avatar'}
                                            disabled={loadingId}
                                            onClick={() => avatarRef.current.click()}
                                        />
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    accept='image/png, image/jpeg, image/jpg'
                                    onChange={(e) => {
                                        const validImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
                                        if(e.target.files[0] && validImageTypes.includes(e.target.files[0].type)) {
                                            new Compressor(e.target.files[0], {
                                                quality: 0.3,
                                                convertSize: 0,
                                                success(result) {
                                                    const originalFileName = e.target.files[0].name;
                                                    const compressedFile = new File([result], originalFileName, {
                                                        type: result.type,
                                                        lastModified: Date.now()
                                                    });
                                            
                                                    setAvatar(URL.createObjectURL(compressedFile));
                                                    dispatch(updateUser({
                                                        avatar: compressedFile
                                                    }));
                                                    console.log('original size in kb', e.target.files[0].size / 1024);
                                                    console.log('compressed size in kb', result.size / 1024);
                                                },
                                                error(err) {
                                                    console.log(err.message);
                                                },
                                            });
                                        }
                                    }}
                                    className="d-none"
                                    ref={avatarRef}
                                />
                            </div>
                        </Input>
                        <Input
                            label="Email"
                            description="Your email address is used to log in and cannot be changed. If you need to change your email address, please contact us at contact@bggrid.com"
                            value={user?.email}
                            wrapColumn
                            disabled
                            type="text"
                        />
                    </div>
                    <div className="col-12 flex flex-col gap-5 gap-sm-3 col-sm-12">
                        <Input
                            label="Username"
                            description="Your username is unique. Changing your username will change your profile URL."
                            value={username}
                            error={msg == 'Username already in use'}
                            errorMsg="Username already in use"
                            onChange={(e) => setUsername(e.target.value)}
                            wrapColumn
                            type="text"
                        />
                        <Input
                            label="First Name"
                            placeholder="Your first Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            wrapColumn
                            type="text"
                        />
                        <Input
                            label="Last Name"
                            placeholder="Your last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            wrapColumn
                            type="text"
                        />
                        <Input
                            label="Bio"
                            placeholder="Tell us about yourself. Games you like, your favorite game, etc."
                            value={bio}
                            onChange={(e) => {
                                if(e.target.value.length >= 250) return
                                setBio(e.target.value)
                            }}
                            wrapColumn
                            type="textarea"
                        />
                        <div className="flex gap-2">
                            <Button
                                label="Save Changes"
                                variant="secondary"
                                displayTextOnLoad
                                type="filled"
                                disabled={loadingId}
                                onClick={() => {
                                    const data = {}
                                    if (username !== user.username) data.username = username.trim()
                                    if (firstName !== user.firstName) data.firstName = firstName
                                    if (lastName !== user.lastName) data.lastName = lastName
                                    if (bio !== user.bio) data.bio = bio
                                    dispatch(updateUser(data))
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
const Integrations = () => {
    const dispatch = useDispatch()

    const { user, isLoading, loadingId, msg } = useSelector((state) => state.auth)
    const { loadingId: libraryLoadingId } = useSelector((state) => state.library)
    const { loadingId: playsLoadingId } = useSelector((state) => state.play)

    const avatarRef = useRef(null)
    const [avatar, setAvatar] = useState(user?.avatar)
    const [username, setUsername] = useState(user?.username)
    const [bggUsername, setBggUsername] = useState(user?.bggUsername)
    const [firstName, setFirstName] = useState(user?.firstName)
    const [lastName, setLastName] = useState(user?.lastName)
    const [bio, setBio] = useState(user?.bio)



    useEffect(() => {
        if (user) {
            setAvatar(user?.avatar ? `${user?.avatar}` : null)
            setBggUsername(user?.bggUsername || '')
            setUsername(user?.username || '')
            setFirstName(user?.firstName || '')
            setLastName(user?.lastName || '')
            setBio(user?.bio || '')
        }
    }, [user])

    return (
        <div className="flex flex-col gap-5 gap-sm-3 animation-slide-in">
            <div>
                <div className="fs-20 bold">
                    Integrations
                </div>
                <div className="fs-12 pt-1 pb-4 text-secondary">
                    Connect your Board Game Geek account to import your collection.
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-3 align-center">
                        <div className="flex-1">
                            <Input
                                value={bggUsername}
                                placeholder="Your board game geek username"
                                error={msg == 'This board game geek username already in use'}
                                errorMsg="This board game geek username already in use"
                                onChange={(e) => setBggUsername(e.target.value)}
                                wrapColumn
                                type="text"
                            />
                        </div>
                        {user?.bggUsername ?
                            <ConfirmAction
                                title={`Sync Collection from Board Game Geek?`}
                                isLoading={libraryLoadingId === 'import'}
                                secondary="This action will import your collection from Board Game Geek. All existing games in your library will not be affected."
                                onClick={() => dispatch(importBggCollection())}
                                disabled={loadingId || !user?.bggUsername || user?.bggUsername !== bggUsername}
                            >
                                <IconButton
                                    type="secondary"
                                    variant="outline"
                                    icon={uploadIcon}
                                    isLoading={libraryLoadingId === 'import'}
                                    disabled={loadingId || !user?.bggUsername}
                                />
                            </ConfirmAction>
                        : null}
                    </div>
                    <div>
                        <Button
                            label="Save Changes"
                            variant="secondary"
                            displayTextOnLoad
                            type="filled"
                            isLoading={loadingId}
                            disabled={loadingId || (user?.bggUsername && user?.bggUsername === bggUsername)}
                            onClick={() => {
                                dispatch(updateUser({
                                    bggUsername
                                }))
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const Preferences = () => {
    const dispatch = useDispatch()

    const { theme, searchHistory } = useSelector((state) => state.local)
    const { user, isLoading, loadingId, msg } = useSelector((state) => state.auth)

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = 'Settings - Preferences'
    }, [])

    return (
        <div className="flex flex-col gap-5 gap-sm-3 animation-slide-in">
            <div className="col-12 flex flex-col gap-5 gap-sm-3 col-sm-12">
                <div>
                    <div className="fs-20 bold">
                        Theme
                    </div>
                    <div className="fs-12 text-secondary">
                        Choose your preferred theme.
                    </div>
                </div>
                <div className="flex gap-2 flex-sm-col">
                    <div className="border border-radius flex-1 overflow-hidden pointer color-border-on-hover-text transition-duration"
                        onClick={() => dispatch(setTheme('system'))}
                    >
                        <div className="h-set-100-px"
                            style={{
                                backgroundColor: '#f5f5f5'
                            }}
                        />
                        <div className="p-3 border-top fs-14 flex gap-2 justify-between align-center">
                            System
                            {theme === 'system' ? 
                            <Icon
                                icon={theme === 'system' ? checkIcon : ''}
                                className="tag-text border-radius-50"
                                size="sm"
                            />
                            : null}
                        </div>
                    </div>
                    <div className="border border-radius flex-1 overflow-hidden pointer color-border-on-hover-text transition-duration"
                        onClick={() => dispatch(setTheme('light'))}
                    >
                        <div className="h-set-100-px"
                            style={{
                                backgroundColor: '#fff'
                            }}
                        />
                        <div className="p-3 border-top fs-14 flex gap-2 justify-between align-center">
                            Light
                            {theme === 'light' ? 
                            <Icon
                                icon={theme === 'light' ? checkIcon : ''}
                                className="tag-text border-radius-50"
                                size="sm"
                            />
                            : null}
                        </div>
                    </div>
                    <div className="border border-radius flex-1 overflow-hidden pointer color-border-on-hover-text transition-duration"
                        onClick={() => dispatch(setTheme('dark'))}
                    >
                        <div className="h-set-100-px"
                            style={{
                                backgroundColor: '#000'
                            }}
                        />
                        <div className="p-3 border-top fs-14 flex gap-2 justify-between align-center">
                            Dark
                            {theme === 'dark' ? 
                            <Icon
                                icon={theme === 'dark' ? checkIcon : ''}
                                className="tag-text border-radius-50"
                                size="sm"
                            />
                            : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Notifications = () => {
    const dispatch = useDispatch()

    const { user, isLoading, loadingId, msg } = useSelector((state) => state.auth)

    const [newFollowers, setNewFollowers] = useState(user?.notifications?.newFollowers || false)
    const [followingUsersLibraryUpdates, setFollowingUsersLibraryUpdates] = useState(user?.notifications?.followingUsersLibraryUpdates || false)
    const [taggedInPlays, setTaggedInPlays] = useState(user?.notifications?.taggedInPlays || false)
    const [wantToPlayLibraryUpdates, setWantToPlayLibraryUpdates] = useState(user?.notifications?.wantToPlayLibraryUpdates || false)
    const [forTradeLibraryUpdates, setForTradeLibraryUpdates] = useState(user?.notifications?.forTradeLibraryUpdates || false)
    const [wantInTradeLibraryUpdates, setWantInTradeLibraryUpdates] = useState(user?.notifications?.wantInTradeLibraryUpdates || false)

    useEffect(() => {
        setNewFollowers(user?.notifications?.newFollowers || false)
        setFollowingUsersLibraryUpdates(user?.notifications?.followingUsersLibraryUpdates || false)
        setTaggedInPlays(user?.notifications?.taggedInPlays || false)
        setWantToPlayLibraryUpdates(user?.notifications?.wantToPlayLibraryUpdates || false)
        setForTradeLibraryUpdates(user?.notifications?.forTradeLibraryUpdates || false)
        setWantInTradeLibraryUpdates(user?.notifications?.wantInTradeLibraryUpdates || false)
    }, [user])

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = 'Settings - Preferences'
    }, [])

    return (
        <div className="flex flex-col gap-5 gap-sm-3 animation-slide-in">
            <div>
                <div className="fs-20 bold">
                    Notifications
                </div>
                <div className="fs-12 text-secondary pt-1">
                    Manage your notifications settings.
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className={`border border-radius p-3 align-center flex justify-between color-border-on-hover-text pointer gap-2 bg-tertiary-hover${loadingId ? ' opacity-50' : ''}`}
                    onClick={(e) => {
                        if (loadingId) return
                        setNewFollowers(!newFollowers)
                    }}
                >
                    <div className="fs-14 weight-500">
                        New followers
                    </div>
                    <Switch
                        active={user?.notifications?.newFollowers}
                    />
                </div>
                <div className={`border border-radius p-3 align-center flex justify-between color-border-on-hover-text pointer gap-2 bg-tertiary-hover${loadingId ? ' opacity-50' : ''}`}
                    onClick={(e) => {
                        if (loadingId) return
                        setFollowingUsersLibraryUpdates(!followingUsersLibraryUpdates)
                    }}
                >
                        <div className="fs-14 weight-500">
                            Library updates from people you follow
                        </div>
                    <Switch
                        active={followingUsersLibraryUpdates}
                    />
                </div>
                <div className={`border border-radius p-3 align-center flex justify-between color-border-on-hover-text pointer gap-2 bg-tertiary-hover${loadingId ? ' opacity-50' : ''}`}
                onClick={(e) => {
                    if (loadingId) return
                    setTaggedInPlays(!taggedInPlays)
                }}>
                        <div className="fs-14 weight-500">
                            Tagged in plays
                        </div>
                    <Switch
                        active={taggedInPlays}
                    />
                </div>
                <div className={`border border-radius p-3 align-center flex justify-between color-border-on-hover-text pointer gap-2 bg-tertiary-hover${loadingId ? ' opacity-50' : ''}`}
                    onClick={(e) => {
                        if (loadingId) return
                        setWantToPlayLibraryUpdates(!wantToPlayLibraryUpdates)
                    }}>
                        <div className="fs-14 weight-500">
                            Someone wants to play a game in your library
                        </div>
                    <Switch
                        active={wantToPlayLibraryUpdates}
                    />
                </div>
                <div className={`border border-radius p-3 align-center flex justify-between color-border-on-hover-text pointer gap-2 bg-tertiary-hover${loadingId ? ' opacity-50' : ''}`}
                    onClick={(e) => {
                        if (loadingId) return
                        setForTradeLibraryUpdates(!forTradeLibraryUpdates)
                    }}>
                        <div className="fs-14 weight-500">
                            Someone wants to trade a game in your library
                        </div>
                    <Switch
                        active={forTradeLibraryUpdates}
                    />
                </div>
                <div className={`border border-radius p-3 align-center flex justify-between color-border-on-hover-text pointer gap-2 bg-tertiary-hover${loadingId ? ' opacity-50' : ''}`}
                    onClick={(e) => {
                        if (loadingId) return
                        setWantInTradeLibraryUpdates(!wantInTradeLibraryUpdates)
                    }}>
                        <div className="fs-14 weight-500">
                            Someone wants to trade a game you want
                        </div>
                    <Switch
                        active={wantInTradeLibraryUpdates}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        label="Save Changes"
                        variant="secondary"
                        displayTextOnLoad
                        type="filled"
                        isLoading={loadingId}
                        disabled={loadingId}
                        onClick={() => {
                            dispatch(updateUser({
                                notifications: {
                                    newFollowers,
                                    followingUsersLibraryUpdates,
                                    taggedInPlays,
                                    wantToPlayLibraryUpdates,
                                    forTradeLibraryUpdates,
                                    wantInTradeLibraryUpdates
                                }
                            }))
                        }}
                    />
                </div>
            </div>
        </div>
    )
}


const Redirect = () => {
    const navigate = useNavigate()

    useEffect(() => {
        navigate('/settings/account')
    }, [])

    return null
}

const Settings = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { tab } = useParams()

    const { user, isLoading, msg } = useSelector((state) => state.auth)

    const [activeTab, setActiveTab] = useState(tab || 'account')

    useEffect(() => {
        setActiveTab(tab)
        window.scrollTo(0, 0)
    }, [tab])

    useEffect(() => {
        document.title = 'Settings'
        if (document.querySelector('.header-title')) document.querySelector('.header-title').innerText = "Settings"
        return () => {
            if (document.querySelector('.header-title')) document.querySelector('.header-title').innerText = ''
        }
    }, [])

    return (
        <>
            <main className="page-body">
                <div className="animation-slide-in container">
                    <div className="flex-1">
                        <div className="flex py-3 justify-between px-sm-3 pb-6">
                            <div className="title-1 bold">
                                Settings
                            </div>
                            {window.innerWidth < 800 && (
                                <div className="justify-end flex align-center flex-no-wrap gap-3">
                                    <div
                                        onClick={() => {
                                            document.querySelector('.open-navbar-button').click()
                                        }}
                                    >
                                        <Avatar
                                            img={`${user?.avatar}`}
                                            name={user ? `${user?.email}` : null}
                                            rounded
                                            avatarColor="1"
                                            size="sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <TabContent
                                items={
                                    [
                                        {label: 'Account'},
                                        {label: 'Notifications'},
                                        {label: 'Integrations'},
                                        {label: 'Preferences'},
                                    ]
                                }
                                activeTabName={activeTab}
                                setActiveTabName={e => {
                                    navigate(`/settings/${e}`)
                                }}
                            />
                        </div>
                        <div className="pb-6 pt-5 px-sm-3 px-4">
                            {activeTab === 'account' ? <Account />
                            : activeTab === 'notifications' ? <Notifications />
                            : activeTab === 'integrations' ? <Integrations/>
                            : activeTab === 'preferences' ? <Preferences />
                            : <Redirect /> }
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Settings