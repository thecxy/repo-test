import I18N from '@src/i18n'
import { useAddAgentGroupModal, useAgentGroupOperation } from '@src/pages/Resource/components/AddGroupModal/hooks'
import { AGENT_GROUP_OPERATION, AGENT_OPERATION } from '@src/pages/Resource/constants/constant'
import { useShutDownOrReboot } from '@src/pages/Resource/components/ShutDownOrRebootAgentModal/hook'
import { message } from 'antd'
import { updateAgentOrAgentGroupOperation } from '@src/pages/Resource/resourceSlice'
import { useDispatch } from 'react-redux'
import { updateCurrentAgentGroupId } from '@src/pages/Resource/components/AddGroupModal/slice'
import { DEFAULT_AGENT_GROUP_ID } from '@src/pages/Resource/components/AddGroupModal/constant'
import { useSelectedRows } from '@src/pages/Resource/hook'

export const useSelectRowsCheck = () => {
    const {
        selectedCount
    } = useSelectedRows()
    const handleCheckSelectedCount = () => {
        if (selectedCount == 0) {
            message.error(I18N.Home.Main.qingZhiShaoXuanZe2)
            return false
        }
        return true
    }
    return {
        handleCheckSelectedCount
    }
}

export const useSubOperation = () => {
    const { toggleAddAgentGroupModal } = useAddAgentGroupModal()
    const { handleCheckSelectedCount } = useSelectRowsCheck()
    const {
        SHUTDOWN,
        MOVETO,
        REBOOT,
        DELETE
    } = AGENT_OPERATION
    const { toggleRebootOrShutDownVisible } = useShutDownOrReboot()
    const {
        toggleAgentOperation,
        agentOperation
    } = useAgentGroupOperation()
    const dispatch = useDispatch()
    const subOperations = {
        [MOVETO.value]: () => {
            if (handleCheckSelectedCount()) {
                dispatch(updateAgentOrAgentGroupOperation({
                    agentGroupOperation: AGENT_GROUP_OPERATION.MOVETO.value,
                    agentOperation
                }))
                dispatch(updateCurrentAgentGroupId(DEFAULT_AGENT_GROUP_ID))
                toggleAddAgentGroupModal(true)
            }
        },
        [SHUTDOWN.value]: () => {
            if (handleCheckSelectedCount()) {
                toggleAgentOperation(SHUTDOWN.value)
                toggleRebootOrShutDownVisible()
            }
        },
        [REBOOT.value]: () => {
            if (handleCheckSelectedCount()) {
                toggleAgentOperation(REBOOT.value)
                toggleRebootOrShutDownVisible()
            }
        },
        [DELETE.value]: () => {
            if (handleCheckSelectedCount()) {
                toggleAgentOperation(DELETE.value)
                toggleRebootOrShutDownVisible()
            }
        }
    }

    return {
        subOperations
    }
}
