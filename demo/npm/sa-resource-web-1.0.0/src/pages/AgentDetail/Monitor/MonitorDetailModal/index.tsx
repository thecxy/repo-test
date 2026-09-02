/**
 * 监控弹窗
 */
import I18N from '@src/i18n'
import { Button, Spin } from 'antd'
import React from 'react'
import TimeSelector from '@src/pages/AgentDetail/components/TimeSelector'
import { useMonitorData, useMonitorDetailVisible } from '@src/pages/AgentDetail/hook'
import { monitorDetailModal, titleCss, left, right } from './index.less'
import LineCharts from '@com/LineChart'
import { formatTimeStamp } from '@src/utils'
import BasicModal from '@com/BasicModal'
import { useTimeSelector } from '../../ExecutiveList/hook'

const MonitorDetailModal: React.FC<{
   changeCallback: (startTime: NumberOrNull, endTime: NumberOrNull,) => void,
   refresh:()=>void
}> = ({changeCallback,refresh}) => {
    const monitorData = useMonitorData()
    const { currentMonitorTimeIndex: index, toggleIndex: setIndex, timeInterval: defaultDate } = useTimeSelector()

    const {
        currentDetailItemCategory,
        currentDetailItemIndex
    } = monitorData
    const data = monitorData[currentDetailItemCategory].monitorList[currentDetailItemIndex]
    console.log(data,'data');
    const title = data.category
    const unit = data.monitorUnit
    const { loading } = useMonitorData()
    const {
        visible,
        toggleVisible
    } = useMonitorDetailVisible()

    const modalProps = {
        visible: visible,
        footer: null,
        width: 800,
        onCancel: toggleVisible,
        title: `${title}(${unit})`
    }

    const yAxisData = {
        // @ts-ignore
        list: data.list.map(item => item.value - 0),
        name: ''
    }

    const xAxisData = data.list
        .map(item => formatTimeStamp(item.time))

    const timeSelectorProps = {
        changeCallback,
        index,
        setIndex,
        defaultDate,
       
    }

    return <BasicModal {...modalProps}>
        <div className={monitorDetailModal}>
            <div className={titleCss}>
                <div className={left}>
                    <TimeSelector {...timeSelectorProps} />
                </div>
                <div className={right}>
                    <Button type={'link'} onClick={()=>refresh()}>{I18N.Monitor.MonitorDetailModal.shuaXin}</Button>
                </div>
            </div>
            <Spin spinning={loading}>
                <LineCharts
                    height={300}
                    xAxisData={xAxisData}
                    yAxisData={yAxisData}
                />
            </Spin>
        </div>
    </BasicModal>
}

export default MonitorDetailModal
