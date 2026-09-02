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
    labelCss,
    valueCss,
    detailItem
} from './index.less'
import { AgentDetail, Input } from '@src/pages/Resource/resourceTypes'
import { formatTimeStamp } from '@src/utils'
import LineCharts from '@com/LineChart'
import { DEFAULT_STRING_VALUE } from '@src/constant'
import { isNil } from 'ramda'

type PublicNetworkBandwidthProps = {
    detail: AgentDetail,
    loading: boolean
}

const PublicNetworkBandwidth: React.FC<PublicNetworkBandwidthProps> = ({
    detail,
    loading
}) => {
    const [inputList, setInputList] = useState<Input[]>([])
    const [outputList, setOutputList] = useState<Input[]>([])
    const xAxisData = useMemo(() => {
        return inputList.map(item => formatTimeStamp(item.time))
    }, [inputList])

    const inputYAxisData = useMemo(() => {
        return {
            name: I18N.Outline.PublicNetworkBandwidth.ru,
            // @ts-ignore
            list: inputList.map(item => item.value - 0)
        }
    }, [inputList])
    const outputYAxisData = useMemo(() => {
        return {
            name: I18N.Outline.PublicNetworkBandwidth.chu,
            // @ts-ignore
            list: outputList.map(item => item.value - 0)
        }
    }, [outputList])

    useEffect(() => {
        const {
            bandwidthMonitor: {
                inputList,
                outputList
            }
        } = detail
        setInputList(inputList)
        setOutputList(outputList)
    }, [detail])

    const detailData = useMemo(() => {
        const {
            bandwidthMonitor: {
                currInput,
                currOutput,
            }
        } = detail

        return {
            input: {
                value: !isNil(currInput) ? I18N.get(I18N.Outline.PublicNetworkBandwidth.cURRI, { val1: currInput }) : DEFAULT_STRING_VALUE
            },
            output: {
                value: !isNil(currOutput) ? I18N.get(I18N.Outline.PublicNetworkBandwidth.cURRO, { val1: currOutput }) : DEFAULT_STRING_VALUE
            }
        }
    }, [detail])

    return <div className={agentConfigContainer}>
        <h3 className={title}>{I18N.Outline.PublicNetworkBandwidth.gongWangDaiKuanShi}</h3>
        <Spin spinning={loading}>
            <div className={content}>
                <div className={detailItem}>
                    <span className={labelCss}>{I18N.Outline.PublicNetworkBandwidth.dangQian}</span>
                    <span className={valueCss}>{detailData.input.value}</span>
                    <span className={valueCss}>{detailData.output.value}</span>
                </div>
                <LineCharts
                    width={300}
                    xAxisLabelFormatter={(value)=>{
                        return value.split(' ')[1]
                    }}
                    xAxisData={xAxisData}
                    multiData
                    multiYAxisData={[outputYAxisData, inputYAxisData]}
                />
            </div>
        </Spin>

    </div>
}

export default PublicNetworkBandwidth
