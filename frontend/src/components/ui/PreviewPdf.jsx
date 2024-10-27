import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom';
import { imgPlaceholder } from '../../assets/constants';
import { minusIcon, largePlusIcon, linkIcon, xIcon, downloadIcon, moreIcon, shareIcon, leftArrowIcon, rightArrowIcon, leftArrowSmIcon, plusIcon } from '../../assets/img/icons';
import ButtonGroup from './ButtonGroup';
import Button from './Button';
import './styles/PreviewPdf.css'
import IconButton from './IconButton';
import Dropdown from './Dropdown';
import { downloadFile } from '../../assets/utils';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

const PreviewPdf = ({
    children,
    file,
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
    const bigDisplayRef = useRef(null)
    const [linkCopied, setLinkCopied] = useState(false)
    const [scale, setScale] = useState(1)
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);

    const escape = (e) => {
        if(e.key === 'Escape') {
            setIsBigDisplay(false)
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', e => escape(e))

        return () => {
            window.removeEventListener('keydown', e => escape(e))
        }
    }, [])

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

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    }

    return (
        <>
        {isBigDisplay && !imgErr && createPortal(
            <div className="preview-pdf-big-display"
                ref={bigDisplayRef}
            >
                    <div className="preview-pdf-big-display-container">
                        <div className="preview-pdf-big-display-controllers-top">
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
                            </div>
                        </div>
                        <div className="preview-pdf-big-display-container-inner">
                            <div className="preview-pdf-big-display-container-inner-pdf">
                                {isLoading ?
                                    <div className="spinner"/>
                                :
                                    <Document
                                        file={file}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                    >
                                        <Page 
                                            pageNumber={pageNumber}
                                            height={window.innerHeight}
                                            width={window.innerWidth}
                                            scale={scale}
                                        />
                                    </Document>
                                }
                            </div>
                        </div>
                        <div className="preview-pdf-big-display-controllers-bottom">
                            <div className="flex gap-3">
                                <ButtonGroup
                                    className="border-transparent"
                                >
                                    <Button
                                        icon={leftArrowSmIcon}
                                        disabled={pageNumber <= 1}
                                        onClick={() => {
                                            setPageNumber(pageNumber - 1)
                                        }}
                                        type="secondary"
                                    />
                                    <Button
                                        label={`${pageNumber || 1}/${numPages || 1}`}
                                        type="secondary"
                                    />
                                    <Button
                                        icon={rightArrowIcon}
                                        disabled={pageNumber >= numPages}
                                        onClick={() => {
                                            setPageNumber(pageNumber + 1)
                                        }}
                                        type="secondary"
                                    />
                                </ButtonGroup>
                                <ButtonGroup
                                    className="border-transparent"
                                >
                                    <Button
                                        icon={minusIcon}
                                        onClick={() => {
                                            setScale(scale - 0.25)
                                        }}
                                        disabled={scale <= 0.25}
                                        type="secondary"
                                    />
                                    <Button
                                        icon={xIcon}
                                        onClick={() => {
                                            setScale(1)
                                        }}
                                        type="secondary"
                                    />
                                    <Button
                                        icon={plusIcon}
                                        onClick={() => {
                                            setScale(scale + 0.25)
                                        }}
                                        type="secondary"
                                    />
                                </ButtonGroup>
                            </div>
                        </div>
                    </div>
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
            null
        }
        </>
    )
}

export default PreviewPdf