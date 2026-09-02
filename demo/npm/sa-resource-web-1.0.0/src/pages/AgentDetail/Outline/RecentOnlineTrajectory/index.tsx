/**
 * 主机详情/Agent 配置
 */
import I18N from '@src/i18n'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Spin } from 'antd'

import {
    agentConfigContainer,
    content,
    title,
} from './index.less'
import { request } from '@src/request/fetch'
import { assembleRequestUrl, formatTimeStamp, requestCallback } from '@src/utils'
import { FETCH_ONLINE_HISTORY } from '@src/pages/Resource/constants/apis'
import { CPURateProps, Data, Params } from './types'
import TimeSelector from '../../components/TimeSelector'
import useSwitch from '@react-hook/switch'
import BarCharts from './BarChart'

const CPURate: React.FC<CPURateProps> = ({
    detail,
}) => {
    const [startTime, setStartTime] = useState<NumberOrNull>(null)
    const [endTime, setEndTime] = useState<NumberOrNull>(null)
    const [index, setIndex] = useState<number>(0)

    const [dataList, setDataList] = useState<Data[]>([])
    const [loading, toggleLoading] = useSwitch(false)
    const containerRef = useRef<HTMLDivElement>(null);
    const [width,setWidth] = useState<number>(680)
    const STATUS_MAP ={
        online: 1,
        offline: 0.2
    }
    const handleRequest = async (params: Params) => {
        toggleLoading.on()
        const res = await request({
            url: assembleRequestUrl(FETCH_ONLINE_HISTORY),
            params,
        })

        requestCallback({
            res,
            hideMessage: true,
            callback (data) {
                setDataList(data.list)
                toggleLoading.off()
            },
            errorCallback () {
                toggleLoading.off()
            }
        })

    }
    const xAxisData = useMemo(() => {
        return dataList.map(item => formatTimeStamp(item.time))
    }, [dataList])
    const yAxisData = useMemo(() => {
        return {
            list: dataList.map(item => item.value === '0' ? STATUS_MAP.online : STATUS_MAP.offline),
            name: ''
        }
    }, [dataList])
    useEffect(() => {
        const { uuid } = detail
        if (!uuid) return
        handleRequest({
            startTime,
            endTime,
            uuid
        })
    }, [startTime, endTime, detail])

    const changeCallback = (startTime: NumberOrNull, endTime: NumberOrNull) => {
        setStartTime(startTime)
        setEndTime(endTime)
    }

    const resizeObserver = new ResizeObserver(() => {
        //回调
        setWidth((containerRef.current?.clientWidth||0) - 16 * 2)
    })

    useEffect(()=>{
        if(containerRef?.current){
            //监听对应的dom
            resizeObserver.observe(containerRef.current)
        }
        return ()=>{
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current)
            }
        }
    },[containerRef.current])

    const timeSelectorProps = {
        changeCallback,
        index,
        setIndex,
        defaultDate: [],
    }

    return <div className={agentConfigContainer} ref={containerRef}>
        <h3 className={title}>{I18N.Outline.RecentOnlineTrajectory.jinQiShangXianGui}</h3>
        <TimeSelector {...timeSelectorProps}/>
        <Spin spinning={loading}>
            <div className={content}>
                <BarCharts
                    width={width}
                    type={'category'}
                    xAxisData={xAxisData}
                    yAxisData={yAxisData}
                />
            </div>
        </Spin>
    </div>
}

export default CPURate
