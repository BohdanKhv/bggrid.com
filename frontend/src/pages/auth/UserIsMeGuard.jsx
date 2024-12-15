import { useSelector } from "react-redux"

const UserIsMeGuard = ({children, id}) => {
    const { isLoading, user } = useSelector(state => state.auth)

    return (
        id === user?._id ? children : null
    )
}

export default UserIsMeGuard