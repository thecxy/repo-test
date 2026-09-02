import { EXECUTE_STATUS_VALUE } from '@src/pages/AgentDetail/Task/constant'
import { Moment } from 'moment'

export type StageTriggerItemParams = {
    id: number
    triggerItemId: number
    stageConfirm: null
    stageFile: null
    stageScript: {
        scriptId: null
        scriptType: number
        scriptName:string
        scriptLanguage: string
        scriptContents: string
        scriptParams: string
        timeoutValue: number
        runtimeEnv: number
    }
    jobOutput: null
    stageConfirmResult: null
    targetResource: {
        id: number
        stageId: number
        targetUuid: string
        targetResourceName: string
        groupName: string
        groupType: number
        tenant: string
        userId: number
        updateTime: number
        status: number
    }
    storageFile: null
    inputDetail: null
    outputDetail: null
}
export type StageTriggerItem = {
    id: number
    stageTriggerId: number
    itemId: number
    type: number
    sortIndex: number
    runStatus: number
    saJobUuid: null
    logUuid: null
    logShowList: AnyType[]
    hasOvertime: null
    errorInfo: string
    beginTime: number
    endTime: number
    consumeTime: number
    allTaskSuccess: boolean
    stageTriggerItemParams: StageTriggerItemParams
}
export type StageTrigger = {
    id: number
    workTriggerId: number
    stageId: number
    name: string
    type: number
    sortIndex: number
    runStatus: number
    ignoreError: number
    errorInfo: null
    beginTime: number
    endTime: number
    consumeTime: number
    stageTriggerItemList: StageTriggerItem[]
}

export type ExecutionDetail = {
    id: number,
    workPlanId: number,
    name: string,
    describes: null,
    useTemp: number,
    runStatus: number,
    beginTime: number,
    endTime: number,
    consumeTime: number,
    errorInfo: null,
    userId: number,
    userName: string,
    groupName: string
    groupType: number
    tenant: string
    stageTriggerList: StageTrigger[]
    variateList: []
}

export type ExecutiveData = {
    consumeTime: number,
    workPlanId: number,
    beginTime: number,
    endTime: number,
    executionDuration: number,
    id: number,
    startTime: number,
    runStatus: EXECUTE_STATUS_VALUE,
    uuid: string
}

export type SliceType = {
    pageSize: number,
    currentPage: number,
    loading: boolean,
    dataList: ExecutiveData[],
    manualRefresh: boolean,
    dataCount: number,
    executeDetailVisible: boolean
    currentExecute: ExecutionDetail | null,
    total: number,
    currentMonitorTimeIndex: MONITOR_TIME_INDEX,
    timeInterval: Moment|null[]
}

export type Operation = {
    label: string,
    disabled?: boolean
    execution: ({ id }: { id: number }) => AnyType
}
export type ConsumeObj = {
    label: string,
    value: string | undefined
}
export type ContentExceptManualConfirmProps = {
    consumeObj: ConsumeObj,
    operations: Operation[],
    stepId: number,
}

export enum MONITOR_TIME_INDEX {
    DEFAULT_INDEX = -1,
    ACTUAL_TIME,
    HOURS24,
    DAYS7
}
