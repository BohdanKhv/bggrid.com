import './styles/Switch.css'

const Switch = ({active, onChange, disabled, dataTooltipContent}) => {
  const id = Math.random().toString(36).substring(7)

    return (
        <>
          <input
            checked={active}
            onChange={(e) => {
              if (disabled || !onChange) return
              if (onChange) onChange(e.target.checked)
            }}
            onClick={(e) => e.stopPropagation()}
            className={`switch-checkbox d-none${disabled || !onChange ? " pointer-events-none" : ""}`}
            id={id ? id : `switch-new`}
            type="checkbox"
          />
          <label
            className={`switch-label${active ? " switch-label-on" : ""}${disabled ? " switch-label-disabled" : ""}`}
            htmlFor={id ? id : `switch-new`}
            data-tooltip-id={`${dataTooltipContent ? 'tooltip-default' : ''}`}
            data-tooltip-content={dataTooltipContent}
          >
            <span className={`switch-button`} />
          </label>
        </>
    )
}

export default Switch