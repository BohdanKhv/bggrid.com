import { rightArrowIcon } from "../../assets/img/icons"


const BoxButton = ({label, onClick, secondary, className, rightIcon, isLoading, noAction}) => {

    return (
        <div className={`border border-radius hover p-3${className ? ` ${className}` : ''}`} onClick={onClick && !isLoading ? onClick : null}>
            <div className="flex justify-between h-100 align-center">
                <div className="flex flex-col text-nowrap me-3">
                    <div className="fs-16 white-space-nowrap">
                        {label}
                    </div>
                    {secondary &&
                        <div className="fs-14 text-secondary white-space-nowrap mt-1">
                            {secondary}
                        </div>
                    }
                </div>
                <div>
                    <div className={`icon icon-sm${isLoading ? ' spinner' : ''}`}>
                        {isLoading ? null : rightIcon ? rightIcon : noAction ? null : rightArrowIcon}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BoxButton