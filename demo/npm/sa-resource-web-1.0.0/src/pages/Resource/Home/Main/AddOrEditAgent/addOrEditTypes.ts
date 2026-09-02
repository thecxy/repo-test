import { REMOTE_INSTALL_STATUS } from '@src/constant/constantWithReactFC'
import { AGENT_TYPE } from '@src/constant'
import { InitialValues, Params } from '@src/pages/Resource/Home/Main/AddOrEditAgent/BySSH/FirstStep/firstStep'

export type StatusData = {
    installStatus: REMOTE_INSTALL_STATUS
    sortIndex: number
    stepMessage: null | string
    stepTitle: string
    updateTime: number
}
export type ManualScript = {
    commandList: string[],
    uuid: string,
    id: number,
    systemType: AGENT_TYPE,
    tips: string
}
export type SliceType = {
    loading: boolean,
    getManualScriptLoading: boolean,
    goBackFromNextProcessOrStep: boolean,
    manualScripts: {
        [key in AGENT_TYPE]: Omit<ManualScript, 'systemType'>
    },
    statusDataList: StatusData[] | null,
    nextButtonDisabled: boolean
}

export type ResponseData = {
    agentLabel: string,
    createTime: number,
    createUser: string,
    executorCount?: number,
    groupId: number,
    id: number,
    labelId: null | number,
    lastHeartbeatTime: number,
    name: string,
    note: null | string,
    status: number,
    tempData: number,
    type: number,
    updateTime: number,
    uuid: string,
    version: null,
}
export type SSHSliceType = {
    loading: boolean
    testLoading: boolean,
    goBackFromNextProcessOrStep: boolean
    firstProgressFormValues: InitialValues
    firstRequestData: Params
    firstResponseData: ResponseData,
    secondResponseData: ResponseData,
    currentAgentGroupId: number
}

export type FormType = {
    authorizeProjects: string[],
    name: string,
    // executorCount: 0, // 并发限制
    // id: 0,
    labelId: number[], // 主机组id
    note: string, // 主机描述
    serviceUnitIds: number[], // serviceUnitIds	服务单元id集合，多个用英文逗号分隔
    // type: 0 // 操作系统类型：1:Windows;2:Linux
}
