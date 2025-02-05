import { Link } from 'react-router-dom';
import './styles/IconButton.css';
import { spinnerIcon } from '../../assets/img/icons';

const IconButton = ({
    icon,
    onClick,
    variant,
    size,
    disabled,
    className,
    type,
    isLoading,
    dataTooltipContent,
    dataTooltipId,
    dataTooltipSide,
    noAction,
    notify,
    notifyCount,
    notifyEmpty,
    to,
    target,
    title,
    muted,
    ...props
}) => {

    return (
        icon &&
        <>
        {to ?
            <Link
                className={`icon-btn${muted ? " icon-btn-muted" : ""}${size ? ` icon-btn-${size}` : ''}${variant ? ` icon-btn-${variant}` : ''}${disabled ? ' icon-btn-disabled' : ''}${className ? ` ${className}` : ''}${type ? ` icon-btn-${type}` : ' icon-btn-secondary'}${noAction ? ' icon-btn-no-action' : ''}${notify && notifyCount ? ' icon-btn-notify' : ''}`}
                onClick={onClick ? onClick : undefined}
                disabled={disabled || isLoading || noAction}
                tabIndex={-1}
                data-tooltip-id={`${dataTooltipId ? dataTooltipId : dataTooltipContent ? 'tooltip-default' : ''}`}
                data-tooltip-content={dataTooltipContent}
                data-tooltip-place={dataTooltipSide ? dataTooltipSide : 'bottom'}
                title={title}
                to={to}
                target={target ? target : "_self"}
            >
            {isLoading ? 
                <div className="icon-svg spinner-animation">
                    {spinnerIcon}
                </div> : 
                notifyCount > 0 ?
                    <div className="icon-svg"
                        data-notify-count={notifyCount > 9 ? '9+' : notifyCount}
                    >
                        {icon && icon}
                    </div>
                :
                    <div className="icon-svg">
                        {icon && icon}
                    </div>
            }
            </Link>
        :
            <button
                className={`icon-btn${muted ? " icon-btn-muted" : ""}${size ? ` icon-btn-${size}` : ''}${variant ? ` icon-btn-${variant}` : ''}${disabled ? ' icon-btn-disabled' : ''}${className ? ` ${className}` : ''}${type ? ` icon-btn-${type}` : ' icon-btn-secondary'}${noAction ? ' icon-btn-no-action' : ''}${notify && notifyCount ? ' icon-btn-notify' : ''}${notifyEmpty ? " icon-btn-notify-empty" : ""}`}
                onClick={onClick ? onClick : undefined}
                disabled={disabled || isLoading || noAction}
                tabIndex={-1}
                data-tooltip-id={`${dataTooltipId ? dataTooltipId : dataTooltipContent ? 'tooltip-default' : ''}`}
                data-tooltip-content={dataTooltipContent}
                data-tooltip-place={dataTooltipSide ? dataTooltipSide : 'bottom'}
                title={title}
            >
            {isLoading ? 
                <div className="icon-svg spinner-animation">
                    {spinnerIcon}
                </div> : 
                notifyCount > 0 ?
                    <div className="icon-svg"
                        data-notify-count={notifyCount > 9 ? '9+' : notifyCount}
                    >
                        {icon && icon}
                    </div>
                :
                    <div className="icon-svg">
                        {icon && icon}
                    </div>
            }
            </button>
        }
        </>
    )
}

export default IconButton