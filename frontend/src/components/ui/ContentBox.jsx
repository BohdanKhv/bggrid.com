import React from 'react'

const ContentBox = ({ title, label, active, className, onClick }) => {
    return (
        <div className={`p-2 flex-1 border border-radius pointer${active ? " border-text text-primary weight-600 outline-primary border-primary" : " color-border-on-hover border-secondary text-secondary"}${className ? ` ${className}` : ""}`}
            onClick={onClick}
        >
            <div className="flex flex-col">
                {title !== undefined ?
                    <div className="fs-14">
                        {title}
                    </div>
                : null }
                {label !== undefined ?
                    <div className={`fs-16 weight-600`}>
                        {label}
                    </div>
                    : null }
            </div>
        </div>
    )
}

export default ContentBox