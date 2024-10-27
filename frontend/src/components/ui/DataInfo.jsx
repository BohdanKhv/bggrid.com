import React from 'react'
import Icon from './Icon'

const DataInfo = ({label, value, icon, wrap, className}) => {
    return (
        <div className={`flex ${wrap ? " flex-col" : " gap-3 gap-1"}${className? ` ${className}` : ""}`}>
            <div className={`fs-14 bold flex py-1 gap-2`}>
                {icon &&
                    <Icon
                        icon={icon}
                        className="opacity-75 fs-20"
                        size="lg"
                    />
                }
            </div>
            <div className="flex flex-col">
                <div className="fs-14 bold">
                    {label}
                </div>
                <div className="fs-14 flex align-center gap-1">
                    {value}
                </div>
            </div>
        </div>
    )
}

export default DataInfo