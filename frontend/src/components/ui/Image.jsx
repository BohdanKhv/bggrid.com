import { useEffect, useState, useRef } from 'react'
import './styles/Image.css'
import Icon from './Icon';
import { createPortal } from 'react-dom';
import { closeIcon } from '../../assets/img/icons';
import Button from './Button';

const Image = ({
    img,
    alt,
    errIcon,
    contain,
    ignoreErr,
    classNameContainer,
    classNameImg,
    bigDisplay,
    style
}) => {
    const [loading, setLoading] = useState(false);
    const [imgErr, setImgErr] = useState(false);
    const imgRef = useRef(null);
    const [isBigDisplay, setIsBigDisplay] = useState(false)

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
        {bigDisplay && isBigDisplay && !imgErr && createPortal(
            <div className="image-big-display"
            >
                <div className="pos-absolute top-0 right-0 m-5">
                    <Button
                        color="secondary"
                        variant="default"
                        type="secondary"
                        muted
                        icon={closeIcon}
                        onClick={() => setIsBigDisplay(false)}
                    />
                </div>
                <div className="image-big-display-container">
                    <img
                        src={img}
                        alt={alt}
                    />
                </div>
            </div>,
            document.body
        )}
        <div 
            className={`image${imgErr ? ' img-error' : ''}${loading ? ' image-loading' : ''}${classNameContainer ? ` ${classNameContainer}` : ''}`}
            style={style}
            onClick={() => {
                if (img && bigDisplay) {
                    setIsBigDisplay(true)
                }
            }}
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