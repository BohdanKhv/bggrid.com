import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Input, Button } from "../../components"
import { resetPassword, resetUser } from "../../features/auth/authSlice"
import { lockIcon } from "../../assets/img/icons"
import { checkPasswordStrength } from "../../assets/utils"


const ResetPassword = () => {
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [params, setParams] = useSearchParams();
    const [error, setError] = useState('');
    const dispatch = useDispatch()
    const navigate = useNavigate();


    const { user, isLoading, isError, isSuccess, msg } = useSelector((state) => state.auth);

    useEffect(() => {
        if (msg === "Password updated") {
            navigate(`/login`);
        } else if (user) {
            navigate(`/`);
        }
    }, [user, isSuccess, msg, navigate, dispatch]);

    const handleReset = () => {
        if (password1 === '' || password2 === '') {
            setError('Please enter a password');
            return;
        } else if (password1 !== password2) {
            setError('Passwords do not match');
            return;
        } else {
            const userData = {
                password: password1.replace(/\s\s+/g, ' ').trim(),
                token: params.get('token'),
                id: params.get('id')
            };

            dispatch(resetPassword(userData));
            setError('');
        }
    }

    useEffect(() => {
        document.title = 'Reset Password';
        window.scrollTo(0, 0);

        return () => {
            dispatch(resetUser())
        }
    }, [])


    return (
        <div className="animation-fade-in">
            <div className="flex flex-col gap-4 text-center">
                <div className="fs-54 weight-500">
                    Almost there!
                </div>
                <div className="fs-16 mb-4">
                    Reset your password to get started.
                </div>
                <Input
                    type="password"
                    placeholder="Enter new password"
                    wrapColumn
                    value={password1}
                    className="border-radius-xl"
                    error={password1 && password2 ? password1 !== password2 || checkPasswordStrength(password1) < 2 : false}
                    success={password1 && password2 ? password1 === password2 && checkPasswordStrength(password1) >= 2 : false}
                    onChange={(e) => setPassword1(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Re-enter new Password"
                    className="border-radius-xl"
                    value={password2}
                    wrapColumn
                    onChange={(e) => setPassword2(e.target.value)}
                    error={password1 && password2 ? password1 !== password2 || checkPasswordStrength(password1) < 2 : false}
                    success={password1 && password2 ? password1 === password2 && checkPasswordStrength(password1) >= 2 : false}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleReset()
                        }
                    }}
                />
            </div>
            {msg ? <div className="flex mt-4"><div className="border-radius-sm weight-600 fs-12 tag-danger px-2 py-1">{msg}</div></div> : null}
            <div className="mt-4">
                <Button
                    size="lg"
                    className="w-100"
                    type={'secondary'}
                    isLoading={isLoading}
                    onClick={() => !isLoading ? handleReset() : null}
                    label="Reset Password"
                    variant="filled"
                    borderRadius="lg"
                    disabled={!password1 || !password2 || password1 !== password2 || checkPasswordStrength(password1) <= 1}
                />
                <div className="pt-6">
                    <div className="fs-12 text-secondary text-center flex align-center gap-1 justify-center weight-500">
                        Remember you password? <Button to="/login" label="Log in" variant="link" type="primary" className="weight-500"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword