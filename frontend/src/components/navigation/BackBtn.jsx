import { Link } from 'react-router-dom'
import { Button } from '../'
import { leftArrowIcon } from '../../assets/img/icons'

const BackBtn = ({to, label, onClick, icon}) => {
    return (
        <Link className="flex py-2 text-underlined-hover"
            to={to}
            onClick={onClick}
        >
            <Button
                icon={icon ? icon : leftArrowIcon}
                size="md"
                variant="link"
                type="secondary"
                label={label}
                className="fs-12 text-start weight-600 py-2"
            />
        </Link>
    )
}

export default BackBtn