import React from 'react'
import { AGENT_STATUS_ENUM, AGENT_TYPE, GROUP_TYPE, SCRIPT_TYPE_ENUM } from '@src/constant'
import { LIST_COLUMN_KEY } from './constants/constant'
import { AsyncThunk } from '@reduxjs/toolkit'
import { ProjectFromServer, ServiceUnitFromServer } from '@src/pages/Resource/components/AddGroupModal/addGroupModalTypes'

export type ListItem = {
    isSlideBar?: boolean
    id?: number
    key?: LIST_COLUMN_KEY
    value?: string
    label: string
    search: boolean
    disabled: boolean,
    fixed?: 'left' | 'right' | boolean,
    width?: number | string,
    className?: string
}

export type HandleChangeColumn = (config: Pick<ListItem, 'key' | 'disabled' | 'id'>) => void

export type  ServiceUnitType = {
    serviceUnitName: string,
    serviceUnitId: number,
    agentUuid: string
}

export type AgentInfoMonitorVoType = {
    uuid: string,
    hostName: string,
    systemType: string,
    ip: string,
    macAddress: string,
    cpuCount: number,
    cpuUnit: string,
    cpuUsedRate: number,
    memory: number,
    memoryUnit: string,
    memoryUsedRate: number,
    diskVolume: number,
    diskVolumeUnit: string,
    diskUsedRate: number,
    usedRateUnit: string
}
export type TableDataType = {
    id: number,
    agentLabel: string,
    labelId: number,
    uuid: string,
    name: string,
    status: AGENT_STATUS_ENUM
    executorCount: number,
    createTime: NumberOrNull,
    updateTime: NumberOrNull,
    lastHeartbeatTime: number,
    note: string,
    createUser: string,
    type: number,
    version: string,
    groupId: number,
    tempData: number,
    groupName: string,
    groupType: number,
    companyUuid: string,
    labelDisplayName: string,
    itUpgradeable: boolean,
    agentInfoMonitorVo: AgentInfoMonitorVoType,
    serviceUnitList: ServiceUnitType[]
}

export enum FilterValueType {
    NAME = 'name',
    IP = 'ip',
    OS = 'os'
}

export type FilterType = {
    [key in FilterValueType]: string
}
export type AgentGroupOperationLabel = 'ADD' | 'VIEW' | 'EDIT' | 'DELETE' | 'MOVETO' | 'DEFAULT'

export type AgentGroupOperationType = {
    [key in AgentGroupOperationLabel]: {
        label: string
        value: AgentGroupOperationLabel
    }
}

export type AgentOperationLabel = AgentGroupOperationLabel | 'REBOOT' | 'SHUTDOWN' | 'RE_CONNECT'

export type AgentOperationType = {
    [key in AgentOperationLabel]: {
        label: string
        value: AgentOperationLabel
    }
}

export type AgentType = {
    createTime: number
    describes: string
    id: number
    name: string
    status: number
    typeNames: string
    updateTime: number
    useTemp: number
    userId: number
    userName: string
    uuid: string
}

export type OriginData = {
    id: number
    name: StringOrNull
    key?: NumberOrNull
    title?: string
    createTime: NumberOrNull
    updateTime: NumberOrNull
    deleteStatus: NumberOrNull
    displayName: string
    description: StringOrNull
    parentId: number
    sortIndex: number
    level: number
    childCount: number
    allocation: NumberOrNull
    groupType: GROUP_TYPE
    projectList: null | ProjectFromServer[]
    serviceUnitList: ServiceUnitFromServer[] | null
    disabled?: boolean
    isLeaf?: boolean
}

export type SaResourceTreeProps = {
    isSlideBar?: boolean
    value?: React.Key[]
    showOperation?: boolean
    onChange?: (value: React.Key[]) => void
    disabled?: boolean
    containerWidth?: number
    background?: string
    maxHeight?: number
    draggableFromParent?: boolean
}

export type RelationShip = {
    parentId: number
    childrenIds: number[]
}

export type AgentItem = {
    id: number,
    agentLabel: string,
    uuid: string,
    name: string,
    status: number,
    executorCount: number,
    createTime: number,
    lastHeartbeatTime: number,
    note: string,
    type: number,
    version: AnyType,
    groupId: number,
    tempData: number,
    labelId: number
}

export type Input = {
    time: number,
    value: string
}
export type NetworkCardVos = {
    ip: string,
    mac: string,
    name: string
}
export type DiskVos = {
    diskUnit: string,
    diskUsed: number,
    diskUsedRate: number,
    diskUsedRateUnit: string,
    diskVolume: number,
    name: string
}

export type AgentDetail = {
    id: number,
    agentPath: string,
    agentUser: string,
    type?: AGENT_TYPE,
    bandwidthMonitor: {
        currInput: number,
        currOutput: number,
        inputList: Input[],
        monitorUnit: string,
        outputList: Input[]
    },
    cpuCount: string,
    itUpgradeable: boolean,
    ip: string,
    cpuMonitor: {
        category: string,
        currUsed: number,
        list: Input[],
        monitorUnit: string,
        propertyUnit: string,
        total: number
    },
    diskFlowMonitor: {
        currInput: number,
        currOutput: number,
        inputList: Input[],
        outputList: Input[]
    },
    diskVolume: string,
    diskVos: DiskVos[],
    executorCount: number,
    hostName: string,
    memory: string,
    memoryMonitor: {
        category: string,
        currUsed: string,
        list: Input[],
        monitorUnit: string,
        propertyUnit: string,
        total: number,
        name: string
    },
    name: string,
    networkCardVos: NetworkCardVos[],
    note: string,
    status: AGENT_STATUS_ENUM,
    systemType: string,
    uuid: string,
    version: string
}

export type GenericAsyncThunk = AsyncThunk<unknown, unknown, AnyType>
export type PendingAction = ReturnType<GenericAsyncThunk['pending']>
export type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
export type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

export type ShutdownOrRebootConfigFormType = {
    time: number
}

export type DeleteAgentConfigFormType = {
    password: string
}
export type TargetResourceItem = {
    targetUuid: StringOrNumber,
    targetResourceName: string
}
export type ScriptContentType = {
    scriptLanguage: string,
    scriptContents: string
}

export type DataSourceType = {
    id: React.Key;
    title?: string;
    decs?: string;
    state?: string;
    created_at?: string;
    update_at?: string;
    children?: DataSourceType[];
};
export type ExecuteScriptForm = {
    name: string,
    scriptName: string,
    scriptType: SCRIPT_TYPE_ENUM,
    currentScript: string,
    scriptContent: ScriptContentType
    timeoutValue: number
    targetResourceList: TargetResourceItem[],
    table: DataSourceType[];
}

export type ScriptParam = {
    defaultValue: string
    name: string
    options: AnyType[]
    description: string
    type: string
    required: boolean
}
export type ScriptItem = {
    id: number
    name: string
    version: number
    category: number
    os: string
    language: string
    languageDependencies: { 'centos': '7' }
    description: string
    scope: string
    params: ScriptParam[]
    script: string
    recommendedDockerImageUrl: string
    createTime: string
    createUser: string
    modifiedTime: string
    modifiedUser: string
    versionName: null
}

export type RapidExecutionParamsType = Pick<ExecuteScriptForm, 'name' | 'targetResourceList' | 'currentScript'> & {
    type: number,
    stageScriptBean: ScriptContentType & {
        scriptName: string,
        timeoutValue: number,
        scriptType: SCRIPT_TYPE_ENUM,
    },
}

// 当前 select tree类型
export enum SelectTreeRole {
    SIDE_BAR,
    ADDING_AGENT,
    AGENT_GROUP_OPERATE
}
