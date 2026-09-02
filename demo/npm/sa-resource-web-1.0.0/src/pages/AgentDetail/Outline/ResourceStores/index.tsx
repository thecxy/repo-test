/**
 * 主机详情/存储资源
 */
import I18N from '@src/i18n'
import React, { useEffect, useMemo, useState } from 'react'
import { Empty, Radio, RadioChangeEvent, Spin } from 'antd'

import {
    bottom,
    content,
    groupContainer,
    labelCss,
    left,
    leftContent,
    resourceStoresContainer,
    right,
    title,
    valueCss
} from './index.less'
import { AgentDetail, DiskVos } from '@src/pages/Resource/resourceTypes'
import PieCharts from '@src/pages/Resource/Home/Main/DataList/PieCharts'
import { defaultAgentDetail } from '@src/pages/AgentDetail/agentDetailSlice'
import { MONITOR_TIME_INDEX } from '@src/pages/AgentDetail/ExecutiveList/executiveTypes'

type ResourceStoresProps = {
    detail: AgentDetail,
    loading: boolean
}

const ResourceStores: React.FC<ResourceStoresProps> = ({
    detail,
    loading
}) => {
    const [diskVos, setDiskVos] = useState<DiskVos[]>([])
    const [index, setIndex] = useState<number>(0)

    const diskOptions = useMemo(() => {
        return diskVos.map(({ name }, index) => ({
            label: name,
            value: index
        }))
    }, [diskVos])

    const handleChange = (e: RadioChangeEvent) => {
        setIndex(e.target.value)
    }

    const currentData = useMemo(() => {
        return diskVos[index] || defaultAgentDetail.diskVos[0]
    }, [diskVos, index])

    const currentDisk = useMemo(() => {
        const {
            diskUnit,
            diskUsedRate = 0
        } = currentData
        const data1 = {
            name: I18N.Outline.ResourceStores.yiShiYong,
            value: diskUsedRate
        }
        const data2 = {
            name: I18N.Outline.ResourceStores.weiShiYong,
            value: (100 - diskUsedRate).toFixed(2)
        }
        const title = diskUnit ? `${diskUsedRate}%` : ''
        return {
            data1,
            data2,
            title
        }
    }, [currentData])

    const leftData = useMemo(() => {
        const {
            diskVolume,
            diskUnit,
            diskUsed,
        } = currentData
        return {
            volume: {
                label: I18N.Outline.ResourceStores.rongLiang,
                value: `${diskVolume}${diskUnit}`
            },
            used: {
                label: I18N.Outline.ResourceStores.yiShiYong,
                value: `${diskUsed}${diskUnit}`
            }
        }
    }, [currentData])

    const isEmpty = useMemo(() => {
        return currentData.name === ''
    }, [currentData])

    useEffect(() => {
        const { diskVos = [] } = detail
        setDiskVos(diskVos)
        if (diskVos.length) {
            setIndex(MONITOR_TIME_INDEX.ACTUAL_TIME)
        }
    }, [detail])

    return <div className={resourceStoresContainer}>
        <div className={left}>
            <h3 className={title}>{I18N.Outline.ResourceStores.cunChuZiYuan}</h3>
            <Spin spinning={loading}>
                {
                    isEmpty ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/> : <div className={content}>
                        <div className={left}>
                            <Radio.Group
                                optionType="button"
                                buttonStyle={'outline'}
                                options={diskOptions}
                                onChange={handleChange}
                                value={index}
                                className={groupContainer}
                            />
                            <div className={bottom}>
                                {
                                    Object.values(leftData).map(({
                                        label,
                                        value
                                    }) => {
                                        return <div key={label} className={leftContent}>
                                            <div className={labelCss}>{label}：</div>
                                            <div className={valueCss}>{value}</div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                }
            </Spin>
        </div>
        <div className={right}>
            <PieCharts {...currentDisk} width={82} fontSize={21}/>
        </div>
    </div>
}

export default ResourceStores
