import I18N from '@src/i18n'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useSwitch from '@react-hook/switch'
import { omit } from 'ramda'
import { Modal } from 'antd'

import { REQUEST_METHODS, SPLIT_SYMBOL, SYMBOL_FOR_ALL } from '@src/constant'
import { request } from '@src/request/fetch'
import { assembleRequestUrl, checkIfUnallocatedGroup, getContainerDOM, requestCallback } from '@src/utils'
import { RootState } from '@src/store'
import {
    resourceNameSpace,
    updateAgentGroupsHasBeenChanged,
    updateAgentOrAgentGroupOperation
} from '@src/pages/Resource/resourceSlice'
import { AgentGroupOperationLabel, AgentOperationLabel, AgentType } from '@src/pages/Resource/resourceTypes'
import { AGENT_GROUP_OPERATION, AGENT_OPERATION } from '../../constants/constant'
import { ADD_AGENT_GROUP, CHECK_WHETHER_HAS_RUNNING_AGENT, FETCH_SERVICE_UNITS, MOVE_AGENT } from '../../constants/apis'
import { AgentGroupDetailFromServer, AgentGroupItem } from './addGroupModalTypes'
import {
    deleteAgentGroupById,
    getAgentGroup
} from '@src/pages/Resource/components/AgentGroupTree/agentGroupTreeSlice'
import { ProFormInstance } from '@ant-design/pro-components'
import { useAuthorizeProject } from '@src/hooks/useAuthorizeProject'
import { confirmToMoveAgent } from '@src/utils/utilsWithReactFC'
import { updateManualRefresh } from '@src/pages/Resource/resourceTableSlice'
import { useFetchTableData } from '@src/pages/Resource/Home/Main/TableFilterCollection/hook'
import { useAgentGroupData } from '../AgentGroupTree/hook'
import { agentGroupModalNameSpace, updateAddAgentGroupModal, updateCurrentAgentGroupId } from './slice'
import { useAgentGroup, useSelectedRows } from '../../hook'

export type ServiceUnit = {
    id: number
    name: string
    sortIndex: number
    status: number
}
export const useServiceUnits = (params = {}) => {

    const [serviceUnits, setServiceUnits] = useState<ServiceUnit[]>([])
    const [loading, toggleLoading] = useSwitch(false)

    const fetchServiceUnits = async () => {
        toggleLoading.on()
        const res = await request({
            url: assembleRequestUrl(FETCH_SERVICE_UNITS),
            method: REQUEST_METHODS.GET,
            params,
        })
        requestCallback({
            res,
            hideMessage: true,
            callback (data) {
                setServiceUnits(data)
                toggleLoading.off()
            },
            errorCallback () {
                toggleLoading.off()
            }
        })
    }
    useEffect(() => {
        fetchServiceUnits()
    }, [])

    return {
        serviceUnits,
        loading,
    }
}

export const useAddAgentGroupModal = () => {
    const { addAgentGroupVisible } = useAgentGroupModalData()
    const dispatch = useDispatch()
    const toggleAddAgentGroupModal = (visible: boolean) => {
        dispatch(updateAddAgentGroupModal(visible))
    }
    return {
        addAgentGroupVisible,
        toggleAddAgentGroupModal
    }
}

export const useAgentGroupModalData = () => {
    return useSelector((state: RootState) => state[agentGroupModalNameSpace])
}

export const useAgentGroupOperation = () => {
    const resourceData = useSelector((state: RootState) => state[resourceNameSpace])
    const agentGroupData = useAgentGroupData()
    const {
        agentGroupOperation,
        agentOperation
    } = resourceData
    const { currentAgentGroupId } = agentGroupData
    const {
        ADD,
        EDIT,
        VIEW,
        MOVETO,
        DELETE,
    } = AGENT_GROUP_OPERATION
    const {
        ADD: ADD_AGENT,
        RE_CONNECT
    } = AGENT_OPERATION
    const isAdding = agentGroupOperation === ADD.value
    const isEditing = agentGroupOperation === EDIT.value
    const isViewing = agentGroupOperation === VIEW.value
    const isMoving = agentGroupOperation === MOVETO.value
    const isDeleting = agentGroupOperation === DELETE.value
    const isAddingAgent = agentOperation === ADD_AGENT.value
    const isReconnecting = agentOperation === RE_CONNECT.value

    const dispatch = useDispatch()
    const transformParams = (params: AgentGroupItem) => {
        const parentId = params.parentId as React.Key[]
        return {
            ...omit(['parentId'], params),
            parentId: parentId[0]
        }
    }
    const { toggleAddAgentGroupModal } = useAddAgentGroupModal()

    const essentialOperateAgentGroup = async (params: AgentGroupItem, method: REQUEST_METHODS) => {
        const { authorizeProjects = [] } = params
        if (authorizeProjects.length) {
            params.authorizeProjects = authorizeProjects.includes(SYMBOL_FOR_ALL) ? [SYMBOL_FOR_ALL] : authorizeProjects
        }
        const res = await request({
            url: assembleRequestUrl(ADD_AGENT_GROUP),
            method,
            params: transformParams(params),
        })
        requestCallback({
            res,
            callback () {
                toggleAddAgentGroupModal(false)
                dispatch(updateAgentGroupsHasBeenChanged(true))
            }
        })
    }

    const handleOperateAgentGroup = {
        [ADD.value]: (params: AgentGroupItem) => essentialOperateAgentGroup(params, REQUEST_METHODS.POST),
        [EDIT.value]: (params: AgentGroupItem) => essentialOperateAgentGroup({
            ...params,
            id: currentAgentGroupId
        }, REQUEST_METHODS.PUT)
    }

    const toggleAgentGroupOperation = (operation: AgentGroupOperationLabel) => {
        dispatch(updateAgentOrAgentGroupOperation({
            agentGroupOperation: operation,
            agentOperation
        }))
    }

    const toggleAgentOperation = (operation: AgentOperationLabel) => {
        dispatch(updateAgentOrAgentGroupOperation({
            agentGroupOperation,
            agentOperation: operation
        }))
    }

    return {
        agentGroupOperation,
        agentOperation,
        isEditing,
        isAdding,
        isViewing,
        isMoving,
        isDeleting,
        handleOperateAgentGroup,
        toggleAgentGroupOperation,
        toggleAgentOperation,
        currentAgentGroupId,
        isAddingAgent,
        isReconnecting
    }
}

type UseToggleGroupOperation = ({
    isAdding,
    formRef,
    addAgentGroupVisible
}: { isAdding: boolean, formRef: React.MutableRefObject<ProFormInstance<AgentGroupItem> | undefined>, addAgentGroupVisible: boolean }) => void
export const useToggleGroupOperation: UseToggleGroupOperation = ({
    isAdding,
    formRef,
    addAgentGroupVisible
}) => {
    useEffect(() => {
        if (isAdding && addAgentGroupVisible) {
            if (formRef.current) {
                formRef.current.resetFields()
            }

        }
    }, [isAdding, addAgentGroupVisible])
}

export const useDeleteAgentGroup = () => {
    const dispatch = useDispatch()
    const { resetAgentGroups } = useAgentGroup()

    const handleDeleteAgentGroup = (ids: number) => dispatch(deleteAgentGroupById(ids))
    const confirmDeleteAgentGroup = (title: string, id: number) => {
        Modal.confirm({
            title: I18N.components.AddGroupModal.shanChuQueRen,
            content: I18N.get(I18N.components.AddGroupModal.queDingYaoShanChu, { val1: title }),
            getContainer: getContainerDOM,
            onOk: async () => {
                await handleDeleteAgentGroup(id)
                resetAgentGroups()
            },
        })
    }
    return {
        confirmDeleteAgentGroup
    }
}

export const useViewAgentGroup = ({
    isDeleting,
    formRef,
    isAdding,
    isMoving,
}: {
    isDeleting: boolean,
    isAdding: boolean,
    isMoving: boolean,
    formRef: React.MutableRefObject<ProFormInstance<AgentGroupItem> | undefined>
}) => {
    const dispatch = useDispatch()
    const resourceTreeData = useAgentGroupData()
    const { addAgentGroupVisible } = useAddAgentGroupModal()
    const { authorizeProjects } = useAuthorizeProject()
    const {
        currentAgentGroup
    } = resourceTreeData
    const { currentAgentGroupId } = useAgentGroupModalData()

    useEffect(() => {
        if (!isDeleting && currentAgentGroupId) {
            dispatch(getAgentGroup(currentAgentGroupId))
        }
    }, [currentAgentGroupId, addAgentGroupVisible])

    useEffect(() => {
        if (isAdding) return
        if (formRef.current) {
            const {
                parentId,
                name,
                displayName,
                serviceUnitList,
                description,
                projectList = [],
                id,
            } = currentAgentGroup as AgentGroupDetailFromServer
            // 这里的filter 是为了处理后端项目和one的项目不同步的问题
            let finalProjectList = projectList?.filter(item => authorizeProjects?.filter(({uuid}) => uuid === (item.uuid)).length)||[]
            // 全选授权项目
            if (projectList?.length === 1 && projectList?.[0].uuid === SYMBOL_FOR_ALL) {
                finalProjectList = [{
                    ...projectList[0],
                    uuid: SYMBOL_FOR_ALL
                }, ...authorizeProjects]
            }
            formRef.current.setFieldsValue({
                /**
                 * 这里 parentId 分两种情况：
                 * 1. 移动主机，此时的 parentId 应该与 当前用户选中的父级id相同
                 * 2. 非移动主机（编辑主机组）， 当前情况应该与 用户所选的主机组的 父级id相同
                 */
                parentId: isMoving ? [id] : [parentId],
                name,
                displayName: checkIfUnallocatedGroup(displayName).name,
                description,
                serviceUnitList: serviceUnitList?.map(item => item.serviceUnitId),
                authorizeProjects: finalProjectList?.map(item => item.uuid)
            })
        }
    }, [currentAgentGroup])

    return {
      authorizeProjects: authorizeProjects
    }
}

export const useMoveAgent = () => {
    const {
        selectedRows,
    } = useSelectedRows()
    const dispatch = useDispatch()
    const { manualRefresh } = useFetchTableData()
    const { toggleAddAgentGroupModal } = useAddAgentGroupModal()
    const { resetSelectRows } = useSelectedRows()
    const handleReset = () => {
        resetSelectRows()
        dispatch(updateManualRefresh(!manualRefresh))
        toggleAddAgentGroupModal(false)
    }
    const confirmToMove = async (agentIdList: number[], parentId: number) => {
        const res = await request({
            url: assembleRequestUrl(MOVE_AGENT),
            method: REQUEST_METHODS.PUT,
            params: {
                agentIdList,
                labelId: parentId
            }
        })
        requestCallback({
            res,
            callback () {
                dispatch(updateCurrentAgentGroupId(parentId))
                dispatch(updateAgentGroupsHasBeenChanged(true))
                handleReset()
            }
        })
    }
    const handleCheckHasRunningAgent = async (values: AgentGroupItem) => {
        const { parentId: parentIdGroup } = values
        const [parentId] = parentIdGroup as React.Key[]
        const agentIdList = selectedRows.map((item: AgentType) => item.id)
        const res = await request({
            url: assembleRequestUrl(CHECK_WHETHER_HAS_RUNNING_AGENT),
            params: {
                agentIdList: agentIdList.join(SPLIT_SYMBOL)
            }
        })

        requestCallback({
            res,
            hideMessage: true,
            callback (data) {
                if (data) {
                    confirmToMoveAgent(data, () => {
                        confirmToMove(agentIdList, parentId as number)
                    }, () => {
                        handleReset()
                    })
                } else {
                    confirmToMove(agentIdList, parentId as number)
                }
            },
            errorCallback () {
                handleReset()
            }
        })
    }
    return {
        handleCheckHasRunningAgent
    }
}
