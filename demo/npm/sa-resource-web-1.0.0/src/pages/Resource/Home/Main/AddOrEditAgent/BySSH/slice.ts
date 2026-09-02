import I18N from '@src/i18n'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { nextProcess, previousProcess, toggleAddAgentModal } from '@src/pages/Resource/resourceSlice'
import { InitialValues, Params } from './FirstStep/firstStep'
import { defaultFirstProgressValues } from '@src/pages/Resource/Home/Main/AddOrEditAgent/BySSH/FirstStep/FirstProgress'
import { request } from '@src/request/fetch'
import { assembleRequestUrl, isFulfilledAction, isRejectedAction, isPendingAction } from '@src/utils'
import {
    INSTALL_AGENT_REMOTE,
    PUT_MORE_CONFIG_FOR_REMOTE_INSTALL,
    REMOTE_LINK_TEST
} from '@src/pages/Resource/constants/apis'
import { REQUEST_CODE, REQUEST_METHODS } from '@src/constant'
import urlJoin from 'url-join'
import { message } from 'antd'
import { ResponseData, SSHSliceType } from '../addOrEditTypes'
import { ROOT_TREE_NODE } from '@src/pages/Resource/constants/constant'

const defaultResponseData = {
    agentLabel: '',
    createTime: 0,
    createUser: '',
    executorCount: -1,
    groupId: 0,
    id: 0,
    labelId: null,
    lastHeartbeatTime: 0,
    name: '',
    note: null,
    status: 0,
    tempData: 0,
    type: 0,
    updateTime: 0,
    uuid: '',
    version: null,
}

const initialState: SSHSliceType = {
    loading: false,
    testLoading: false,
    goBackFromNextProcessOrStep: false,
    firstRequestData: {
        agentUuid: '',
        executorCount: 0,
        ip: '',
        password: '',
        port: 0,
        type: 0,
        user: ''
    },
    firstProgressFormValues: defaultFirstProgressValues,
    firstResponseData: defaultResponseData,
    secondResponseData: defaultResponseData,
    currentAgentGroupId: ROOT_TREE_NODE.id
}

export const bySSHSliceNameSpace = 'bySSH'

export const handleExtraConfig = async (params: { executorCount?: NumberOrNull, uuid?: StringOrNull }) => {
    return request({
        url: assembleRequestUrl(PUT_MORE_CONFIG_FOR_REMOTE_INSTALL),
        method: REQUEST_METHODS.PUT,
        params,
    })
}
export const submitFirstStep = createAsyncThunk(
    urlJoin(bySSHSliceNameSpace, 'submitFirstStep'),
    async ({
        params,
        values,
        needExtraConfig,
    }: {
        params: Params,
        values: InitialValues,
        needExtraConfig: boolean
    }) => {
        const res = await request({
            url: assembleRequestUrl(INSTALL_AGENT_REMOTE),
            method: REQUEST_METHODS.POST,
            params
        })
        const {
            code,
            data
        } = res
        if (code === REQUEST_CODE.SUCCESS) {
            const { uuid } = data as unknown as { uuid: string }
            if (!needExtraConfig) {
                return {
                    data,
                    params: values
                }
            }
            const res = await handleExtraConfig({
                uuid,
                executorCount: Number(params.executorCount)
            })
            const {
                code,
                data: innerData
            } = res
            if (code === REQUEST_CODE.SUCCESS) {
                return {
                    data: innerData,
                    params: values
                }
            }

        } else {
            return {
                params: values
            }
        }
    })

export const remoteLinkTest = createAsyncThunk(
    urlJoin(bySSHSliceNameSpace, 'remoteLinkTest'),
    async (params: Params) => {
        const res = await request({
            url: assembleRequestUrl(REMOTE_LINK_TEST),
            method: REQUEST_METHODS.POST,
            params
        })
        const { code } = res
        if (code === REQUEST_CODE.SUCCESS) {
            message.success(I18N.Home.Main.ceShiTongGuo)
        }
    }
)

const bySSHSlice = createSlice({
    name: bySSHSliceNameSpace,
    initialState,
    reducers: {
        updateSecondResponseData (state, action) {
            state.secondResponseData = action.payload
        },
        updateCurrentAgentGroupId (state, action) {
            state.currentAgentGroupId = action.payload
        }
    },
    extraReducers (builder) {
        builder.addCase(submitFirstStep.fulfilled, (state, action) => {
            if (action.payload) {
                const {
                    data,
                    params
                } = action.payload as unknown as {
                    data: ResponseData
                    params: Params
                }
                state.firstProgressFormValues = params
                state.firstResponseData = data
                state.firstRequestData.agentUuid = data.uuid
                state.goBackFromNextProcessOrStep = false
            }
        })
        builder.addCase(toggleAddAgentModal, (state, action) => {
            // 重置缓存数据
            if (!action.payload) {
                state.firstProgressFormValues = initialState.firstRequestData
                state.firstResponseData = initialState.firstResponseData
                state.goBackFromNextProcessOrStep = false
            }
        })
        builder.addCase(remoteLinkTest.pending, (state) => {
          state.testLoading = true
        })
        builder.addCase(remoteLinkTest.fulfilled, (state) => {
          state.testLoading = false
        })
        builder.addCase(previousProcess, (state) => {
            state.goBackFromNextProcessOrStep = true
        })
        builder.addCase(nextProcess, (state) => {
            state.goBackFromNextProcessOrStep = false
        })
        builder.addMatcher(isPendingAction, (state) => {
            state.loading = true
        }).addMatcher(isRejectedAction, (state) => {
            state.loading = false
        }).addMatcher(isFulfilledAction, (state) => {
            state.loading = false
        })
    },
})

export const {
    updateSecondResponseData,
    updateCurrentAgentGroupId
} = bySSHSlice.actions

export default bySSHSlice.reducer
