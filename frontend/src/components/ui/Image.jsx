import { useEffect, useState, useRef } from 'react'
import './styles/Image.css'
import Icon from './Icon';

const Image = ({
    img,
    alt,
    errIcon,
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
            {((imgErr && errIcon) || (!img && errIcon)) ? <Icon icon={errIcon} />
            :
            <img
                className={`${contain ? ' image-contain' : ''}${classNameImg ? ` ${classNameImg}` : ''}`}
                ref={imgRef}
                src={img} 
                alt={alt}
                draggable="false"
                // decoding="async"
                loading="lazy"
                onError={() => setImgErr(true)}
            />
            }
        </div>
        </>
    )
}

export default Image