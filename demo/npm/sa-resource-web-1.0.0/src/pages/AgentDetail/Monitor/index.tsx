/**
 * 主机详情/监控
 * 这部分逻辑写的很乱，redux中有状态，子组件又去维护一份状态，数据流混乱
 * 请求逻辑最后走到一个components组件内去处理，不合理
 * 请求逻辑冗余，时间状态维护一份用来请求就好
 * 
 */
import I18N from '@src/i18n'
import TimeSelector from '@src/pages/AgentDetail/components/TimeSelector'
import { monitorContainer, tips, info, inner, monitorTree } from './index.less'
import IconFont from '@com/Iconfont'
import CPUMonitor from '@src/pages/AgentDetail/Monitor/CPUMonitor'
import MemoryMonitor from './MemoryMonitor'
import { useSelector,useDispatch } from 'react-redux'
import PublicNetworkBandwidthMonitor from './PublicNetworkBandwidthMonitor'
import React, { useEffect, useMemo, useState } from 'react'
import {useMonitorSort, useUuid, useMonitor, useMonitorDetailVisible } from '@src/pages/AgentDetail/hook'
import { isEmpty, pickBy } from 'ramda'
import DiskMonitor from '@src/pages/AgentDetail/Monitor/DiskMonitor'
import { MonitorParams } from '@src/pages/AgentDetail/agentDetailTypes'
import { updateDate } from '../agentDetailSlice'
import MonitorDetailModal from '@src/pages/AgentDetail/Monitor/MonitorDetailModal'
import { Helmet } from 'react-helmet'
import { useDisk } from '@src/pages/AgentDetail/hook'
import { useMetaTitleName } from '@src/hooks/useMetaTitleName'
import { useTimeSelector } from '../ExecutiveList/hook'
import { Tree } from 'antd'
import { useDrag } from './hook'
import { Item } from './types'
import { RootState } from '@src/store'

const Monitor: React.FC = () => {
    const {
        currentMonitorTimeIndex: index,
        toggleIndex: setIndex,
        timeInterval: defaultDate
    } = useTimeSelector()
    const dispatch = useDispatch();

    // 日期数据统一在redux中管理
    const date = useSelector((state:RootState)=>state.agentDetail.date) 

    const uuid = useUuid()
    const {
        itemIndex,
        setMonitorSort
    } = useMonitorSort()
    const { updateMonitor } = useMonitor()
    const metaTitle = useMetaTitleName()
    // 用于图表的请求
    const params: MonitorParams = useMemo(() => {
        return pickBy((data) => !isEmpty(data), {
            uuid,
            startTime:date?.[0],
            endTime:date?.[1]
        })
    }, [date, uuid])

    const {currentDisk,handleChangeDisk,handleFetchDiskMonitor} = useDisk(params);

    const commonParams = {
        selectable: false,
        isLeaf: true,
        children: []
    }
    const defaultItems: Item[] = [
        {
            ...commonParams,
            index: itemIndex.cpuIndex,
            title: <CPUMonitor />,
            key: 'cpu'

        },
        {
            ...commonParams,
            index: itemIndex.memoryIndex,
            title: <MemoryMonitor />,
            key: 'memory'
        },
        {
            ...commonParams,
            index: itemIndex.bandwidthIndex,
            title: <PublicNetworkBandwidthMonitor />,
            key: 'bandwidth'
        },
        {
            ...commonParams,
            index: itemIndex.diskIndex,
            title: <DiskMonitor currentDisk={currentDisk} handleChangeDisk={handleChangeDisk}/>,
            key: 'disk'
        }
    ]

    const changeCallback = (startTime: NumberOrNull, endTime: NumberOrNull) => {
        dispatch(updateDate([startTime,endTime]));
    }

    const refresh = ()=>{
        updateMonitor(params); // 请求内存 cpu 内网数据
        handleFetchDiskMonitor(currentDisk,params); // 请求磁盘数据
    }

    const [items, setItems] = useState<Item[]>([])

    useEffect(() => {
        setItems(defaultItems.sort((a, b) => a.index - b.index))
    }, [itemIndex,params])

    useEffect(()=>{
        updateMonitor(params);
    },[params])

    const onSortEnd = (data: Item[]) => {
        const res: { [key: string]: number } = {}

        const newItems = data.map((item, index) => {
            const { key } = item
            res[`${key}Index`] = index + 1
            return {
                ...item,
                index
            }
        })
        setItems(newItems as unknown as Item[])
        setMonitorSort(res)
    }

    const timeSelectorProps = {
        changeCallback,
        index,
        setIndex,
        defaultDate
    }
    const { onDrop } = useDrag(items, (data) => {
        onSortEnd(data as unknown as Item[])
    })

    return <div className={monitorContainer}>
        <div className={inner}>
            <Helmet title={`${I18N.AgentDetail.index.jianKong}${metaTitle}`} />
            <TimeSelector {...timeSelectorProps} />
            <div className={tips}>
                <IconFont type={'iconinfo'} /><span className={info}>{I18N.Monitor.index.zhuShiMAX}</span>
            </div>
            <Tree
                className={monitorTree}
                draggable
                defaultExpandAll
                treeData={items}
                onDrop={onDrop}
            />
            <MonitorDetailModal changeCallback={changeCallback} refresh={refresh}/>

        </div>
    </div>
}

export default Monitor

