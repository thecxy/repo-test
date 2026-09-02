import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
    resourceNameSpace,
    selectAllColumns,
    toggleAddAgentModal,
    updateSelectTreeRole,
} from '@src/pages/Resource/resourceSlice'
import { assembleRequestUrl, debounceWith250ms, requestCallback } from '@src/utils'
import { resourceTableNameSpace, updateKeyword, updatePagination, updateSelectRows } from './resourceTableSlice'
import { RootState } from '@src/store'
import { LIST_COLUMNS } from '@src/pages/Resource/constants/constant'
import { SelectTreeRole, TableDataType } from '@src/pages/Resource/resourceTypes'
import {
    agentGroupTreeSliceNameSpace,
    getAgentGroups,
    updateAgentGroupsWithOutFetching
} from '@src/pages/Resource/components/AgentGroupTree/agentGroupTreeSlice'
import { FETCH_AGENTS, UPDATE_AGENT } from '@src/pages/Resource/constants/apis'
import { request } from '@src/request/fetch'
import {
    AGENT_STATUS_ENUM,
    PAGE_SIZE_OF_NO_PAGINATION,
    REQUEST_METHODS,
    REQUEST_URL_TYPES,
    SPLIT_SYMBOL
} from '@src/constant'
import { RequestData } from '@src/request/request.d'
import {
    agentUpdateNameSpace,
    modifyUpdateConfig,
    UpdateAgentFormType,
    updateVisible
} from '@com/AgentUpdateModal/slice'
import { agentGroupModalNameSpace } from '@src/pages/Resource/components/AddGroupModal/slice'
import { bySSHSliceNameSpace } from '@src/pages/Resource/Home/Main/AddOrEditAgent/BySSH/slice'

export const useColumns = () => {
    const columns = useSelector(selectAllColumns)
    const visibleColumns = columns.filter(column => !column.disabled)
    const {
        AGENT_NAME,
        CPU,
        MEMORY,
        STORAGE
    } = LIST_COLUMNS

    const keys = [AGENT_NAME, CPU, MEMORY, STORAGE].map(item => item.key)
    const checkedAgentsColumns = visibleColumns.filter(column => keys.includes(column.key))

    return {
        columns,
        visibleColumns,
        checkedAgentsColumns,
        visibleColumnsKeys: visibleColumns.map(column => column.key),
    }
}

export const useUpdateResourceTable = () => {
    const dispatch = useDispatch()
    const modifyKeyword = debounceWith250ms((target: string) => dispatch(updateKeyword(target)))
    const modifyPagination = debounceWith250ms((current: number, pageSize: number) => dispatch(updatePagination({
        current,
        pageSize
    })))
    return {
        modifyKeyword,
        modifyPagination
    }
}

export const useExtraConfig = () => {
    const [needExtraConfig, setNeedExtraConfig] = useState(false)
    const toggleExtraConfig = () => {
        setNeedExtraConfig(!needExtraConfig)
    }
    return {
        needExtraConfig,
        toggleExtraConfig
    }
}

export const useAddAgentModal = () => {
    const resourceData = useSelector((state: RootState) => state[resourceNameSpace])
    const visible = resourceData.addAgentVisible
    const dispatch = useDispatch()
    const toggleVisible = () => dispatch(toggleAddAgentModal(!visible))
    return {
        visible,
        toggleVisible
    }
}

export const useSelectedRows = () => {
    const {
        selectedRows,
        selectedRowKeys
    } = useSelector((state: RootState) => state[resourceTableNameSpace])
    const dispatch = useDispatch()
    const updateAgentSelectRows = (selectedRowKeys: React.Key[],
        selectedRows: TableDataType[]) => {
        dispatch(updateSelectRows({
            selectedRowKeys,
            selectedRows
        }))
    }
    const resetSelectRows = () => {
        updateAgentSelectRows([], [])
    }

    const hasOfflineAgent = useMemo(() => {
        return Boolean(selectedRows.filter((item: TableDataType) => item.status === AGENT_STATUS_ENUM.OFFLINE).length)
    }, [selectedRows])

    return {
        selectedRows,
        selectedRowKeys,
        selectedCount: selectedRows.length,
        resetSelectRows,
        updateAgentSelectRows,
        hasOfflineAgent
    }
}

export const useAgentGroup = () => {
    const dispatch = useDispatch()
    const initAgentGroups = () => {
        dispatch(getAgentGroups())
    }

    const updateAgentGroups = (isAddingAgentGroup: boolean, isAddingAgent: boolean, isSlideBar: boolean) => {
        dispatch(updateAgentGroupsWithOutFetching({isAddingAgentGroup, isAddingAgent, isSlideBar, isGetNew: false}))
    }

    const resetAgentGroups = () => {
        updateAgentGroups(false, false, false)
    }

    return {
        initAgentGroups,
        resetAgentGroups,
        updateAgentGroups
    }
}

export const useFilterFetchAgent = () => {
    const fetchAgentsByIdList = async (idList: number[], callback: (data: RequestData['data']) => void) => {
        const res = await request({
            url: assembleRequestUrl(FETCH_AGENTS),
            params: {
                agentIdList: idList.join(SPLIT_SYMBOL),
                currentPage: 1,
                pageSize: PAGE_SIZE_OF_NO_PAGINATION
            }
        })

        requestCallback({
            res,
            hideMessage: true,
            callback (data) {
                callback && callback(data)
            }
        })
    }
    return {
        fetchAgentsByIdList
    }
}

export const useAgentUpdate = () => {
    const {
        visible,
        loading,
        mode,
        startTime,
        endTime,
    } = useSelector((state: RootState) => state[agentUpdateNameSpace])
    const dispatch = useDispatch()
    const toggleVisible = (visible: boolean) => {
        dispatch(updateVisible(visible))
    }
    const handleUpdateAgent = async (agentUuid: string, callback: (data: RequestData['data']) => void) => {
        const res = await request({
            url: assembleRequestUrl(UPDATE_AGENT, REQUEST_URL_TYPES.MANAGER.label),
            params: {
                agentUuid
            },
            method: REQUEST_METHODS.POST
        })

        requestCallback({
            res,
            callback
        })
    }

    const handleUpdateAgentConfig = (params: UpdateAgentFormType) => {
        dispatch(modifyUpdateConfig(params))
    }
    const requestData = {
        mode,
        startTime,
        endTime
    }
    return {
        visible,
        loading,
        toggleVisible,
        handleUpdateAgent,
        handleUpdateAgentConfig,
        requestData
    }
}

export const useSelectTreeRole = () => {
    const { currentSelectTreeRole } = useSelector((state: RootState) => state[resourceNameSpace])
    const dispatch = useDispatch()
    const toggleSelectTreeRole = (role: SelectTreeRole) => {
        dispatch(updateSelectTreeRole(role))
    }
    const { currentAgentGroupId: currentAgentGroupIdForAgentOperate } = useSelector((state: RootState) => state[agentGroupModalNameSpace])
    const { currentAgentGroupId: currentAgentGroupIdForAddAgent } = useSelector((state: RootState) => state[bySSHSliceNameSpace])
    const { currentAgentGroupId: currentAgentGroupIdForSideBar } = useSelector((state: RootState) => state[agentGroupTreeSliceNameSpace])
    let currentAgentGroupId
    switch (currentSelectTreeRole) {
    case SelectTreeRole.SIDE_BAR:
        currentAgentGroupId = currentAgentGroupIdForSideBar
        break
    case SelectTreeRole.ADDING_AGENT:
        currentAgentGroupId = currentAgentGroupIdForAddAgent
        break
    case SelectTreeRole.AGENT_GROUP_OPERATE:
        currentAgentGroupId = currentAgentGroupIdForAgentOperate
        break
    }

    return {
        currentSelectTreeRole,
        toggleSelectTreeRole,
        currentAgentGroupId
    }
}

