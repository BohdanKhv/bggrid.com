import { Button, Icon } from '../'

const ErrorInfo = ({icon, btnIcon, size, label, secondary, tertiary, onClick, btnLabel, type, isLoading, className, to, variant, code, info}) => {
    return (
        code ?
        <div className="flex flex-col">

            <div className="h-100 w-100 flex justify-center align-center">
                <div className="title-2 border-right px-4 weight-500">
                    {code}
                </div>
                <div className="flex flex-col justify-start px-4">
                    <div className="fs-12">
                        {info || 'An error occurred'}
                    </div>
                </div>
            </div>
            {to && (
                <Button
                    label={btnLabel || "Go back"}
                    to={to}
                    type="secondary"
                    variant={variant || "filled"}
                    className="mt-4"
                />
            )}
        </div>
        :
        <div className={`flex flex-col overflow-hidden align-center px-3 py-6 justify-center${className ? ` ${className}` : ''}`}>
            {isLoading ? 
                <div className="spinner mb-3"/>
            : icon && (
                <Icon
                    icon={icon}
                    size={size ? size : 'lg'}
                    className="mb-3 title-1"
                    type={type}
                />
            )}
            {label && (
            <p className="fs-16 text-center weight-500 text-capitalize w-max-400-px text-ellipsis-1">
                {label}
            </p>
            )}
            {secondary && (
                <p className="fs-12 text-center text-secondary mt-1 w-max-400-px">
                    {secondary}
                </p>
            )}
            {tertiary && (
                <p className="fs-12 text-center text-secondary">
                    {tertiary}
                </p>
            )}
            {onClick && (
                <Button
                    icon={btnIcon}
                    label={btnLabel}
                    onClick={onClick}
                    type="primary"
                    variant={variant || "filled"}
                    className="mt-4"
                />
            )}
            {to && (
                <Button
                    icon={btnIcon}
                    label={btnLabel}
                    to={to}
                    type="primary"
                    variant={variant || "filled"}
                    className="mt-4"
                />
            )}
        </div>
    )
}

export default ErrorInfo