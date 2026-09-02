/**
 * 时间切换
 */
import I18N from '@src/i18n'
import React, { useEffect, useRef, useState } from 'react'
import DateRangePicker from '@com/DateRangePicker'
import { Form, FormInstance, Radio, RadioChangeEvent, Space } from 'antd'
import { groupContainer ,timerFormContainer} from './index.less'
import { MONITOR_TIME_INDEX } from '@src/pages/AgentDetail/ExecutiveList/executiveTypes'
import { useDispatch } from 'react-redux'
import { updateTimeInterval } from '../../ExecutiveList/executiveSlice'
import moment,{Moment} from 'moment'
import { MILLI_SECOND_STEP } from '@src/constant'

type TimeSelectorProps = {
    changeCallback: (startTime: NumberOrNull, endTime: NumberOrNull) => void,
    index:MONITOR_TIME_INDEX,
    setIndex:(index:MONITOR_TIME_INDEX)=>void,
    defaultDate: Moment|null[]
}
const TimeSelector: React.FC<TimeSelectorProps> = ({
    changeCallback,
    index,
    setIndex,
    defaultDate,
}) => {
    const dispatch = useDispatch()
    const formRef = useRef<FormInstance<{picker: Moment|null[]}>|undefined>(null)
    const diskOptions = {
        ActualTime: {
            label: I18N.components.TimeSelector.shiShi,
            value: MONITOR_TIME_INDEX.ACTUAL_TIME
        },
        Hours24: {
            label: I18N.components.TimeSelector.jinXiaoShi,
            value: MONITOR_TIME_INDEX.HOURS24
        },
        Days7: {
            label: I18N.components.TimeSelector.jinTian,
            value: MONITOR_TIME_INDEX.DAYS7
        }
    }
    const handleChange = (e: RadioChangeEvent) => {
        const index = e.target.value
        const millisecondOfOneDay = 24 * 60 * 60 * MILLI_SECOND_STEP
        setIndex(index)
        dispatch(updateTimeInterval([null,null]));
        formRef.current?.resetFields();
        const {
            ActualTime,
            Hours24,
            Days7
        } = diskOptions
        switch (index) {
        case ActualTime.value:
            changeCallback(null, null)
            break
        case Hours24.value:
        {
            const now = Date.now()
            changeCallback(now - millisecondOfOneDay, now)
        }
            break
        case Days7.value:
            changeCallback(Date.now() - 7 * millisecondOfOneDay, Date.now())
            break
        }
    }
    const handleChangeDate = ({
        startTime,
        endTime
    }: { startTime: number, endTime: number }) => {
        changeCallback(startTime, endTime)
        setIndex(MONITOR_TIME_INDEX.DEFAULT_INDEX)
        const transferTime = [moment(moment(startTime).format("YYYY-MM-DD")),moment(moment(endTime).format("YYYY-MM-DD"))]
        dispatch(updateTimeInterval(transferTime))
    }

    const formProps = {
        className: timerFormContainer,
        initialValues:{
            picker: defaultDate
        }
    }
    return <div>
        {/* @ts-ignore */}
        <Form ref={formRef} {...formProps}>
        <Space size={16}>
                <Radio.Group
                    optionType='button'
                    buttonStyle={'outline'}
                    options={Object.values(diskOptions)}
                    onChange={handleChange}
                    value={index}
                    className={groupContainer}
                />
                <Form.Item name={'picker'}>
                    <DateRangePicker handleChangeDate={handleChangeDate} defaultDate={defaultDate} />
                </Form.Item>
        </Space>
        </Form>
    </div>
}

export default TimeSelector
