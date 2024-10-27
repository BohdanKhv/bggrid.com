import { useEffect, useState } from 'react';
import { Button, Icon, IconButton } from '../';
import { closeIcon, errorIcon, spinnerIcon, warningFillIcon } from '../../assets/img/icons';
import './styles/Modal.css';
import { createPortal } from 'react-dom';

const Modal = ({
    children,
    secondary,
    bodyHidden,
    bodyStyles,
    headerNone,
    noAction,
    style,
    modalIsOpen,
    label,
    setModalIsOpen,
    actionBtnText,
    onSubmit,
    actionDangerBtnText,
    onSubmitDanger,
    disableClose,
    isLoading,
    notCloseOnUpdate,
    isError,
    errMsg,
    isScroll,
    onClose,
    type,
    classNameBody,
    classNameContent,
    showOverflow,
    warning,
    forbidBackdropClose,
    disabledAction,
    minWith,
    maxWith,
    dialogWindow,
    smallWindow,
    smallWindowCenter,
    onSubmitEnter,
    onSubmitDangerDelete,
    ...props
}) => {
    const [open, setOpen] = useState(false); 

    const closeModal = () => {
        if (forbidBackdropClose) {
            return;
        }

        setModalIsOpen && setModalIsOpen(false);
    }

    const onClickOutside = (e) => {
        if (forbidBackdropClose) {
            return;
        }

        if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-wrapper')) {
            if(!disableClose || disableClose === false) {
                closeModal();
            } else {
                console.log('modal is disabled');
            }
        }
    }

    const closeOnEscape = (e) => {
        if (forbidBackdropClose) {
            return;
        }

        if(e.key === 'Escape') {
            closeModal();
        }
    }

    useEffect(() => {
        if (forbidBackdropClose) {
            return;
        }

        let timeOut = null;

        if (!modalIsOpen) {
            timeOut = setTimeout(() => {
                setOpen(false);
                onClose && onClose();
            }, 150);
        } else {
            setOpen(true);
        }

        if(modalIsOpen) {
            window.addEventListener('keydown', closeOnEscape);
        }

        return () => {
            timeOut && clearTimeout(timeOut);
            window.removeEventListener('keydown', closeOnEscape);
        }
    }, [modalIsOpen])

    return createPortal(
        open ? (
        <>
        <div className="modal-overlay" onMouseDown={onClickOutside} style={{
            '--modal-min-width': minWith || '',
            '--modal-max-width': maxWith || undefined,
            ...style
        }}>
            <div className={`modal-wrapper${modalIsOpen ? ' modal-open' : ' modal-closed'}${dialogWindow ? " modal-dialog-window" : ""}${smallWindow ? " modal-small-window" : ""}${smallWindowCenter ? " modal-small-window-center" : ""}`}>
                <div className={`modal-body${classNameBody ? ` ${classNameBody}` : ""}${showOverflow ? ' modal-overflow-none' : ''}`}>
                    {!headerNone ? (
                    <div className="modal-header">
                        {props.centerHeader && <div className="w-set-50-px"/>}
                        <div>
                            <div className="fs-18 fs-sm-16 weight-500">{label}</div>
                            {secondary && <div className="fs-14 text-secondary mt-2">{secondary}</div>}
                        </div>
                        {disableClose ? null : (
                            <Button
                                color="secondary"
                                variant="text"
                                muted
                                icon={closeIcon}
                                onClick={closeModal}
                                disabled={forbidBackdropClose}
                            />
                        )}
                    </div>
                    ) : null}
                    <div className={`modal-content${isScroll ? ' modal-scroll' : ''}${classNameContent ? ` ${classNameContent}` : ""}`} style={bodyStyles}>
                        {children}
                        {isScroll && isLoading && (
                            <div className="flex align-center mb-1">
                                <div className="btn-icon modal-spinner">{spinnerIcon}</div>
                            </div>
                        )}
                    </div>
                    {isError && errMsg && (
                        <div className="modal-error">
                            <Icon
                                icon={errorIcon}
                                size="sm"
                                className="fill-danger"
                            />
                            {warning}
                        </div>
                    )}
                    {warning && (
                        <div className="modal-warning">
                            <Icon
                                icon={warningFillIcon}
                                size="sm"
                                className="fill-warning"
                            />
                            {warning}
                        </div>
                    )}
                    {!noAction && (
                        <div className="modal-footer flex-sm-col gap-2">
                            {props.footer ? (
                                props.footer
                            ) : 
                                actionDangerBtnText && !isLoading && (
                                    <Button
                                        label={actionDangerBtnText}
                                        onClick={onSubmitDanger ? onSubmitDanger : undefined}
                                        type="secondary"
                                        variant="text"
                                        size={smallWindow ? "lg" : ""}
                                        className={smallWindow ? "flex-grow-1" : "" }
                                        smSize="xl"
                                        disabled={forbidBackdropClose}
                                    />
                                )}
                                {actionBtnText && (
                                    <Button
                                        label={actionBtnText}
                                        onClick={onSubmit ? onSubmit : undefined}
                                        isLoading={isLoading}
                                        type={type ? type : "primary"}
                                        size={smallWindow ? "lg" : ""}
                                        className={smallWindow ? "flex-grow-1" : "" }
                                        variant="filled"
                                        onKeyPress={onSubmitEnter ?
                                            (e) => {
                                                if(e.key === 'Enter') {
                                                    onSubmit()
                                                }
                                            } : undefined
                                        }
                                        smSize="xl"
                                        disabled={disabledAction || forbidBackdropClose}
                                    />
                                )
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
        </> ) : null,
        document.body
    )
}

export default Modal