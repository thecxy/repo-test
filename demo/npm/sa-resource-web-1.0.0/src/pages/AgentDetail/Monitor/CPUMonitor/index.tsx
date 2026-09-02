/**
 * CPU 监控
 */
import I18N from '@src/i18n'
import React from 'react'
import { cpuMonitorContainer } from './index.less'
import CommonMonitor from '@src/pages/AgentDetail/components/CommonMonitor'
import { useMonitorData } from '@src/pages/AgentDetail/hook'
import { Spin } from 'antd'
import { AGENT_DETAIL_CATEGORY } from '@src/constant'
import EllipsisContainer from '@com/EllipsisContainer'

const CPUMonitor: React.FC = () => {
    const {
        cpuMonitor: { monitorList: list },
        loading
    } = useMonitorData()
    return <div className={cpuMonitorContainer}>
        <Spin spinning={loading}>
            {
                list.map((item, index) => {
                    return <CommonMonitor
                        index={index}
                        category={AGENT_DETAIL_CATEGORY.CPU}
                        uuid={'cpu'}
                        key={index}
                        label={!index ? <EllipsisContainer
                            style={{ maxWidth: 135 }}
                            val={I18N.Monitor.CPUMonitor.cPUJianKong}/> : ''}
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
export default CPUMonitor
