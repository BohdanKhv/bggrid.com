import { DateTime } from 'luxon';
import axios from 'axios';


const addCommaToNumber = (_number) => {
    return _number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const numberFormatter = (_number) => {
    // format 1000 to 1k or 1000000 to 1m etc
    const number = Math.abs(_number);
    const formatter = new Intl.NumberFormat('en-US', { notation: 'compact' });
    return formatter.format(number);
}

const estimatedCartCost = (cart) => {
    if(!cart?.length) return 0;
    const cost = cart.reduce((acc, item) => {
        const { price, quantity } = item;
        return acc + (+price * +quantity);
        }, 0);
    return cost.toFixed(2);
}

const estimatedDeliveryCost = (cart) => {
    if(!cart?.length) return 0;
    const cost = cart.reduce((acc, item) => {
        const { price, receivedQuantity, quantity } = item;
        return acc + ((price || (Number(price) === 0) ? +price : +price / 100) * ((receivedQuantity || Number(receivedQuantity) === 0) ? +receivedQuantity : +quantity));
    }, 0) / 100;
    return cost.toFixed(2);
}

const estimatedDeliveryQty = (cart) => {
    if(!cart?.length) return 0;
    const cost = cart.reduce((acc, item) => {
        const { price, receivedQuantity, quantity, bulk } = item;
        return acc + ((receivedQuantity ? +receivedQuantity : +quantity) / (bulk || 1));
        }, 0);
    return cost.toFixed(0);
}

const createEmailBody = (cart, address, date) => {
    let email = '';

    const body = cart.reduce((acc, item) => {
        const { name, price, code, quantity } = item;
        return acc + `${name} - [${code}] x ${quantity} \n`;
        // return acc + `${name} x ${quantity} \n`;
        // return acc + `${name} - ${price} x ${quantity} = ${price * quantity} \n`;
    }, '');

    email += `Order Details: %0d%0a`;
    email += `${body} %0d%0a`;
    email += `Address: %0d%0a`;
    email += `${address} %0d%0a`;
    email += `Date: %0d%0a`;
    email += `${date.toLocaleDateString('en-US', { weekday: "short", year: "2-digit", month: "short", day: "numeric" })} %0d%0a`;

    return email;
}


const clearOrderId = (orderId) => {
    let clearOrderId = orderId.toString().replace(/[^0-9]/g, '');
    clearOrderId = clearOrderId.slice(0, 4) + '-' + clearOrderId.slice(4, 8) + '-' + clearOrderId.slice(8, 12) + '-' + clearOrderId.slice(12, 16);

    return clearOrderId;
}


const dateToTimeAgo = (date, short) => {
    let timeAgo = '';
    const now = new Date();
    const diff = now - date;
    const diffInSec = diff / 1000;
    const diffInMin = diffInSec / 60;
    const diffInHrs = diffInMin / 60;
    const diffInDays = diffInHrs / 24;
    const diffInWeeks = diffInDays / 7;
    const diffInMonths = diffInDays / 30;
    const diffInYears = diffInDays / 365;

    if(diffInSec < 60) {
        timeAgo = `${Math.floor(diffInSec)}` + (short ? 's' : ' sec');
    } else if(diffInMin < 60) {
        timeAgo = `${Math.floor(diffInMin)}` + (short ? 'm' : ' min');
    } else if(diffInHrs < 24) {
        timeAgo = `${Math.floor(diffInHrs)}` + (short ? 'h' : ' hr');
    } else if(diffInDays < 7) {
        timeAgo = `${Math.floor(diffInDays)}` + (short ? 'd' : ' day');
    } else if(diffInWeeks < 4) {
        timeAgo = `${Math.floor(diffInWeeks)}` + (short ? 'w' : ' week');
    } else if(diffInMonths < 12) {
        timeAgo = `${Math.floor(diffInMonths)}` + (short ? 'm' : ' month');
    } else {
        timeAgo = `${Math.floor(diffInYears)}` + (short ? 'y' : ' year');
    }

    if(timeAgo?.split(' ')[0] == 0 && timeAgo?.split(' ')[1] == 'sec') {
        timeAgo = 'Just now';
    } else if(timeAgo?.split(' ')[0] == 0 && timeAgo?.split(' ')[1] == 'min') {
        timeAgo = '1 min';
    } else if(timeAgo?.split(' ')[0] == 0 && timeAgo?.split(' ')[1] == 'hr') {
        timeAgo = '60 min';
    } else if(timeAgo?.split(' ')[0] == 0 && timeAgo?.split(' ')[1] == 'day') {
        timeAgo = '24 hr';
    } else if(timeAgo?.split(' ')[0] == 0 && timeAgo?.split(' ')[1] == 'week') {
        timeAgo = '7 day';
    } else if(timeAgo?.split(' ')[0] == 0 && timeAgo?.split(' ')[1] == 'month') {
        timeAgo = '30 day';
    } else if(timeAgo?.split(' ')[0] == 0 && timeAgo?.split(' ')[1] == 'year') {
        timeAgo = '12 month';
    }

    return short ? timeAgo : timeAgo?.split(' ')[0] == 1 ? timeAgo + ' ago' : timeAgo + 's ago';
}

const dateToDaysAgo = (date) => {
    const currentDate = new Date();
    const givenDate = new Date(date);
    const diffTime = Math.abs(currentDate - givenDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? "today" : diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
}

const copyToClipboard = (text, setLinkCopied) => {
    // copy link to clipboard
    const doc = document.createElement('textarea');
    doc.value = text;
    document.body.appendChild(doc);
    doc.select();
    document.execCommand('copy');

    // Check if doc is still a child of document.body before removing it
    if (document.body.contains(doc)) {
        document.body.removeChild(doc);
    }

    if(!setLinkCopied) return
    setLinkCopied(true)
    setTimeout(() => {
        setLinkCopied(false)
    }, 3000)
}

const cutOffTimeCountDown = (time, setCutOffTimeIn) => {
    // time "00:00 - 23:00"
    const h = Number(time.split(':')[0])
    const m = Number(time.split(':')[1])

    const now = new Date()
    let cutOffTime = new Date()
    if(Number(cutOffTime.getHours()) >= h) {
        cutOffTime.setDate(cutOffTime.getDate() + 1)
    }
    cutOffTime.setHours(h, m, 0, 0)
    const diff = cutOffTime - now
    const diffInHours = diff / (1000 * 60 * 60)
    const diffInMinutes = diff / (1000 * 60)
    const diffInSeconds = diff / 1000
    let hours = `${Math.floor(diffInHours)}`.padStart(2, '0')
    let minutes = `${Math.floor(diffInMinutes % 60)}`.padStart(2, '0')
    let seconds = `${Math.floor(diffInSeconds % 60)}`.padStart(2, '0')
    if(hours > 23) hours = '00'
    if(minutes > 59) minutes = '00'
    if(seconds > 59) seconds = '00'
    if( hours == '00') hours = ''
    if( minutes == '00') minutes = ''
    setCutOffTimeIn(`${hours}${hours ? ':' : ''}${minutes}${minutes ? ':' : ''}${seconds}`)
}

const convertTo12Hour = (time) => {
    if(!time || (time && !time.includes(':'))) return ''
    if(time === '00:00') return '12:00 AM'
    if(time === '12:00') return '12:00 PM'
    const h = Number(time.split(':')[0])
    const m = Number(time.split(':')[1])
    let hours = h % 12
    let minutes = m
    let ampm = h < 12 ? 'AM' : 'PM'
    hours = hours ? hours : 12
    minutes = minutes < 10 ? '0' + minutes : minutes
    return `${hours}:${minutes} ${ampm}`
}

const formula = (f) => {
    let formula = f
    
    // remove spaces
    formula = formula.replace(/ /g, '')
    // remove all symbols except + - * / ( )
    // remove all double operators
    formula = formula.replace(/([*+-/])\1+/g, '$1')
    // remove all operators at the beginning
    formula = formula.replace(/^([*+-/])/g, '')
    // remove all operators at the end
    formula = formula.replace(/([*+-/])$/g, '')
    // remove all operators before )
    formula = formula.replace(/([*+-/])\)/g, ')')
    // remove all operators after (
    formula = formula.replace(/\(([+/*-])/, '(')
    if(formula.includes('(') && !formula.includes(')')) formula = formula.replace(/\(/g, '')
    if(formula.includes(')') && !formula.includes('(')) formula = formula.replace(/\)/g, '')

    return formula
}

const executeFormula = (formula, obj) => {
    try {
        const { onHand, usage, capacity, capacityPct } = obj
        
        if(onHand) formula = formula.replace(/oh/gi, onHand)
        if(usage) formula = formula.replace(/use/gi, usage)
        if(capacity) formula = formula.replace(/cap/gi, capacity)
        if(capacityPct) formula = formula.replace(/pcap/gi, capacityPct)
        // remove all letters
        formula = formula.replace(/[a-zA-Z]/g, '')
        formula = formula.replace(/[^-()\d/*+.]/g, '')
        // remove all operators at the beginning
        formula = formula.replace(/^([*+-/])/g, '')
        // remove all operators at the end
        formula = formula.replace(/([*+-/])$/g, '')
        // execute formula
        let result = eval(formula)

        return result
    } catch (error) {
        return 0
    }
}

const phoneFormatter = (phone) => {
    if(!phone) return
    const digitsOnly = phone.replace(/\D/g, ''); // Remove non-digit characters

    if (digitsOnly.length >= 9) {
    let formattedPhone = '';

    // Format based on number of digits
    if (digitsOnly.length === 9) {
        formattedPhone += `${digitsOnly.substring(0, 3)}-${digitsOnly.substring(3, 6)}-${digitsOnly.substring(6)}`;
    } else if (digitsOnly.length === 10) {
        formattedPhone += `(${digitsOnly.substring(0, 3)}) ${digitsOnly.substring(3, 6)}-${digitsOnly.substring(6)}`;
    } else if (digitsOnly.length === 11) {
        formattedPhone += `+${digitsOnly.substring(0, 1)} (${digitsOnly.substring(1, 4)}) ${digitsOnly.substring(4, 7)}-${digitsOnly.substring(7)}`;
    } else if (digitsOnly.length === 12) {
        formattedPhone += `+${digitsOnly.substring(0, 2)} (${digitsOnly.substring(2, 5)}) ${digitsOnly.substring(5, 8)}-${digitsOnly.substring(8)}`;
    } else {
        // Invalid or unsupported phone number format
        return phone;
    }

    return formattedPhone;
    } else {
    // Invalid or unsupported phone number format
    return phone;
    }
};

const validateEmail = (email) => {
    if (!email) return;

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

const validatePhone = (phone) => {
    if (!phone) return false;
    // Trim leading and trailing spaces
    phone = phone.trim();
    // Allow various formats for USA phone numbers
    const reUSA = /^(\+?\d{1,2}\s?[ -]?)?(\(\d{3}\)|\d{3})[-. ]?\d{3}[-. ]?\d{4}$/;

    // Allow international format (with or without country code)
    const reInternational = /^\+\d{1,15}$/;

    return reUSA.test(phone) || reInternational.test(phone);
};

const validateState = (state) => {
    if (!state) return false;

    // Convert to uppercase for consistent comparison
    state = state.toUpperCase();

    // Check for valid US state abbreviations
    const validStates = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH',
        'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];

    return validStates.includes(state);
};

const validateZipCode = (zipCode) => {
    if (!zipCode) return false;

    // Remove spaces
    zipCode = zipCode.replace(/\s/g, '');

    // Check for 5-digit zip code
    const reFiveDigitZip = /^\d{5}$/;
    if (reFiveDigitZip.test(zipCode)) return true;

    // Check for 5-digit zip code with hyphen and 4-digit extension
    const reHyphenatedZip = /^\d{5}-\d{4}$/;
    return reHyphenatedZip.test(zipCode);
};


const calcHoursBetween = (start, end) => {
    if (!start || !end || !start.includes(':') || !end.includes(':')) {
        return "Invalid input";
    }

    const startTime = start.split(':');
    const endTime = end.split(':');

    const startHour = parseInt(startTime[0]);
    const startMin = parseInt(startTime[1]);
    const endHour = parseInt(endTime[0]);
    const endMin = parseInt(endTime[1]);

    let hours = endHour - startHour;
    let minutes = endMin - startMin;

    if (minutes < 0) {
        hours--;
        minutes = 60 + minutes;
    }

    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
};

const calculateTimeDifference = (startDate, endDate) => {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
        console.log("Invalid input: Please provide valid Date objects.")
        return "err";
    }

    const timeDiffInMillis = endDate - startDate;
    if (timeDiffInMillis < 0) {
        console.log("End date should be greater than start date.")
        return "err";
    }

    const hours = Math.floor(timeDiffInMillis / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiffInMillis % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0) {
        return `${minutes}m`;
    }

    const formattedHours = hours < 10 ? `${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `${minutes}` : `${minutes}`;

    return `${formattedHours}h${formattedMinutes > 0 ? ` ${formattedMinutes}m` : ""}`;
};

const getTime = (date, timezone) => {
    if (!date || !timezone) return;
    const time = new Date(date)?.toLocaleTimeString([], { timeZone: timezone,  hour: 'numeric', minute: '2-digit', hour12: false });
    const [hours, minutes] = time.split(':');
    return hours === '24' ? `00:${minutes}` : hours.length === 1 ? `0${hours}:${minutes}` : `${hours}:${minutes}`;
}

const calcTotalScheduleHours = (shifts) => {
    if ( !shifts || shifts?.length === 0 ) return 0;

    // get start, end time of each shift and calculate total hours and minutes: example 8:30 - 17:00 = 8.5 hours
    let totalHours = 0;
    let totalMinutes = 0;
    shifts.forEach(shift => {
        const start = DateTime.fromJSDate(new Date(shift.start), { zone: 'utc' }).setZone(shift.location.timezone);
        const end = DateTime.fromJSDate(new Date(shift.end), { zone: 'utc' }).setZone(shift.location.timezone);
        const hours = end.hour - start.hour;
        const minutes = end.minute - start.minute;
        totalHours += hours;
        totalMinutes += minutes;
    });

    // convert minutes to hours
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    let min = totalMinutes / 60;
    // convert minutes to 60 minutes = 1 hour
    min = Math.round(min * 60);

    // return total hours
    return `${totalHours}h ${min > 0 ? `${min}m` : ''}`; 
}

const calcTotalSchedulePaidHours = (shifts, pay, payType) => {
    if ( !shifts || shifts?.length === 0 || !pay || pay === 0 ) return 0;

    // get start, end time of each shift and calculate total hours and minutes: example 8:30 - 17:00 = 8.5 hours
    let totalHours = 0;
    let totalMinutes = 0;
    shifts.forEach(shift => {
        const start = DateTime.fromJSDate(new Date(shift.start), { zone: 'utc' }).setZone(shift.location.timezone);
        const end = DateTime.fromJSDate(new Date(shift.end), { zone: 'utc' }).setZone(shift.location.timezone);
        const hours = end.hour - start.hour;
        const minutes = end.minute - start.minute;
        totalHours += hours;
        totalMinutes += minutes;
    });

    // convert minutes to hours
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    let min = totalMinutes / 60;
    // convert minutes to 60 minutes = 1 hour
    min = Math.round(min * 60);

    // Convert minutes to 100ths of an hour
    min = Math.round(min / 60 * 100);

    // Calculate total paid hours
    let totalPaidHours = 0
    
    if (!payType || payType === 'hourly') {
        totalPaidHours = (totalHours + min / 100) * pay;
    } else if (payType === 'salary') {
        // Calculate total paid hours based on 40 hours per week
        totalPaidHours = (totalHours + min / 100) * 40;
    }
    // return total hours
    return totalPaidHours;
}

const shiftsRow = (shifts, days) => {
    let arr = shifts;
    // filter out shift that out of range of days
    const isoDays = days.map(day => DateTime.fromJSDate(day).toISODate());
    arr = arr.filter(shift => {
        return isoDays.includes(shift?.date?.split('T')[0]);
    });
    const n = isoDays.map(d => {return {date: d, shift: null}})

    const rows = [];

    if (arr.length === 0) {
        rows.push(n, n);
        return rows;
    }

    while (arr.length > 0 && days.length > 0) {
        const row = [];
        let shiftsAdded = false; // Flag to check if any shifts were added for the current day

        isoDays.forEach((day) => {
            const index = arr.findIndex((shift) => {
                return DateTime.fromISO(shift.date).setZone(shift.location.timezone).toISODate() === day;
            });
            if (index !== -1) {
                row.push({
                    date: arr[index]?.date.split('T')[0],
                    shift: arr[index]
                });
                arr.splice(index, 1);
                shiftsAdded = true;
            } else {
                row.push({
                    date: day,
                    shift: null
                });
            }
        });

        if (shiftsAdded) {
            rows.push(row);
        } else {
            days.shift(); // Remove the current day from the days array
        }

        shiftsAdded = false; // Reset the shiftsAdded flag for the next iteration
    }

    rows.push(n);
    return rows;
};


const setShiftTime = (_start, _end, timezone) => {
    if (!_start || !_end || !timezone) return;
    let start = DateTime.fromISO(_start, { zone: timezone });
    let end = DateTime.fromISO(_end, { zone: timezone });

    let startTime = start.toLocaleString(DateTime.TIME_SIMPLE);
    let endTime = end.toLocaleString(DateTime.TIME_SIMPLE);

    // If the shift goes into the next day
    if (start > end && endTime.endsWith('AM')) {
        endTime += ' (next day)';
    }

    // Remove minutes if they are zero
    startTime = startTime.replace(':00', '');
    endTime = endTime.replace(':00', '');

    return `${startTime} - ${endTime}`;
};

const compareDate = (date1, date2) => {
    if(!date1 || !date2) return
    return DateTime.fromJSDate(date1).toISODate() === DateTime.fromJSDate(date2).toISODate()
};

const toIsoDate = (date) => {
    if (!date) return date;
    if (date instanceof Date) {
        return DateTime.fromJSDate(date).toISODate();
    } else {
        return ''
    }
};

const checkIfDateIsInPast = (date) => {
    if(!date) return
    const d1 = new Date(date).toISOString().split('T')[0];
    const d2 = new Date().toISOString().split('T')[0];
    return d1 < d2;
};

const getDayDif = (date1, date2) => {
    if(!date1 || !date2) return
    // get day difference including the start and end date
    const dayDif = Math.round((date1 - date2) / (1000 * 60 * 60 * 24)) + 1
    return dayDif
}

const calcTasklistDueDate = (tasklist, date) => {
    if (!tasklist || !date) return;

    const { recurrenceType, dueDate, activatedDate } = tasklist;

    const today = new Date(date.setHours(0,0,0,0));
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    let dueStartDate = new Date(date.setHours(0,0,0,0));
    let dueEndDate = new Date(date.setHours(0,0,0,0));

    if (recurrenceType === 'once') {
        return {
            dueStartDate: new Date(activatedDate).toISOString().split('T')[0].replaceAll('-', '/'),
            dueEndDate: new Date(dueDate).toISOString().split('T')[0].replaceAll('-', '/')
        }
    } else if (recurrenceType === 'weekly') {
        // Set dueStartDate to Monday of this week
        // if Date is sunday return previous monday, day starts on monday
        if (today.getDay() === 0) {
            return {
                dueStartDate: new Date(todayYear, todayMonth, todayDate - 6),
                dueEndDate: new Date(todayYear, todayMonth, todayDate)
            }
        }
        const monday = new Date(todayYear, todayMonth, todayDate - today.getDay() + 1);
        dueStartDate = monday;

        // Set dueEndDate to Sunday of this week
        const sunday = new Date(todayYear, todayMonth, todayDate + (7 - today.getDay()));
        dueEndDate = sunday;
    } else if (recurrenceType === 'monthly') {
    // Set dueStartDate to the first day of this month
        const firstDay = new Date(todayYear, todayMonth, 1);
        dueStartDate = firstDay;

        // Set dueEndDate to the last day of this month
        const lastDay = new Date(todayYear, todayMonth + 1, 0);
        dueEndDate = lastDay;
    } else if (recurrenceType === 'daily' || recurrenceType === 'days') {
        // Set dueStartDate and dueEndDate to today's date
        // Prevent having one day difference behind the actual date
        return {
            dueStartDate: new Date(date.setHours(0,0,0,0)).toISOString().split('T')[0].replaceAll('-', '/'),
            dueEndDate: new Date(date.setHours(0,0,0,0)).toISOString().split('T')[0].replaceAll('-', '/')
        }
    }

    return {
        dueStartDate: dueStartDate.toISOString().split('T')[0].replaceAll('-', '/'),
        dueEndDate: dueEndDate.toISOString().split('T')[0].replaceAll('-', '/'),
    };
};



const calcDaysLeft = (date) => {
    if (!date) return;
    console.log(date)

    const currentDate = new Date();
    const inputDate = new Date(date);

    // Calculate the difference in milliseconds
    const timeDifference = inputDate.getTime() - currentDate.getTime();

    // Convert milliseconds to days
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    // Return the appropriate message based on the calculated days
    if (daysLeft === 0) {
        return 'Today';
    } else if (daysLeft === 1) {
        return 'Tomorrow';
    } else {
        return `${daysLeft} days left`;
    }
};


const exportCSV = (csvData, fileName) => {
    if (!csvData || !fileName) return;

    const headers = Object.keys(csvData[0]);

    let csv = headers.join(',') + '\n';

    csvData.forEach((row) => {
        const values = headers.map((header) => {
            const escaped = ('' + row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csv += values.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, fileName);
    } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
};

const convertTimezoneToUTC = (date, timezone) => {
    if (!date || !timezone) return;
    const dt = DateTime.fromISO(date, { zone: timezone }); // Parse the date in the given timezone
    const dtInUTC = dt.setZone('utc'); // Convert the date to UTC
    return dtInUTC.toISO(); // Return the date in UTC as an ISO string
}


const convertFromUTC = (date, timezone) => {
    if (!date || !timezone) return;
    const dt = DateTime.fromISO(date, { zone: 'utc' }); // Parse the date in UTC
    const dtInTimezone = dt.setZone(timezone); // Convert the date to the given timezone
    return dtInTimezone.toISO(); // Return the date in the given timezone as an ISO string
}


const convertToUTC = (date) => {
    const dt = DateTime.fromJSDate(new Date(date), { setZone: true });
    const dtInUTC = dt.setZone('utc');
    return dtInUTC.toJSDate();
}


const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}


const createICS = (event) => {
    const { title, description, location, start, end } = event;

    const icsString = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Emplorex Inc//Emplorex team schedule//EN',
        'BEGIN:VEVENT',
        'UID:1',
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d\d\dZ/, 'Z')}`,
        `DTSTART:${start.toISOString().replace(/[-:]/g, '').replace(/\.\d\d\dZ/, 'Z')}`,
        `DTEND:${end.toISOString().replace(/[-:]/g, '').replace(/\.\d\d\dZ/, 'Z')}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8;' });
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, `${title}.ics`);
    } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${title}.ics`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}


const getLatLongFromTimezone = (timezone) => {
    if (!timezone) return;
    const latLong = {
        "America/New_York": [40.7128, -74.0060],
        "America/Chicago": [41.8781, -87.6298],
        "America/Denver": [39.7392, -104.9903],
        "America/Los_Angeles": [34.0522, -118.2437],
        "America/Anchorage": [61.2181, -149.9003],
        "Pacific/Honolulu": [21.3069, -157.8583],
        "America/Adak": [51.8778, -176.6581],
        "Pacific/Midway": [28.2014, -177.3754],
        "Pacific/Pago_Pago": [14.2750, -170.7020],
        "Pacific/Guam": [13.4443, 144.7937],
        "Pacific/Saipan": [15.1870, 145.7439],
        "Pacific/Palau": [7.5150, 134.5825],
        "Pacific/Chuuk": [7.4256, 151.7966],
        "Pacific/Kosrae": [5.3117, 162.9814],
        "Pacific/Pohnpei": [6.8617, 158.2150],
        "Pacific/Yap": [9.4980, 138.0910]
    };
    return {
        lat: latLong[timezone][0],
        lon: latLong[timezone][1]
    };
}

const downloadFile = async (url, name, mimeType, currentUrl) => {
    if (currentUrl) {
        const response = await axios.get(url, { responseType: 'blob' });
        const blob = new Blob([response.data]);

        let filename = name ? name : url.split('/').pop() || 'download';

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename + '.' + mimeType || 'download';
        a.click();
    } else {
        const proxy = `${import.meta.env.VITE_API_URL}/third-party/proxy?url=${url}`
        const response = await fetch(proxy);
        const blob = await response.blob();

        let filename = name ? name : url.split('/').pop() || 'download';

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
    }
}

const passwordStrength = (password) => {
    if (!password) return false;
    // Validate password strength (Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    return passwordRegex.test(password);
}

const checkPasswordStrength = (password) => {
    // Return the strength of the password based on the following criteria:
    // 0: Password is empty
    // 1: Password is too weak (no uppercase, number, or special character)
    // 2: Password is weak (only one of the following: uppercase, number, or special character)
    // 3: Password is moderate (two of the following: uppercase, number, or special character)
    // 4: Password is strong (all of the following: uppercase, number, and special character)

    if (!password) return 0;
    if (password.length < 6) return 1; // too weak

    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*]/.test(password);

    // Check if password contains only numbers
    const onlyNumbers = /^\d+$/.test(password);

    if (onlyNumbers) return 1; // too weak

    const conditionsMet = [hasUppercase, hasNumber, hasSpecialCharacter].filter(Boolean).length;

    switch (conditionsMet) {
        case 0: return 1; // too weak
        case 1: return 2; // weak
        case 2: return 3; // moderate
        case 3: return 4; // strong
        default: return 0;
    }
}

const getNestedProperty = (obj, path) => {
    return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null
    }, obj);
}

const hasAccess = (job, path, manyPaths) => {
    if (!job) return false;

    if (manyPaths && manyPaths.length > 0) {
        for (let i = 0; i < manyPaths.length; i++) {
            const access = getNestedProperty(job, manyPaths[i]);
            if (access) return true;
        }
        return false;
    } else {
        if (!path) return false;
        return getNestedProperty(job, path);
    }
}


// return opposite color of the given color
const returnColorLum = (color) => {
    // Convert hex color to RGB
    const hexToRgb = (hex) => {
        let bigint = parseInt(hex.slice(1), 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;
        return [r, g, b];
    };

    // Calculate luminance
    const luminance = (r, g, b) => {
        const a = [r, g, b].map((v) => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const [r, g, b] = hexToRgb(color);
    const lum = luminance(r, g, b);

    // Return white for dark colors and black for light colors
    return lum;
};


export {
    addCommaToNumber,
    numberFormatter,
    estimatedCartCost,
    estimatedDeliveryCost,
    estimatedDeliveryQty,
    createEmailBody,
    clearOrderId,
    dateToTimeAgo,
    dateToDaysAgo,
    copyToClipboard,
    cutOffTimeCountDown,
    convertTo12Hour,
    formula,
    executeFormula,
    phoneFormatter,
    validateEmail,
    validatePhone,
    validateState,
    validateZipCode,
    calcHoursBetween,
    calculateTimeDifference,
    getTime,
    calcTotalScheduleHours,
    calcTotalSchedulePaidHours,
    shiftsRow,
    setShiftTime,
    compareDate,
    toIsoDate,
    checkIfDateIsInPast,
    getDayDif,
    calcTasklistDueDate,
    calcDaysLeft,
    exportCSV,
    convertTimezoneToUTC,
    convertFromUTC,
    convertToUTC,
    isToday,
    createICS,
    getLatLongFromTimezone,
    downloadFile,
    passwordStrength,
    checkPasswordStrength,
    getNestedProperty,
    hasAccess,
    returnColorLum,
};