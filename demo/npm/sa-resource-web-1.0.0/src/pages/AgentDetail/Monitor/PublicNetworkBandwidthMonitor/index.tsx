/**
 * 内网带宽 监控
 */
import I18N from '@src/i18n'
import React from 'react'
import { publicNetworkBandwidthContainer } from './index.less'
import { useMonitorData } from '@src/pages/AgentDetail/hook'
import CommonMonitor from '@src/pages/AgentDetail/components/CommonMonitor'
import { Spin } from 'antd'
import { AGENT_DETAIL_CATEGORY } from '@src/constant'
import EllipsisContainer from '@com/EllipsisContainer'

const PublicNetworkBandwidthMonitor: React.FC = () => {
    const {
        bandwidthMonitor: { monitorList: list },
        loading
    } = useMonitorData()
    return <div className={publicNetworkBandwidthContainer}>
        <Spin spinning={loading}>
            {
                list.map((item, index) => {
                    return <CommonMonitor
                        category={AGENT_DETAIL_CATEGORY.BAND_WIDTH}
                        key={index}
                        uuid={`network${index}`}
                        index={index}
                        label={!index ? <EllipsisContainer
                            style={{ maxWidth: 135 }}
                            val={I18N.Monitor.PublicNetworkBandwidthMonitor.neiWangDaiKuanJian}/> : ''}
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
export default PublicNetworkBandwidthMonitor
