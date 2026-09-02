import I18N from '@src/i18n'
import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AgentType } from '@src/pages/Resource/resourceTypes'
import urlJoin from 'url-join'
import { RootState } from '@src/store'
import { DELETE_AGENTS, FETCH_AGENTS } from '@src/pages/Resource/constants/apis'
import { request } from '@src/request/fetch'
import { DEFAULT_PAGINATION, REQUEST_CODE, REQUEST_METHODS, SPLIT_SYMBOL, AGENT_STATUS_ENUM } from '@src/constant'
import { ParamsType } from '@ant-design/pro-components'
import { isEmpty, omit, pickBy } from 'ramda'
import { message } from 'antd'
import { assembleRequestUrl, isFulfilledAction, isPendingAction, isRejectedAction } from '@src/utils'
import { getItem, setItem } from '@src/utils/storage'

export const resourceTableNameSpace = "resourceTable";

type Params = ParamsType & {
    pageSize?: number | undefined;
    current?: number | undefined;
    keyword?: string | undefined;
    agentIdList?: number[];
};

export const getAgents = createAsyncThunk(
    urlJoin(resourceTableNameSpace, "getAgents"),
    async (params: Params) => {
        const { current } = params;

        const res = await request({
            url: assembleRequestUrl(FETCH_AGENTS),
            params: pickBy((data) => !isEmpty(data), {
                // ...params,
                ...omit(["current", "manualRefresh"], params),
                currentPage: current,
            }),
        });
        const { code, data: result } = res;
        if (code === REQUEST_CODE.SUCCESS) {
            const { list = [], total, currentPage } = result;
            return {
                success: true,
                total,
                currentPage,
                data: list as unknown as AgentType[],
            };
        } else {
            return {
                success: false,
            };
        }
    }
);

export const deleteAgents = createAsyncThunk(
    urlJoin(resourceTableNameSpace, "deleteAgents"),
    async ({ idList, password }: { idList: number[]; password?: string }) => {
        const res = await request({
            url: assembleRequestUrl(DELETE_AGENTS),
            params: {
                idList: idList.join(SPLIT_SYMBOL),
                password,
            },
            method: REQUEST_METHODS.DELETE,
        });
        const { code, data } = res;
        if (code === REQUEST_CODE.SUCCESS) {
            const totalLength = idList.length
            const { failures } = data as { failures: number[] }
            const failureLength = failures.length
            message.success(I18N.get(I18N.Resource.resourceTableSlice.shanChuChengGongT, { val1: totalLength - failureLength,
val2: failureLength }))
            return true
        }
        return false;
    }
);
const resourceTableAdapter = createEntityAdapter<AgentType>();
const nameKey = `${resourceTableNameSpace}name`
const ipKey = `${resourceTableNameSpace}ip`
const osKey = `${resourceTableNameSpace}os`
const agentStatusKey = `${resourceTableNameSpace}agentStatus`
const agentStatus = getItem(agentStatusKey) === '' ? AGENT_STATUS_ENUM.ALL : getItem(agentStatusKey) as unknown as AGENT_STATUS_ENUM - 0
const initialState = resourceTableAdapter.getInitialState({
    currentPage: 1,
    name: getItem(nameKey)||"",
    ip: getItem(ipKey)||"",
    os: getItem(osKey)||"",
    agentStatus,
    pageSize: DEFAULT_PAGINATION.pageSize,
    total: 0,
    loading: false,
    selectedRowKeys: [],
    selectedRows: [],
    dataCount: 0,
    manualRefresh: false,
});
const resourceSlice = createSlice({
    name: resourceTableNameSpace,
    initialState,
    reducers: {
        updatePagination(state, action) {
            const { current: currentPage, pageSize } = action.payload;
            state.currentPage = currentPage;
            state.pageSize = pageSize;
        },
        // 当前action 的作用是手动更新tableData
        updateManualRefresh(state, action) {
            state.manualRefresh = action.payload;
        },
        updateKeyword(state, action) {
            const name = action.payload
            state.name = name;
            setItem(nameKey,name)
        },
        updateSelectRows(state, action) {
            const { selectedRowKeys, selectedRows } = action.payload;
            state.selectedRows = selectedRows;
            state.selectedRowKeys = selectedRowKeys;
        },
        updateColumn: resourceTableAdapter.updateOne,
        updateIp(state, action) {
            const ip = action.payload
            state.ip = ip;
            setItem(ipKey,ip)
        },
        updateOs(state, action) {
            const os = action.payload
            state.os = os;
            setItem(osKey,os)
        },
        updateAgentStatus(state, action) {
            const agentStatus = action.payload;
            state.agentStatus = agentStatus;
            setItem(agentStatusKey,agentStatus)
        },
    },
    extraReducers(builder) {
        builder
            .addCase(deleteAgents.fulfilled,(state)=>{
                state.manualRefresh = !state.manualRefresh
            })
            .addCase(getAgents.fulfilled, (state, action) => {
            if (action.payload) {
                const { currentPage, data, total } =
                    action.payload as unknown as {
                        currentPage: number;
                        total: number;
                        data: AgentType[];
                    };
                state.dataCount = data.length;
                state.total = total;
                // 当前页数据为空时跳到前一页
                if (
                    state.dataCount === 0 &&
                    state.currentPage > 1 &&
                    currentPage > 1
                ) {
                    state.currentPage -= 1;
                }
            }
        });
        builder
            .addMatcher(isPendingAction, (state) => {
                state.loading = true;
            })
            .addMatcher(isRejectedAction, (state) => {
                state.loading = false;
            })
            .addMatcher(isFulfilledAction, (state) => {
                state.loading = false;
            });
    },
});

export const {
    updateKeyword,
    updatePagination,
    updateSelectRows,
    updateIp,
    updateOs,
    updateAgentStatus,
    updateManualRefresh,
} = resourceSlice.actions;
export default resourceSlice.reducer;

export const { selectAll: selectAllResource } =
    resourceTableAdapter.getSelectors(
        (state: RootState) => state[resourceTableNameSpace]
    );
