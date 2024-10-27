import { useState, useEffect, useRef } from 'react'
import './styles/Img.css'

const Img = ({img, alt, onClick, className, style, bigDisplay}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isBigDisplay, setIsBigDisplay] = useState(false)
    const imgRef = useRef()

    const escape = (e) => {
        if(e.key === 'Escape') {
            setIsBigDisplay(false)
        }
    }

    const close = (e) => {
        if(e.target.className === 'img-big-display' || e.target.className === 'img-big-display-container') {
            setIsBigDisplay(false)
        }
    }

    useEffect(() => {
        const img = imgRef.current
        if (img && img.complete) {
            setIsLoading(false)
        } else {
            setIsLoading(true)
            img && img.addEventListener('load', () => setIsLoading(false))
        }
    }, [img])

    useEffect(() => {
        if(bigDisplay) {
            window.addEventListener('keydown', e => escape(e))
            window.addEventListener('click', e => close(e))
        }

        return () => {
            window.removeEventListener('keydown', e => escape(e))
            window.removeEventListener('click', e => close(e))
        }
    }, [bigDisplay])

    return (
        <>
        {bigDisplay && isBigDisplay && (
            <div className="img-big-display">
                <div className="img-big-display-container">
                    <img
                        onClick={isLoading ? null : onClick ? onClick : null}
                        src={img}
                        alt={alt}
                    />
                </div>
            </div>
        )}
        <img
            onClick={isLoading ? null : onClick ? onClick : null}
            src={img}
            alt={alt}
            ref={imgRef}
            loading="lazy"
            style={style}
            className={`img ${isLoading ? 'loading' : 'loaded'}${className ? ` ${className}` : ''}${bigDisplay ? ' pointer' : ''}}`}
            />
        </>
    )
}

export default Img