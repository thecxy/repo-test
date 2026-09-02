import I18N from '@src/i18n'
import { clone } from 'ramda'

import {
    treeDataParent,
    leftContent,
    treeDataParentShow,
    content
} from '@src/pages/Resource/components/TargetServer/index.less'
import { SCRIPT_TYPES, AGENT_TERMINAL_TYPE } from '@src/constant'
import {
    AgentItem,
    AgentMapByUuid,
    AgentTempMap,
    AgentTempMapItem,
    LabelChildNode,
    LabelItem,
    LabelMapType
} from './types'
import { ExecuteScriptForm } from '@src/pages/Resource/resourceTypes'
import { ProFormInstance } from '@ant-design/pro-components'
import React from 'react'

export const getAgentMap = (agents: AgentItem[]) => {
    const tempMap: AgentTempMap = {}
    const agentMapByUuid: AgentMapByUuid = {}
    for (let i = 0; i < agents.length; i++) {
        const agent = { ...agents[i] }
        agent.title = agent.name
        agent.value = agent.uuid
        agent.key = agent.uuid
        agent.disabled = !!agent.status

        const tempObj = tempMap[agent.labelId]
        agentMapByUuid[agent.uuid] = agent
        if (tempObj) {
            const {
                activeCount: originActiveCount,
                list: originList,
                totalCount: originTotalCount
            } = tempObj
            tempMap[agent.labelId] = {
                list: [...originList, agent],
                activeCount: !agent.status ? originActiveCount + 1 : originActiveCount,
                totalCount: originTotalCount + 1,
            }
        } else {
            tempMap[agent.labelId] = {
                list: [agent],
                activeCount: !agent.status ? 1 : 0,
                totalCount: 1,
            }
        }
    }
    return {
        tempMap,
        agentMapByUuid,
    }
}

type FormatChildNodes = (label: LabelItem, agentObj: AgentTempMapItem) => LabelChildNode
export const formatChildNodes: FormatChildNodes = (label, agentObj = {
    list: [],
    activeCount: 0,
    totalCount: 0
}) => {
    const tempObj: LabelChildNode = clone(label)
    const {
        activeAgentNum,
        registerAgentNum
    } = tempObj
    tempObj.children = agentObj.list
    tempObj.activeCount = activeAgentNum
    tempObj.totalCount = registerAgentNum

    return tempObj
}

export type WindowsStatus = {
    status: number,
    tips: string
}

// 如果用户选择的步骤类型是脚本类型，并且脚本语言为 linux bash， 则目标服务器不可以为 windows 类型
export const useWindowsStatus = (formRef: React.MutableRefObject<ProFormInstance<ExecuteScriptForm> | undefined>): WindowsStatus => {
    const defaultReturn = {
        status: 0,
        tips: ''
    }
    if (!formRef.current) {
        return defaultReturn
    }
    const { scriptContent = { scriptLanguage: '' } } = formRef.current.getFieldsValue()

    const { scriptLanguage = '' } = scriptContent
    if (scriptLanguage === SCRIPT_TYPES[0].key) {
        return {
            status: AGENT_TERMINAL_TYPE.WINDOWS.value,
            tips: I18N.components.TargetServer.wINDO +
                I18N.components.TargetServer.qingXuanZeLI
        }
    } else if (scriptLanguage === SCRIPT_TYPES[1].key) {
        return {
            status: AGENT_TERMINAL_TYPE.LINUX.value,
            tips: I18N.components.TargetServer.linuxINDO +
                I18N.components.TargetServer.qingXuanZeWin
        }
    }
    return defaultReturn
}
// label 处理
export const formatLabels = (agentMap: AgentTempMap, labels: LabelChildNode[]) => {
    const labelMap: LabelMapType = {}
    const tempLabels = labels.map(label => {
        let tempLabel = clone(label)
        const {
            id,
        } = tempLabel
        const tempAgentObj = agentMap[id]
        tempLabel = formatChildNodes(tempLabel, tempAgentObj)
        const {
            totalCount,
            activeCount,
            displayName
        } = tempLabel

        tempLabel.title = (
            <div
                className={treeDataParent}
            >
                <div className={leftContent}>
                    <span className={content}>{displayName}</span>
                    <span className={treeDataParentShow}>
                        {`（${activeCount}/${totalCount}）`}
                    </span>
                </div>
            </div>
        )
        tempLabel.value = label.id
        tempLabel.key = label.id
        labelMap[label.id] = tempLabel
        return tempLabel
    })
    return {
        tempLabels,
        labelMap,
        agentMap
    }
}

export const formatData = (agents: AgentItem[], labels: LabelChildNode[]) => {
    const {
        agentMapByUuid,
        tempMap: agentMap
    } = getAgentMap(agents)
    return {
        ...formatLabels(agentMap, labels),
        agentMapByUuid
    }
}
