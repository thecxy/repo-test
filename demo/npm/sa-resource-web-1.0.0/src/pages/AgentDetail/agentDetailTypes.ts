import { Input } from '@src/pages/Resource/resourceTypes'

export type MonitorParams = {
    uuid: string
    diskName?: string // 需要先获取主机磁盘名称列表，只有在查询磁盘监控时需要传递
    entTime?: NumberOrNull
    startTime?: NumberOrNull
}

export type CpuMonitorItem = {
    avgValue: number,
    category: string,
    description: string,
    maxValue: number,
    minValue: number,
    monitorUnit: string,
    list: Input[],
}
export type CpuMonitorType = {
    endTime: string,
    monitorList: CpuMonitorItem[],
    startTime: string,
    timeUnit: string
}

export enum DetailTabs {
    outline = 'outline',
    monitor = 'monitor',
    task = 'task',
    executiveCommand = 'executive command'
}
