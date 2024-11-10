import React, { useEffect } from 'react'
import { Button, ErrorInfo, Icon } from '../../components'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../features/auth/authSlice'
import { errorIcon } from '../../assets/img/icons'

const LoginWithEmail = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user, isLoading, msg } = useSelector(state => state.auth)

    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        if (searchParams.get('token')) {
            dispatch(login({ token: searchParams.get('token') }))
        }
    }, [setSearchParams])

    useEffect(() => {
        if (!user) return
        if (searchParams.get('redirect')) {
            navigate(searchParams.get('redirect'))
        } else {
            navigate('/')
        }
    }, [user, searchParams])

    return (
        msg === 'Token expired' ?
        <div className="">
            <div className="tag-danger p-3 border-radius-md mb-3">
                <div className="flex gap-3 align-center">
                    <Icon
                        className="fill-danger"
                        icon={errorIcon}
                    />
                    <div>
                        <div className="fs-16 weight-600">
                            This link has expired.
                        </div>
                        <div className="fs-16">
                            Please request a new one.
                        </div>
                    </div>
                </div>
            </div>
            <Button
                label="Log in"
                variant={'filled'}
                size={'lg'}
                borderRadius="md"
                type={'primary'}
                to={'/login'}
            />
        </div>
        : !isLoading && msg ?
            <ErrorInfo 
                icon={errorIcon}
                label="Something went wrong"
                secondary={msg}
                tertiary="Please try again."
            />
        :
        <ErrorInfo 
            label={isLoading ? "Getting your account ready" : searchParams.get('token') ? "Logging you in" : "We could't find your token, please try again"}
            isLoading
        />
    )
}

export default LoginWithEmail