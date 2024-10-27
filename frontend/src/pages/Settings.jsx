import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Input, TabContent } from '../components'


const Account = () => {
    const dispatch = useDispatch()

    const { user, isLoading, loadingId, msg } = useSelector((state) => state.auth)

    useEffect(() => {
        setAccountType(user?.accountType || 'work')
    }, [user])

    return (
        <div className="flex flex-col gap-5 gap-sm-3 animation-slide-in">
            <div>
                <div className="flex gap-6 flex-sm-col">
                    <div className="col-6 flex flex-col gap-5 gap-sm-3 col-sm-12">
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
                        <div className="pt-6 pt-sm-3">
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
                        </div>
                        <div className="pb-6 pt-5 px-sm-2">
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