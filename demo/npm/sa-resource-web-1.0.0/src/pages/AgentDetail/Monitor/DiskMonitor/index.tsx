/**
 * 磁盘 监控
 */
import I18N from '@src/i18n'
import React from 'react'
import { publicNetworkBandwidthContainer } from './index.less'
import { useMonitorData } from '@src/pages/AgentDetail/hook'
import CommonMonitor from '@src/pages/AgentDetail/components/CommonMonitor'
import { Spin } from 'antd'
import { AGENT_DETAIL_CATEGORY } from '@src/constant'
import EllipsisContainer from '@com/EllipsisContainer'

type DiskMonitorProps = {
    currentDisk:string,
    handleChangeDisk:(disk:string)=>void
}
const DiskMonitor: React.FC<DiskMonitorProps> = ({ currentDisk,handleChangeDisk }) => {
    const {
        diskMonitor: { monitorList: list },
        diskList,
        diskLoading
    } = useMonitorData()
    return <div className={publicNetworkBandwidthContainer}>
        <Spin spinning={diskLoading}>
            {
                list.map((item, index) => {
                    const uuid = `disk${currentDisk}${index}`

                    return <CommonMonitor
                        index={index}
                        uuid={uuid}
                        category={AGENT_DETAIL_CATEGORY.DISK}
                        key={index}
                        label={!index ? <EllipsisContainer
                            style={{ maxWidth: 135 }}
                            val={I18N.Monitor.DiskMonitor.ciPanShiYongJi}/> : ''}
                        selectList={!index ? diskList : []}
                        selectChangeCallback={handleChangeDisk}
                        column1={{
                            label: item.category,
                            unit: item.monitorUnit,
                            tips: item.description
                        }}
                        column2={item.list}
                        column3={{
                            max: item.maxValue,
                            min: item.minValue,
                            avg: item.avgValue.toFixed(2),
                        }}
                        monitorUnit={item.monitorUnit}
                    />
                })
            }
        </Spin>
    </div>
}
export default DiskMonitor
