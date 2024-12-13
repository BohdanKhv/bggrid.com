import { useEffect, useRef, useState } from 'react'
import './styles/InputSearch.css'
import { closeIcon, leftArrowIcon, searchIcon } from '../../assets/img/icons'
import IconButton from './IconButton'
import Button from './Button'
import Icon from './Icon'



const InputSearch = ({
    type,
    value,
    label,
    onChange,
    name,
    loading,
    disabled,
    autoFocus,
    classNameBlur,
    classNameFocus,
    onClick,
    onFocus,
    onBlur,
    clearable,
    onClear,
    className,
    onSubmit,
    onSubmitEmpty,
    size,
    itemOnFocus,
    placeholder,
    searchable,
    searchChildren,
    notCloseOnClick,
    icon
}) => {
    

    const [focus, setFocus] = useState(autoFocus || false)
    const inputRef = useRef(null)
    const inputParentRef = useRef(null)
    const inputSearchRef = useRef(null)
    const [searchOpen, setSearchOpen] = useState(autoFocus || false)
    
    const [offsetTop, setOffsetTop] = useState(0)

    const onClickOutside = (e) => {
        if (searchable) {
                if (inputParentRef?.current?.contains(e.target)) {
                    return
                }
                setSearchOpen(false)
        }
    }

    useEffect(() => {
        if(searchable && inputParentRef && inputSearchRef && searchOpen && searchable) {
            const menuHeight = inputSearchRef?.current?.getBoundingClientRect()?.height;
            const inputParentRefHeight = inputParentRef?.current?.getBoundingClientRect()?.height;
            const inputParentRefTop = inputParentRef?.current?.getBoundingClientRect()?.top;
            const viewportHeight = window.innerHeight;
            const inputRefHeight = inputParentRef?.current?.getBoundingClientRect()?.height;
    
            if (inputParentRefTop > viewportHeight / 2) {
                setOffsetTop(-(menuHeight + 12)); // 12 is the padding
            } else {inputRef?.current?.offsetHeigh
                setOffsetTop(inputRefHeight - 4); // 16 is the padding
            }
        }
    }, [inputParentRef, inputSearchRef, searchOpen, inputRef])

    useEffect(() => {
        if(!searchOpen) return
        document.addEventListener('mousedown', onClickOutside)
        return () => {
            document.removeEventListener('mousedown', onClickOutside)
        }
    }, [inputParentRef, searchOpen])

    const handleDropdownClick = () => {
        if (notCloseOnClick) return
        setSearchOpen(false);
    };

    useEffect(() => {
        if (searchable && focus) {
            setSearchOpen(true)
        }
    }, [searchable, focus])

    return (
        <>
        {itemOnFocus && focus ? itemOnFocus : null}
        <div className={`input-search-container${focus && classNameFocus ? ` ${classNameFocus}` : !focus && classNameBlur ? ` ${classNameBlur}` : ""}${focus ? ` input-search-focused` : ''}${className ? ` ${className}`: ""}${size ? ` input-search-${size}` : ""}`}
            ref={inputParentRef}
        >
            {
            label ?
            <span className="weight-500 fs-14">
                {label}
            </span>
            : icon ?
            <Icon
                icon={icon ? icon : null}
                className={`${focus ? '' : 'opacity-25'}`}
                size="sm"
                onClick={(e) => {
                    e.stopPropagation()
                    inputRef.current.focus()
                }}
                />
            : null}
            <input
                ref={inputRef}
                type={type}
                value={value} 
                onChange={onChange}
                name={name}
                disabled={loading || disabled}
                placeholder={placeholder || ''}
                autoComplete="off"
                autoFocus={autoFocus}
                tabIndex={0}
                onFocus={(e) => {
                    setFocus(true)
                    if (onFocus) onFocus()
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        if (value || onSubmitEmpty) {
                            onSubmit ? onSubmit() : null
                        }
                        // Blur input
                        if (searchable) {
                            setSearchOpen(false)
                        }
                        inputRef.current.blur()
                    }
                }}
                onBlur={(e) => {
                    setFocus(false)
                    if (onBlur) onBlur()
                }}
                onClick={() => {
                    if (searchable) {
                        setSearchOpen(true)
                    } 
                    onClick ? onClick : null
                }}
            />
            {clearable ? (
            <div className="clear-input">
                {
                    <IconButton
                        icon={((clearable && value) || onClear) ? closeIcon : ''}
                        onClick={(e) => {
                            e.stopPropagation()
                            inputRef.current.focus()
                            value ? onChange({target: {value: ''}}) : null
                            onClear ? onClear() : null
                        }}
                        muted
                        size="sm"
                        dataTooltipContent="Clear"
                        variant="link"
                    />
                }
            </div>
            ) : null}
            {searchable && searchOpen ? (
                <div className={`input-search-searchable-dropdown`}
                    style={{
                        position: 'absolute',
                        top: `${offsetTop}px`,
                        left: - 1,
                        willChange: 'top, left',
                    }}
                    ref={inputSearchRef}
                    onClick={handleDropdownClick}
                >
                    <div className="input-search-searchable-dropdown-content">
                        {searchChildren}
                    </div>
                </div>
            ) : null}
        </div>
        </>
    )
}

export default InputSearch