import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button, ErrorInfo, Icon, Modal } from "../../components"
import { getMe } from "../../features/auth/authSlice"
import { errorIcon } from "../../assets/img/icons"
import { useLocation, useNavigate } from "react-router-dom"
import { getMyLibrary } from "../../features/library/librarySlice"

const Me = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { pathname } = useLocation()

    const { user, isLoading, msg } = useSelector(state => state.auth)
    const [modalIsOpen, setModalIsOpen] = useState(!pathname.startsWith('/login-with-email') ? true : false)

    useEffect(() => {
        let promise;
        let promiseLibrary
        if (user) {
            promise = dispatch(getMe())
            promiseLibrary = dispatch(getMyLibrary())
        }

        return () => {
            if(promise) promise.abort()
            if(promiseLibrary) promiseLibrary.abort()
        }
    }, [])

    return (
        msg === 'Token expired' ?
        <>
            <Modal
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
                headerNone
                noAction
                smallWindow
                smallWindowCenter
                maxWith="300px"
                minWith="300px"
            >
            <div className="">
                <div className="tag-danger p-3 border-radius-md mb-3">
                    <div className="flex gap-3 align-center">
                        <Icon
                            className="fill-danger"
                            icon={errorIcon}
                        />
                        <div>
                            <div className="fs-16 weight-600">
                                Your session has expired.
                            </div>
                            <div className="fs-16">
                                Please log in again.
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    label="Dismiss"
                    variant={'outline'}
                    size={'lg'}
                    borderRadius="md"
                    className="w-100 mb-3"
                    muted
                    type={'secondary'}
                    onClick={() => setModalIsOpen(false)}
                />
                <Button
                    label="Log in"
                    variant={'filled'}
                    size={'lg'}
                    borderRadius="md"
                    className="w-100"
                    type={'primary'}
                    onClick={() => {
                        navigate('/login')
                        setModalIsOpen(false)
                    }}
                />
            </div>
            </Modal>
            </>
        : null
        // : isLoading ?
        //     <div className="h-min-100 w-100 flex justify-center align-center">
        //         <ErrorInfo
        //             isLoading={isLoading}
        //         />
        //     </div>
        // : children
    )
}

export default Me