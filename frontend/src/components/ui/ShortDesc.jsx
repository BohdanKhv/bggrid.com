import React, { useState } from 'react'

const ShortDesc = ({content, isOpen, ellipsis, className}) => {
    const [open, setOpen] = useState(isOpen ? isOpen : false)

    return (
        <div
            className={`${!open ? `text-ellipsis-${ellipsis ? ellipsis : '2'}` : ""} pointer${className ? ` ${className}` : ''}`}
            onClick={() => setOpen(!open)}
        >
            {content}
        </div>
    )
}

export default ShortDesc