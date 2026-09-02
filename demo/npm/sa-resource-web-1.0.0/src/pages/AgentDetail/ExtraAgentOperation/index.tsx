import I18N from '@src/i18n'
import { Button, Space } from 'antd'
import { ButtonType } from 'antd/lib/button'
import React from 'react'
import { AgentDetail, AgentType } from '@src/pages/Resource/resourceTypes'
import { useAddAgentModal, useSelectedRows } from '@src/pages/Resource/hook'
import { useAgentGroupOperation } from '@src/pages/Resource/components/AddGroupModal/hooks'
import { AGENT_OPERATION } from '@src/pages/Resource/constants/constant'
import { generateFullPath } from '@src/utils'
import { useNavigate } from 'react-router'
import { routes } from '@src/routes'
import useSwitch from '@react-hook/switch'
import DeleteAgentModal from '@src/pages/Resource/components/DeleteAgentModal'
import { useShutDownOrReboot } from '@src/pages/Resource/components/ShutDownOrRebootAgentModal/hook'
import { AGENT_STATUS_ENUM, AGENT_TYPE } from '@src/constant'
import { useFileDistribution } from '@src/pages/Resource/components/FileDistribution/hook'
import { useWebTerminal } from '@com/WebTerminal/hook'
import { updateAgentType } from '@src/pages/Resource/resourceSlice'
import { useDispatch } from 'react-redux'

type Operation = {
    label: string,
    type: ButtonType,
    danger?: boolean,
    disabled?: boolean,
    hide?: boolean,
    operate: React.MouseEventHandler<HTMLElement>
}
type Operations = {
    [key: string]: Operation
}

type ExtraAgentOperationProps = {
    currentAgentDetail: AgentDetail,
    loading: boolean
}

const ExtraAgentOperation: React.FC<ExtraAgentOperationProps> = ({
    currentAgentDetail,
}) => {
    const navigate = useNavigate()

    const [modalVisible, toggleDeleteVisible] = useSwitch(false)
    const {
        toggleVisible
    } = useAddAgentModal()
    const dispatch = useDispatch()
    const { toggleAgentOperation } = useAgentGroupOperation()
    const { toggleRebootOrShutDownVisible } = useShutDownOrReboot()
    const { toggleVisible: toggleFileDistributionVisible } = useFileDistribution()
    const { toggleAgentInfoVisible } = useWebTerminal()

    const {
        RE_CONNECT,
        SHUTDOWN,
        REBOOT
    } = AGENT_OPERATION

    const {
        selectedRowKeys,
        selectedRows,
        updateAgentSelectRows
    } = useSelectedRows()
    const handleReConnection = () => {
        toggleAgentOperation(RE_CONNECT.value)
        const {type} = currentAgentDetail
        dispatch(updateAgentType(type))

        toggleVisible()
    }
    const handleShutdown = () => {
        toggleAgentOperation(SHUTDOWN.value)
        toggleRebootOrShutDownVisible()
    }
    const handleReboot = () => {
        toggleAgentOperation(REBOOT.value)
        toggleRebootOrShutDownVisible()
    }

    const handleDeleteAgent = () => {
        toggleAgentOperation(AGENT_OPERATION.DELETE.value)

        toggleDeleteVisible()
    }

    const {
        id,
        status,
        type
    } = currentAgentDetail

    const isOnline = status === AGENT_STATUS_ENUM.ONLINE
    const isWindows = type === AGENT_TYPE.WINDOWS
    const operations: Operations = {
        reConnection: {
            label: I18N.ExtraAgentOperation.index.zhongLian,
            type: 'default',
            disabled: isOnline,
            operate: handleReConnection
        },
        shutdown: {
            label: I18N.ExtraAgentOperation.index.guanJi,
            type: 'default',
            disabled: !isOnline,
            operate: handleShutdown
        },
        reboot: {
            label: I18N.ExtraAgentOperation.index.zhongQi,
            type: 'default',
            disabled: !isOnline,
            operate: handleReboot
        },
        fileDistribution: {
            label: I18N.constant.index.wenJianFenFa,
            type: 'default',
            disabled: !isOnline,
            operate: () => {
                toggleFileDistributionVisible(true)
            }
        },
        webTerminal: {
            label: 'Web terminal',
            type: 'default',
            disabled: !isOnline || isWindows,
            hide: isWindows,
            operate: () => {
                toggleAgentInfoVisible(true)
            }
        },
        remove: {
            label: I18N.ExtraAgentOperation.index.yiChuZhuJi,
            type: 'default',
            danger: true,
            disabled: false,
            operate: () => {
                handleDeleteAgent()
            }
        }
    }

    const deleteModalProps = {
        idList: [id],
        hasOnlineAgent: status === AGENT_STATUS_ENUM.ONLINE,
        visible: modalVisible,
        onCancel: () => {
            toggleDeleteVisible()
        },
        callback: () => {
            updateAgentSelectRows(selectedRowKeys.filter(item => item != id), selectedRows.filter((item: AgentType) => item.id != id))
            navigate(generateFullPath(routes.HOME.path))
        }
    }

    return <div>
        <Space>
            {
                Object.values(operations).map(({
                    type,
                    operate,
                    label,
                    danger = false,
                    disabled,
                    hide = false
                }) => {
                    return !hide ? <Button
                        disabled={disabled}
                        key={label}
                        type={type}
                        onClick={operate}
                        danger={danger}
                    >{label}</Button> : null
                })
            }
        </Space>
        <DeleteAgentModal {...deleteModalProps} />
    </div>
}

export default ExtraAgentOperation
