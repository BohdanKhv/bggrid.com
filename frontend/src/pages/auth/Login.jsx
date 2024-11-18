import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Input, Button, IconButton } from "../../components"
import { resetUser, login } from "../../features/auth/authSlice"
import { arrowRightShortIcon, emailIcon, googleIcon } from "../../assets/img/icons"


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
            <div className="flex flex-col gap-4 text-center">
                <div className="fs-96 weight-500">
                    Hi there!
                </div>
                <div className="fs-16 mb-4">
                    Log in to your account to get started.
                </div>
                <Button
                    icon={googleIcon}
                    size="lg"
                    borderRadius="md"
                    className="w-100"
                    variant="outline"
                    type="secondary"
                    label="Continue with Google"
                />
                <div className="flex align-center gap-2 py-3">
                    <div className="flex-grow-1 border-bottom border-secondary"/>
                    <div className="fs-12 px-4">or</div>
                    <div className="flex-grow-1 border-bottom border-secondary"/>
                </div>
                <Input
                    type="text"
                    value={email}
                    wrapColumn
                    placeholder="Your email"
                    error={email ? !email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) : msg === 'Invalid credentials'}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    value={password}
                    wrapColumn
                    placeholder="Password"
                    error={msg === 'Invalid credentials'}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {msg ? <div className="flex"><div className="border-radius-sm weight-600 fs-12 tag-danger px-2 py-1">{msg}</div></div> : null}
                <div className="flex justify-end">
                    <Button
                        to="/forgot-password"
                        label="Forgot your password?"
                        variant="link"
                        type="primary"
                        className="fs-12 weight-500"
                    />
                </div>
            </div>
            <div className="mt-4">
                <Button
                    size="lg"
                    className="w-100"
                    type={'secondary'}
                    isLoading={isLoading}
                    disabled={isLoading || !email || !email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)}
                    onClick={() => !isLoading ? handleLogin() : null}
                    label="Log In"
                    variant="filled"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            console.log('Enter')
                            handleLogin()
                        }
                    }}
                />
                <div className="pt-6">
                    <div className="fs-12 text-secondary text-center flex align-center gap-1 justify-center weight-500">
                        Don't have an account? <Button to="/register" label="Sign up" variant="link" type="primary" className="weight-500"/>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Login