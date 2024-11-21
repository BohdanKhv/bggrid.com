import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, Button, Icon, IconButton, Input, TabContent } from '../components'
import { checkIcon, uploadIcon } from '../assets/img/icons'
import { updateUser } from '../features/auth/authSlice'
import Compressor from 'compressorjs'
import { DateTime } from 'luxon'
import { setTheme } from '../features/local/localSlice'



const Account = () => {
    const dispatch = useDispatch()

    const { user, isLoading, loadingId, msg } = useSelector((state) => state.auth)

    const avatarRef = useRef(null)
    const [avatar, setAvatar] = useState(user?.avatar)
    const [username, setUsername] = useState(user?.username)
    const [firstName, setFirstName] = useState(user?.firstName)
    const [lastName, setLastName] = useState(user?.lastName)



    useEffect(() => {
        if (user) {
            setAvatar(user?.avatar ? `${user?.avatar}` : null)
            setUsername(user?.username || '')
            setFirstName(user?.firstName || '')
            setLastName(user?.lastName || '')
        }
    }, [user])

    return (
        <div className="flex flex-col gap-5 gap-sm-3 animation-slide-in">
            <div>
                <div className="flex gap-6 flex-sm-col">
                    <div className="col-6 flex flex-col gap-5 gap-sm-3 col-sm-12">
                        <Input
                            label="Username"
                            description="Your username is unique. Changing your username will change your profile URL."
                            value={user?.username}
                            error={msg == 'Username already in use'}
                            errorMsg="Username already in use"
                            onChange={(e) => setUsername(e.target.value)}
                            wrapColumn
                            size="sm"
                            type="text"
                        />
                        <Input
                            label="First Name"
                            placeholder="Your first Name"
                            value={user?.firstName}
                            size="sm"
                            onChange={(e) => setFirstName(e.target.value)}
                            wrapColumn
                            type="text"
                        />
                        <Input
                            label="Last Name"
                            placeholder="Your last name"
                            value={user?.lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            wrapColumn
                            size="sm"
                            type="text"
                        />
                        <div className="flex">
                            <Button
                                label="Save Changes"
                                variant="secondary"
                                displayTextOnLoad
                                type="filled"
                                isLoading={loadingId === 'profile'}
                                disabled={loadingId}
                                size="sm"
                                onClick={() => {
                                    const data = {}
                                    if (username !== user.username) data.username = username
                                    if (firstName !== user.firstName) data.firstName = firstName
                                    if (lastName !== user.lastName) data.lastName = lastName

                                    dispatch(updateUser(data))
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-6 flex flex-col gap-5 gap-sm-3 col-sm-12">
                        <Input
                            label="Profile Picture"
                            wrapColumn
                            description="Upload a profile picture to help employers recognize you."
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
                                    <div className="pos-absolute border border-w-3 border-radius-50 border-color-main color-border-on-hover-primary"
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
                            description="Your email address is used to log in and cannot be changed. If you need to change your email address, please contact us at contact@increw.cafe"
                            value={user?.email}
                            wrapColumn
                            disabled
                            type="text"
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

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = 'Settings - Preferences'
    }, [])

    return (
        <div className="flex flex-col gap-5 gap-sm-3 animation-slide-in">
            <div>
                <div className="flex gap-6 flex-sm-col">
                    <div className="col-8 flex flex-col gap-5 gap-sm-3 col-sm-12">
                        <div className="fs-14 bold">
                            Theme
                        </div>
                        <div className="flex gap-2">
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

    return (
        <div>
            <main className="page-body">
                <div className="animation-slide-in">
                    <div className="container">
                            <div className="pt-6 pb-3 title-1 bold px-sm-2 pt-sm-0">
                                Account
                            </div>
                            <div className="border-bottom">
                                <TabContent
                                    items={
                                        [
                                            {label: 'Account'},
                                            {label: 'Preferences'},
                                        ]
                                    }
                                    activeTabName={activeTab}
                                    setActiveTabName={e => {
                                        navigate(`/settings/${e}`)
                                    }}
                                />
                        </div>
                        <div className="pb-6 pt-5 px-sm-3">
                            {activeTab === 'account' ? <Account />
                            : activeTab === 'preferences' ? <Preferences />
                            : <Redirect /> }
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Settings