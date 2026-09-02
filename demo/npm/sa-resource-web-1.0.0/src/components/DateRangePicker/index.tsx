/* eslint-disable */
// @ts-nocheck
/**
 * 日期选择组件 日期有间隔最大默认30， 自动补齐开始及结束时分秒
 */
import React, { useState } from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'

const { RangePicker } = DatePicker
import 'moment/locale/zh-cn'
import { currentAntdLang } from '@src/i18n/antdLangs'

type DateRangePicker = {
    handleChangeDate: ({
        startTime: number,
        endTime: number
    }) => void
    dateRange?: number,
    defaultDate: Moment|null[]
}
export declare type EventValue<DateType> = DateType | null;

export declare type RangeValue<DateType> = [EventValue<DateType>, EventValue<DateType>] | null;

const DateRangePicker: React.FC<DateRangePicker> = ({
    handleChangeDate,
    dateRange = 30,
    defaultDate
}) => {
    const [dates, setDates] = useState([])
    const [hackValue, setHackValue] = useState(defaultDate)
    const [value, setValue] = useState(defaultDate)
    const disabledDate = current => {
        if (!dates || dates.length === 0) {
            return false
        }
        const tooLate = dates[0] && current.diff(dates[0], 'days') > dateRange
        const tooEarly = dates[1] && dates[1].diff(current, 'days') > dateRange
        return tooEarly || tooLate
    }

    const onOpenChange = open => {
        if (open) {
            setHackValue([])
            setDates([])
        } else {
            setHackValue(null)
        }
    }

    const onDateChange: (values: RangeValue<DateType>, formatString: [string, string]) => void = val => {
        setValue(val)
        let startTime
        let endTime
        if (val) {
            startTime = Date.parse(`${moment(val[0]).format('YYYY-MM-DD')} 00:00:00`)
            endTime = Date.parse(`${moment(val[1]).format('YYYY-MM-DD')} 23:59:59`)
        }
        handleChangeDate({
            startTime,
            endTime,
        })
    }
    // 时间段选择做多31天
    return (
        <RangePicker
            defaultValue={defaultDate}
            locale={currentAntdLang}
            value={hackValue || value}
            disabledDate={disabledDate}
            onCalendarChange={val => setDates(val)}
            onChange={val => onDateChange(val)}
            onOpenChange={onOpenChange}
        />
    )
}

export default DateRangePicker
