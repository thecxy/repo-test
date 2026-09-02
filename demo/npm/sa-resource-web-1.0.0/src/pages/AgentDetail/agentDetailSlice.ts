import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "@src/request/fetch";
import {
    assembleRequestUrl,
    // isFulfilledAction,
    // isPendingAction,
    // isRejectedAction
} from "@src/utils";
import {
    EDIT_AGENT,
    FETCH_AGENT,
    FETCH_BANDWIDTH_MONITOR,
    FETCH_CPU_MONITOR,
    FETCH_DISK_LIST,
    FETCH_DISK_MONITOR,
    FETCH_MEMORY_MONITOR,
} from "@src/pages/Resource/constants/apis";
import {
    AGENT_DETAIL_CATEGORY,
    REQUEST_CODE,
    REQUEST_METHODS,
} from "@src/constant";
import urlJoin from "url-join";
import { AgentDetail } from "@src/pages/Resource/resourceTypes";
import {
    CpuMonitorType,
    DetailTabs,
    MonitorParams,
} from "@src/pages/AgentDetail/agentDetailTypes";

export const defaultAgentDetail = {
    id: 0,
    agentPath: "",
    agentUser: "",
    itUpgradeable: false,
    ip: "",
    bandwidthMonitor: {
        currInput: 0,
        currOutput: 0,
        inputList: [
            {
                time: 0,
                value: "",
            },
        ],
        monitorUnit: "",
        outputList: [
            {
                time: 0,
                value: "",
            },
        ],
    },
    cpuCount: "",
    cpuMonitor: {
        category: "",
        currUsed: 0,
        list: [
            {
                time: 0,
                value: "",
            },
        ],
        monitorUnit: "",
        propertyUnit: "",
        total: 0,
    },
    diskFlowMonitor: {
        currInput: 0,
        currOutput: 0,
        inputList: [
            {
                time: 0,
                value: "",
            },
        ],
        outputList: [
            {
                time: 0,
                value: "",
            },
        ],
    },
    diskVolume: "",
    diskVos: [
        {
            diskUnit: "",
            diskUsed: 0,
            diskUsedRate: 0,
            diskUsedRateUnit: "",
            diskVolume: 0,
            name: "",
        },
    ],
    executorCount: 0,
    hostName: "",
    memory: "",
    memoryMonitor: {
        category: "",
        currUsed: "",
        list: [
            {
                time: 0,
                value: "",
            },
        ],
        monitorUnit: "",
        propertyUnit: "",
        total: 0,
        name: "",
    },
    name: "",
    networkCardVos: [
        {
            ip: "",
            mac: "",
            name: "",
        },
    ],
    note: "",
    status: 0,
    systemType: "",
    uuid: "",
    version: "",
};

const defaultMonitorInfo = {
    endTime: "",
    monitorList: [
        {
            avgValue: 0,
            category: "",
            description: "",
            list: [
                {
                    time: 0,
                    value: "",
                },
            ],
            maxValue: 0,
            minValue: 0,
            monitorUnit: "",
        },
    ],
    startTime: "",
    timeUnit: "",
};
type SliceData = {
    currentAgentDetail: AgentDetail;
    loading: boolean;
    shutdownVisible: boolean;
    diskList: string[];
    cpuMonitor: CpuMonitorType;
    memoryMonitor: CpuMonitorType;
    diskMonitor: CpuMonitorType;
    bandwidthMonitor: CpuMonitorType;
    monitorDetailVisible: boolean;
    currentDetailItemIndex: number;
    currentDetailItemCategory: AGENT_DETAIL_CATEGORY;
    detailTabs: DetailTabs;
    date: [NumberOrNull, NumberOrNull];
    diskLoading: boolean
};
const initialState: SliceData = {
    currentAgentDetail: defaultAgentDetail,
    loading: false,
    diskLoading: false,
    shutdownVisible: false,
    diskList: [],
    cpuMonitor: defaultMonitorInfo,
    memoryMonitor: defaultMonitorInfo,
    diskMonitor: defaultMonitorInfo,
    bandwidthMonitor: defaultMonitorInfo,
    // shutdownVisible: true,
    monitorDetailVisible: false,
    currentDetailItemCategory: AGENT_DETAIL_CATEGORY.CPU,
    currentDetailItemIndex: 0,
    detailTabs: DetailTabs.outline,
    date: [null, null],
};
export const agentDetailNameSpace = "agentDetail";
export const getAgent = createAsyncThunk(
    urlJoin(agentDetailNameSpace, "getAgent"),
    async (uuid: string) => {
        // 如果uuid为空，直接返回null。在调用getAgent时，useeffect的rturn调用传空字符串，用来清除数据
        if(!uuid) return null;
        
        const res = await request({
            url: assembleRequestUrl(FETCH_AGENT.expand({ uuid })),
        });
        const { code, data } = res;
        return code === REQUEST_CODE.SUCCESS ? data : null;
    }
);
export const editAgent = createAsyncThunk(
    urlJoin(agentDetailNameSpace, "editAgent"),
    async ({ params, callback }: { params: AnyType; callback: () => void }) => {
        const res = await request({
            url: assembleRequestUrl(EDIT_AGENT),
            method: REQUEST_METHODS.PUT,
            params,
        });
        const { code, data } = res;
        if (code === REQUEST_CODE.SUCCESS) {
            callback();
            return data;
        } else {
            return [];
        }
    }
);

export const fetchDiskList = createAsyncThunk(
    urlJoin(agentDetailNameSpace, "fetchDiskList"),
    async (uuid: string) => {
        const res = await request({
            url: assembleRequestUrl(FETCH_DISK_LIST),
            params: { uuid },
        });
        const { code, data } = res;
        return code === REQUEST_CODE.SUCCESS ? data : null;
    }
);
export const fetchDiskMonitorData = createAsyncThunk(
    urlJoin(agentDetailNameSpace, "fetchDiskMonitorData"),
    async (params: MonitorParams) => {
        const res = await request({
            url: assembleRequestUrl(FETCH_DISK_MONITOR),
            params,
        });
        const { code, data } = res;
        return code === REQUEST_CODE.SUCCESS ? data : null;
    }
);
export const fetchMonitorData = createAsyncThunk(
    urlJoin(agentDetailNameSpace, "fetchMonitorData"),
    async (params: MonitorParams) => {
        const fetchCpu = request({
            url: assembleRequestUrl(FETCH_CPU_MONITOR),
            params,
        });
        const fetchMemory = request({
            url: assembleRequestUrl(FETCH_MEMORY_MONITOR),
            params,
        });
        const fetchBandWidth = request({
            url: assembleRequestUrl(FETCH_BANDWIDTH_MONITOR),
            params,
        });
        return await Promise.all([fetchBandWidth, fetchMemory, fetchCpu]);
    }
);
const agentDetailSlice = createSlice({
    name: agentDetailNameSpace,
    initialState,
    reducers: {
        updateShutdownVisible(state, action) {
            state.shutdownVisible = action.payload;
        },
        updateMonitorDetailVisible(state, action) {
            state.monitorDetailVisible = action.payload;
        },
        updateCurrentDetailItemIndex(state, action) {
            state.currentDetailItemIndex = action.payload;
        },
        updateCurrentDetailItemCategory(state, action) {
            state.currentDetailItemCategory = action.payload;
        },
        updateDetailTabs(state, action) {
            state.detailTabs = action.payload;
        },
        updateDate(state, action) {
            state.date = action.payload;
        },
    },
    extraReducers(builder) {
        // 处理agent
        builder.addCase(getAgent.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAgent.fulfilled, (state, action) => {
            if (action.payload) {
                state.currentAgentDetail = action.payload as unknown as AgentDetail;
            } else {
                state.currentAgentDetail = defaultAgentDetail as AgentDetail;
            }
            state.loading = false
        });

        // 请求磁盘下拉列表
        builder.addCase(fetchDiskList.fulfilled, (state, action) => {
            if (action.payload) {
                state.diskList = action.payload as unknown as string[];
            }
        });

        // 请求监控数据
        builder.addCase(fetchMonitorData.pending,(state)=>{
            state.loading = true
        })
        builder.addCase(fetchMonitorData.fulfilled, (state, action) => {
            if (action.payload) {
                const [bandWidth, memory, cpu] = action.payload;
                state.cpuMonitor = cpu.data as CpuMonitorType;
                state.bandwidthMonitor = bandWidth.data as CpuMonitorType;
                state.memoryMonitor = memory.data as CpuMonitorType;
            }
            state.loading = false
        });

        // 请求监控磁盘数据
        builder.addCase(fetchDiskMonitorData.pending,(state)=>{
            state.diskLoading = true
        })
        builder.addCase(fetchDiskMonitorData.fulfilled, (state, action) => {
            if (action.payload) {
                state.diskMonitor = action.payload as CpuMonitorType;
            }
            state.diskLoading = false
        });
        // .addMatcher(isPendingAction, (state) => {
        //     state.loading = true
        // })
        // .addMatcher(isRejectedAction, (state) => {
        //     state.loading = false
        // })
        // .addMatcher(isFulfilledAction, (state) => {
        //     state.loading = false
        // })
    },
});

export const {
    updateShutdownVisible,
    updateMonitorDetailVisible,
    updateCurrentDetailItemCategory,
    updateCurrentDetailItemIndex,
    updateDetailTabs,
    updateDate,
} = agentDetailSlice.actions;

export default agentDetailSlice.reducer;
