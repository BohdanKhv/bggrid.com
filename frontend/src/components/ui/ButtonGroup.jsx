import './styles/ButtonGroup.css'

const ButtonGroup = ({children, className}) => {
    return (
        <div className={`button-group${className ? ` ${className}` : ''}`}>
            {children}
        </div>
    )
}

export default ButtonGroup