import { IconButton } from '../'
import { leftArrowSmIcon, rightArrowIcon } from "../../assets/img/icons"

const Carousel = ({items, currentItem, onChange}) => {
    return (
    items && items.length > 0 && currentItem && onChange &&
        <div className="flex justify-between align-center py-4 px-3">
            <div style={{minWidth: '29px'}}>
                { items.findIndex(l => l._id === currentItem._id) !== 0 &&
                    <IconButton
                        icon={leftArrowSmIcon}
                        size="md"
                        onClick={() => {
                            const currIndex = items.findIndex(l => l._id === currentItem._id);
                            const prevIndex = currIndex - 1;
                            onChange(items[prevIndex])
                        }}
                    />
                }
            </div>
            <div className="flex flex-col align-center">
                <div className="fs-18">
                    {currentItem.name}
                </div>
                <div className="fs-14 text-secondary">
                    {`${items.findIndex(l => l._id === currentItem._id) + 1} of ${items.length}`}
                </div>
            </div>
            <div style={{minWidth: '29px'}}>
                { items.findIndex(l => l._id === currentItem._id) !== items.length - 1 &&
                    <IconButton
                        icon={rightArrowIcon}
                        size="md"
                        onClick={() => {
                            const currIndex = items.findIndex(l => l._id === currentItem._id);
                            const nextIndex = currIndex + 1;
                            onChange(items[nextIndex])
                        }}
                    />
                }
            </div>
        </div>
    )
}

export default Carousel