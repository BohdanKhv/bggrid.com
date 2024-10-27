import { useState } from "react"
import { checkIcon, copyIcon, rightArrowIcon } from "../../assets/img/icons"
import IconButton from "./IconButton"


const LineButton = ({label, title, placeholder, viewOnly, icon, onClick, type, noAction, disabled, rightIcon, rightLabel, rightCustom, secondary, className, classNameContainer, borderWidth,  isLoading, children, copy, showOverflowLabel}) => {
    const [isCopied, setIsCopied] = useState(false)

    return (
        <div className={`line-button ${viewOnly || (copy && !onClick) || noAction ? '' : 'bg-secondary-hover transition-duration pointer '} ${isLoading ? ' bg-secondary cursor-disabled' : disabled ? " text-secondary cursor-disabled" : ""}${classNameContainer ? `${classNameContainer} ` : ""}`}>
        <div className={`${className ? `${className} ` : ""}flex justify-between mx-2 overflow-hidden gap-2 align-center border-bottom ${borderWidth ? borderWidth : 'border-w-1'}${viewOnly || copy || noAction ? '' : ' hover-border-transparent '} border-secondary`}
            onClick={viewOnly ? undefined : !disabled && !isLoading ? onClick ? onClick : undefined : undefined}>
            <div className="flex align-center flex-grow-1 overflow-hidden">
                {title ?
                <div className="flex flex-sm-col flex-grow-1 w-min-0">
                    <div className="flex flex-col flex-1 w-set-200-px px-1 py-3 pb-sm-0 w-set-sm-auto">
                        <div className="flex align-center text-secondary">
                            {icon &&
                                <span className={`icon me-2 icon-xs`}>
                                    {icon}
                                </span>
                            }
                            <span className="fs-12 weight-500">
                                {title}
                            </span>
                        </div>
                    </div>
                    <div className="flex-grow-1">
                    {children ? (
                        children
                        ) : (
                            <div className="flex overflow-hidden">
                            <div className={`fs-14 fs-sm-16 text-wrap-anywhere${noAction ? "" : " text-underlined-hover"}${!showOverflowLabel ? " text-ellipsis " : ""}px-1 py-3 overflow-hidden${type ? ` text-${type}` : ""}`}>
                                {label ? label: <span className="text-secondary">{placeholder}</span>}
                            </div>
                            {copy && label?.length && label !== '-' ?
                                <div className="flex align-center justify-center">
                                    <IconButton
                                        variant="link"
                                        size="sm"
                                        className="ms-2"
                                        icon={isCopied ? checkIcon : copyIcon}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            navigator.clipboard.writeText(label)
                                            setIsCopied(true)
                                            setTimeout(() => setIsCopied(false), 2000)
                                        }}
                                        />
                                    </div>
                                : null}
                            </div>
                        )}
                    </div>
                </div>
                :
                <div className="px-1 py-3 flex gap-2 align-center">
                    {icon &&
                        <div className={`icon icon-sm${type ? ` fill-${type}` : ""}`}>
                            {icon}
                        </div>
                    }
                    <div className="flex flex-col">
                        <div>
                            <div className={`fs-16 ${type ? ` text-${type}` : ""}`}>
                                {label ? label : <span className="text-secondary">{placeholder}</span>}
                            </div>
                        </div>
                        {secondary &&
                            <div>
                                <div className="fs-14 mt-1 text-secondary">
                                    {secondary}
                                </div>
                            </div>
                        }
                    </div>
                </div>
                }
            </div>
            { rightIcon === 'none' ?
                null
            : rightCustom ?
                rightCustom
            : rightIcon ?
                <div className="icon icon-sm px-1 py-3">
                    {rightIcon}
                </div>
            : rightLabel ?
                <div className="fs-14 px-1 py-3">
                    {rightLabel}
                </div>
            : !noAction && !viewOnly ?
                <div className={`icon opacity-50 icon-xs${isLoading ? ' spinner' : " px-1 py-3"}`}>
                    {isLoading ? null : !disabled ? rightArrowIcon : null}
                </div>
            : null}
        </div>
        </div>
    )
}

export default LineButton