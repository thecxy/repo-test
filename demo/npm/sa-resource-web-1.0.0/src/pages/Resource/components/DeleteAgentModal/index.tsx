import I18N from '@src/i18n'
import DeleteAgentPasswordConfirm from '@src/pages/Resource/components/DeleteAgentPasswordConfirm'
import { getContainerDOM } from '@src/utils'
import { useConfirmAgentOperation } from '@src/pages/Resource/components/ShutDownOrRebootAgentModal/hook'
import React, { useEffect, useRef } from 'react'
import { ProFormInstance } from '@ant-design/pro-components'
import { DeleteAgentConfigFormType } from '../../resourceTypes'
import Warning from '@src/statics/icons/warning-Circle-Fill.svg'
import { shutdownTipsCss } from './index.less'
import BasicModal from '@com/BasicModal'

type DeleteAgentModalProps = {
    visible: boolean
    idList: number[],
    callback: () => void
    onCancel: () => void
    hasOnlineAgent: boolean
}
const DeleteAgentModal: React.FC<DeleteAgentModalProps> = ({
    visible,
    idList,
    callback,
    onCancel,
    hasOnlineAgent
}) => {
    const formRef = useRef<ProFormInstance<DeleteAgentConfigFormType>>()
    const {
        loading,
        handleSubmitDelete
    } = useConfirmAgentOperation()

    const modalProps = {
        visible,
        title: I18N.components.AddGroupModal.shanChuQueRen,
        getContainer: getContainerDOM,
        okButtonProps: {
            loading,
        },
        onCancel () {
            onCancel()
        },
        onOk: async () => {
            handleSubmitDelete(formRef, idList, callback)
        },
    }
    useEffect(() => {
        if (!visible) {
            formRef.current?.resetFields()
        }
    }, [visible])

    return <BasicModal {...modalProps}>
        <div className={shutdownTipsCss}>
            <Warning/>
            {
                hasOnlineAgent ?
                    <span style={{ paddingRight: 4 }}>{I18N.components.DeleteAgentModal.beiShanChuZhuJi2}</span> :
                    <span>{I18N.components.DeleteAgentModal.beiShanChuZhuJi}</span>
            }
        </div>
        <DeleteAgentPasswordConfirm formRef={formRef}/>
    </BasicModal>
}

export default DeleteAgentModal
