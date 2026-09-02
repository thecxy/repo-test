import React from "react";
import { debounceWith250ms } from "@src/utils";
import { useDispatch, useSelector } from "react-redux";
import { updateColumn } from "@src/pages/Resource/resourceSlice";
import {
    FilterValueType,
    HandleChangeColumn,
} from "@src/pages/Resource/resourceTypes";
import { RootState } from "@src/store";
import {
    resourceTableNameSpace,
    updateAgentStatus,
    updateIp,
    updateKeyword,
    updateOs,
    updatePagination,
} from "@src/pages/Resource/resourceTableSlice";
import { ROOT_TREE_NODE } from "@src/pages/Resource/constants/constant";
import { AGENT_STATUS_ENUM } from "@src/constant";
import { useAgentGroupData } from "@src/pages/Resource/components/AgentGroupTree/hook";
import { hasValue } from "@src/utils";

export const useSelectStatus = () => {
    const dispatch = useDispatch();
    const tableData = useSelector(
        (state: RootState) => state[resourceTableNameSpace]
    );

    const onChange = debounceWith250ms((target: number) => {
        dispatch(updateAgentStatus(target));
    });
    const reset = () => {
        dispatch(updateAgentStatus(AGENT_STATUS_ENUM.ALL));
    };
    return {
        agentStatus: tableData.agentStatus,
        onChange,
        reset,
        hasFilterSelect:
            hasValue(tableData.agentStatus) &&
            tableData.agentStatus !== AGENT_STATUS_ENUM.ALL,
    };
};

export const useInputFilter = () => {
    const dispatch = useDispatch();

    const tableData = useSelector(
        (state: RootState) => state[resourceTableNameSpace]
    );

    const { name, ip, os } = tableData;
    const { NAME, IP, OS } = FilterValueType;
    const generateHandler = (newValue: string, type: FilterValueType) => {
        switch (type) {
            case NAME:
                dispatch(updateKeyword(newValue));
                break;
            case IP:
                dispatch(updateIp(newValue));
                break;
            case OS:
                dispatch(updateOs(newValue));
                break;
        }
    };
    const onChange = {
        [NAME]: (e: React.ChangeEvent<HTMLInputElement>) =>
            generateHandler(e.target.value, NAME),
        [IP]: (e: React.ChangeEvent<HTMLInputElement>) =>
            generateHandler(e.target.value, IP),
        [OS]: (e: React.ChangeEvent<HTMLInputElement>) =>
            generateHandler(e.target.value, OS),
    };
    const reset = () => {
        dispatch(updateKeyword(""));
        dispatch(updateIp(""));
        dispatch(updateOs(""));
    };
    return {
        value: {
            [NAME]: name,
            [IP]: ip,
            [OS]: os,
        },
        onChange,
        reset,
        hasFilterInput: hasValue(name) || hasValue(ip) || hasValue(os),
    };
};

export const useToggleColumns = () => {
    const dispatch = useDispatch();
    const handleChange: HandleChangeColumn = (config) => {
        const { id, ...rest } = config;
        dispatch(
            updateColumn({
                id: id as number,
                changes: rest,
            })
        );
    };
    return {
        handleChange,
    };
};

export const useFetchTableData = () => {
    const tableData = useSelector(
        (state: RootState) => state[resourceTableNameSpace]
    );
    const agentGroupData = useAgentGroupData();
    const { currentAgentGroupId } = agentGroupData;
    const { ip, os, name, agentStatus, pageSize, currentPage, manualRefresh } =
        tableData;
    return {
        // 当前主机组id 如果为 -1 ,则传给服务端时，labelId 传 空， 服务端的 labelId -1 是
        // labelId: currentAgentGroupId === ROOT_TREE_NODE.id ? '' : currentAgentGroupId,
        pageSize,
        currentPage,
        name,
        statusList: agentStatus === AGENT_STATUS_ENUM.ALL ? "" : agentStatus,
        ip,
        os,
        manualRefresh,
        // 顶级主机组不穿 labelId
        labelId:
            currentAgentGroupId === ROOT_TREE_NODE.id
                ? ""
                : currentAgentGroupId,
    };
};

export const usePagination = () => {
    const tableData = useSelector(
        (state: RootState) => state[resourceTableNameSpace]
    );
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
