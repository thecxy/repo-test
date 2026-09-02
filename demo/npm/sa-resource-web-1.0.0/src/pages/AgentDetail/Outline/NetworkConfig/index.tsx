/**
 * 主机详情/网卡配置
 */
import I18N from '@src/i18n'
import React, { useEffect, useMemo, useState } from 'react'
import { Empty, Radio, RadioChangeEvent, Spin } from 'antd'

import { agentConfigContainer, content, groupContainer, infoItem, labelCss, title, valueCss } from './index.less'
import { AgentDetail, NetworkCardVos } from '@src/pages/Resource/resourceTypes'
import { defaultAgentDetail } from '@src/pages/AgentDetail/agentDetailSlice'
import { MONITOR_TIME_INDEX } from '@src/pages/AgentDetail/ExecutiveList/executiveTypes'

type NetworkConfigProps = {
    detail: AgentDetail,
    loading: boolean
}

const NetworkConfig: React.FC<NetworkConfigProps> = ({
    detail,
    loading
}) => {
    const [networkCardVos, setNetworkCardVos] = useState<NetworkCardVos[]>([])
    const [index, setIndex] = useState<number>(0)

    const currentData = useMemo(() => {
        return networkCardVos[index] || defaultAgentDetail.networkCardVos[0]
    }, [networkCardVos, index])
    const handleChange = (e: RadioChangeEvent) => {
        setIndex(e.target.value)
    }
    const diskOptions = useMemo(() => {
        return networkCardVos.map(({ name }, index) => ({
            label: name,
            value: index
        }))
    }, [networkCardVos])
    const data = useMemo(() => {
        const {
            ip,
            mac
        } = currentData
        return {
            volume: {
                label: 'IP',
                value: ip
            },
            used: {
                label: I18N.Outline.NetworkConfig.mACDiZhi,
                value: mac
            }
        }
    }, [currentData])
    const isEmpty = useMemo(() => {
        return currentData.name === ''
    }, [currentData])
    useEffect(() => {
        const { networkCardVos = [] } = detail
        setNetworkCardVos(networkCardVos)
        if (networkCardVos.length) {
            setIndex(MONITOR_TIME_INDEX.ACTUAL_TIME)
        }
    }, [detail])
    return <div className={agentConfigContainer}>
        <h3 className={title}>{I18N.Outline.NetworkConfig.wangKaPeiZhi}</h3>
        <Spin spinning={loading}>
            <Radio.Group
                optionType="button"
                buttonStyle={'outline'}
                options={diskOptions}
                onChange={handleChange}
                value={index}
                className={groupContainer}
            />
            {
                isEmpty ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/> :
                    <div className={content}>
                        {
                            Object.values(data).map(({
                                label,
                                value
                            }) => {
                                return <div key={label} className={infoItem}>
                                    <span className={labelCss}>{label}：</span>
                                    <span className={valueCss}>{value}</span>
                                </div>
                            })
                        }
                    </div>
            }
        </Spin>

    </div>
}

export default NetworkConfig
