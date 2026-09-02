/**
 * 主机详情/Agent 配置
 */
import I18N from '@src/i18n'
import React, { useEffect, useMemo, useState } from 'react'
import { Spin } from 'antd'

import {
    agentConfigContainer,
    content,
    title,
    detailItem,
    labelCss,
    valueCss,
    detailDataCss
} from './index.less'
import { AgentDetail, Input } from '@src/pages/Resource/resourceTypes'
import { formatTimeStamp } from '@src/utils'
import LineCharts from '@com/LineChart'
import { DEFAULT_STRING_VALUE } from '@src/constant'
import { isNil } from 'ramda'

type CPURateProps = {
    detail: AgentDetail,
    loading: boolean
}

const CPURate: React.FC<CPURateProps> = ({
    detail,
    loading
}) => {
    const [dataList, setDataList] = useState<Input[]>([])
    const xAxisData = useMemo(() => {
        return dataList.map(item => formatTimeStamp(item.time))
    }, [dataList])
    const yAxisData = useMemo(() => {
        return {
            // @ts-ignore
            list: dataList.map(item => item.value - 0),
            name: I18N.Outline.CPURate.shiYongLu
        }
    }, [dataList])

    useEffect(() => {
        const { cpuMonitor: { list } } = detail
        setDataList(list)
    }, [detail])
    const detailData = useMemo(() => {
        const {
            cpuMonitor: {
                currUsed,
                total,
                propertyUnit,
                monitorUnit,
            }
        } = detail

        return {
            current: {
                label: I18N.Outline.CPURate.dangQian,
                value: !isNil(currUsed) ? `${currUsed}${monitorUnit}` : DEFAULT_STRING_VALUE
            },
            total: {
                label: I18N.Outline.CPURate.zongLiang,
                value: !isNil(total) ? `${total}${propertyUnit}` : DEFAULT_STRING_VALUE
            }
        }
    }, [detail])
    return <div className={agentConfigContainer}>
        <h3 className={title}>{I18N.Outline.CPURate.cPULiYong}</h3>
        <Spin spinning={loading}>

            <div className={content}>
                <div className={detailDataCss}>
                    {
                        Object.values(detailData).map(({
                            label,
                            value
                        }) => (
                            <div key={label} className={detailItem}><span className={labelCss}>{label}:</span><span
                                className={valueCss}>{value}</span></div>
                        ))
                    }
                </div>
                <LineCharts
                    xAxisLabelFormatter={(value)=>{
                        return value.split(' ')[1]
                    }}
                    width={300}
                    xAxisData={xAxisData}
                    yAxisData={yAxisData}
                />
            </div>
        </Spin>

    </div>
}

export default CPURate
