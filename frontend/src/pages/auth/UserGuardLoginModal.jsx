import { useSelector } from "react-redux"
import { Modal } from "../../components"
import Login from "./Login"
import { useState } from "react"

const UserGuardLoginModal = ({children}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const { user } = useSelector(state => state.auth)


    return (
        <>
        {!user ?
        <>
            <Modal
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
                onClickOutside={() => { setModalIsOpen(false) }}
                onClose={() => { setModalIsOpen(false) }}
                headerNone
                noAction
                smallWindow
            >
                <Login/>
            </Modal>
            <div
                onClick={(e) => {
                    e.stopPropagation()
                    setModalIsOpen(true)
                }}
                className="pointer"
            >
                <div
                    className="pointer-events-none"
                >
                    {children}
                </div>
            </div>
        </>
        : children}
        </>
    )
}

export default UserGuardLoginModal