import { useRef, useState, useEffect } from 'react';
import './styles/TabContent.css';

const TabContent = ({items, active, onChange, setActive, setActiveTabName, activeTabName}) => {
    const activeRef = useRef(null);
    const indicatorRef = useRef(null);
    const containerRef = useRef(null);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [indicatorWidth, setIndicatorWidth] = useState(0);
    const [indicatorLeft, setIndicatorLeft] = useState(0);


    useEffect(() => {
        const activeTab = activeRef.current;
        const indicator = indicatorRef.current;
        if (indicator && activeTab) {
            const activeTabWidth = activeTab.offsetWidth;
            const activeTabLeft = activeTab.offsetLeft;
            setIndicatorWidth(activeTabWidth);
            setIndicatorLeft(activeTabLeft);

            // scroll tabs content to make active tab on the middle of container
            const container = containerRef.current;
            const containerWidth = container.offsetWidth;
            const containerScrollLeft = container.scrollLeft;
            const containerHalfWidth = containerWidth / 2;
            const activeTabHalfWidth = activeTabWidth / 2;
            const activeTabCenter = activeTabLeft + activeTabHalfWidth;
            const scrollLeft = activeTabCenter - containerHalfWidth + containerScrollLeft;
            container.scrollTo({
                left: scrollLeft,
            })
        }
    }, [active, items, activeTabName]);

    const onWheel = (e) => {
        if(containerRef.current === null) return
        if(containerRef.current.scrollWidth <= containerRef.current.clientWidth) return
        if (e.deltaY > 0) {
            setScrollLeft(containerRef.current.scrollLeft + 100)
        } else {
            setScrollLeft(containerRef.current.scrollLeft - 100)
        }
    }

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollLeft = scrollLeft
        }
    }, [scrollLeft])

    useEffect(() => {
        let timeout = null
        if (indicatorRef) {
            timeout = setTimeout(() => {
                indicatorRef?.current?.classList?.remove('animation-prevent');
            }, 200);
        }
        return () => {
            clearTimeout(timeout)
        }
    }, [indicatorRef, active, items, activeTabName, indicatorWidth, indicatorLeft]);

    return (
        <div className="tabs-content" ref={containerRef}
        onWheel={onWheel}>
            <div className="tabs-content-container">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`tab-content p-1${active === index || activeTabName === item?.label.toLowerCase() ? ' active': ''}`}
                        onClick={() => {
                            setActive && setActive(index)
                            setActiveTabName && setActiveTabName(item?.label.toLowerCase())
                            onChange && onChange()
                        }}
                        ref={active === index || activeTabName === item?.label.toLowerCase() ? activeRef : null}
                    >
                        {item.icon && <span className="tab-content-icon">{item.icon}</span>}
                        <div className="tab-content-label p-2">{item.label}</div>
                    </div>
                ))}
            </div>
            <span className="tabs-content-indicator animation-prevent" ref={indicatorRef}
                style={{
                    width: indicatorWidth,
                    left: indicatorLeft,
                }}
            />
        </div>
    )
}

export default TabContent