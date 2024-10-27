import { useState, useEffect, useRef } from 'react';
import { arrowDoubleBottomIcon, arrowDoubleRightIcon, closeIcon } from '../../assets/img/icons';
import { IconButton, Avatar, BackBtn, Button } from '../';
import './styles/FsModal.css';
import { createPortal } from 'react-dom';

const FsModal = ({
    children,
    title,
    secondary,
    fsmOpen,
    onClose,
    setIsFsmOpen,
    logo,
    classNameContainer,
    fullScreen,
    classNameTitle,
    titleMiddle,
    classNameBody,
    classNameHeader,
    ...props
}) => {
    const wrapperRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const closeModal = () => {
        if (setIsFsmOpen) {
            setIsFsmOpen(false);
        }
        if (onClose) {
            onClose();
        }
    }

    const onClickOutside = (e) => {
        if (fullScreen) return
        if (e.target.classList.contains('fsm-wrapper')) {
            closeModal();
        }
    }

    const onEsc = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    }

    useEffect(() => {
        let timer;

        if (fsmOpen) {
            document.addEventListener('mousedown', onClickOutside);
            document.addEventListener('pointerdown', onClickOutside);
            document.addEventListener('keydown', onEsc);
        } else {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('pointerdown', onClickOutside);
            document.removeEventListener('keydown', onEsc);
        }

        if (!fsmOpen) {
            wrapperRef?.current?.addEventListener('transitionend', () => {
                setIsOpen(false);
            });
        } else {
            setIsOpen(true);
        }

        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('pointerdown', onClickOutside);
            document.removeEventListener('keydown', onEsc);
            clearTimeout(timer);
        }
    }, [fsmOpen]);

    useEffect(() => {
        return () => {
            document.removeEventListener('click', onClickOutside);
            document.removeEventListener('keydown', onEsc);
            document.body.style.overflow = 'auto';
        }
    }, []);

    return createPortal(
        isOpen ?
            <div 
                className={`fsm-wrapper${fsmOpen ? ' open' : ' closed'}${fullScreen ? ' fsm-full-screen' : ''}`}
                ref={wrapperRef}
            >
                <div className={`fsm${props.openBottom ? " fsm-bottom" : ""}${classNameContainer ? ` ${classNameContainer}` : ""}`}>
                    {!props.noTitle &&
                        <>
                        {title || props.customTitle ? (
                        <div className={`fsm-header${classNameHeader ? ` ${classNameHeader}` : ""}`}>
                            <div className={`flex justify-between align-center${classNameTitle ? ` ${classNameTitle}` : ''}`}>
                                    {titleMiddle ? (
                                        <div className="w-set-50-px"/>
                                    ) : null}
                                    {props.titleLeft ? (
                                        <BackBtn
                                            onClick={closeModal}
                                            label={props.titleLeft}
                                        />
                                    ) : null}
                                    {props.customTitle ? (
                                        props.customTitle
                                    ) :
                                    <div className="flex align-center overflow-hidden flex-no-wrap">
                                        {logo ? (
                                            <div className="me-3">
                                                <Avatar
                                                    img={logo ? `${logo}` : null}
                                                    alt={title}
                                                    name={title}
                                                    size="md"
                                                    len={2}
                                                    bigDisplay
                                                    contain
                                                />
                                            </div>
                                        ) : null}
                                        <div className="text-nowrap me-3">
                                            <div className="flex overflow-hidden align-center">
                                                <Button
                                                    variant="text"
                                                    icon={closeIcon}
                                                    onClick={closeModal}
                                                />
                                                <div className="ps-4 border-secondary ms-2 border-left fs-18 text-ellipsis">
                                                    {title}
                                                </div>
                                            </div>
                                            {secondary ? (
                                                <div className="fs-14 text-secondary text-ellipsis">
                                                    {secondary}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    }
                                    {props.titleRight ? (
                                        props.titleRight
                                    ) : null }
                            </div>
                        </div>
                        ) : (
                            <div className="fsm-close-absolute">
                                <div>
                                <IconButton
                                    color="secondary"
                                    variant="text"
                                    muted
                                    icon={closeIcon}
                                    onClick={closeModal}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                    }
                    <div className={`fsm-body safe-area-bottom${classNameBody ? ` ${classNameBody}` : ''}`}>
                        {children}
                    </div>
                </div>
            </div>
        : null
        ,
        document.body
    )
}

export default FsModal