import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Input, Button, IconButton } from "../../components"
import { forgotPassword, resetUser } from "../../features/auth/authSlice"
import { validateEmail } from "../../assets/utils"
import { checkIcon, emailIcon, rightArrowIcon } from "../../assets/img/icons"


const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const { msg, isLoading } = useSelector(state => state.auth)
    const dispatch = useDispatch()


    const handleSubmit = () => {
        if (email === '') {
            return;
        } else {
            dispatch(forgotPassword({
                email: email.replace(/\s\s+/g, ' ').trim().toLowerCase(),
            }));
        }
    }

    useEffect(() => {
        document.title = 'Forgot Password';
        window.scrollTo(0, 0);

        return () => {
            dispatch(resetUser())
        }
    }, [])


    return (
        <div className="animation-fade-in">
        {msg === "Email sent" ?
                <div className="flex flex-col justify-center align-center gap-4 py-5 text-center animation-slide-in">
                    <div>
                        <div className="fs-54 weight-500">
                            Reset link sent!
                        </div>
                        <p className="fs-14 mt-2">Check your email for a link to reset your password.</p>
                    </div>
                    <div className="pt-5">
                        <div className="fs-12 text-secondary text-center flex align-center gap-1 justify-center weight-500">
                            Remember you password? <Button to="/login" label="Log in" variant="link" type="primary" className="weight-500"/>
                        </div>
                    </div>
                </div>
            :
            <>
                <div className="flex flex-col text-center">
                    <div className="fs-96 weight-500">
                        Oh no!
                    </div>
                    <div className="fs-16 mb-4">
                        We'll send you a link to reset your password.
                    </div>
                    <div className="mt-4">
                        <Input
                            type="text"
                            placeholder="Enter your email"
                            className="border-radius-xl"
                            value={email}
                            wrapColumn
                            error={email.length > 0 ? !validateEmail(email) : false}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                {msg ? <div className="flex mt-4"><div className="border-radius-sm weight-600 fs-12 tag-danger px-2 py-1">{msg}</div></div> : null}
                <div className="mt-4">
                    <Button
                        size="lg"
                        className="w-100"
                        type={'secondary'}
                        isLoading={isLoading}
                        disabled={!validateEmail(email)}
                        onClick={() => !isLoading ? handleSubmit() : null}
                        label="Sent login link"
                        variant="filled"
                        borderRadius="lg"
                    />
                    <div className="pt-6">
                        <div className="fs-12 text-secondary text-center flex align-center gap-1 justify-center weight-500">
                            Remember you password? <Button to="/login" label="Log in" variant="link" type="primary" className="weight-500"/>
                        </div>
                        <div className="fs-12 mt-2 text-secondary text-center flex align-center gap-1 justify-center weight-500">
                            Don't have an account? <Button to="/register" label="Sign up" variant="link" type="primary" className="weight-500"/>
                        </div>
                    </div>
                </div>
            </>
        }
        </div>
    )
}

export default ForgotPassword