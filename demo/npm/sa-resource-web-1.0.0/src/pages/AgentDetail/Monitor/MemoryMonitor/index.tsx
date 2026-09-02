/**
 * 内存 监控
 */
import I18N from '@src/i18n'
import React from 'react'

import { memoryMonitorContainer } from './index.less'
import { useMonitorData } from '@src/pages/AgentDetail/hook'
import CommonMonitor from '@src/pages/AgentDetail/components/CommonMonitor'
import { Spin } from 'antd'
import { AGENT_DETAIL_CATEGORY } from '@src/constant'
import EllipsisContainer from '@com/EllipsisContainer'

const MemoryMonitor: React.FC = () => {
    const {
        memoryMonitor: { monitorList: list },
        loading
    } = useMonitorData()
    return <div className={memoryMonitorContainer}>
        <Spin spinning={loading}>
            {
                list.map((item, index) => {
                    return <CommonMonitor
                        category={AGENT_DETAIL_CATEGORY.MEMORY}
                        index={index}
                        uuid={`memory${index}`}
                        key={index}
                        label={!index ? <EllipsisContainer
                            style={{ maxWidth: 135 }}
                            val={I18N.Monitor.MemoryMonitor.neiCunJianKong}/> : ''}
                        column1={{
                            label: item.category,
                            unit: item.monitorUnit,
                            tips: item.description
                        }}
                        column2={item.list}
                        column3={{
                            max: item.maxValue,
                            min: item.minValue,
                            avg: item.avgValue,
                        }}
                        monitorUnit={item.monitorUnit}
                    />
                })
            }
        </Spin>
    </div>
}
export default MemoryMonitor
