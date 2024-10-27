import { useEffect, useState } from 'react'
import { errorIcon, warningIcon, wifiOffIcon } from '../../assets/img/icons'
import ErrorInfo from '../ui/ErrorInfo'

const OfflineAction = ({onRetry, onBackOnline}) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine)

    useEffect(() => {
        const handleOffline = () => {
            setIsOnline(true);
            onBackOnline && onBackOnline();
        }
        const handleOnline = () => {
            setIsOnline(false);
            onBackOnline && onBackOnline();
        }

        window.addEventListener('offline', handleOffline)
        window.addEventListener('online', handleOnline)

        return () => {
            window.removeEventListener('offline', handleOffline)
            window.removeEventListener('online', handleOnline)
        }
    }, [])

    return (
        isOnline ? 
            <ErrorInfo
                label="Network error"
                secondary="Please check your internet connection"
                onClick={() => onRetry ? onRetry() : window.location.reload()}
                btnLabel="Try again"
                variant="filled"
            />
        :
        <ErrorInfo
            icon={wifiOffIcon}
            label="You are offline"
            secondary="Please check your internet connection and try again."
            onClick={onRetry}
            btnLabel={onRetry && "Try again"}
            variant="filled"
        />
    )
}

export default OfflineAction