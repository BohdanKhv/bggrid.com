import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { imgPlaceholder } from '../../assets/constants';
import { closeIcon, minusIcon, plugIcon, largePlusIcon, linkIcon, copyIcon, xIcon, checkIcon, downloadIcon, arrowLeftRightIcon, moreIcon, shareIcon, leftArrowIcon, arrowClockwiseIcon, arrowCounterclockwiseIcon } from '../../assets/img/icons';
import ButtonGroup from './ButtonGroup';
import Button from './Button';
import './styles/PreviewImage.css'
import IconButton from './IconButton';
import Dropdown from './Dropdown';
import { downloadFile } from '../../assets/utils';

const PreviewImage = ({
    children,
    img,
    alt,
    name,
    canOpenOnNewWindow,
    canShare,
    canDownload,
    contain,
    ignoreErr,
    imgClassName,
    isLoading
}) => {
    const [loading, setLoading] = useState(false);
    const [imgErr, setImgErr] = useState(false);
    const [isBigDisplay, setIsBigDisplay] = useState(false)
    const imgRef = useRef(null);
    const bigDisplayRef = useRef(null)
    const [linkCopied, setLinkCopied] = useState(false)
    const [rotate, setRotate] = useState(0)

    const escape = (e) => {
        if(e.key === 'Escape') {
            setIsBigDisplay(false)
        }
    }

    // const close = (e) => {
    //     if (e.target.className === 'preview-img-big-display-container') {
    //         setIsBigDisplay(false)
    //     }
    // }

    useEffect(() => {
        window.addEventListener('keydown', e => escape(e))
        // window.addEventListener('click', e => close(e))
        // window.addEventListener('touchend', e => close(e))

        return () => {
            window.removeEventListener('keydown', e => escape(e))
            // window.removeEventListener('click', e => close(e))
            // window.removeEventListener('touchend', e => close(e))
        }
    }, [])


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
        if(isBigDisplay && bigDisplayRef.current) {
            document.body.appendChild(bigDisplayRef.current);
        }
    
        return () => {
            if(isBigDisplay && bigDisplayRef.current && document.body.contains(bigDisplayRef.current)) {
                bigDisplayRef.current.remove();
            }
        }
    }, [isBigDisplay])

    return (
        <>
        {isBigDisplay && !imgErr && createPortal(
            <div className="preview-img-big-display"
                ref={bigDisplayRef}
            >
                <TransformWrapper
                    initialScale={1}
                    minScale={0.25}
                    centerOnInit
                    centerZoomedOut={true}
                    initialPositionY={1}
                >
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                    <div className="preview-img-big-display-container">
                        <div className="preview-img-big-display-controllers-top">
                            <div className="flex justify-between align-center container px-sm-2 gap-2">
                                <div className="flex-grow-1 flex align-center gap-2">
                                    <IconButton
                                        icon={leftArrowIcon}
                                        onClick={() => setIsBigDisplay(false)}
                                        type="secondary"
                                        variant="text"
                                    />
                                    <div className="fs-12 text-ellipsis-1">
                                        {name}
                                    </div>
                                </div>
                                {(canDownload || canShare || canOpenOnNewWindow) && (
                                <div className="flex justify-end">
                                    <Dropdown
                                        closeOnSelect
                                        customDropdown={
                                            <IconButton
                                                icon={moreIcon}
                                                type="secondary"
                                                variant="text"
                                            />
                                        }
                                    >
                                        {canOpenOnNewWindow && (
                                            <Button
                                                icon={linkIcon}
                                                label="Open in new window"
                                                onClick={() => {
                                                    window.open(img, '_blank')
                                                }}
                                                className="fs-12"
                                                type="secondary"
                                                variant="text"
                                            />
                                        )}
                                        {canShare && (
                                            <Button
                                                icon={shareIcon}
                                                label="Share link"
                                                onClick={() => {
                                                    navigator.share({
                                                        title: alt,
                                                        text: alt,
                                                        url: img
                                                    })
                                                }}
                                                className="fs-12"
                                                type="secondary"
                                                variant="text"
                                            />
                                        )}
                                        {canDownload && (
                                            <Button
                                                icon={downloadIcon}
                                                label="Download"
                                                onClick={() => {
                                                    downloadFile(img, alt)
                                                }}
                                                className="fs-12"
                                                type="secondary"
                                                variant="text"
                                            />
                                        )}
                                    </Dropdown>
                                </div>
                                )}
                            </div>
                        </div>
                            <TransformComponent
                                centerZoomedOut
                            >
                                <div className="preview-img-big-display-container-inner">
                                    <div className="preview-img-big-display-container-inner-img">
                                        {isLoading ?
                                            <div className="spinner"/>
                                        :
                                            <img
                                                src={imgErr ? imgPlaceholder : img} 
                                                alt={alt}
                                                decoding="async"
                                                loading="lazy"
                                                style={{
                                                    transform: `rotate(${rotate}deg)`
                                                }}
                                            />
                                        }
                                    </div>
                                </div>
                            </TransformComponent>
                        <div className="preview-img-big-display-controllers-bottom">
                            <div className="flex gap-1">
                                <ButtonGroup
                                    className="border-transparent"
                                >
                                    <Button
                                        icon={arrowClockwiseIcon}
                                        onClick={() => {
                                            setRotate(rotate + 90)
                                        }}
                                        type="secondary"
                                    />
                                    <Button
                                        icon={minusIcon}
                                        onClick={() => {
                                            zoomOut()
                                        }}
                                        type="secondary"
                                    />
                                    <Button
                                        icon={xIcon}
                                        onClick={() => {
                                            resetTransform()
                                        }}
                                        type="secondary"
                                    />
                                    <Button
                                        icon={largePlusIcon}
                                        onClick={() => {
                                            zoomIn()
                                        }}
                                        type="secondary"
                                    />
                                    <Button
                                        icon={arrowCounterclockwiseIcon}
                                        onClick={() => {
                                            setRotate(rotate - 90)
                                        }}
                                        type="secondary"
                                    />
                                </ButtonGroup>
                            </div>
                        </div>
                    </div>
                )}
                </TransformWrapper>
            </div>,
            document.body
        )}
        {children ?
            <div
                className="flex-grow-1"
                onClick={() => {setIsBigDisplay(true)}}
            >
                {children}
            </div>
        :
        <div 
            className={`preview-image${imgErr ? ' img-error' : ''}${loading ? ' preview-image-loading' : ''}`}
        >
            <img
                className={`${contain ? ' preview-image-contain' : ''}${imgClassName ? ` ${imgClassName}` : ''}`}
                ref={imgRef}
                src={imgErr ? imgPlaceholder : img} 
                onClick={() => {setIsBigDisplay(true)}}
                alt={alt}
                decoding="async"
                loading="lazy"
                onError={() => setImgErr(true)}
            />
        </div>
        }
        </>
    )
}

export default PreviewImage