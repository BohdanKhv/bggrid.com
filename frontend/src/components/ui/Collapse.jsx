import { useEffect, useState, useRef } from 'react'
import { downArrowIcon } from '../../assets/img/icons'
import './styles/Collapse.css'


const Collapse = ({
    children,
    label,
    labelRight,
    title,
    icon,
    labelClassName,
    className,
    onOpen,
    onClose,
    isOpen,
    classNameOpen,
    classNameOpenLabel,
    labelEllipsis,
    classNameContainer,
    customLabelOpen,
    customLabel,
    ...props
}) => {
    const [open, setOpen] = useState(isOpen ? isOpen : false)
    const [height, setHeight] = useState(0)
    const collapseBodyRef = useRef(null)
    const collapseBodyInnerRef = useRef(null)

    useEffect(() => {
        if(isOpen) {
            setOpen(true)
        } else {
            setOpen(false)
        }
    }, [isOpen])

    useEffect(() => {
        if(open && collapseBodyInnerRef.current) {
            setHeight(collapseBodyInnerRef.current.scrollHeight)
        } else {
            setHeight(0)
        }
    }, [open])

    // resize height if inner content changes height
    useEffect(() => {
        if(open && collapseBodyInnerRef.current) {
            setHeight(collapseBodyInnerRef.current.scrollHeight)
        }
    }, [children, collapseBodyRef.current])

    return (
        <div className={`collapse${open ? ` collapse-open ${classNameOpen ? ` ${classNameOpen}` : ''}` : ' collapse-closed'}${className ? ` ${className}` : ''}`}>
            <div className={`collapse-label ${classNameContainer ? ` ${classNameContainer}` : ''}${open ? classNameOpenLabel ? ` ${classNameOpenLabel}` : '' : ''}${labelEllipsis ? ' collapse-label-ellipsis' : ''}`}
                onClick={() => {
                    setOpen(!open)
                    open ? onClose && onClose() : onOpen && onOpen()
                }}>
                <div className="flex align-center flex-grow-1">
                    {title ?
                    <div className="flex align-end">
                        {icon &&
                            <div className={`icon icon-sm me-2`}>
                                {icon}
                            </div>
                        }
                        <div className="flex flex-col mb-2">
                            <div className="fs-12 text-secondary">
                                {title}
                            </div>
                            <div className={`fs-16`}>
                                {label}
                            </div>
                        </div>
                    </div>
                    :
                    open && customLabelOpen ? customLabelOpen :
                    customLabel ? customLabel :
                    <>
                        {icon &&
                            <div className={`icon icon-sm me-3`}>
                                {icon}
                            </div>
                        }
                        <div className={`fs-16${labelClassName ? ` ${labelClassName}`: ''} collapse-label-content`}>
                            {props.customLabel ? props.customLabel : label}
                        </div>
                    </>
                    }
                </div>
                <div className="flex align-center justify-center">
                    {labelRight &&
                        labelRight
                    }
                    {props.noArrow ? null :
                    <div className={`icon icon-sm transition-duration${open ? ' transform-rotate-180' : ''}`}>
                        {downArrowIcon}
                    </div>
                    }
                </div>
            </div>
            <div className="collapse-body"
                ref={collapseBodyRef}
                style={{height: open ? height : 0}}
            >
                <div className="collapse-body-inner"
                    ref={collapseBodyInnerRef}
                >
                    {props.leftLine ? 
                    <div className="flex mt-2">
                        <div className="bg-primary border-radius mx-2" style={{width: '2px'}} />
                        <div className="flex-grow-1">
                            {children}
                        </div>
                    </div>
                    : children }
                </div>
            </div>
        </div>
    )
}

export default Collapse