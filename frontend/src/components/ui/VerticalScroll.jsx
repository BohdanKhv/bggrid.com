    import { useEffect, useRef } from 'react';
    import './styles/VerticalScroll.css'; // Import the styles file

    const VerticalScroll = ({ children, classNameContent, className }) => {
    const scrollShadowTop = useRef(null);
    const scrollShadowBottom = useRef(null);
    const scrollShadowContent = useRef(null);

    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const content = scrollShadowContent.current;
        const wrapper = scrollContainerRef.current;

        if (content && wrapper) {
            // set the height of the content to be the same as the wrapper
            content.style.height = `${wrapper.offsetHeight}px`;

            const contentScrollHeight = content.scrollHeight - wrapper.offsetHeight;

            scrollShadowBottom.current.style.opacity = contentScrollHeight > 0 ? 1 : 0;

            content.addEventListener('scroll', () => {
                const currentScroll = content.scrollTop / contentScrollHeight;
                scrollShadowTop.current.style.opacity = currentScroll;
                scrollShadowBottom.current.style.opacity = 1 - currentScroll;
            });
        }
    }, [children]);

    return (
        <div
            ref={scrollContainerRef}
            className={`vertical-scroll-wrapper${className ? ` ${className}` : ""}`}
        >
            <div className="vertical-scroll-shadow vertical-scroll-shadow-top" ref={scrollShadowTop} />
            <div className="vertical-scroll-shadow vertical-scroll-shadow-bottom" ref={scrollShadowBottom} />
            <div className={`vertical-scroll-content${classNameContent ? ` ${classNameContent}` : ""}`} ref={scrollShadowContent}>
                {children}
            </div>
        </div>
    );
};

export default VerticalScroll;
