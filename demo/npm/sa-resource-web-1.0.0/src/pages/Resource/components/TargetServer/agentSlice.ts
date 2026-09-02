import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from '@src/request/fetch'
import { AGENT_TYPE, SERVICE_UNIT } from '@src/constant'
import urlJoin from 'url-join'
import { assembleRequestUrl, isFulfilledAction, isPendingAction, isRejectedAction } from '@src/utils'
import { GLOBAL_URLS } from '../../constants/apis'

export const agentNameSpace = 'agent'

type Agent = {
    labelId: number
    jarDownload: string
    runCommand: string
    startShell: string
    origin: string
    serverArg: string
    jarUrl: string
    runningTaskCount: number
    waitingTaskCount: number
    companyUuid: NumberOrNull
    groupType: NumberOrNull
    groupName: StringOrNull
    currentVersion: StringOrNull
    latestVersion: string
    cpuUsedRate: NumberOrNull
    memoryUsedRate: NumberOrNull
    status: string
    note: string
    hiGroup: null
    executorCount: number
    sendEmail: null
    type: string
    uuid: string
    createTime: string
    name: string
    title?: string
}

type LabelType = {
    id: number
    name: string
    status: number
    sortIndex: number
}

type Label = {
    id: number
    name: string
    displayName: string
    createTime: string
    deleteStatus: boolean
    description: string
    purpose: number
    labelAgentRels: null
    type: number
    agentEntities: null
    companyUuid: null
    groupName: string
    origin: string
    authorizeProjects: string []
    groupType: number
    labelType: number
    registerAgentNum: number
    activeAgentNum: number
    oldDisplayName: null
    labelTypeIdList: null
    labelTypeList: LabelType[]
}

type AgentState = {
    labelName: string
    labelList: Label[]
    agentList: Agent[]
    loading: boolean
}

export const getAgentList = createAsyncThunk(
    urlJoin(agentNameSpace, 'getAgentList'),
    async ({
        type,
        agentName
    }: { type: AGENT_TYPE, agentName: string }) => {
        const res = await request({
            url: assembleRequestUrl(GLOBAL_URLS.AGENTS),
            params: {
                serviceUnit: SERVICE_UNIT.Opera,
                type,
                agentName
            }
        })
        const { data: list } = res as unknown as { data: Agent[] }

        return { agentList: list }
    }
)

export const getLabelList = createAsyncThunk(
    urlJoin(agentNameSpace, 'getLabelList'),
    async ({
        labelName,
        type
    }: { labelName: string, type: AGENT_TYPE }) => {
        const res = await request({
            url: assembleRequestUrl(GLOBAL_URLS.LABELS),
            params: {
                labelName,
                serviceUnit: SERVICE_UNIT.Opera,
                type
            }
        })
        const { data: list } = res as unknown as { data: Label[] }

        return { labelList: list }
    }
)

const agentSlice = createSlice({
    name: agentNameSpace,
    initialState: {
        labelName: '',
        agentList: [],
        labelList: [],
        type: AGENT_TYPE.LINUX,
        loading: false
    },
    reducers: {
        updateLabelName: (state, action) => {
            state.labelName = action.payload
        },
        updateType: (state, action) => {
            state.type = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAgentList.fulfilled, (state: AgentState, action) => {
                state.agentList = action.payload.agentList
            })
            .addCase(getLabelList.fulfilled, (state: AgentState, action) => {
                state.labelList = action.payload.labelList
            })
            .addMatcher(isPendingAction, (state) => {
                state.loading = true
            })
            .addMatcher(isRejectedAction, (state) => {
                state.loading = false
            })
            .addMatcher(isFulfilledAction, (state) => {
                state.loading = false
            })
    }
})

export const {
    updateLabelName,
    updateType
} = agentSlice.actions
export default agentSlice.reducer
