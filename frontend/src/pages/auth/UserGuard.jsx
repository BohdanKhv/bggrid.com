import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ErrorInfo } from "../../components"
import { getMe } from "../../features/auth/authSlice"
import { getMyNotification } from "../../features/notification/notificationSlice"

const UserGuard = ({children}) => {
    const dispatch = useDispatch()
    const { isLoading, user } = useSelector(state => state.auth)


    useEffect(() => {
        const promise = dispatch(getMe())
        let notificationPromise;

        if (user) {
            notificationPromise = dispatch(getMyNotification())
        }

        return () => {
            promise && promise.abort()
            notificationPromise && notificationPromise.abort()
        }
    }, [])

    return (
        isLoading ?
        <div className="h-min-100 w-100 flex justify-center align-center">
            <ErrorInfo
                isLoading={isLoading}
                label="Hold on..."
                secondary="We're fetching your stuff"
            />
        </div>
        : children
    )
}

export default UserGuard