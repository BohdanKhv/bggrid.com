import { useEffect, useState } from "react"
import { toast } from 'react-toastify';


const IsOffline = () => {
    const [isOffline, setIsOffline] = useState(false)

    useEffect(() => {
        const handleOffline = () => {setIsOffline(true); console.log('offline')}
        const handleOnline = () => {setIsOffline(false); console.log('online')}

        window.addEventListener('offline', handleOffline)
        window.addEventListener('online', handleOnline)

        return () => {
            window.removeEventListener('offline', handleOffline)
            window.removeEventListener('online', handleOnline)
        }
    }, [])

    // useEffect(() => {
    //     if (isOffline) {
    //         toast.error('No internet connection available', {
    //             toastId: 'offline',
    //             autoClose: false,
    //             closeOnClick: false,
    //             draggable: false,
    //             hideProgressBar: true,
    //             pauseOnHover: false,
    //             closeButton: false,
    //         })
    //     } else {
    //         // check if toast is still active, if so, close it and reload page
    //         if (toast.isActive('offline')) {
    //             toast.dismiss('offline')
    //         }
    //     }
    // }, [isOffline])

    return (
        null
    )
}

export default IsOffline