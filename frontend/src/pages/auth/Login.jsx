import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Input, Button } from "../../components"
import { resetUser, login } from "../../features/auth/authSlice"
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginWithGoogle from "./LoginWithGoogle"


const Login = () => {
    const dispatch = useDispatch()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { msg, isLoading, user, loadingId } = useSelector(state => state.auth)


    const handleLogin = () => {
        dispatch(login({
            email: email.replace(/\s\s+/g, ' ').trim().toLowerCase(),
            password
        }))
    }

    useEffect(() => {
        document.title = 'Log in to BGGRID';
        window.scrollTo(0, 0);

        return () => {
            dispatch(resetUser())
        }
    }, [])

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
            <>
            <div className="animation-fade-in">
                <div className="flex flex-col gap-4 text-center">
                    <div className="fs-96 weight-500 fs-sm-54">
                        Hi there!
                    </div>
                    <div className="fs-16 mb-4">
                        Log in to your account.
                    </div>
                    <LoginWithGoogle/>
                    <div className="flex align-center gap-2 py-3">
                        <div className="flex-grow-1 border-bottom border-secondary"/>
                        <div className="fs-14 px-4">OR</div>
                        <div className="flex-grow-1 border-bottom border-secondary"/>
                    </div>
                    <Input
                        type="text"
                        value={email}
                        wrapColumn
                        placeholder="Email"
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
                        disabled={isLoading || !email || !email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) || loadingId === 'google' || !password}
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
                    {msg ? <div className="flex align-center justify-center pt-4"><div className="border-radius-sm weight-600 fs-12 tag-danger px-2 py-1">{msg}</div></div> : null}
                    <div className="pt-4">
                        <div className="fs-12 text-secondary text-center flex align-center gap-1 justify-center weight-500">
                            Don't have an account? <Button to="/register" label="Sign up" variant="link" type="primary" className="weight-500"/>
                        </div>
                    </div>
                </div>
            </div>
            </>
        </GoogleOAuthProvider>
    )
}

export default Login