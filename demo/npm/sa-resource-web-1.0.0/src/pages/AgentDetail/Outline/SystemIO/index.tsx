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
    valueCss
} from './index.less'
import { AgentDetail, Input } from '@src/pages/Resource/resourceTypes'
import LineCharts from '@com/LineChart'
import { formatTimeStamp } from '@src/utils'
import { DEFAULT_STRING_VALUE } from '@src/constant'
import { isNil } from 'ramda'

type SystemIOProps = {
    detail: AgentDetail,
    loading: boolean
}

const SystemIO: React.FC<SystemIOProps> = ({
    detail,
    loading
}) => {
    const [inputList, setInputList] = useState<Input[]>([])
    const [outputList, setOutputList] = useState<Input[]>([])
    const inputYAxisData = useMemo(() => {
        return {
            name: I18N.Outline.SystemIO.xie,
            // @ts-ignore
            list: inputList.map(item => item.value - 0)
        }
    }, [inputList])
    const outputYAxisData = useMemo(() => {
        return {
            name: I18N.Outline.SystemIO.du,
            // @ts-ignore
            list: outputList.map(item => item.value - 0)
        }
    }, [outputList])

    const xAxisData = useMemo(() => {
        return inputList.map(item => formatTimeStamp(item.time))
    }, [inputList])

    const detailData = useMemo(() => {
        const {
            diskFlowMonitor: {
                currInput,
                currOutput,
            }
        } = detail

        return {
            input: {
                value: !isNil(currInput) ? I18N.get(I18N.Outline.SystemIO.cURRI, { val1: currInput }) : DEFAULT_STRING_VALUE
            },
            output: {
                value: !isNil(currOutput) ? I18N.get(I18N.Outline.SystemIO.cURRO, { val1: currOutput }) : DEFAULT_STRING_VALUE
            }
        }
    }, [detail])

    useEffect(() => {
        const {
            diskFlowMonitor: {
                inputList,
                outputList
            }
        } = detail
        setInputList(inputList)
        setOutputList(outputList)
    }, [detail])
    return <div className={agentConfigContainer}>
        <h3 className={title}>{I18N.Outline.SystemIO.xiTongPanIO}</h3>
        <Spin spinning={loading}>
            <div className={content}>
                <div className={detailItem}>
                    <span className={labelCss}>{I18N.Outline.PublicNetworkBandwidth.dangQian}</span>
                    <span className={valueCss}>{detailData.output.value}</span>
                    <span className={valueCss}>{detailData.input.value}</span>
                </div>
                <LineCharts
                    xAxisLabelFormatter={(value)=>{
                        return value.split(' ')[1]
                    }}
                    width={300}
                    xAxisData={xAxisData}
                    multiData
                    multiYAxisData={[outputYAxisData, inputYAxisData]}
                />
            </div>
        </Spin>

    </div>
}

export default SystemIO
