import { useRef, useState } from 'react'
import Compressor from 'compressorjs';
import { Avatar, Button } from '../'
import { photoIcon, rightArrowIcon } from '../../assets/img/icons'
import './styles/AvatarUpload.css'

const AvatarUpload = ({img, setImg, setImgFile, label, title, noAction, disabled, size}) => {
    const inputRef = useRef(null)

    // Compress image ---------------------------------------------
    const onSelectFile = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const t0 = performance.now();
            new Compressor(file, {
                quality: 0.6,
                maxWidth: 1920,
                convertSize: 1000000, // 1MB
                success(blob) {
                    setImgFile(blob)
                },
            });
        }
    }
    // End Compress image ---------------------------------------------

    return (
        <>
        <input type="file" ref={inputRef} style={{display: 'none'}}
            accept='image/png, image/jpeg, image/jpg'
            onChange={(e) => {
                const validImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
                if(e.target.files[0] && validImageTypes.includes(e.target.files[0].type)) {
                    setImg(URL.createObjectURL(e.target.files[0]))
                    onSelectFile(e)
                }
            }}
        />
        <div className="me-2 avatar-input"
            onClick={!disabled && !noAction ? () => inputRef.current.click() : null}>
                <Avatar
                    img={img ? `${img}` : null}
                    alt={title}
                    name={title}
                    size={size}
                    contain
                    noLoader
                    borderRadiusNone
                    ignoreErr
                    className="hover"
                    len={1}
                />
                <div className='avatar-hover'>
                    <div className="icon icon-md">
                        {photoIcon}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AvatarUpload