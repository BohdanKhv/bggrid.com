import { useState, useEffect, useRef } from 'react'
import { closeIcon, downArrowIcon } from '../../assets/img/icons'
import './styles/Dropdown.css'
import IconButton from './IconButton'
import Button from './Button'
import { createPortal } from 'react-dom'

const Dropdown = ({
    isOpen,
    setIsOpen,
    children,
    label,
    className,
    closeOnSelect,
    closeOnEscape,
    classNameContainer,
    widthUnset,
    size,
    disabled,
    openUp,
    openRight,
    minWidth,
    maxWidth,
    customDropdown,
    dropdownButton,
    icon,
    classNameDropdown,
    mobileDropdown,
    ...props
}) => {
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [offsetTop, setOffsetTop] = useState(0)
    const [offsetLeft, setOffsetLeft] = useState(0)
    const menuRef = useRef(null)
    const dropdownLabelRef = useRef(null)

    const closeDropdown = (e) => {
        if(e.target !== dropdownLabelRef.current && !dropdownLabelRef.current.contains(e.target))
        setOpen2(false)
    }

    useEffect(() => {
        document.addEventListener('click', closeDropdown)
        return () => {
            document.removeEventListener('click', closeDropdown)
        }
    }, [])

    useEffect(() => {
        if (!open2) {
            setTimeout(() => {
                setOpen(false);
            }, 150);
        } else {
            setOpen(true);
        }
    }, [open2]);

    useEffect(() => {
        if(menuRef.current && dropdownLabelRef.current) {
            const menuHeight = menuRef.current.getBoundingClientRect().height;
            const dropdownLabelRefHeight = dropdownLabelRef.current.getBoundingClientRect().height;
            const dropdownLabelRefTop = dropdownLabelRef.current.getBoundingClientRect().top;
            const dropdownLabelRefLeft = dropdownLabelRef.current.getBoundingClientRect().left;
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
    
            // If the dropdown label is below the middle of the viewport, open the dropdown upwards
            if (dropdownLabelRefTop > viewportHeight / 2) {
                setOffsetTop(-(menuHeight + dropdownLabelRefHeight) - 10);
            } else {
                setOffsetTop(dropdownLabelRefHeight - dropdownLabelRefHeight);
            }

            const menuWidth = menuRef.current.getBoundingClientRect().width;
            const dropdownLabelRefWidth = dropdownLabelRef.current.getBoundingClientRect().width;

            const viewportCenter = viewportWidth / 2;

            if (dropdownLabelRefLeft + menuWidth > viewportWidth) {
                // If the dropdown would overflow the right edge of the viewport, open to the left
                setOffsetLeft(-menuWidth + dropdownLabelRefWidth);
            } else if (dropdownLabelRefLeft > viewportCenter) {
                // If the button is on the right half of the screen, open to the left
                setOffsetLeft(-menuWidth + dropdownLabelRefWidth);
            } else {
                // If the button is on the left half of the screen, open to the right
                setOffsetLeft(0);
            }
        }
    }, [menuRef, dropdownLabelRef, open]);

    useEffect(() => {
        if (closeOnEscape) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    setOpen2(false)
                }
            })
            return () => {
                document.removeEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        setOpen2(false)
                    }
                })
            }
        }
    }, [closeOnEscape])

    useEffect(() => {
        setOpen2(isOpen);
    }, [isOpen]);

    useEffect(() => {
        if (setIsOpen) {
            setIsOpen(open2);
        }
    }, [open2, setIsOpen]);

    return (
        <div className={`dropdown flex-shrink-0${open2 ? ' dropdown-open' : ' dropdown-closed'}${disabled ? " cursor-disabled" : ""}${mobileDropdown ? ' dropdown-mobile' : ''}`}
            style={{
                minWidth: minWidth ? `${minWidth}px` : undefined,
            }}
        >
            {customDropdown ?
                <div
                    onClick={(e) => {
                        if (disabled) return
                        setOpen2(!open2)
                    }}
                    ref={dropdownLabelRef}
                >
                    {customDropdown}
                </div>
            : dropdownButton ?
                <div
                    ref={dropdownLabelRef}
                >
                    <Button
                        disabled={disabled}
                        onClick={(e) => {
                            if (disabled) return
                            setOpen2(!open2)
                        }}
                        size={size}
                        variant={props?.variant ? props.variant : 'text'}
                        type={props?.type ? props.type : 'secondary'}
                        className={classNameContainer}
                        label={label}
                        icon={icon}
                        iconRight={
                            <div className={`btn-icon btn-icon-right transition-duration flex align-center${open ? ' transform-rotate-180' : ""}`}>
                                {downArrowIcon}
                            </div>
                        }
                    />
                </div>
            :
                <div className={`${size ? `dropdown-${size} ` : ''}${classNameContainer ? `${classNameContainer} ` : ''}dropdown-label-container justify-between flex align-center`}
                        onClick={(e) => {
                            if (disabled) return
                            // e.stopPropagation()
                            setOpen2(!open2)
                        }}
                        ref={dropdownLabelRef}
                    >
                    <div className={`dropdown-label text-capitalize me-2 ${className ? className : ''}`}>
                        {label}
                    </div>
                    <div className={`icon icon-xs transition-duration flex align-center${open ? ' transform-rotate-180' : ""}`}>
                        {downArrowIcon}
                    </div>
                </div>
            }
            {open ?
            window.innerWidth <= 800 && mobileDropdown ?
            createPortal(
                <div className={`dropdown-menu dropdown-mobile-content${open2 ? ' dropdown-menu-open' : ' dropdown-menu-closed'}`}
                    ref={menuRef}
                    style={{
                        maxWidth: props.menuMaxWidth ? props.menuMaxWidth : undefined,
                        minWidth: props.menuMinWidth ? props.menuMinWidth : undefined,
                        left: openRight ? undefined : !mobileDropdown ? `${offsetLeft}px` : undefined,
                        openRight: openRight ? 0 : undefined,
                        height: props.height ? props.height : undefined,
                        bottom: dropdownLabelRef && dropdownLabelRef.current.getBoundingClientRect().bottom + offsetTop > window.innerHeight ? `${offsetTop}px` : undefined,
                        top: !mobileDropdown && dropdownLabelRef && dropdownLabelRef.current.getBoundingClientRect().bottom + offsetTop <= window.innerHeight ? `${offsetTop}px` : undefined,
                    }}
                    onClick={(e) => {
                        if (disabled) return
                        e.stopPropagation()
                        closeOnSelect ? setOpen2(!open) : setOpen2(true)
                        mobileDropdown && e.target.classList.contains('dropdown-menu') && setOpen2(false)
                    }}
                >
                    {mobileDropdown ?
                    <div className="dropdown-mobile-menu">
                        <div className="dropdown-mobile-menu-label">
                            <div className="flex justify-between align-center px-4 py-4 border-bottom">
                                <div className="fs-16 weight-600">
                                    {props?.dropdownLabel}
                                </div>
                                <IconButton
                                    type="text"
                                    muted
                                    onClick={(e) => {
                                        if (disabled) return
                                        e.stopPropagation()
                                        setOpen2(false)
                                    }}
                                    icon={closeIcon}
                                    />
                            </div>
                        </div>
                        <div className="dropdown-mobile-container">
                            {children ? children : <div className="text-secondary fs-12 p-2">No options available</div>}
                        </div>
                    </div>
                    : children ? children : <div className="text-secondary fs-12 p-2">No options available</div>
                    }
                </div>
                , document.body)
                :
                <>
                {createPortal(
                <div className={`dropdown-menu${classNameDropdown ? ` ${classNameDropdown}` : ''}${widthUnset ? ' dropdown-w-unset' : ''}${open2 ? ' dropdown-menu-open' : ' dropdown-menu-closed'}`}
                    ref={menuRef}
                    style={{
                        maxWidth: props.menuMaxWidth ? props.menuMaxWidth : undefined,
                        minWidth: props.menuMinWidth ? props.menuMinWidth : undefined,
                        left: openRight ? undefined : `${dropdownLabelRef.current.getBoundingClientRect().left + offsetLeft + window.scrollX}px`,
                        right: openRight ? 0 : undefined,
                        height: props.height ? props.height : undefined,
                        bottom: dropdownLabelRef && dropdownLabelRef.current.getBoundingClientRect().bottom + offsetTop > window.innerHeight ? `${offsetTop}px` : undefined,
                        top: dropdownLabelRef && dropdownLabelRef.current.getBoundingClientRect().bottom + offsetTop <= window.innerHeight ? `${dropdownLabelRef.current.getBoundingClientRect().bottom + offsetTop + window.scrollY}px` : undefined,
                        transform: `translateY(${dropdownLabelRef.current.getBoundingClientRect().bottom + offsetTop > window.innerHeight ? '-100%' : '0'})`
                    }}
                    onClick={(e) => {
                        if (disabled) return
                        e.stopPropagation()
                        closeOnSelect ? setOpen2(!open) : setOpen2(true)
                        e.target.classList.contains('dropdown-menu') && setOpen2(false)
                    }}
                >
                    {children ? children : <div className="text-secondary fs-12 p-2">No options available</div>
                    }
                </div>
                , document.body)}
                </>
                : null
            }
        </div>
    )
}

export default Dropdown