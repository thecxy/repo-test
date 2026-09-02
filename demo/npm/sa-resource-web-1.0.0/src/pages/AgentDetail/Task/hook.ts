import { RootState } from "@src/store";
import {
    taskNameSpace,
    updateActiveKey,
    updatePagination,
} from "@src/pages/AgentDetail/Task/taskSlice";
import { useDispatch, useSelector } from "react-redux";
import { useUuid } from "@src/pages/AgentDetail/hook";
import { AGENT_STATUS_VALUE } from "./constant";

export const useTask = () => {
    const dispatch = useDispatch();
    const handleChangeTab = (e: string) => {
        dispatch(updateActiveKey(e));
    };
    const { activeKey } = useSelector(
        (state: RootState) => state[taskNameSpace]
    );
    return {
        handleChangeTab,
        activeKey,
    };
};

export const useRequestData = () => {
    const { pageSize, currentPage, manualRefresh, activeKey } = useSelector(
        (state: RootState) => state[taskNameSpace]
    );
    const agentUuid = useUuid();

    return {
        pageSize,
        currentPage,
        agentUuid,
        status:
            Number(activeKey) === AGENT_STATUS_VALUE.SUCCESS
                ? `${AGENT_STATUS_VALUE.SUCCESS},${AGENT_STATUS_VALUE.FAILED}`
                : activeKey,
        manualRefresh,
    };
};

export const usePagination = () => {
    const tableData = useSelector((state: RootState) => state[taskNameSpace]);
    const dispatch = useDispatch();
    const { total, pageSize, currentPage } = tableData;
    const onChange = (current: number, pageSize: number) => {
        dispatch(
            updatePagination({
                current,
                pageSize,
            })
        );
    };
    return {
        total,
        pageSize,
        current: currentPage,
        onChange,
    };
};
