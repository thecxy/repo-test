import I18N from '@src/i18n'
import React, { ReactNode } from 'react'
import FormErrorMessage from '@com/FormErrorMessage'
import { ListItem, TableDataType } from '@src/pages/Resource/resourceTypes'
import { AGENT_STATUS, AGENT_STATUS_ENUM } from '@src/constant'
import {
    groupTypeTag,
    left,
    statusStyle,
    tableTitle,
    serviceUnitCss,
} from '@src/pages/Resource/Home/Main/DataList/index.less'
import {
    operationButton,
    danger,
} from './index.less'
import EllipsisContainer from '@com/EllipsisContainer'
import {
    checkIfUnallocatedGroup,
    formatTimeStamp,
    generateFullPath,
    getContainerDOM,
    omitChineseWords
} from '@src/utils/index'
import PieCharts from '@src/pages/Resource/Home/Main/DataList/PieCharts'
import { LIST_COLUMNS } from '@src/pages/Resource/constants/constant'
import { Button, Modal, Space, Tag, Tooltip } from 'antd'
import { ActionType } from '@ant-design/pro-components'
import { Dispatch } from 'redux'
import { NavigateFunction } from 'react-router-dom'
import { routes } from '@src/routes'
import UpdateAgent from '@src/pages/Resource/components/UpdateAgent'
import { IP_REGEXP, PORT_REGEXP } from '@src/constant/regExp'

export const generateFormRequiredRule = (message: string) => {
    return {
        required: true,
        message: <FormErrorMessage message={message} />
    }
}

/**
 * 表单输入长度限制(Notice: 当前方法不包含无长度的校验，需要单独指定必填校验)
 * @param min
 * @param max
 */
export const generateFormLengthLimitRule = (min = 0, max = 200) => {
    const args = {
        val1: min,
        val2: max
    }
    return {
        validator: async (_rule: AnyType, value: string) => {
            const length = value.length
            if (length === 0) return
            if (length < min || length > max) {
                return Promise.reject(<FormErrorMessage
                    message={I18N.get(I18N.utils.utilsWithReactFC.shuRuChangDuChao, args)} />)
            }
        }
    }
}

export const handleManage = (record: TableDataType, navigate: NavigateFunction) => {
    const {
        uuid
    } = record
    navigate(generateFullPath(routes.AGENT_DETAIL.path, { uuid }))
}

export const renderAgentsTableColumns = (item: ListItem, actionRef: React.MutableRefObject<ActionType | undefined>, dispatch: Dispatch<AnyType>, navigate: NavigateFunction, toggleDeleteModalVisible?: (record: TableDataType) => void) => {

    const handleDeleteAgent = (record: TableDataType) => {
        toggleDeleteModalVisible && toggleDeleteModalVisible(record)
    }

    const {
        AGENT_NAME,
        OPERATING,
        AGENT_ID,
        CPU,
        CREATE_TIME,
        MEMORY,
        STORAGE,
        OPERATING_SYSTEM,
        IP,
        HOST_NAME,
        MAC_ADDRESS,
        AGENT_VERSION,
        AGENT_DESCRIPTION,
        BELONGS_GROUP
    } = LIST_COLUMNS
    return (text: ReactNode, record: TableDataType) => {
        const agentStatusLabel: keyof typeof AGENT_STATUS = AGENT_STATUS_ENUM[record.status]
        switch (item.label) {
        case AGENT_NAME.label:
            return <div className={tableTitle}>
                <div className={left}>
                    <Tooltip title={AGENT_STATUS[agentStatusLabel].label}>
                        <span className={statusStyle}
                              style={{ background: AGENT_STATUS[agentStatusLabel].color }} />
                    </Tooltip>
                    <EllipsisContainer val={record.name} style={{
                        fontWeight: 600,
                        color: '#1E2A3D',
                    }} />
                </div>
                <div className={serviceUnitCss}>
                    {
                        record?.serviceUnitList?.map(({ serviceUnitName: name }: { serviceUnitName: string }) => (
                            <EllipsisContainer
                                placement={'left'}
                                key={name}
                                val={<Tag className={groupTypeTag}>{omitChineseWords(name)}</Tag>}
                                tipVal={name}
                            />
                        ))
                    }
                </div>
            </div>
        case HOST_NAME.label:
            return <EllipsisContainer val={record.agentInfoMonitorVo?.hostName} style={{maxWidth:'150px'}}/>
        case AGENT_ID.label:
            return <EllipsisContainer val={record.uuid}/>
        case AGENT_DESCRIPTION.label:
            return <>
                <EllipsisContainer val={record.note} style={{
                    color: '#4D545E'
                }} />
            </>

        case BELONGS_GROUP.label:
            return  <EllipsisContainer val={checkIfUnallocatedGroup(record.labelDisplayName).name} style={{maxWidth:'none'}}/>
        case CPU.label: {
            const {
                cpuCount,
                cpuUsedRate = 0,
                cpuUnit
            } = record?.agentInfoMonitorVo || {}
            const data1 = {
                name: I18N.utils.utilsWithReactFC.cPUShiYong,
                value: cpuUsedRate
            }
            const data2 = {
                name: I18N.utils.utilsWithReactFC.cPUWeiShiYong,
                value: (100 - cpuUsedRate).toFixed(2)
            }
            const title = cpuUnit ? `${cpuCount}${cpuUnit}` : ''
            return <PieCharts title={title} data1={data1} data2={data2} />
        }
        case MEMORY.label: {
            const {
                memory,
                memoryUsedRate,
                memoryUnit
            } = record?.agentInfoMonitorVo || {}
            const transformRate = memoryUsedRate ? (memoryUsedRate).toFixed(2) : 0
            const data1 = {
                name: I18N.utils.utilsWithReactFC.neiCunShiYongLu,
                value: transformRate
            }
            const data2 = {
                name: I18N.utils.utilsWithReactFC.neiCunWeiShiYongLu,
                value: (100 - Number(transformRate)).toFixed(2)
            }
            const title = memoryUnit ? `${memory}${memoryUnit}` : ''
            return <PieCharts title={title} data1={data1} data2={data2}/>
        }
        case STORAGE.label: {
            const {
                diskVolume,
                diskVolumeUnit,
                diskUsedRate
            } = record?.agentInfoMonitorVo || {}
            const data1 = {
                name: I18N.utils.utilsWithReactFC.yingPanShiYongLu,
                value: diskUsedRate
            }
            const data2 = {
                name: I18N.utils.utilsWithReactFC.yingPanWeiShiYongLu,
                value: (100 - diskUsedRate).toFixed(2)
            }
            const title = diskVolumeUnit ? `${parseInt(diskVolume.toString())}${diskVolumeUnit}` : ''
            return <PieCharts title={title} data1={data1} data2={data2}/>
        }
        case OPERATING_SYSTEM.label:
            return <EllipsisContainer val={record.agentInfoMonitorVo?.systemType} style={{maxWidth:'none'}}/>
        case IP.label:
            return <EllipsisContainer val={record.agentInfoMonitorVo?.ip}/>
        case MAC_ADDRESS.label:
            return <EllipsisContainer val={record.agentInfoMonitorVo?.macAddress}/>
            // agent 版本
        case AGENT_VERSION.label:
            return <UpdateAgent
                version={record.version}
                itUpgradeable={record.itUpgradeable}
                uuid={record.uuid}
                status={record.status}
                callback={() => {
                    actionRef.current?.reload()
                }}
            />
        case CREATE_TIME.label:
            return <EllipsisContainer val={formatTimeStamp(record.createTime)}/>
        case OPERATING.label:
            return <Space style={{ flexWrap: 'wrap' }}>
                <Button type={'link'} className={operationButton}
                        onClick={(e) => {
                            e.stopPropagation()
                            handleManage(record, navigate)
                        }}>{I18N.utils.utilsWithReactFC.guanLi}</Button>
                <Button type={'link'} className={`${operationButton} ${danger}`} onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteAgent(record)
                }
                }>{I18N.constant.index.shanChu}</Button>
            </Space>
        default:
            return <EllipsisContainer val={text}/>
        }
    }
}

export const renderCheckListTableColumns = (item: ListItem,
    // actionRef: React.MutableRefObject<ActionType | undefined>, dispatch: Dispatch<AnyType>
) => {
    const {
        AGENT_NAME,
        AGENT_ID,
        CPU,
        MEMORY,
        STORAGE,
    } = LIST_COLUMNS
    return ({
        title: item.label,
        dataIndex: item.key,
        render: (text: ReactNode, record: TableDataType) => {
            switch (item.label) {
            case AGENT_NAME.label:
                return <EllipsisContainer val={record.name}/>
            case AGENT_ID.label:
                return <EllipsisContainer val={record.uuid}/>
            case CPU.label: {
                const {
                    cpuCount,
                    cpuUsedRate,
                    cpuUnit,
                } = record?.agentInfoMonitorVo || {}
                return cpuUnit ? `${cpuUsedRate}% / ${cpuCount}${cpuUnit}` : ''
            }
            case MEMORY.label: {
                const {
                    memory,
                    memoryUsedRate,
                    memoryUnit
                } = record?.agentInfoMonitorVo || {}
                return memoryUnit ? `${memoryUsedRate}% / ${memory}${memoryUnit}` : ''
            }
            case STORAGE.label: {
                const {
                    diskVolumeUnit,
                    diskUsedRate,
                    diskVolume
                } = record?.agentInfoMonitorVo || {}
                return diskVolumeUnit ? `${diskUsedRate}% / ${diskVolume}${diskVolumeUnit}` : ''
            }
            }
        }
    })
}

export const confirmToMoveAgent = (title: string, onOk: () => void, onCancel: () => void) => {
    Modal.confirm({
        title,
        getContainer: getContainerDOM,
        onOk,
        onCancel
    })
}

export const IPValidator: Validator = async (rule, value) => {
    if (IP_REGEXP.test(value)) {
        return Promise.resolve()
    }
    return Promise.reject(<FormErrorMessage message={I18N.Home.Main.qingShuRuIP}
    />)
}

export const portValidator: Validator = async (rule, value) => {
    if (!PORT_REGEXP.test(value)) {
        return Promise.reject(<FormErrorMessage message={I18N.utils.utilsWithReactFC.qingShuRuZhengQue}/>)
    }
}

export const socketErrorNotice = (content: ReactNode | string, onOk: () => void, onCancel?: () => void) => {
    Modal.confirm({
        title: I18N.utils.utilsWithReactFC.dengLuShiBai,
        style: {
            top: '20%'
        },
        getContainer: getContainerDOM,
        content,
        okText: I18N.RetryButton.index.zhongShi,
        onOk,
        onCancel
    })
}
