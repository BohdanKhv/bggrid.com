import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Input, Button, IconButton } from "../../components"
import { resetUser, register } from "../../features/auth/authSlice"
import { arrowRightShortIcon, emailIcon } from "../../assets/img/icons"


const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { msg, isLoading, user } = useSelector(state => state.auth)
    const dispatch = useDispatch()


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


    return (
        <>
        <div className="animation-fade-in">
            <div className="flex flex-col gap-3">
                <div className="fs-24 pb-4 bold">
                    Sign up
                </div>
                <Input
                    type="text"
                    value={username}
                    wrapColumn
                    placeholder="Enter your username"
                    error={msg && msg === 'This username is already in use'}
                    errorMsg="This username is already in use"
                    label="Username"
                    onChange={(e) => setUsername(e.target.value.replaceAll(' ', ''))}
                />
                <Input
                    type="text"
                    value={email}
                    wrapColumn
                    placeholder="Enter your email"
                    error={msg && msg === 'This email is already in use'}
                    errorMsg="This email is already in use"
                    label="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    value={password}
                    wrapColumn
                    placeholder="Enter your password"
                    error={msg === 'Invalid credentials'}
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="mt-5">
                <Button
                    size="lg"
                    className="w-100"
                    type={'primary'}
                    isLoading={isLoading}
                    disabled={isLoading || !email || !email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)}
                    onClick={() => !isLoading ? handleLogin() : null}
                    label="Sign up"
                    variant="filled"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            console.log('Enter')
                            handleLogin()
                        }
                    }}
                    />
            </div>
            <div className="fs-12 pt-4 text-secondary text-center">
                By signing up, you agree to our <a href="https://increw.cafe/terms" target="_blank" className="text-underlined-hover">Terms of Service</a> and <a href="https://increw.cafe/privacy" target="_blank" className="text-underlined-hover">Privacy Policy</a>
            </div>
            <div className="pt-6">
                <div className="fs-12 text-secondary text-center flex align-center gap-1 justify-center">
                    Already have an account? <Button to="/login" label="login" variant="link" type="primary" className="weight-400"/>
                </div>
            </div>
        </div>
        </>
    )
}

export default Register