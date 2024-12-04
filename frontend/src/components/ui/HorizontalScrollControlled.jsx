import { useRef, useEffect, useState } from 'react'
import { leftArrowSmIcon, rightArrowIcon } from '../../assets/img/icons'
import { IconButton } from '../'
import './styles/HorizontalScrollControlled.css'

const HorizontalScrollControlled = ({items, label, maxVisibleItems, contentClassName}) => {
    const scrollContainerRef = useRef(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft -= scrollContainerRef.current.clientWidth;
            setTimeout(updateScrollPosition, 300); // Adjust the timeout duration to match your animation duration
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft += scrollContainerRef.current.clientWidth;
            setTimeout(updateScrollPosition, 300); // Adjust the timeout duration to match your animation duration
        }
    };

    const updateScrollPosition = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setIsAtStart(scrollLeft === 0);
            setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
        }
    };

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.setProperty('--max-visible-items', maxVisibleItems);
            updateScrollPosition();
        }
    }, [maxVisibleItems]);


    return (
        <div className="flex flex-col">
            <div className="mb-4">
                <div className="flex justify-between align-center">
                    <div>
                        {label ? label : null}
                    </div>
                    <div className="">
                        <div className="flex items-center gap-2">
                            <IconButton
                                icon={leftArrowSmIcon}
                                onClick={scrollLeft}
                                type="secondary"
                                disabled={isAtStart}
                            />
                            <IconButton
                                icon={rightArrowIcon}
                                onClick={scrollRight}
                                type="secondary"
                                disabled={isAtEnd}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div 
                className={`scrollable-content`}
                ref={scrollContainerRef}
                onScroll={() => setTimeout(updateScrollPosition, 300)} // Adjust the timeout duration to match your animation duration
            >
                {items.map((item, index) => (
                    <div className="carousel-item bg-secondary-hover py-2 border-radius pointer" key={index}
                        style={{
                            '--max-visible-items': maxVisibleItems || 3
                        }}
                    >
                        {item}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HorizontalScrollControlled