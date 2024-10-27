import { useEffect, useState } from "react"
import FsModal from "./FsModal"
import MobileModal from "./MobileModal"
import Modal from "./Modal"

const DynamicWrapper = ({ children, onClose, fsmOpen, classNameContainer, classNameBody, header, fsm }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        windowWidth > 800 ?
        fsm ?
            <Modal
                modalIsOpen={fsmOpen}
                headerNone
                classNameContent="p-0 scrollbar-none"
                noAction
                setModalIsOpen={onClose}
            >
                {children}
            </Modal>
        :
            children
        :
        <MobileModal
            isOpen={fsmOpen}
            onClose={onClose}
            header={header}
            children={children}
        />
    )
}


export default DynamicWrapper