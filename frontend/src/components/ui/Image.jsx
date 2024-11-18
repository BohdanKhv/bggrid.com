import { useEffect, useState, useRef } from 'react'
import './styles/Image.css'

const Image = ({
    img,
    alt,
    contain,
    ignoreErr,
    classNameContainer,
    classNameImg,
    style
}) => {
    const [loading, setLoading] = useState(false);
    const [imgErr, setImgErr] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const img = imgRef.current
        if (img) {
        setLoading(true)
        // If image is already loaded, don't show loader
        if (img.complete) {
            setLoading(false)
        } else {
            setImgErr(false)
            setLoading(true)
        }
        // If image is not loaded, show loader
        img.addEventListener('error', () => {
            if(!ignoreErr) {
            setImgErr(true)
            }
        })
        img.addEventListener('load', () => setLoading(false))
        }
    }, [imgRef])

    return (
        <>
        <div 
            className={`image${imgErr ? ' img-error' : ''}${loading ? ' image-loading' : ''}${classNameContainer ? ` ${classNameContainer}` : ''}`}
            style={style}
        >
            <img
                className={`${contain ? ' image-contain' : ''}${classNameImg ? ` ${classNameImg}` : ''}`}
                ref={imgRef}
                src={imgErr ? '' : img} 
                alt={alt}
                draggable="false"
                decoding="async"
                loading="lazy"
                onError={() => setImgErr(true)}
            />
        </div>
        </>
    )
}

export default Image