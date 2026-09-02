/**
 * 关机|重启|删除 Modal
 */
import I18N from '@src/i18n'
import React, { useMemo, useRef } from 'react'

import {
    useConfirmAgentOperation,
    useShutDownOrReboot,
} from '@src/pages/Resource/components/ShutDownOrRebootAgentModal/hook'
import { AGENT_OPERATION } from '@src/pages/Resource/constants/constant'
import CheckAgentList from './CheckAgentList'
import { useAgentGroupOperation } from '@src/pages/Resource/components/AddGroupModal/hooks'
import DeleteAgentPasswordConfirm from '../DeleteAgentPasswordConfirm'
import { ProFormInstance } from '@ant-design/pro-components'
import { AgentType, DeleteAgentConfigFormType, ShutdownOrRebootConfigFormType } from '@src/pages/Resource/resourceTypes'
import ShutdownOrRebootConfig from '@src/pages/Resource/components/ShutdownOrRebootConfig'
import { deleteCss,shutdownTipsCss, danger, confirmTips,delayContainer } from './index.less'
import Warning from '@src/statics/icons/warning-Circle-Fill.svg'
import useSwitch from '@react-hook/switch'
import { useUuid } from '@src/pages/AgentDetail/hook'
import { useSelectedRows } from '../../hook'
import BasicModal from '@com/BasicModal'

type ShutDownOrRebootAgentModalType = {
    multiple?: boolean
}
const ShutDownOrRebootAgentModal: React.FC<ShutDownOrRebootAgentModalType> = ({
    multiple = true
}) => {
    const [confirmToRebootOrShutdown, toggleConfirm] = useSwitch(false)
    const {
        agentRebootOrShutdownVisible,
        toggleRebootOrShutDownVisible,
        isRebootingOrShutdown,
        isDeleting
    } = useShutDownOrReboot()
    const {
        selectedRows,
        selectedCount,
        resetSelectRows,
        hasOfflineAgent,
    } = useSelectedRows()
    const {
        agentOperation
    } = useAgentGroupOperation()
    const uuid = useUuid()
    const {
        handleSubmitShutdownOrReboot,
        handleSubmitDelete,
        loading
    } = useConfirmAgentOperation()
    const {
        DELETE,
        SHUTDOWN,
        REBOOT
    } = AGENT_OPERATION
    const formRef = useRef<ProFormInstance<DeleteAgentConfigFormType>>()
    const shutdownFormRef = useRef<ProFormInstance<ShutdownOrRebootConfigFormType>>()

    const okText = useMemo(() => {
        switch (agentOperation) {
        case DELETE.value:
            return I18N.FormikComp.index.queDing
        case SHUTDOWN.value:
        case REBOOT.value:
            return confirmToRebootOrShutdown ? I18N.components.ShutDownOrRebootAgentModal.queDingCaoZuo : I18N.FormikComp.index.queDing
        }
    }, [agentOperation, confirmToRebootOrShutdown])

    const delay = useMemo(() => {
        return Number(shutdownFormRef.current?.getFieldsValue().time)
    }, [shutdownFormRef.current])
    const disabled = useMemo(()=>{
        switch (agentOperation) {
        case DELETE.value:
            return multiple ? !selectedCount : false
        case SHUTDOWN.value:
        case REBOOT.value:
            return multiple ? !selectedCount || hasOfflineAgent : hasOfflineAgent
        }
    },[hasOfflineAgent,selectedCount,agentOperation])

    const cancelText = useMemo(() => {
        switch (agentOperation) {
        case DELETE.value:
            return I18N.FormikComp.index.quXiao
        case SHUTDOWN.value:
        case REBOOT.value:
            return confirmToRebootOrShutdown ? I18N.components.ShutDownOrRebootAgentModal.quXiaoCaoZuo : I18N.FormikComp.index.quXiao
        }
    }, [agentOperation, confirmToRebootOrShutdown])

    const idList = useMemo(() => {
        return multiple ? selectedRows.map((item: AgentType) => item?.uuid) : [uuid]
    }, [multiple, selectedRows, uuid])
    const modalProps = {
        maskClosable: false,
        visible: agentRebootOrShutdownVisible,
        title: I18N.get(I18N.components.ShutDownOrRebootAgentModal.aGENT, { val1: AGENT_OPERATION[agentOperation].label }),
        onOk () {
            switch (agentOperation) {
            case DELETE.value:
                handleSubmitDelete(formRef, selectedRows.map((item: AgentType) => item.id), () => {
                    resetSelectRows()
                })
                break
            case REBOOT.value:
            case SHUTDOWN.value:
                shutdownFormRef.current?.validateFields().then(() => {
                    if (confirmToRebootOrShutdown) {
                        handleSubmitShutdownOrReboot({
                            type: agentOperation,
                            delay,
                            idList
                        })
                    } else {
                        toggleConfirm.on()
                    }
                })
                break
            }
        },
        okText,
        cancelText,
        okButtonProps: {
            loading,
            disabled,
        },
        onCancel: () => {
            if (isRebootingOrShutdown) {
                if (confirmToRebootOrShutdown) {
                    toggleConfirm.off()

                } else {
                    toggleRebootOrShutDownVisible()
                }
            } else {
                toggleRebootOrShutDownVisible()
            }
        }
    }

    const { label } = AGENT_OPERATION[agentOperation]
    return <BasicModal {...modalProps}>
        {isRebootingOrShutdown && <div className={shutdownTipsCss}>
            <Warning/>
            <span
                style={{ paddingRight: 4 }}>{I18N.components.ShutDownOrRebootAgentModal.suoXuanZhuJi}{label}{I18N.components.ShutDownOrRebootAgentModal.shiDuanNeiZhengZai}{label}？</span>
        </div>}
        {isDeleting && <div className={`${shutdownTipsCss} ${deleteCss}`}>
            <Warning/>
            <span
                style={{ paddingRight: 4 }}>{I18N.components.DeleteAgentModal.beiShanChuZhuJi}</span>
        </div>}
        {/*  已选择主机列表 */}
        {multiple && <CheckAgentList/>}
        <div className={delayContainer}>
            {
                isDeleting && <DeleteAgentPasswordConfirm formRef={formRef} />
            }
        </div>

        {
            isRebootingOrShutdown && <div className={delayContainer}><ShutdownOrRebootConfig
                formRef={shutdownFormRef}
                visible={agentRebootOrShutdownVisible}
            />
                {confirmToRebootOrShutdown &&
                    <span className={confirmTips}>{I18N.components.ShutDownOrRebootAgentModal.zhiLingJiangZai}<span
                        className={danger}>{delay}</span> {I18N.components.ShutDownOrRebootAgentModal.miaoHouFaSongDian}<span
                        className={danger}>{I18N.components.ShutDownOrRebootAgentModal.queDingAnNiu}</span>{I18N.components.ShutDownOrRebootAgentModal.houZhiLingJiangWu}</span>}
            </div>
        }
    </BasicModal>
}

export default ShutDownOrRebootAgentModal
