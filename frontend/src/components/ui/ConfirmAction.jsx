import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import Banner from './Banner'
import ErrorInfo from './ErrorInfo'

const ConfirmAction = ({ children, title, secondary, isLoading, type, onClick, className, content, actionDangerBtnText, actionBtnText }) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!isLoading) setOpen(false)
    }, [isLoading])

    return (
        <>
            <Modal
                modalIsOpen={open}
                setModalIsOpen={setOpen}
                headerNone
                isLoading={isLoading}
                actionBtnText={onClick ? actionBtnText ? actionBtnText : "Confirm" : ''}
                onSubmit={onClick}
                actionDangerBtnText={actionDangerBtnText ? actionDangerBtnText : "Cancel"}
                onSubmitDanger={() => setOpen(false)}
                smallWindow
                smallWindowCenter
                type={type}
                classNameBody="overflow-hidden"
                dialogWindow
            >
                {content ?
                    content
                :
                <div className="flex flex-col gap-1">
                    <div className="fs-16 weight-600">
                        {title}
                    </div>
                    <div className="fs-14">
                        {secondary}
                    </div>
                </div>
                }
            </Modal>
            <div
                onClick={() => setOpen(true)}
                className={className ? `${className}` : ''}
            >
                {children}
            </div>
        </>
    )
}

export default ConfirmAction