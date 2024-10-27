import { checkIcon, uncheckIcon } from '../../assets/img/icons'
import './styles/CheckBox.css'

const CheckBox = ({checked, uncheck,  label, labelLeft, onClick, className, disabled, fontSize, rounded, type, isLoading, size, secondaryLabel}) => {

    return (
        <div className={`checkbox-wrapper${checked ? ' checkbox-wrapper-checked' : ''}${className ? ` ${className}` : ''}${disabled ? ' disabled' : ''}${fontSize ? ` fs-${fontSize}` : ''}${rounded ? ' checkbox-rounded' : ''}${type ? ` checkbox-${type}` : ''}${size ? ` checkbox-${size}` : ''}`}
            onClick={isLoading || disabled ? null : onClick ? onClick : null}
        >
            {labelLeft ? <span className="checkbox-label text-ellipsis-2">{labelLeft}</span> : null}
            {isLoading ? <span className="spinner"></span> : 
            <div className="checkbox">
            {checked ? <span className="checkbox-checked">{uncheck ? uncheckIcon : checkIcon}</span> : null}
            </div>
            }
            {label ? 
                <div className="flex gap-1 overflow-hidden flex-col">
                    <span className="checkbox-label text-ellipsis-2">{label}</span>
                    {secondaryLabel ? <span className="fs-12 text-secondary">{secondaryLabel}</span> : null}
                </div>
            : null}
        </div>
    )
}

export default CheckBox