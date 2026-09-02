import { RootState } from "@src/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
    agentDetailNameSpace,
    fetchDiskList,
    fetchDiskMonitorData,
    fetchMonitorData,
    getAgent,
    updateMonitorDetailVisible,
    updateShutdownVisible,
} from "@src/pages/AgentDetail/agentDetailSlice";
import { MonitorParams } from "@src/pages/AgentDetail/agentDetailTypes";
import {
    AGENT_DETAIL_CATEGORY,
    REQUEST_CODE,
    REQUEST_METHODS,
} from "@src/constant";
import { assembleRequestUrl, requestCallback } from "@src/utils";
import {
    FETCH_MONITOR_SORT_RULE,
    MODIFY_MONITOR_SORT,
} from "@src/pages/Resource/constants/apis";
import { request } from "@src/request/fetch";
import { isEmpty, pickBy } from "ramda";

export const useUuid = () => {
    const params = useParams();
    const { uuid } = params as { uuid: string };
    return uuid;
};

export const useAgentDetailData = () => {
    return useSelector((state: RootState) => state[agentDetailNameSpace]);
};
export const useAgentDetail = () => {
    const dispatch = useDispatch();
    const { currentAgentDetail, loading, detailTabs } = useAgentDetailData();
    const uuid = useUuid();
    useEffect(() => {
        if (uuid) {
          dispatch(getAgent(uuid));
        }
        return () => {
          // 初始化agent详情
          dispatch(getAgent(''));
        }
    }, [uuid]);
    return {
        uuid,
        detailTabs,
        loading,
        currentAgentDetail,
    };
};

export const useShutdownAgent = () => {
    const dispatch = useDispatch();
    const { shutdownVisible } = useSelector(
        (state: RootState) => state[agentDetailNameSpace]
    );

    const toggleShutdownVisible = () => {
        dispatch(updateShutdownVisible(!shutdownVisible));
    };

    return {
        shutdownVisible,
        toggleShutdownVisible,
    };
};

export const useMonitor = () => {
    const dispatch = useDispatch();
    const updateMonitor = (params: MonitorParams) => {
        dispatch(fetchMonitorData(params));
    };

    return {
        updateMonitor,
    };
};
export const useMountMonitor = () => {
    const uuid = useUuid();
    const { updateMonitor } = useMonitor();

    useEffect(() => {
        updateMonitor({ uuid });
    }, []);
};

export const useMonitorData = () => {
    const {
        cpuMonitor,
        bandwidthMonitor,
        memoryMonitor,
        diskMonitor,
        diskList,
        loading,
        diskLoading,
        currentDetailItemCategory,
        currentDetailItemIndex,
    } = useSelector((state: RootState) => state[agentDetailNameSpace]);
    const { CPU, DISK, MEMORY, BAND_WIDTH } = AGENT_DETAIL_CATEGORY;
    return {
        cpuMonitor,
        bandwidthMonitor,
        memoryMonitor,
        diskMonitor,
        diskList,
        loading,
        diskLoading,
        [CPU]: cpuMonitor,
        [DISK]: diskMonitor,
        [MEMORY]: memoryMonitor,
        [BAND_WIDTH]: bandwidthMonitor,
        currentDetailItemCategory,
        currentDetailItemIndex,
    };
};

export const useDisk = (params: MonitorParams) => {
    const { diskList } = useSelector(
        (state: RootState) => state[agentDetailNameSpace]
    );
    const dispatch = useDispatch();
    const uuid = useUuid();
    const [currentDisk, setCurrentDisk] = useState("");
    const handleChangeDisk = (disk: string) => {
        setCurrentDisk(disk);
    };
    useEffect(() => {
        dispatch(fetchDiskList(uuid));
    }, []);

    useEffect(() => {
        setCurrentDisk(diskList[0] || "");
    }, [diskList]);

    const handleFetchDiskMonitor = (
        currentDisk: string,
        params: MonitorParams
    ) => {
        dispatch(
            fetchDiskMonitorData({
                ...params,
                diskName: currentDisk,
            })
        );
    };

    useEffect(() => {
        if (currentDisk) {
            handleFetchDiskMonitor(currentDisk, params);
        }
    }, [params, currentDisk]);

    return {
        currentDisk,
        handleChangeDisk,
        handleFetchDiskMonitor
    };
};

export const useMonitorDetailVisible = () => {
    const { monitorDetailVisible } = useSelector(
        (state: RootState) => state[agentDetailNameSpace]
    );
    const dispatch = useDispatch();
    const toggleVisible = () => {
        dispatch(updateMonitorDetailVisible(!monitorDetailVisible));
    };
    return {
        visible: monitorDetailVisible,
        toggleVisible,
    };
};

export const useMonitorSort = () => {
    const [itemIndex, setItemIndex] = useState({
        cpuIndex: 1,
        memoryIndex: 2,
        bandwidthIndex: 3,
        diskIndex: 4,
    });
    const [sortId, setSortId] = useState<StringOrNumber | null>(null);
    const getMonitorSort = async () => {
        const res = await request({
            url: assembleRequestUrl(FETCH_MONITOR_SORT_RULE),
        });
        const { code, data } = res;
        if (code === REQUEST_CODE.SUCCESS) {
            const { bandwidthIndex, cpuIndex, diskIndex, memoryIndex, id } =
                data as {
                    [key: string]: number;
                };
            setSortId(id);
            setItemIndex({
                bandwidthIndex,
                cpuIndex,
                diskIndex,
                memoryIndex,
            });
        }
    };

    const setMonitorSort = async (params: AnyType) => {
        const res = await request({
            url: assembleRequestUrl(MODIFY_MONITOR_SORT),
            method: REQUEST_METHODS.POST,
            params: pickBy((data) => !isEmpty(data), {
                ...params,
                id: sortId,
            }),
        });
        requestCallback({
            res,
        });
    };
    useEffect(() => {
        getMonitorSort();
    }, []);
    return {
        itemIndex,
        setMonitorSort,
    };
};
