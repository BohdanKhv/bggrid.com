import { useState, useRef, useEffect, useMemo, forwardRef } from 'react'
import { calendarDefaultIcon, closeIcon, downArrowIcon, errorIcon, infoIcon, questionIcon, selectOptionsIcon } from '../../assets/img/icons'
import './styles/Input.css'
import IconButton from './IconButton'
import Button from './Button'
import { phoneFormatter } from '../../assets/utils'
import CheckBox from './CheckBox'
import Switch from './Switch'
import DatePicker from 'react-datepicker'
import Icon from './Icon'


const CustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
    minYear,
    maxYear,
}) => {
    // Years from 1900 to 2100
    const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i)
    const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]

    return (
    <div className="flex justify-center align-center flex-nowrap gap-2 py-2">
        <button type="button"
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className="react-datepicker__navigation react-datepicker__navigation--previous"><span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--previous">
                {'<'}</span>
            </button>
        <select
            value={months[new Date(date).getMonth()]}
            onChange={({ target: { value } }) =>
                changeMonth(months.indexOf(value))
            }
            className="bg-secondary border-0 text-dark fs-14 opacity-75 outline-none hover-opacity-100 border-none px-2 pointer bg-secondary-hover border-radius-sm box-shadow-none py-1"
            >
            {months.map((option) => (
                <option key={option} value={option} className="bg-main text-dark">
                    {option}
                </option>
            ))}
        </select>
        <select
            value={new Date(date).getFullYear()}
            onChange={({ target: { value } }) => changeYear(value)}
            className="bg-secondary border-0 text-dark opacity-75 outline-none hover-opacity-100 fs-14 border-none px-2 pointer bg-secondary-hover border-radius-sm box-shadow-none py-1"
        >
        {years.map((option) => (
            <option key={option} value={option} className="bg-main text-dark">
                { option}
            </option>
        ))}
        </select>
        <button type="button"
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className="react-datepicker__navigation react-datepicker__navigation--next"><span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--next">
                {'>'}</span>
            </button>
    </div>
    )
}

const CustomDateSelect = ({ value, onChange, disabled, readOnly, maxDate, minDate, fields }) => {
    const [day, setDay] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')

    useEffect(() => {
        if (value) {
            setDay(new Date(value).getDate())
            setMonth(new Date(value).getMonth())
            setYear(new Date(value).getFullYear())
        }
    }, [value])

    const years = useMemo(() => {
        let years = [{ label: 'Year', value: '' }]
        const minYear = minDate ? new Date(minDate).getFullYear() : 1900
        const maxYear = maxDate ? new Date(maxDate).getFullYear() : 2100
        for (let i = minYear; i <= maxYear; i++) {
            years.unshift({ label: i, value: i })
        }
        return years
    }, [maxDate, minDate])

    const months =  [
        { label: 'Month', value: ''},
        { label: 'January', value: 0 },
        { label: 'February', value: 1 },
        { label: 'March', value: 2 },
        { label: 'April', value: 3 },
        { label: 'May', value: 4 },
        { label: 'June', value: 5 },
        { label: 'July', value: 6 },
        { label: 'August', value: 7 },
        { label: 'September', value: 8 },
        { label: 'October', value: 9 },
        { label: 'November', value: 10 },
        { label: 'December', value: 11 }
    ]
    const days = [{ label: 'Day', value: '' }]
    for (let i = 1; i <= 31; i++) {
        days.push({ label: i, value: i })
    }

    useEffect(() => {
        if (fields) {
            if (fields.includes('m') && fields.includes('d') && fields.includes('y')) {
                if (day && year && month) {
                    onChange({ target: { value: new Date(year, month, day) } })
                }
            } else if (fields.includes('m') && fields.includes('d')) {
                if (day && month) {
                    onChange({ target: { value: new Date(new Date().getFullYear(), month, day) } })
                }
            } else if (fields.includes('m') && fields.includes('y')) {
                if (year && month) {
                    onChange({ target: { value: new Date(year, month, 1) } })
                }
            } else if (fields.includes('d') && fields.includes('y')) {
                if (day && year) {
                    onChange({ target: { value: new Date(year, new Date().getMonth(), day) } })
                }
            } else if (fields.includes('m')) {
                if (month) {
                    onChange({ target: { value: new Date(new Date().getFullYear(), month, 1) } })
                }
            } else if (fields.includes('d')) {
                if (day) {
                    onChange({ target: { value: new Date(new Date().getFullYear(), new Date().getMonth(), day) } })
                }
            } else if (fields.includes('y')) {
                if (year) {
                    onChange({ target: { value: new Date(year, new Date().getMonth(), 1) } })
                }
            }
        } else {
            if (day && year && month) {
                onChange({ target: { value: new Date(year, month, day) } })
            }
        }
    }, [day, month, year])

    return (
        <div className="flex ps-0 flex-1">
            {!fields || !fields?.length || fields.includes('m') ?
                <div className="border-right flex flex-1 align-center border-secondary border-right">
                    <select
                        value={month}
                        placeholder="Month"
                        onChange={(e) => {
                            setMonth(e.target.value)
                        }}
                        className={`bg-main border-0 text-dark flex-1 outline-none hover-opacity-100 fs-12 py-1 border-none px-2 pointer box-shadow-none bg-secondary-hover border-radius-sm${!month ? " text-secondary" : ""}`}
                        disabled={disabled || readOnly}
                    >
                        {months.map((option) => (
                            <option key={`${option.value}-month`} value={option.value} className={`bg-main${option.value === '' ? " text-secondary" : " text-dark"}`}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            : null }
            {!fields || !fields?.length || fields.includes('d') ?
                <div className="border-right flex flex-1 align-center border-secondary">
                    <select
                        value={day}
                        placeholder="Day"
                        onChange={({ target: { value } }) => {
                            setDay(value)
                        }}
                        className={`bg-main border-0 text-dark flex-1 outline-none hover-opacity-100 fs-12 py-1 border-none px-2 pointer box-shadow-none bg-secondary-hover border-radius-sm${!day ? " text-secondary" : ""}`}
                        disabled={disabled || readOnly}
                    >
                        {days.map((option) => (
                            <option key={`${option.value}-day`} value={option.value} className={`bg-main${option.value === '' ? " text-secondary" : " text-dark"}`}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            : null }
            {!fields || !fields?.length || fields.includes('y') ?
                <div className="flex flex-1 align-center">
                    <select
                        placeholder="Year"
                        value={year}
                        onChange={({ target: { value } }) => {
                            setYear(value)
                        }}
                        className={`bg-main border-0 text-dark flex-1 outline-none hover-opacity-100 fs-12 py-1 border-none px-2 pointer box-shadow-none bg-secondary-hover border-radius-sm${!year ? " text-secondary" : ""}`}
                        disabled={disabled || readOnly}
                    >
                        {years?.map((option) => (
                            <option key={`${option.value}-year`} value={option.value} className={`bg-main${option.value === '' ? " text-secondary" : " text-dark"}`}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            : null }
        </div>
    )
}

const CustomDatePickInput = forwardRef(({ value, onClick }, ref) => (
    <div className="border-right">
        <IconButton
            icon={calendarDefaultIcon}
            onClick={onClick}
            variant="link"
            size="xs"
            className="react-datepicker__view-calendar-icon h-100 opacity-50 hover-opacity-100"
        />
    </div>
))

const Input = ({
    children,
    label,
    description,
    type,
    value,
    onChange,
    placeholder,
    disabled,
    readOnly,
    size,
    onFocus,
    onBlur,
    searchable,
    searchOptions,
    dropdown,
    dropdownOptions,
    dropdownOptionsCustom,
    closeOnSelect,
    selectOptions,
    clearable,
    selectMultiple,
    active,
    info,
    maxLength,
    max,
    wrapColumn,
    labelRight,
    min,
    openUp,
    error,
    errorMsg,
    success,
    warning,
    required,
    sign,
    icon,
    switchLabel,
    onClick,
    minDate,
    maxDate,
    autoFocus,
    autocapitalize,
    className,
    ...props
}) => {
    const [focused, setFocused] = useState(false)
    const inputParentRef = useRef(null)
    const inputRef = useRef(null)
    const labelRef = useRef(null)
    const inputSearchRef = useRef(null)
    const [searchValue, setSearchValue] = useState(value ? value : '')
    const [searchOpen, setSearchOpen] = useState(false)
    const [offsetTop, setOffsetTop] = useState(0)
    const [width, setWidth] = useState(0)
    const datePickerRef = useRef(null)
    
    const onClickOutside = (e) => {
        if (searchable || dropdown) {
            if (inputParentRef?.current?.contains(e.target)) {
                return
            }
            setSearchOpen(false)
        }
    }

    useEffect(() => {
        if(inputParentRef && inputSearchRef && searchOpen && (dropdown || searchable)) {
            const menuHeight = inputSearchRef?.current?.getBoundingClientRect()?.height;
            const inputParentRefHeight = inputParentRef?.current?.getBoundingClientRect()?.height;
            const inputParentRefTop = inputParentRef?.current?.getBoundingClientRect()?.top;
            const viewportHeight = window.innerHeight;
            const inputRefHeight = inputRef?.current?.getBoundingClientRect()?.height;
    
            // If the dropdown label is below the middle of the viewport, open the dropdown upwards
            if (inputParentRefTop > viewportHeight / 2) {
                setOffsetTop(-(menuHeight + 12)); // 12 is the padding
            } else {inputRef?.current?.offsetHeigh
                setOffsetTop(inputRefHeight + 24); // 12 is the padding
            }
        }
    }, [inputParentRef, inputSearchRef, searchOpen, searchValue, inputRef])

    useEffect(() => {
        if(!searchOpen) return
        document.addEventListener('mousedown', onClickOutside)
        return () => {
            document.removeEventListener('mousedown', onClickOutside)
        }
    }, [inputParentRef, searchOpen])

    const handleResize = () => {
        if (inputRef?.current) {
            setWidth(inputRef?.current?.offsetWidth)
        }
    }

    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [inputRef])


    return (
        <div className={`input${size && window.innerWidth > 800 ? ` input-${size}` : ""}${wrapColumn ? " input-column" : ""}${error ? " input-error" : ""}${readOnly ? " input-readonly" : ""}${success ? " input-success" : ""}${warning ? " input-warning" : ""}${focused ? ` input-focused` : ''}${disabled ? ' input-disabled' : ''}${dropdown ? ' input-dropdown' : ""}${searchable ? ' input-searchable' : ""}${(dropdown || searchable) && searchOpen ? ` input-search-opened` : ''}`}
            ref={inputParentRef}
        >
            {label ?
            <div className="input-label"
                // onClick={(e) => {
                //     e.stopPropagation()
                //     if (disabled || readOnly) return
                //     if (dropdown || searchable) setSearchOpen(!searchOpen)
                //     if (inputRef?.current) inputRef?.current?.focus()
                // }}
                ref={labelRef}
            >
                <div className="flex gap-3">
                    <label>
                        {label}
                        {required ? <span className="ms-2 text-bold fs-14 text-danger">*</span> : null}
                        {/* {readOnly ? <span className="ms-2 weight-400 fs-10 text-secondary">(read only)</span> : null} */}
                    </label>
                    {labelRight ? labelRight : null}
                </div>
                {description ?
                    <div className="fs-12 text-secondary">
                        {description}
                    </div>
                : null}
            </div>
            : null}
            <div className={`flex flex-col flex-grow-1${className ? ` ${className}` : ""}`}>
            {children ? (
                children
            ) :
            type === 'select' ?
            <div className="pos-relative">
            <select className={`input-input w-100${value === '' ? ' text-secondary' : ' text-dark'}`}
                value={value}
                onChange={e => {
                    if (disabled || readOnly) return
                    onChange(e)
                }}
                ref={inputRef}
                disabled={disabled || readOnly}
            >
                <option value=""
                    disabled={props.allowEmpty ? false : true}
                >Select</option>
                {selectOptions?.map((item, index) => (
                    <option key={`${index}-select-${item.value}`} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
            <span className="input-arrow pos-absolute right-0 pointer-events-none">{selectOptionsIcon}</span>
            </div>
            : type === 'date' ?
            <div className="input-input flex-grow-1 align-center p-0 input-input-date"
                onClick={(e) => {
                    if (disabled || readOnly) return
                    // if (datePickerRef.current) {
                    //     datePickerRef.current.setOpen(true)
                    // }
                }}
            >
                {!props.fields || !props.fields?.length || props.fields.includes('c') ?
                    <div className="flex">
                        <DatePicker
                            selected={value || ''}
                            onChange={(e) => {
                                if (disabled || readOnly) return
                                onChange({target: {value: e}});
                            }}
                            // closeOnScroll={true}
                            className="flex-grow-1 w-available px-0"
                            placeholderText={placeholder ? placeholder : "Select date"}
                            wrapperClassName="input-input-inner w-100"
                            formatWeekDay={nameOfDay => nameOfDay.slice(0, 1)}
                            customInput={<CustomDatePickInput/>}
                            todayButton="Today"
                            disabled={disabled || readOnly}
                            popperPlacement={'bottom-start'}
                            maxDate={maxDate ? maxDate : ''}
                            minDate={minDate ? minDate : ''}
                            calendarStartDay={1}
                            withPortal
                            ref={datePickerRef}
                            renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => ( 
                                <CustomHeader
                                    date={date}
                                    changeYear={changeYear}
                                    changeMonth={changeMonth}
                                    decreaseMonth={decreaseMonth}
                                    increaseMonth={increaseMonth}
                                    prevMonthButtonDisabled={prevMonthButtonDisabled}
                                    nextMonthButtonDisabled={nextMonthButtonDisabled}
                                    minYear={minDate ? new Date(minDate).getFullYear() : 1900}
                                    maxYear={maxDate ? new Date(maxDate).getFullYear() : 2100}
                                />
                            )}
                        >
                        <div className="flex flex-col w-100 gap-2">
                            <Button
                                label="Close"
                                className="w-100 border-radius"
                                muted
                                variant="text"
                                onClick={() => {
                                    if (datePickerRef.current) {
                                        datePickerRef.current.setOpen(false)
                                    }
                                }}
                            />
                        </div>
                        </DatePicker>
                    </div>
                : null}
                <CustomDateSelect
                    value={value}
                    onChange={onChange}
                    disabled={disabled || readOnly}
                    maxDate={maxDate}
                    minDate={minDate}
                    fields={props.fields}
                />
            </div>
            : type === 'switch' ? (
                <div className={`input-input input-switch${value ? ' input-switch-active' : ''}`}
                    onClick={() => {
                        if (disabled || readOnly) return
                        if (onClick) onClick(!value)
                        if (onChange) onChange(!value)
                    }}
                >
                    {switchLabel &&
                        <div className="fs-14 weight-600">
                            {switchLabel}
                        </div>
                    }
                    <div>
                        <Switch
                            disabled={disabled}
                            active={value ? true : false}
                            label={label}
                        />
                    </div>
                </div>
            ) : selectOptions ? (
                <div className={`input-select${disabled ? ' bg-secondary' : ''}`}>
                    {selectOptions.map((item, index) => (
                        selectMultiple ?
                            <div
                                key={`${item}-${index}-select-${Math.random()}`}
                                onClick={() => {
                                    if (disabled || readOnly) return
                                    onChange(item)
                                }}>
                                    <CheckBox
                                        checked={value.includes(item.value)}
                                        className={`input-select-item${value.includes(item.value) ? ' input-select-item-checked' : ''}`}
                                        label={item.label}
                                    />
                            </div>
                        :
                        <div
                            key={`${item}-${index}-select-${Math.random()}`}
                            onClick={() => {
                                if (disabled || readOnly) return
                                onChange(item)
                            }}>
                                <CheckBox
                                    checked={active === item.value}
                                    rounded
                                    className={`input-select-item${active === item.value ? ' input-select-item-checked' : ''}`}
                                    label={item.label}
                                />
                        </div>
                    ))}
                </div>
            ) : (
            <div className={`input-input`}
                onClick={(e) => {
                    e.stopPropagation()
                    if (disabled || readOnly) return
                    if ((dropdown && closeOnSelect) || searchable) setSearchOpen(!searchOpen)
                    if (inputRef?.current) inputRef?.current.focus()
                }}
            >
                {sign && <span className="input-sign">{sign}</span>}
                {icon && <span className="input-icon">{icon}</span>}
                {type === 'textarea' ?
                    <textarea
                        className="input-input-inner w-100"
                        rows={props.rows || 4}
                        cols={props.cols || 30}
                        value={value}
                        onChange={e => {
                            if (disabled || readOnly) return
                            if (onChange) onChange(e)
                        }}
                        placeholder={placeholder}
                        disabled={disabled || readOnly || dropdown}
                        onFocus={(e) => {
                            setFocused(true)
                            onFocus && onFocus(e)
                        }}
                        onBlur={(e) => {
                            setFocused(false)
                            onBlur ? onBlur(e) : null
                        }}
                        ref={inputRef}
                    />
                :
                    <input
                        className={`input-input-inner`}
                        type={type}
                        maxLength={maxLength}
                        max={max}
                        autoCapitalize={autocapitalize}
                        autoFocus={autoFocus}
                        min={min}
                        readOnly={(dropdown && !searchable) || readOnly}
                        onClick={(e) => {
                            e.stopPropagation()
                            if (disabled || readOnly) return
                            if (dropdown || searchable) setSearchOpen(!searchOpen)
                        }}
                        onWheel={(e) => {
                            e.target.blur()
                        }}
                        value={(searchable && dropdown) ? searchValue : value}
                        onChange={e => {
                            if (type === 'tel') return onChange({target: {value: phoneFormatter(e.target.value)}})
                            if (maxLength) {
                                if (e.target.value.length > maxLength) return onChange({target: {value: e.target.value.slice(0, maxLength)}})
                            }
                            onChange(e)
                            if (searchable) {
                                setSearchValue(e.target.value)
                                setSearchOpen(true)
                                if (dropdown) {
                                    const foundItem = dropdownOptions.find(item => item.label.toLowerCase() === e.target.value.toLowerCase())
                                    if (foundItem) {
                                        onChange(foundItem)
                                        setSearchOpen(false)
                                    } else {
                                        onChange({target: {value: null}})
                                    }
                                }
                            }
                        }}
                        placeholder={placeholder}
                        disabled={disabled}
                        onFocus={(e) => {
                            setFocused(true)
                            onFocus && onFocus(e)
                            if (disabled || readOnly) return
                            if (searchable) inputRef?.current?.select()
                        }}
                        onBlur={(e) => {
                            setFocused(false)
                            onBlur ? onBlur(e) : null
                        }}
                        ref={inputRef}
                    />
                }
                {clearable && !disabled && !readOnly && value && (
                    <span className="input-arrow opacity-50 hover-opacity-100"
                        onClick={() => {
                            if (disabled || readOnly) return
                            onChange({target: {value: ''}})
                            setSearchValue('')
                        }}
                    >{closeIcon}</span>
                )}
                {(searchable || dropdown) && (!disabled && !readOnly) && (
                    <span className="input-arrow"
                        onClick={(e) => {
                            e.stopPropagation()
                            if (disabled || readOnly) return
                            if (dropdown || searchable) setSearchOpen(!searchOpen)
                        }}
                    >{dropdown ? selectOptionsIcon : downArrowIcon}</span>
                )}
                {(searchable || dropdown) && searchOpen ? (
                    <div className={`input-search${openUp ? ' input-search-up' : ''}`}
                        style={{
                            position: 'absolute',
                            // width: inputRef?.current?.offsetWidth + 1,
                            top: `${offsetTop}px`,
                            left: - 1,
                            willChange: 'top, left',
                        }}
                        ref={inputSearchRef}
                    >
                    {(searchable && !dropdown) ?
                        <>
                            {searchOptions
                            ?.filter(item => item.toLowerCase().includes(searchValue.toLowerCase()) || !searchValue || searchOptions?.some(item => item.toLowerCase() === searchValue.toLowerCase()))
                            ?.map((item, index) => (
                                <div
                                    key={`${item}-${index}-search-${Math.random()}`}
                                    className={`input-search-item${value === item ? ' text-primary' : ''}`}
                                    onClick={() => {
                                        onChange({target: {value: item}})
                                        setSearchValue(item)
                                        if (closeOnSelect) setSearchOpen(false)
                                    }}
                                    onMouseDown={e => e.preventDefault()} 
                                >
                                    {item}
                                </div>
                            ))}
                            {
                                !searchOptions ||
                                searchOptions?.length === 0 ||
                                searchOptions
                                ?.filter(item => item.toLowerCase().includes(searchValue.toLowerCase()))
                                .length === 0 ?
                                <div className="fs-12 text-secondary flex align-center justify-center p-4">
                                    No results found
                                </div>
                                : null
                            }
                        </>
                    :
                        <>
                            {props.dropdownIsLoading ? (
                                <div className="py-4 flex align-center justify-center"><div className="spinner"/></div>
                            ) : dropdownOptionsCustom ?
                            dropdownOptionsCustom
                            : !dropdownOptions || dropdownOptions?.length === 0 ? (
                                <div className="input-dropdown-item text-secondary">No results</div>
                            ) : (
                                <>
                                {dropdownOptions
                                ?.filter(item => value || !searchable || item.label.toLowerCase().includes(searchValue.toLowerCase()))
                                ?.map((item, index) => (
                                    <div
                                        key={`${item}-${index}-search-${Math.random()}`}
                                        className={`input-dropdown-item${value && (active === item.label || active === item.value || searchValue?.toLowerCase() === item.label.toLowerCase()) ? ' input-dropdown-item-checked' : ''}${item.disabled ? ' bg-secondary' : ''}${item.className ? ` ${item.className}` : ''}`}
                                        onClick={() => {
                                            if (disabled || readOnly || item.disabled) return
                                            onChange(item)
                                            if (searchable) setSearchValue(item.label)
                                            if (closeOnSelect) setSearchOpen(false)
                                        }}
                                        onMouseDown={e => e.preventDefault()} 
                                    >
                                        {item.label}
                                    </div>
                                ))}
                                {dropdownOptions
                                ?.filter(item => value || !searchable || item.label.toLowerCase().includes(searchValue.toLowerCase()))
                                .length === 0 &&
                                <div className="input-dropdown-item text-secondary">No results</div>
                                }
                                </>
                            )}
                        </>
                    }
                    </div>
                ) : null}
            </div>
            )}
            {error && errorMsg ?
                <div className="flex fs-12 gap-2 align-center pt-2">
                    <div className="tag-danger px-2 py-1 border-radius-sm flex">
                        <Icon icon={errorIcon} size="sm" className="fill-danger" />
                        <span className="px-2 weight-500">
                            {errorMsg}
                        </span>
                    </div>
                </div>
            : null}
            </div>
        </div>
    )
}

export default Input