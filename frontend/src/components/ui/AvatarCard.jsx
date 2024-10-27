import { Avatar, IconButton } from '../'
import { rightArrowIcon, spinnerIcon } from '../../assets/img/icons'

const AvatarCard = ({img, title, secondary, tertiary, forth, onClick, className, rightIcon, isLoading, iconSize, iconAction}) => {
    return (
        <div
            className={`${className ? className : ''} ${isLoading ? "bg-disabled " : ""}border border-radius p-3 hover`}
            onClick={onClick ? onClick : null}
        >
            <div className="flex justify-between align-center flex-grow-1 pointer-events-none">
                <div className="flex overflow-hidden">
                    <div className="list-item-logo">
                        <Avatar
                            img={img ? `${img}` : null}
                            name={title}
                            size="full"
                            borderRadiusNone
                            contain
                        />
                    </div>
                    <div className="flex flex-grow-1 flex-col justify-center list-item-name mx-3 gap-sm-1 overflow-hidden">
                        <div className="text-nowrap">
                            <div className="list-item-title text-ellipsis">{title}</div>
                            {secondary &&
                                <div className="fs-12 mt-1 text-secondary text-ellipsis">{secondary}</div>
                            }
                        </div>
                        <div className="text-nowrap">
                            {tertiary &&
                                <div className="fs-12 text-secondary text-ellipsis">{tertiary}</div>
                            }
                            {forth && 
                                <div className="fs-10 mt-1 text-secondary text-ellipsis">{forth}</div>
                            }
                        </div>
                    </div>
                </div>
                <div>
                    {iconAction ?
                        <IconButton
                            icon={rightIcon ? rightIcon : rightArrowIcon}
                            isLoading={isLoading}
                            disabled={isLoading}
                            size={iconSize ? iconSize : "sm"}
                        />
                    :  rightIcon != 'null' ?
                        <div className={`icon icon-sm${isLoading ? ' spinner' : ""}`}>
                            {isLoading || rightIcon === 'none' ? null : rightIcon ? rightIcon : rightArrowIcon}
                        </div>
                    : null}
                </div>
            </div>
        </div>
    )
}

export default AvatarCard