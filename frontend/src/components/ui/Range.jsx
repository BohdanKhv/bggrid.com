import './styles/Range.css'

const Range = ({value, onChange, min, max, className}) => {
    return (
        <input
            className={`range-input${className ? ` ${className}` : ""}`}
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    )
}

export default Range