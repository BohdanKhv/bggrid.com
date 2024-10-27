import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Input, Button, IconButton } from "../../components"
import { resetUser, sendLoginEmail } from "../../features/auth/authSlice"
import { arrowRightShortIcon, emailIcon } from "../../assets/img/icons"


const Login = () => {
    const [email, setEmail] = useState('')
    const { msg, isLoading, user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const [countDown, setCountDown] = useState(60)


    const handleLogin = () => {
        dispatch(sendLoginEmail({
            email: email.replace(/\s\s+/g, ' ').trim().toLowerCase(),
        }))
    }

    useEffect(() => {
        document.title = 'Log in to in Crew | Find a job in the service industry';
        window.scrollTo(0, 0);

        return () => {
            dispatch(resetUser())
        }
    }, [])

    useEffect(() => {
        if (msg === 'email_sent') {
            const interval = setInterval(() => {
                setCountDown(countDown => countDown - 1)
            }, 1000)
            return () => clearInterval(interval)
        }
    }
    , [msg])


    return (
        <>
        {msg === 'email_sent' ? 
        <div className="animation-fade-in">
            <div className="flex flex-col align-center justify-center gap-4">
                <IconButton
                    size="lg"
                    icon={emailIcon}
                    variant="filled"
                    type="primary"
                />
                <div className="fs-20 weight-600">
                    Check your email for a login link
                </div>
                <div className="fs-12 text-secondary text-center">
                    Check your spam folder if you don't see it in your inbox within a few minutes. If you still can't find it, click the button below to resend the email.
                </div>
                <Button
                    size="lg"
                    className="w-100"
                    type={'primary'}
                    isLoading={isLoading}
                    onClick={() => !isLoading && countDown <= 0 ? handleLogin() : null}
                    disabled={isLoading || countDown > 0}
                    label={`Resend email ${countDown > 0 ? ` in (${countDown}s)` : ''}`}
                    variant={countDown > 0 ? 'outline' : 'filled'}
                    borderRadius="md"
                />
            </div>
        </div>
        :
        <div className="animation-fade-in">
            <div className="flex flex-col gap-3">
                <Input
                    type="text"
                    description="You will receive an email with a link to login. No password needed."
                    value={email}
                    wrapColumn
                    placeholder="Email"
                    error={email ? !email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) : msg === 'Invalid credentials'}
                    label="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="mt-4 transition-slide-right-hover-parent">
                <Button
                    size="lg"
                    className="w-100"
                    type={'primary'}
                    isLoading={isLoading}
                    disabled={isLoading || !email || !email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)}
                    onClick={() => !isLoading ? handleLogin() : null}
                    label="Continue"
                    iconRight={<div className="flex align-center transition-slide-right-hover">
                        {arrowRightShortIcon}
                    </div>}
                    variant="filled"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            console.log('Enter')
                            handleLogin()
                        }
                    }}
                    />
            </div>
        </div>
        }
        </>
    )
}

export default Login