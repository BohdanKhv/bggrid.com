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
            {scrollLeft > 10 ?
                <div className="horizontal-scroll-prev"/>
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
            {isScrollNeeded && scrollLeft < HorizontalScrollRef.current.scrollWidth - HorizontalScrollRef.current.clientWidth - 10 ?
                <div className="horizontal-scroll-next"/>
            : null}
        </div>
    )
}

export default HorizontalScroll