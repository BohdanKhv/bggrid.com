import React from 'react'
import { useSelector } from 'react-redux';

const UserGate = ({children}) => {
const { user } = useSelector(state => state.auth);

    return (
        <>
            {user ? children : null}
        </>
    )
}

export default UserGate