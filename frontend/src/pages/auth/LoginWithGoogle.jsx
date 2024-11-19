import { useDispatch, useSelector } from "react-redux"
import { Button } from "../../components"
import { continueWithGoogle } from "../../features/auth/authSlice"
import { googleIcon } from "../../assets/img/icons"
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

const GoogleLogin = () => {
    const dispatch = useDispatch()
    const { loadingId } = useSelector(state => state.auth)

    const loginWithGoogle = useGoogleLogin({
        flow: 'implicit',
        onSuccess: tokenResponse  => {
            dispatch(continueWithGoogle(tokenResponse))
        },
        onError: (error) => { console.log('error', error) },
    });

    return (
        <Button
            icon={googleIcon}
            size="lg"
            borderRadius="md"
            className="w-100"
            variant="outline"
            type="secondary"
            label="Continue with Google"
            isLoading={loadingId === 'google'}
            displayTextOnLoad
            onClick={() => {
                loginWithGoogle()
            }}
        />
    )
}

const LoginWithGoogle = () => {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
            <GoogleLogin/>
        </GoogleOAuthProvider>
    )
}

export default LoginWithGoogle