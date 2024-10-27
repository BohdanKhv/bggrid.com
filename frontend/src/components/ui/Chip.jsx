
import { closeIcon } from "../../assets/img/icons"
import "./styles/Chip.css"


const Chip = ({label, remove, onClick, type, className, dataTooltipContent, disabled}) => {
    return (
        <div className={`chip${type ? ` chip-${type}` : ' chip-secondary'}${className ? ` ${className}` : ''}${disabled ? ' chip-disabled' : ''}`}
            onClick={!disabled && onClick ? onClick : null}
        >
            {label ? <span className="chip-label text-nowrap"
                data-tooltip-id={`${dataTooltipContent ? 'tooltip-default' : ''}`}
                data-tooltip-content={dataTooltipContent}
            >{label}</span> : ''}
            {remove ? <span className="chip-icon"
                data-tooltip-id="tooltip-default"
                data-tooltip-content="Remove"
                onClick={remove}
            >{closeIcon}</span> : ''}
        </div>
    )
}

export default Chip