import './styles/SelectBasic.css'

const SelectBasic = ({options, value, onChange}) => {
    return (
        <select className="select-basic"
            value={value}
            onChange={onChange}
        >
            {options.map((option, i) => (
                <option key={i} value={option}>{option}</option>
            ))}
        </select>
    )
}

export default SelectBasic