import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Input, Button } from "../../components"
import { resetUser, register } from "../../features/auth/authSlice"
import LoginWithGoogle from "./LoginWithGoogle"


const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { msg, isLoading, user, loadingId } = useSelector(state => state.auth)
    const dispatch = useDispatch()


    const handleLogin = () => {
        dispatch(register({
            email: email.replace(/\s\s+/g, ' ').trim().toLowerCase(),
            password,
            username
        }))
    }

    useEffect(() => {
        document.title = 'Create an account on BGGRID';
        window.scrollTo(0, 0);

        return () => {
            dispatch(resetUser())
        }
    }, [])


    return (
        <>
        <div className="animation-fade-in">
            <div className="flex flex-col gap-3 text-center">
                <div className="fs-96 weight-500 fs-sm-54">
                    Hi there!
                </div>
                <div className="fs-16 mb-4">
                    Let's get started by creating your account.
                </div>
                <LoginWithGoogle/>
                <div className="flex align-center gap-2 py-3">
                    <div className="flex-grow-1 border-bottom border-secondary"/>
                    <div className="fs-14 px-4">OR</div>
                    <div className="flex-grow-1 border-bottom border-secondary"/>
                </div>
                <Input
                    type="text"
                    value={username}
                    wrapColumn
                    placeholder="Username"
                    error={msg && msg === 'This username is already in use'}
                    errorMsg="This username is already in use"
                    onChange={(e) => setUsername(e.target.value.replaceAll(' ', ''))}
                />
                <Input
                    type="text"
                    value={email}
                    wrapColumn
                    placeholder="Email"
                    error={msg && msg === 'This email is already in use'}
                    errorMsg="This email is already in use"
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
            </div>
            <div className="mt-5">
                <Button
                    size="lg"
                    className="w-100"
                    type={'secondary'}
                    isLoading={isLoading}
                    disabled={isLoading || !email || !email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) || !username || !password}
                    onClick={() => !isLoading ? handleLogin() : null}
                    label="Sign Up"
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
                By signing up, you agree to our <a href="https://bggrid.com/terms" target="_blank" className="text-underlined-hover">Terms of Service</a> and <a href="https://bggrid.com/privacy" target="_blank" className="text-underlined-hover">Privacy Policy</a>
            </div>
            {msg ? <div className="flex align-center justify-center pt-4"><div className="border-radius-sm weight-600 fs-12 tag-danger px-2 py-1">{msg}</div></div> : null}
            <div className="pt-4">
                <div className="fs-12 text-secondary text-center flex align-center gap-1 justify-center weight-500">
                    Already have a member? <Button to="/login" label="Log in" variant="link" type="primary" className="weight-500"/>
                </div>
            </div>
        </div>
        </>
    )
}

export default Register