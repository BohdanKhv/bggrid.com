import { useState, useEffect, useRef } from 'react';
import { closeIcon } from '../../assets/img/icons';
import './styles/MobileModal.css';
import IconButton from './IconButton';
import { createPortal } from 'react-dom';
import Button from './Button';

const MobileModal = ({
    isOpen,
    onClose,
    children,
    header,
}) => {
    const [open2, setOpen2] = useState(isOpen);
    const menuRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setOpen2(true);
        } else {
            setOpen2(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        const modalContent = menuRef.current;
        if (modalContent) {
            const handleTransitionEnd = () => {
                if (onClose) {
                    onClose();
                }
                modalContent.removeEventListener('transitionend', handleTransitionEnd);
            };
            modalContent.addEventListener('transitionend', handleTransitionEnd);
            setOpen2(false);
        }
    };

    const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            handleClose();
        }
    };

    useEffect(() => {
        if (open2) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open2]);

    return createPortal(
        <div
            ref={menuRef}
            className={`mobile-modal-content${open2 ? ' mobile-modal-open' : ' mobile-modal-closed'}`}
            onClick={(e) => {
                e.stopPropagation();
                if (e.target.classList.contains('mobile-modal-content')) {
                    handleClose();
                    setTimeout(() => {
                        onClose();
                    }, 150);
                }
            }}
        >
            <div className="mobile-modal-menu">
                <div className="mobile-modal-container-wrapper">
                <div className="mobile-modal-container">
                    <div className="flex align-center px-4 pt-4 justify-between">
                        <div>
                            {header ? header : null}
                        </div>
                        <Button
                            rounded
                            variant="text"
                            icon={closeIcon}
                            size="lg"
                            muted
                            onClick={handleClose}
                            borderRadius="lg"
                        />
                    </div>
                    {children}
                </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default MobileModal;