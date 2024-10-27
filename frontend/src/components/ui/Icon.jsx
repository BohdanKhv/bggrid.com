const Icon = ({size, icon, className, type, dataTooltipContent, dataTooltipId, dataTooltipPosition, style}) => {
    return (
        <div className={`${size === 'float' ? '' : 'icon'}${size ? ` icon-${size}` : ' icon-md'}${className ? ` ${className}` : ''}${type ? ` fill-${type}` : ''}`}
            style={style}
            data-tooltip-id={`${dataTooltipId ? dataTooltipId : dataTooltipContent ? 'tooltip-default' : ''}`}
            data-tooltip-content={dataTooltipContent}
            data-tooltip-place={dataTooltipPosition ? dataTooltipPosition : 'bottom'}
        >
            {icon}
        </div>
    )
}

export default Icon