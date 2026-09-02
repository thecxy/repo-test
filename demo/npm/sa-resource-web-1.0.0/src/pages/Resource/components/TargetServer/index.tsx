/* eslint-disable */
// @ts-nocheck

import I18N from '@src/i18n'
import { RadioChangeEvent, TreeSelect } from 'antd'
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'

import DropDownRender from './DropDownRender'

import { agentSelectTreeDropdown } from './index.less'
import { formatData, useWindowsStatus } from './util'
import { AGENT_TERMINAL_TYPE, AGENT_TYPE } from '@src/constant'
import { debounceWith250ms, debounceWith500ms, getDefaultPopupContainer } from '@src/utils'
import useLabelAndAgents from '@src/hooks/useLabelAndAgents'
import { updateLabelName } from './agentSlice'
import { AgentMapByUuid, LabelChildNode } from '@src/pages/Resource/components/TargetServer/types'
import { AgentItem, ExecuteScriptForm, TargetResourceItem } from '../../resourceTypes'
import { ProFormInstance } from '@ant-design/pro-components'
import { useAgentDetailData } from '@src/pages/AgentDetail/hook'

type TargetServerProps = {
    visible: boolean,
    multiple?: boolean,
    allowClear?: boolean,
    resetUserInputError?: React.FocusEventHandler<HTMLElement>,
    disabled: boolean,
    formRef: React.MutableRefObject<ProFormInstance<ExecuteScriptForm> | undefined>
    onChange?: (e: TargetResourceItem[]) => void
    onFromChange: (e: TargetResourceItem[]) => void,
    value?: TargetResourceItem[],
}
const TargetServer: React.FC<TargetServerProps> = ({
    visible,
    multiple = true,
    allowClear = true,
    resetUserInputError,
    disabled,
    formRef,
    value,
    onChange,
    onFromChange,
}) => {
    const dispatch = useDispatch()

    const {
        status,
        tips
    } = useWindowsStatus(formRef)

    const [treeData, setTreeData] = useState<LabelChildNode[]>([])
    const [initComplete,setInitComplete] = useState(false)
    const [agentMapByUuid, setAgentMapByUuid] = useState<AgentMapByUuid>({})
    const {currentAgentDetail} = useAgentDetailData()
    const [labelMap, setLabelMap] = useState({})

    const {
        type,
        labelName,
        agentList: agents,
        labelList: labels,
        loading,
        fetchData,
        toggleType
    } = useLabelAndAgents()

    const handleSearch = debounceWith250ms((e: string) => dispatch(updateLabelName(e)))

    const handleChangeType = (value: number) => {
        handleSearch('')
        toggleType(value)
        // 清除已选的目标服务器
        onFromChange({
          targetResourceList: [],
        })
    }

    const first = useRef(true)
    useEffect(() => {
      // status变化，要重置目标服务器的选择框，并且根据states切换选中的Linux还是Windows。（这里不调用handleChangeType是因为会清除会先数据）
      if (status === AGENT_TERMINAL_TYPE.WINDOWS.value) {
          handleSearch('')
          toggleType(AGENT_TERMINAL_TYPE.LINUX.value)
          if(!first.current) {
            onFromChange({
              targetResourceList: [],
            })
          }
      } else if (status === AGENT_TERMINAL_TYPE.LINUX.value) {
          handleSearch('')
          toggleType(AGENT_TERMINAL_TYPE.WINDOWS.value)
          if(!first.current) {
            onFromChange({
              targetResourceList: [],
            })
          }
      }
      first.current = false
    }, [status])


    const initType = (agents: AgentItem[]) => {
        let tempType = currentAgentDetail?.type || AGENT_TERMINAL_TYPE.LINUX.value
        if (!agents.length || !value) {
            return tempType
        }
        const oneOfCurrentAgent = currentAgentDetail as {type: AGENT_TYPE} ||  agents.filter(item => item.uuid === value?.[0]?.targetUuid)[0]
        if (oneOfCurrentAgent) {
            const { type } = oneOfCurrentAgent
            tempType = type
        }
        return tempType
    }

    const updateData = debounceWith500ms(async () => {
        const {
            tempLabels: treeData,
            agentMapByUuid,
            labelMap,
        } = formatData(agents, labels)
        setTreeData(treeData)
        setLabelMap(labelMap)
        setAgentMapByUuid(agentMapByUuid)
    })

    const getActiveAgentInfoByLabel = labelId => {
        const label = labelMap[labelId]
        const children = label?.children
        const length = children?.length
        const res = []
        for (let i = 0; i < length; i++) {
            const child = children[i]
            if (!child?.status) {
                res.push(child)
            }
        }
        return res
    }

    const filterAgent = agent => {
        if (typeof agent === 'number') {
            return getActiveAgentInfoByLabel(agent)
        }
        return [agentMapByUuid[agent]]
    }

    const triggerChange = (changeValue: StringOrNumber[]) => {
        const agents = []
        if (multiple) {
            for (let i = 0; i < changeValue.length; i++) {
                const item = changeValue[i]
                agents.push(...filterAgent(item))
            }
        } else {
            agents.push(...filterAgent(changeValue))
        }
        onChange?.(agents.map(item => ({
            targetUuid: item.uuid,
            targetResourceName: agentMapByUuid[item.uuid]?.name
        })))
    }

    useEffect(() => {
        if (visible && initComplete) {
           toggleType(initType(agents))
        }
    }, [visible, initComplete])

    useEffect(() => {
        if (visible) {
            fetchData(type)
        }
    }, [labelName, type])

    useEffect(()=>{
        if(!initComplete){
            setInitComplete(true)
        }
    },[agents])
    useEffect(() => {
        updateData()
    }, [labelName, agents, labels, type,visible])
    const dropDownRenderProps = {
        type,
        handleChangeType,
        loading,
        status,
        tips
    }
    return (
        <TreeSelect
            showSearch
            className={'agent-select-tree'}
            dropdownStyle={{
                maxHeight: 400,
                overflow: 'auto',
                width: '100%'
            }}
            value={value?.map(item => item.targetUuid)}
            placeholder={I18N.OriginTargetServer.index.qingXuanZeMuBiao}
            showArrow
            allowClear={allowClear}
            multiple={multiple}
            onSearch={handleSearch}
            treeData={treeData}
            filterTreeNode={false}
            getPopupContainer={getDefaultPopupContainer}
            treeDefaultExpandAll
            dropdownClassName={agentSelectTreeDropdown}
            onFocus={resetUserInputError}
            disabled={disabled}
            dropdownRender={originNode => <DropDownRender
                originNode={originNode} {...dropDownRenderProps}/>}
            onChange={triggerChange}
        />
    )
}

export default TargetServer
