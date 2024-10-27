import { useRef, useEffect, useState } from 'react'
import { leftArrowSmIcon, rightArrowIcon } from '../../assets/img/icons'
import { IconButton } from '../'
import './styles/HorizontalScroll.css'

const HorizontalScroll = ({children, fixed, noControllers, className, contentClassName}) => {
    const [scrollLeft, setScrollLeft] = useState(0);
    const HorizontalScrollRef = useRef(null);
    const HorizontalScrollParentRef = useRef(null);
    
    useEffect(() => {
        if (HorizontalScrollRef.current) {
            HorizontalScrollRef.current.scrollLeft = scrollLeft
        }
    }, [scrollLeft])
    
    useEffect(() => {
        const handleWheel = (e) => {
            if (HorizontalScrollRef.current) {
                HorizontalScrollRef.current.scrollLeft += e.deltaY;
            }
        }
    
        const scrollableElement = HorizontalScrollRef.current;
        if (scrollableElement) {
            scrollableElement.addEventListener('wheel', handleWheel);
        }
    
        return () => {
            if (scrollableElement) {
                scrollableElement.removeEventListener('wheel', handleWheel);
            }
        }
    }, []);
    
    // New state variable to store whether scrolling is needed
    const [isScrollNeeded, setIsScrollNeeded] = useState(false);
    
    useEffect(() => {
        if (HorizontalScrollRef.current) {
            setIsScrollNeeded(HorizontalScrollRef.current.scrollWidth > HorizontalScrollRef.current.clientWidth);
        }
    }, [children]); // Re-run this effect whenever children change
    
    return (
        <div className={`horizontal-scroll${fixed ? ' horizontal-scroll-fixed' : ''}${className ? ' ' + className : ''}`}
            ref={HorizontalScrollParentRef}
        >
            {!noControllers && scrollLeft > 10 ?
                <div className="horizontal-scroll-prev">
                    <IconButton
                        icon={leftArrowSmIcon}
                        type="secondary"
                        className="horizontal-scroll-next-button"
                        variant="link"
                        onClick={() => {
                            setScrollLeft(HorizontalScrollRef.current.scrollLeft < 250 ? 0 : HorizontalScrollRef.current.scrollLeft - 250)
                        }}
                    />
                </div>
            : null}
            <div 
                className={`horizontal-scroll-flex${contentClassName ? ' ' + contentClassName : ''}`}
                ref={HorizontalScrollRef}
                onScroll={(e) => {
                    setScrollLeft(e.target.scrollLeft)
                }}
            >
                {children}
            </div>
            { !noControllers && isScrollNeeded && scrollLeft < HorizontalScrollRef.current.scrollWidth - HorizontalScrollRef.current.clientWidth - 10 ?
                <div className="horizontal-scroll-next">
                    <IconButton
                        icon={rightArrowIcon}
                        type="secondary"
                        variant="link"
                        className="horizontal-scroll-next-button"
                        onClick={() => {
                            setScrollLeft(HorizontalScrollRef.current.scrollLeft + 250)
                        }}
                    />
                </div>
            : null}
        </div>
    )
}

export default HorizontalScroll