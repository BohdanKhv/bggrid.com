import { useEffect, useState, useRef, memo } from 'react'
import './styles/Avatar.css'
import { createPortal } from 'react-dom';
import { imgPlaceholder } from '../../assets/constants';

const Avatar = ({
    img,
    name,
    size,
    sizeSm,
    alt,
    borderRadiusNone,
    defaultColor,
    len,
    bigDisplay,
    contain,
    noLoader,
    ignoreErr,
    imgClassName,
    onClick,
    rounded,
    icon,
    status,
    bg,
    avatarColor,
    dataTooltipContent
}) => {
    const [loading, setLoading] = useState(false);
    const [imgErr, setImgErr] = useState(false);
    const [isBigDisplay, setIsBigDisplay] = useState(false)
    const imgRef = useRef(null);
    const bigDisplayRef = useRef(null)

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
        if(bigDisplay) {
            window.addEventListener('keydown', e => escape(e))
            window.addEventListener('click', e => close(e))
            window.addEventListener('touchend', e => close(e))
        }

        return () => {
            window.removeEventListener('keydown', e => escape(e))
            window.removeEventListener('click', e => close(e))
            window.removeEventListener('touchend', e => close(e))
        }
    }, [bigDisplay])

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

    useEffect(() => {
        if(imgErr) {
            setImgErr(false)
            setLoading(false)
        }
    }, [img])

    useEffect(() => {
        if(bigDisplay && isBigDisplay && bigDisplayRef.current) {
            document.body.appendChild(bigDisplayRef.current);
        }
    
        return () => {
            if(bigDisplay && isBigDisplay && bigDisplayRef.current && document.body.contains(bigDisplayRef.current)) {
                bigDisplayRef.current.remove();
            }
        }
    }, [bigDisplay, isBigDisplay])

    return (
        <>
        {bigDisplay && isBigDisplay && !imgErr && createPortal(
            <div className="img-big-display" onClick={() => setIsBigDisplay(false)}
                ref={bigDisplayRef}
            >
                <div className="img-big-display-container max-width">
                    <img
                        src={imgErr ? imgPlaceholder : img} 
                        alt={alt}
                    />
                </div>
            </div>,
            document.body
        )}
        <div 
            className={`avatar text-decoration-none$${defaultColor ? " avatar-default" : ""}${imgErr ? ' img-error' : ''}${(loading && !noLoader) ? ' avatar-loading' : ''}${size ? ` avatar-${size}` : ''}${sizeSm ? ` avatar-sm-${sizeSm}` : ''}${borderRadiusNone ? ' avatar-border-radius-none' : ''}${bigDisplay ? " pointer" : ""}${rounded ? ' avatar-rounded' : ''}${status ? ` avatar-status avatar-status-${status}` : ''}`}
            style={{
                background: img && !imgErr ?  'transparent' : bg ? bg : avatarColor ? `var(--peer-avatar-${avatarColor % 21})`: `var(--peer-avatar-${((name?.length || 1) + 15) % 21})`,
            }}
            data-tooltip-id={`${dataTooltipContent ? 'tooltip-default' : ''}`}
            data-tooltip-content={dataTooltipContent}
        >
        { 
        imgErr ?
            icon ? icon : name ? name?.slice(0, len || 1).toUpperCase() : alt ? alt.slice(0, len || 1).toUpperCase() : 'AV'
        : img ?
            <img
                className={`${contain ? ' avatar-contain' : ''}${imgClassName ? ` ${imgClassName}` : ''} animation-fade-in`}
                ref={imgRef}
                src={imgErr ? imgPlaceholder : img} 
                onClick={() => {
                    if(bigDisplay) {setIsBigDisplay(true);}
                    if(onClick) {onClick()}
                }}
                alt={alt}
                // decoding="async"
                loading="lazy"
                onError={() => setImgErr(true)}
                draggable="false"
            />
            : icon ? icon : name ? name?.slice(0, len || 1).toUpperCase() : alt ? alt.slice(0, len || 1).toUpperCase() : 'AV'
        }
        </div>
        </>
    )
}

export default memo(Avatar)