import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@src/store'
import { resourceNameSpace, updateRebootOrShutDownVisible } from '@src/pages/Resource/resourceSlice'
import { deleteAgents, resourceTableNameSpace, updateManualRefresh } from '@src/pages/Resource/resourceTableSlice'
import { useAgentGroupOperation } from '@src/pages/Resource/components/AddGroupModal/hooks'
import { AGENT_OPERATION } from '@src/pages/Resource/constants/constant'
import { ProFormInstance } from '@ant-design/pro-components'
import React from 'react'
import { assembleRequestUrl, generateEncrypt, requestCallback } from '@src/utils'
import {
    AgentOperationLabel,
    DeleteAgentConfigFormType,
} from '@src/pages/Resource/resourceTypes'
import { REBOOT_URL, SHUTDOWN_URL } from '@src/pages/Resource/constants/apis'
import { request } from '@src/request/fetch'
import { REQUEST_METHODS, REQUEST_URL_TYPES } from '@src/constant'
import useSwitch from '@react-hook/switch'
import { useAgentGroup } from '@src/pages/Resource/hook'

export const useShutDownOrReboot = () => {
    const {
        SHUTDOWN,
        REBOOT,
        DELETE
    } = AGENT_OPERATION
    const { agentRebootOrShutdownVisible } = useSelector((state: RootState) => state[resourceNameSpace])
    const dispatch = useDispatch()
    const { agentOperation } = useAgentGroupOperation()
    const toggleRebootOrShutDownVisible = () => dispatch(updateRebootOrShutDownVisible(!agentRebootOrShutdownVisible))
    const isRebootingOrShutdown = [SHUTDOWN.value, REBOOT.value].some(item => item === agentOperation)
    const isDeleting = agentOperation === DELETE.value

    return {
        isDeleting,
        isRebootingOrShutdown,
        agentRebootOrShutdownVisible,
        toggleRebootOrShutDownVisible,
    }
}

export const useConfirmAgentOperation = () => {
    const [loading, toggleLoading] = useSwitch(false)

    const { agentOperation } = useAgentGroupOperation()
    const { initAgentGroups } = useAgentGroup()
    const dispatch = useDispatch()
    const { toggleRebootOrShutDownVisible } = useShutDownOrReboot()
    const {
        DELETE,
        SHUTDOWN,
        REBOOT
    } = AGENT_OPERATION
    const tableData = useSelector((state: RootState) => state[resourceTableNameSpace])

    const handleDelete = async (values: DeleteAgentConfigFormType, idList: number[], callback?: () => void) => {
        const { password } = values
        const res = await dispatch(deleteAgents({
            idList,
            password: generateEncrypt(password)
        }))
        const { payload } = res as unknown as { payload: boolean }
        if (payload) {
            initAgentGroups()
            callback && callback()
        }
    }

    const handleSubmitShutdownOrReboot = async ({
        type,
        idList,
        delay
    }: {
        type: AgentOperationLabel,
        idList: string[],
        delay: number
    }) => {
        toggleLoading.on()
        const urls = {
            [AGENT_OPERATION.SHUTDOWN.value]: SHUTDOWN_URL,
            [AGENT_OPERATION.REBOOT.value]: REBOOT_URL,
        }
        const res = await request({
            url: assembleRequestUrl(urls[type], REQUEST_URL_TYPES.MANAGER.label),
            method: REQUEST_METHODS.POST,
            params: {
                agentUuids: idList,
                delay
            }
        })

        requestCallback({
            res,
            callback () {
                toggleLoading.off()
                dispatch(updateManualRefresh(!tableData.manualRefresh))
                toggleRebootOrShutDownVisible()
            },
            errorCallback () {
                toggleLoading.off()
            }
        })
    }

    const handleSubmitDelete = (formRef: React.MutableRefObject<ProFormInstance<DeleteAgentConfigFormType> | undefined>, idList: number[], callback?: () => void) => {
        formRef.current?.validateFields().then(async (res) => {
            await handleDelete(res, idList, callback)
        })
    }

    const loadings = {
        [DELETE.value]: tableData.loading,
        [SHUTDOWN.value]: loading,
        [REBOOT.value]: loading
    }
    return {
        handleSubmitShutdownOrReboot,
        handleSubmitDelete,
        loading: loadings[agentOperation]
    }
}
