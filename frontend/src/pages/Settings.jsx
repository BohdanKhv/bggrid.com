import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, IconButton, Input, TabContent } from '../components'
import { uploadIcon } from '../assets/img/icons'
import { updateUser } from '../features/auth/authSlice'
import Compressor from 'compressorjs'
import { DateTime } from 'luxon'



const Account = () => {
    const dispatch = useDispatch()

    const { user, isLoading, loadingId, msg } = useSelector((state) => state.auth)

    const avatarRef = useRef(null)
    const [avatar, setAvatar] = useState(user?.jobSeeker?.avatar)



    useEffect(() => {
        if (user) {
            setAvatar(user?.jobSeeker?.avatar ? `${import.meta.env.VITE_USERS_S3_API_URL}/${user?.jobSeeker?.avatar}` : null)
        }
    }, [user])

    return (
        <div className="flex flex-col gap-5 gap-sm-3 animation-slide-in">
            <div>
                <div className="flex gap-6 flex-sm-col">
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
                                        len={2}
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
            <main className="page-body mx-auto w-max-md">
                <div className="mx-auto w-max-md animation-slide-in">
                    <div className="container">
                            <div className="py-3 title-1 bold px-sm-2">
                                Account
                            </div>
                            <div className="border-bottom">
                                <TabContent
                                    items={
                                        [
                                            {label: 'Account'},
                                        ]
                                    }
                                    activeTabName={activeTab}
                                    setActiveTabName={e => {
                                        navigate(`/account/${e}`)
                                    }}
                                />
                        </div>
                        <div className="pb-6 pt-5 px-sm-3">
                            {activeTab === 'account' ? <Account />
                            :
                                <Redirect />
                            }
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Settings