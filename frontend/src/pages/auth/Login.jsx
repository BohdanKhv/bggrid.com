import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Input, Button, IconButton } from "../../components"
import { resetUser, login } from "../../features/auth/authSlice"
import { arrowRightShortIcon, emailIcon } from "../../assets/img/icons"


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { msg, isLoading, user } = useSelector(state => state.auth)
    const dispatch = useDispatch()


    const handleLogin = () => {
        dispatch(login({
            email: email.replace(/\s\s+/g, ' ').trim().toLowerCase(),
            password
        }))
    }

    useEffect(() => {
        document.title = 'Log in to in Crew | Find a job in the service industry';
        window.scrollTo(0, 0);

        return () => {
            dispatch(resetUser())
        }
    }, [])

    return (
        <>
        <div className="animation-fade-in">
            <div className="flex flex-col gap-4">
                {/* <div className="fs-24 pb-4 bold">
                    Sign in
                </div> */}
                <Input
                    type="text"
                    value={email}
                    wrapColumn
                    placeholder="Email"
                    error={email ? !email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) : msg === 'Invalid credentials'}
                    label="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    value={password}
                    wrapColumn
                    placeholder="Password"
                    error={msg === 'Invalid credentials'}
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                {msg ? <div className="flex"><div className="border-radius-sm weight-600 fs-12 tag-danger px-2 py-1">{msg}</div></div> : null}
                <div className="flex">
                    <Button
                        to="/forgot-password"
                        label="Forgot your password?"
                        variant="link"
                        type="secondary"
                        className="fs-12"
                    />
                </div>
            </div>
            <div className="mt-4">
                <Button
                    size="lg"
                    className="w-100 transition-slide-right-hover-parent"
                    type={'primary'}
                    isLoading={isLoading}
                    disabled={isLoading || !email || !email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)}
                    onClick={() => !isLoading ? handleLogin() : null}
                    label="Log in"
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
                <div className="pt-6">
                    <div className="fs-12 text-secondary text-center flex align-center gap-1 justify-center weight-600">
                        Don't have an account? <Button to="/register" label="Sign up" variant="link" type="primary"/>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Login