import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from '@src/request/fetch'
import { assembleRequestUrl } from '@src/utils'
import { CANCEL_AGENT, FETCH_TASK_LIST } from '@src/pages/Resource/constants/apis'
import urlJoin from 'url-join'
import { DEFAULT_PAGINATION, REQUEST_CODE, REQUEST_METHODS, REQUEST_URL_TYPES } from '@src/constant'
import { AGENT_STATUS_VALUE, TABS } from './constant'
import { ParamsType } from '@ant-design/pro-components'
import { isEmpty, omit, pickBy } from 'ramda'
import { AgentType } from '@src/pages/Resource/resourceTypes'

export const taskNameSpace = 'task'

export type Data = {
    createTime: number,
    endTime: number,
    executionDuration: number,
    id: number,
    startTime: number,
    status: AGENT_STATUS_VALUE,
    uuid: string
}

type SliceType = {
    pageSize: number,
    currentPage: number,
    loading: boolean,
    dataList: Data[],
    activeKey: AGENT_STATUS_VALUE,
    manualRefresh: boolean,
    dataCount: number,
    total: number
}

const initialState: SliceType = {
    pageSize: DEFAULT_PAGINATION.pageSize,
    currentPage: 1,
    total: 0,
    loading: false,
    dataList: [],
    activeKey: TABS.queue.key,
    manualRefresh: false,
    dataCount: 0,
}
type Params =
    ParamsType
    & { pageSize?: number | undefined; current?: number | undefined; status: AGENT_STATUS_VALUE; agentUuid: string }
export const updateTaskList = createAsyncThunk(
    urlJoin(taskNameSpace, 'updateTaskList'),
    async (params: Params) => {
        const {
            currentPage,
            agentUuid
        } = params

        const res = await request({
            url: assembleRequestUrl(FETCH_TASK_LIST.expand({ agentUuid })),
            params: pickBy((data) => !isEmpty(data), {
                ...omit(['current'], params),
                currentPage,
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
                data: list as unknown as Data[],
            }
        } else {
            return {
                success: false,
            }
        }
    }
)

export const cancelAgent = createAsyncThunk(
    urlJoin(taskNameSpace, 'cancelAgent'),
    async (jobUuid: string) => {
        const res = await request({
            url: assembleRequestUrl(CANCEL_AGENT, REQUEST_URL_TYPES.MANAGER.label),
            method: REQUEST_METHODS.POST,
            params: {
                jobUuid
            }
        })
        const {
            data,
            code
        } = res
        return code === REQUEST_CODE.SUCCESS ? data : null
    }
)
const taskSlice = createSlice({
    name: taskNameSpace,
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
        updateActiveKey (state, action) {
            state.activeKey = action.payload
            state.currentPage = 1
            state.pageSize = 10
        },
        // 当前action 的作用是手动更新tableData
        updateManualRefresh (state, action) {
            state.manualRefresh = action.payload
        },
    },
    extraReducers (builder) {
        builder.addCase(updateTaskList.fulfilled, (state, action) => {
            const {
                currentPage,
                data,
                total,
            } = action.payload as unknown as { currentPage: number, total: number, data: AgentType[] }
            state.dataCount = data.length
            state.total = total
            // 当前页数据为空时跳到前一页
            if (state.dataCount === 0 && state.currentPage > 1 && currentPage > 1) {
                state.currentPage -= 1
            }
        })
    }
})

export const {
    updatePagination,
    updateActiveKey,
    updateManualRefresh
} = taskSlice.actions

export default taskSlice.reducer

