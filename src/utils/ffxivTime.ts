import { Moment } from 'moment'

interface IRet {
    YearVal: number
    MonthVal: number
    DayVal: number
    HourVal: number
    MinuteVal: number
    SecondVal: number
}
const YEAR = 33177600
const MONTH = 2764800
const DAY = 86400
const HOUR = 3600
const MINUTE = 60
const SECOND = 1

const EORZEA_TIME_CONSTANT = 3600 / 175

export function ConvertToEorzeaTime(time: Moment): IRet {
    const earthTime = time.unix()
    const eorzeaTime = Math.floor(earthTime * EORZEA_TIME_CONSTANT)
    const ret: IRet = {
        YearVal: 0,
        MonthVal: 0,
        DayVal: 0,
        HourVal: 0,
        MinuteVal: 0,
        SecondVal: 0
    }
    ret.YearVal = Math.floor(eorzeaTime / YEAR) + 1
    ret.MonthVal = Math.floor(eorzeaTime / MONTH % 12) + 1
    ret.DayVal = Math.floor(eorzeaTime / DAY % 32) + 1
    ret.HourVal = Math.floor(eorzeaTime / HOUR % 24)
    ret.MinuteVal = Math.floor(eorzeaTime / MINUTE % 60)
    ret.SecondVal = Math.floor(eorzeaTime / SECOND % 60)

    return ret
}

function formatZero(str: string): string {
    if (str.length === 1) {
        return '0' + str
    } else {
        return str
    }
}

export function ConvertToEorzeaTimeString(time: Moment): string {
    const earthTime = time.unix()
    const eorzeaTime = Math.floor(earthTime * EORZEA_TIME_CONSTANT)

    const yearVal = parseInt((Math.floor(eorzeaTime / YEAR) + 1).toString(), 10)
    const monthVal = formatZero(parseInt((Math.floor(eorzeaTime / MONTH % 12) + 1).toString(), 10).toString())
    const dayVal = formatZero(parseInt((Math.floor(eorzeaTime / DAY % 32) + 1).toString(), 10).toString())
    const hourVal = formatZero(parseInt(Math.floor(eorzeaTime / HOUR % 24).toString(), 10).toString())
    const minuteVal = formatZero(parseInt(Math.floor(eorzeaTime / MINUTE % 60).toString(), 10).toString())
    // const secondVal = formatZero(parseInt(Math.floor(eorzeaTime / SECOND % 60).toString(), 10).toString())
    const secondVal = '00'

    let ret: string
    // ret = moment(`${yearVal}${monthVal}${dayVal}${hourVal}${minuteVal}${secondVal}`).format(format)
    ret = `${hourVal}:${minuteVal}:${secondVal}`
    return ret
}

// function parseEorzeaTimeString(timestring: string, format: string) {

//     date, err := time.Parse(format, timestring)
//     var ret time.Time
//     if err != nil {
//         return ret, err
//     }
//     return date, nil
// }

// function ConvertToEarthTime(timestring: string, format: string) {
//     const { date, nil } = parseEorzeaTimeString(format, timestring)
//     const years = date.Year()
//     const months = date.Month()
//     const days = date.Day()
//     const hours = date.Hour()
//     const minutes = date.Minute()
//     const seconds = date.Second()

//     const utc = ((years - 1) * YEAR + (months - 1) * MONTH + (days - 1) * DAY + hours * HOUR + minutes * MINUTE + seconds) / EORZEA_TIME_CONSTANT
//     // tslint:disable-next-line: no-shadowed-variable
//     const ret = moment(utc).unix()
//     return {
//         ret, nil
//     }
// }