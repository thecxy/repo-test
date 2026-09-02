import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from '@src/request/fetch'
import { assembleRequestUrl, isFulfilledAction, isPendingAction, isRejectedAction } from '@src/utils'
import {
    ENTIRELY_RE_EXECUTE,
    FETCH_EXECUTE_DETAIL,
    FETCH_EXECUTE_LIST,
    NEGLECT_ERRORS
} from '@src/pages/Resource/constants/apis'
import urlJoin from 'url-join'
import { DEFAULT_PAGINATION, REQUEST_CODE, REQUEST_METHODS, REQUEST_URL_TYPES } from '@src/constant'
import { ParamsType } from '@ant-design/pro-components'
import { isEmpty, omit, pickBy } from 'ramda'
import { AgentType } from '@src/pages/Resource/resourceTypes'
import { ExecutionDetail, ExecutiveData, MONITOR_TIME_INDEX, SliceType } from './executiveTypes'

export const executiveNameSpace = 'executive'

const initialState: SliceType = {
    pageSize: DEFAULT_PAGINATION.pageSize,
    currentPage: 1,
    loading: false,
    dataList: [],
    manualRefresh: false,
    dataCount: 0,
    total: 0,
    executeDetailVisible: false,
    currentExecute: null,
    currentMonitorTimeIndex:MONITOR_TIME_INDEX.ACTUAL_TIME,
    timeInterval:[null,null]
}

type Params =
    ParamsType
    & { pageSize?: number | undefined; current?: number | undefined; agentUuid: string }
export const updateExecutiveList = createAsyncThunk(
    urlJoin(executiveNameSpace, 'updateExecutiveList'),
    async (params: Params) => {
        const {
            current,
            agentUuid
        } = params

        const res = await request({
            url: assembleRequestUrl(FETCH_EXECUTE_LIST, REQUEST_URL_TYPES.NOAH.label),
            params: pickBy((data) => !isEmpty(data), {
                ...omit(['current'], params),
                currentPage: current,
                agentUuid,
            })
        })

        const {
            code,
            data: result
        } = res
        if (code === REQUEST_CODE.SUCCESS) {
            const {
                list = [],
                total,
                currentPage
            } = result

            return {
                success: true,
                total,
                currentPage,
                data: list as unknown as ExecutiveData[],
            }
        } else {
            return {
                success: false,
            }
        }
    }
)

export const entirelyRetry = createAsyncThunk(
    urlJoin(executiveNameSpace, 'entirelyRetry'),
    async (id: number) => {
        const res = await request({
            url: assembleRequestUrl(ENTIRELY_RE_EXECUTE.expand({ id }), REQUEST_URL_TYPES.NOAH.label),
            method: REQUEST_METHODS.POST,
        })
        const {
            code,
            data
        } = res
        return code === REQUEST_CODE.SUCCESS ? data : null
    }
)

export const neglectErrors = createAsyncThunk(
    urlJoin(executiveNameSpace, 'neglectErrors'),
    async (id: number) => {
        const res = await request({
            url: assembleRequestUrl(NEGLECT_ERRORS.expand({ id }), REQUEST_URL_TYPES.NOAH.label),
            method: REQUEST_METHODS.POST,
        })
        const {
            code,
            data
        } = res
        return code === REQUEST_CODE.SUCCESS ? data : null
    }
)

export const getExecutiveDetail = createAsyncThunk(
    urlJoin(executiveNameSpace, 'getExecutiveDetail'),
    async (id: StringOrNumber) => {
        const res = await request({
            url: assembleRequestUrl(FETCH_EXECUTE_DETAIL.expand({ id }), REQUEST_URL_TYPES.NOAH.label),
        })
        const {
            code,
            data
        } = res
        return code === REQUEST_CODE.SUCCESS ? data : null
    })

const executiveSlice = createSlice({
    name: executiveNameSpace,
    initialState,
    reducers: {
        updatePagination (state, action) {
            const {
                current: currentPage,
                pageSize
            } = action.payload
            state.currentPage = currentPage
            state.pageSize = pageSize
        },
        // 当前action 的作用是手动更新tableData
        updateManualRefresh (state, action) {
            state.manualRefresh = action.payload
        },
        updateExecuteDetailVisible (state, action) {
            state.executeDetailVisible = action.payload
        },
        updateCurrentExecute (state, action) {
            state.currentExecute = action.payload
        },
        updateCurrentMonitorTimeIndex (state, action) {
            state.currentMonitorTimeIndex = action.payload
        },
        updateTimeInterval (state,action){
            state.timeInterval = action.payload
        }
    },
    extraReducers (builder) {
        builder
            .addCase(updateExecutiveList.fulfilled, (state, action) => {
                const {
                    currentPage,
                    data,
                    total
                } = action.payload as unknown as { currentPage: number, total: number, data: AgentType[] }
                state.dataCount = data.length
                state.total = total
                // 当前页数据为空时跳到前一页
                if (state.dataCount === 0 && state.currentPage > 1 && currentPage > 1) {
                    state.currentPage -= 1
                }
            })
            .addCase(getExecutiveDetail.fulfilled, (state, action) => {
                if (action.payload) {
                    state.currentExecute = action.payload as unknown as ExecutionDetail
                }
            })
            .addCase(neglectErrors.fulfilled, (state) => {
                state.executeDetailVisible = false
            })
            .addCase(entirelyRetry.fulfilled, (state) => {
                state.executeDetailVisible = false
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
    updatePagination,
    updateManualRefresh,
    updateExecuteDetailVisible,
    updateCurrentExecute,
    updateCurrentMonitorTimeIndex,
    updateTimeInterval,
} = executiveSlice.actions

export default executiveSlice.reducer

