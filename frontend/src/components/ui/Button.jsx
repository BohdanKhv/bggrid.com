import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './styles/Button.css'
import { spinnerIcon } from '../../assets/img/icons'
import { useEffect } from 'react'

const Button = ({
    icon,
    iconRight,
    label,
    type,
    variant,
    size,
    smSize,
    isLoading,
    disabled,
    download,
    borderRadius,
    onClick,
    className,
    displayTextOnLoad,
    dataTooltipContent,
    to,
    target,
    textNoWrap,
    onKeyPress,
    rounded,
    dataTooltipHtml,
    muted,
    style
}) => {
    const navigate = useNavigate()

    useEffect(() => {
        if(onKeyPress) {
            document.addEventListener('keydown', onKeyPress)
            return () => {
                document.removeEventListener('keydown', onKeyPress)
            }
        }
    }, [onKeyPress, onClick])

    return (
        <>
        { to ?
            <Link className={`btn${rounded ? " btn-rounded" : ""}${muted ? " btn-muted" : ""}${type ? ` btn-${type}` : ''}${variant ? ` btn-${variant}` : ''}${smSize ? ` btn-sm-${smSize}` : ''}${size ? ` btn-${size}` : ''}${disabled || isLoading ? ' disabled' : ''}${className ? ` ${className}` : ''}${borderRadius ? ` border-radius-${borderRadius}` : ""}`}
                to={to}
                onClick={onClick ? (e) => { if(disabled) e.preventDefault(); onClick(e) } : null}
                data-tooltip-id={`${dataTooltipContent || onKeyPress ? 'tooltip-default' : ''}`}
                data-tooltip-content={dataTooltipContent ? dataTooltipContent : null}
                data-tooltip-html={dataTooltipHtml ? dataTooltipHtml : null}
                style={style}
                download={download}
                disabled={disabled || isLoading}
                target={target ? target : '_self'}
            >
                {isLoading ? 
                    <>
                    {displayTextOnLoad && label &&  <span className="btn-label text-ellipsis">{label}</span>}
                    <span className={`btn-icon spinner-animation`}>{spinnerIcon} </span>
                    </>
                : 
                    <>
                    {/* {onKeyPress && <span className="py-1 px-2 fs-10 border border-radius-xs bg-tertiary text-dark d-sm-none weight-100 me-2">{onKeyPress}</span>} */}
                    {icon ? <span className={`btn-icon`}>{icon}</span> : null}
                    {label !== undefined ? <span className={`btn-label text-ellipsis${textNoWrap ? ' text-nowrap' : ''}`}>{label}</span> : null}
                    {iconRight ? <span className={`btn-icon btn-icon-right`}>{iconRight}</span> : null}
                    </>
                }
            </Link>
        :
            <button className={`btn${rounded ? " btn-rounded" : ""}${muted ? " btn-muted" : ""}${type ? ` btn-${type}` : ''}${variant ? ` btn-${variant}` : ''}${smSize ? ` btn-sm-${smSize}` : ''}${size ? ` btn-${size}` : ''}${disabled || isLoading ? ' disabled' : ''}${className ? ` ${className}` : ''}${borderRadius ? ` border-radius-${borderRadius}` : ""}`}
                style={style}
                onClick={(e) => {
                    if(disabled) return
                    if(onClick) onClick(e)
                    if(to) navigate(to)
                }}
                disabled={disabled || isLoading}
                data-tooltip-id={`${dataTooltipContent || onKeyPress ? 'tooltip-default' : ''}`}
                data-tooltip-content={dataTooltipContent ? dataTooltipContent : null}
                data-tooltip-html={dataTooltipHtml ? dataTooltipHtml : null}
            >
                {isLoading ? 
                    <>
                    {displayTextOnLoad && label && <span className="btn-label text-ellipsis">{label}</span>}
                    <span className={`btn-icon spinner-animation`}>{spinnerIcon} </span>
                    </>
                : 
                    <>
                    {/* {onKeyPress && <span className="py-1 px-2 fs-10 border border-radius-xs bg-tertiary text-dark d-sm-none weight-100 me-2">{onKeyPress}</span>} */}
                    {icon ? <span className={`btn-icon`}>{icon}</span> : null}
                    {label !== undefined ? <span className={`btn-label text-ellipsis${textNoWrap ? ' text-nowrap' : ''}`}>{label}</span> : null}
                    {iconRight ? <span className={`btn-icon btn-icon-right`}>{iconRight}</span> : null}
                    </>
                }
            </button>
            }
        </>
    )
}

export default Button