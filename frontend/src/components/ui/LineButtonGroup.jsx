import './styles/LineButtonGroup.css'

const LineButtonGroup = ({ children, title }) => {
    return (
        <div className={`line-button-group`}>
            <div className={`line-button-group-content border border-radius border-secondary border-sm-none`}>
                {title && 
                    <div className="fs-20 p-4 weight-500 border-bottom border-secondary border-sm-none px-sm-3">
                        {title}
                    </div>
                }
                {children}
            </div>
        </div>
    )
}

export default LineButtonGroup