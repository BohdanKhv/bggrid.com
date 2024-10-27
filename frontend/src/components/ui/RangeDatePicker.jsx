import { forwardRef, useRef } from "react";
import DatePicker from "react-datepicker";
import { Button, ButtonGroup } from '../'
import { calendarIcon, leftArrowSmIcon, rightArrowIcon } from "../../assets/img/icons";

const RangeDatePicker = ({
    children,
    dateFrom,
    todayButton,
    setDateFrom,
    dateTo,
    setDateTo,
    dateClassName,
    maxDate,
    popperPlacement
}) => {
    const ref = useRef()

    const CustomInputStart = forwardRef(({ value, onClick }, ref) => (
        <Button
            className={`fs-14 fs-sm-12 px-0 weight-600${dateClassName ? ` ${dateClassName}` : ''}`}
            textNoWrap
            icon={calendarIcon}
            type="secondary"
            onClick={onClick}
            label={`${
                dateFrom && dateTo && dateFrom?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) === dateTo?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) ?
                    dateFrom?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                :
                `${dateFrom ?
                    dateFrom?.getFullYear() === dateTo?.getFullYear() ?
                        dateFrom?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) :
                    dateFrom?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
                : 'Select Date'} - ${dateTo ?
                    dateFrom?.getMonth() === dateTo?.getMonth() ?
                        `${dateTo?.toLocaleDateString('en-US', { day: 'numeric' })}, ${dateTo?.getFullYear()}` :
                    dateTo?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
                    : 'Select Date'}`}`.replace('undefined', '')}
        /> 
    ))

    const onChange = dates => {
        const [start, end] = dates;
        setDateFrom(start)
        setDateTo(end)
    };

    const getDayDif = () => {
        // get day difference including the start and end date
        const dayDif = Math.round((dateTo - dateFrom) / (1000 * 60 * 60 * 24)) + 1
        return dayDif
    }
    

    const prevTimeFrame = () => {
        const dayDif = getDayDif()
        const newStart = new Date(dateFrom.setDate(dateFrom.getDate() - dayDif))
        const newEnd = new Date(dateTo.setDate(dateTo.getDate() - dayDif))
        setDateFrom(newStart)
        setDateTo(newEnd)
    }

    const nextTimeFrame = () => {
        const dayDif = getDayDif()
        const newStart = new Date(dateFrom.setDate(dateFrom.getDate() + dayDif))
        const newEnd = new Date(dateTo.setDate(dateTo.getDate() + dayDif))
        setDateFrom(newStart)
        setDateTo(newEnd)
    }

    return (
        <ButtonGroup className="flex-grow-1 border-transparent pos-relative">
            <Button
                icon={leftArrowSmIcon}
                onClick={prevTimeFrame}
                type="secondary"
                muted
            />
            <div className="w-sm-100">
                <DatePicker
                    selected={dateFrom}
                    onChange={onChange}
                    startDate={dateFrom}
                    closeOnScroll={true}
                    endDate={dateTo}
                    popperPlacement={popperPlacement ? popperPlacement : 'bottom-end'}
                    className="w-sm-100"
                    wrapperClassName="w-sm-100"
                    formatWeekDay={nameOfDay => nameOfDay.slice(0, 1)}
                    todayButton={todayButton ? todayButton : ''}
                    // Set max 2 months between start and end date
                    maxDate={maxDate ? maxDate : ''}
                    minDate={dateFrom && !dateTo ? dateFrom : null}
                    selectsRange
                    calendarStartDay={1}
                    // maxDate={new Date()}
                    customInput={<CustomInputStart />}
                    // withPortal={window.innerWidth > 800 ? false : true}
                    withPortal
                    ref={ref}
                >
                    <div className="flex flex-col w-100 gap-2">
                        {children}
                        <Button
                            label="Close"
                            className="w-100 border-radius"
                            muted
                            variant="text"
                            onClick={() => {
                                if (ref.current) {
                                    ref.current.setOpen(false)
                                }
                            }}
                        />
                    </div>
                </DatePicker>
            </div>
            <Button
                icon={rightArrowIcon}
                type="secondary"
                onClick={nextTimeFrame}
                muted
            />
        </ButtonGroup>
    )
}

export default RangeDatePicker