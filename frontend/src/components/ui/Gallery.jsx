import { useEffect, useRef, useState } from 'react';
import { Button, Image } from '../';
import { closeIcon } from '../../assets/img/icons';
import './styles/Gallery.css';
import { createPortal } from 'react-dom';

const Gallery = ({
    items,
    isOpen,
    onClose,
    setIsOpen,
}) => {
    const [open, setOpen] = useState(isOpen);
    const containerRef = useRef(null);

    const closeModal = () => {
        onClose && onClose();
        setIsOpen && setIsOpen(false);
    }

    const clickOutside = (e) => {
        if (e.target.classList.contains('gallery-overlay') || e.target.classList.contains('gallery-wrapper')) {
            closeModal();
        }
    }

    const closeOnEscape = (e) => {
        if(e.key === 'Escape') {
            closeModal();
        }
    }

    useEffect(() => {
        let timeOut = null;

        if (!isOpen) {
            if (open) {
                timeOut = setTimeout(() => {
                    setOpen(false);
                    onClose && onClose();
                }, 150);
            }
        } else {
            setOpen(true);
        }

        if(isOpen) {
            window.addEventListener('keydown', closeOnEscape);
        }

        return () => {
            timeOut && clearTimeout(timeOut);
            window.removeEventListener('keydown', closeOnEscape);
        }
    }, [isOpen])

    return createPortal(
        open ? (
        <>
        <div className="gallery-overlay" onMouseDown={clickOutside}>
            <div className={`gallery-wrapper${isOpen ? ' gallery-open' : ' gallery-closed'}`}>
                <div className={`gallery-body`}>
                    <div className="pos-absolute top-0 right-0 m-5">
                        <Button
                            color="secondary"
                            variant="default"
                            type="secondary"
                            muted
                            icon={closeIcon}
                            onClick={closeModal}
                        />
                    </div>
                    <div className={`gallery-content`}>
                        <div className="gallery-big-display-container" ref={containerRef}>
                            {items.map((item, i) => (
                                <Image
                                    img={item.image}
                                    key={i}
                                />
                            ))}
                        </div>
                        <div className="gallery-content-images">
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    className={`gallery-thumbnail clickable`}
                                    onClick={() => {
                                        containerRef.current.scrollLeft = index * window.innerWidth;
                                    }}
                                >
                                    <Image
                                        img={item.thumbnail || item.image}
                                        classNameContainer="border-radius"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </> ) : null,
        document.body
    )
}

export default Gallery