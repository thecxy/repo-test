import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    DEFAULT_SUCCESS_MESSAGE,
    REQUEST_CODE,
    REQUEST_METHODS,
    REQUEST_URL_TYPES,
    UPDATE_STRATEGIES,
    UPDATE_TYPE_RADIOS
} from '@src/constant'
import { FETCH_UPDATE_CONFIG, MODIFY_UPDATE_CONFIG } from '@src/pages/Resource/constants/apis'
import { request } from '@src/request/fetch'
import { assembleRequestUrl, isFulfilledAction, isPendingAction, isRejectedAction } from '@src/utils'
import { getCompanyId } from '@src/utils/getRouteIds'
import { message } from 'antd'
import moment from 'moment'
import { Moment } from 'moment'
import urlJoin from 'url-join'

export const agentUpdateNameSpace = 'agentUpdate'
export const fetchUpdateConfig = createAsyncThunk(
    urlJoin(agentUpdateNameSpace, 'fetchUpdateConfig'),
    async () => {
        const res = await request({
            url: assembleRequestUrl(FETCH_UPDATE_CONFIG, REQUEST_URL_TYPES.MANAGER.label),
            params: {
                companyUuid: getCompanyId()
            }
        })
        const {
            data,
            code
        } = res
        return code === REQUEST_CODE.SUCCESS ? data : null
    }
)

export const modifyUpdateConfig = createAsyncThunk(
    urlJoin(agentUpdateNameSpace, 'modifyUpdateConfig'),
    async (params: UpdateAgentFormType) => {
        const res = await request({
            url: assembleRequestUrl(MODIFY_UPDATE_CONFIG, REQUEST_URL_TYPES.MANAGER.label),
            params,
            method: REQUEST_METHODS.POST
        })
        const {
            code
        } = res
        if (code === REQUEST_CODE.SUCCESS) {
            message.success(DEFAULT_SUCCESS_MESSAGE)
        }
    }
)

export type UpdateAgentFormType = {
    // 升级方式
    mode: number,
    companyUuid?: string,
    strategy?: number,
    startTime?: Moment | string,
    endTime?: Moment | string
}
type UpdateConfigType = {
    visible: boolean,
    loading: boolean,
} & UpdateAgentFormType

const initialState: UpdateConfigType = {
    visible: false,
    loading: false,
    mode: UPDATE_TYPE_RADIOS.AUTO.value,
    strategy: UPDATE_STRATEGIES.DEFAULT.value,
    startTime: '',
    endTime: '',
}
const agentUpdateSlice = createSlice({
    name: agentUpdateNameSpace,
    initialState,
    reducers: {
        updateVisible (state, action) {
            state.visible = action.payload
        },

    },
    extraReducers (builder) {
        builder
            .addCase(fetchUpdateConfig.fulfilled, (state, action) => {
                if (action.payload) {
                    const {
                        mode,
                        startTime,
                        endTime
                    } = action.payload as UpdateAgentFormType
                    state.mode = mode
                    if (mode === UPDATE_TYPE_RADIOS.MANUAL.value) {
                        state.startTime = moment(startTime, 'HH:mm:ss')
                        state.endTime = moment(endTime, 'HH:mm:ss')
                    }
                }
            })
            .addCase(modifyUpdateConfig.fulfilled, (state) => {
                state.visible = false
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

export const { updateVisible, } = agentUpdateSlice.actions

export default agentUpdateSlice.reducer

