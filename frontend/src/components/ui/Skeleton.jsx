import './styles/Skeleton.css'

const Skeleton = ({width, widthType, height, type, animation, className, index, heightMobile, overflowBodyHidden}) => {
    return (
        <div 
            className={`skeleton${type ? ` skeleton-${type}` : ''}${animation ? ` skeleton-animation-${animation}` : ''}${className ? ` ${className}` : ''}${overflowBodyHidden ? ` skeleton-overflow-body-hidden` : ''}`}
            style={{
                '--skeleton-width': width ? `${width}${widthType ? widthType : 'px' }` : '100%',
                '--skeleton-height': height ? `${height}px` : '100%',
                '--skeleton-height-mobile': heightMobile ? `${heightMobile}px` : undefined,
                minWidth: type === 'circular' ? `${width}px` : undefined,
                minHeight: type === 'circular' ? `${height}px` : undefined,
                '--skeleton-animation-wave-delay': index ? index : "0"
            }}
        />
    )
}

export default Skeleton