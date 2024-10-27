import { Link } from 'react-router-dom'
import Icon from './Icon'
import { rightArrowIcon } from '../../assets/img/icons'

const Legend = ({items}) => {
    return (
        items && items.length &&
        <div className="flex gap-2">
            {items.map((item, index) => (
                <div className="flex gap-2 align-center"
                    key={index}
                >
                    <Link
                        key={index}
                        to={item.url}
                        className="fs-14 text-primary weight-600 hover-opacity-75 transition-duration"
                    >
                        {item.label}
                    </Link>
                    {item.active ?
                        null
                    :
                        <Icon
                            icon={rightArrowIcon}
                            size="xs"
                            className="opacity-50"
                        />
                    }   
                </div>
            ))}
        </div>
    )
}

export default Legend