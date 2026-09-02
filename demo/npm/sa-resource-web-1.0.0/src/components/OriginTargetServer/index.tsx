/* eslint-disable */
// @ts-nocheck
import I18N from '@src/i18n'
import { TreeSelect } from 'antd'
import React, { useEffect, useState } from 'react'

import DropDownRender from './DropDownRender'

import {
    AGENT_STATUS,
    AGENT_TERMINAL_TYPE,
    SERVICE_UNIT
} from '@src/constant'
import {
    assembleRequestUrl,
    debounceWith250ms,
    debounceWith500ms,
    getDefaultPopupContainer
} from '@src/utils'
import { GLOBAL_URLS } from '@src/pages/Resource/constants/apis'
import { request } from '@src/request/fetch'
import { formatData } from '@src/pages/Resource/components/TargetServer/util'
import { useAgentDetailData } from '@src/pages/AgentDetail/hook'
import DownOutlined from '@src/statics/icons/down.svg'

const TargetServer = ({
    field,
    handleChange,
    visible,
    multiple = true,
    allowClear = true,
    resetUserInputError,
    disabled,
    name,
}) => {

    const [needUpdate, setNeedUpdate] = useState(false)
    const [loading, setLoading] = useState(false)
    const {currentAgentDetail} = useAgentDetailData()

    const [treeData, setTreeData] = useState([])
    const [labelMap, setLabelMap] = useState({})
    // const [agentMap, setAgentMap] = useState({})
    const [agentMapByUuid, setAgentMapByUuid] = useState({})
    const [type, setType] = useState(currentAgentDetail.type || AGENT_TERMINAL_TYPE.LINUX.value)
    const [labelName, setLabelName] = useState('')
    const handleSearch = debounceWith250ms(e => setLabelName(e))

    const handleChangeType = e => {
        handleSearch('')
        setType(e.target.value)
    }

    const fetchAgents = async () => {

        return request({
            url: assembleRequestUrl(GLOBAL_URLS.AGENTS),
            params: {
                agentName: labelName,
                serviceUnit: SERVICE_UNIT.Opera,
                type,
            },
        })
    }

    const fetchLabels = async () => {
        return request({
            url: assembleRequestUrl(GLOBAL_URLS.LABELS),
            params: {
                labelName,
                serviceUnit: SERVICE_UNIT.Opera,
                type
            },
        })
    }

    const updateData = debounceWith500ms(async () => {
        if (!needUpdate) {
            return
        }
        setNeedUpdate(false)
        setTreeData([])
        let tempAgents
        let tempLabels
        setLoading(true)
        const [agentRes, labelRes] = await Promise.all([fetchAgents(), fetchLabels()])
        const { data: agents } = agentRes
        setLoading(false)

        const { data: labels } = labelRes

        tempAgents = agents
        tempLabels = labels
        const {
            labelMap,
            tempLabels: treeData,
            // agentMap,
            agentMapByUuid
        } = formatData(tempAgents, tempLabels)
        setTreeData(treeData.filter(item => item))
        // setAgentMap(agentMap)
        setLabelMap(labelMap)
        setAgentMapByUuid(agentMapByUuid)
    })

    const getActiveAgentInfoByLabel = labelId => {
        const label = labelMap[labelId]
        if (label.deleteStatus) {
            return []
        }
        const children = label?.children
        const length = children?.length
        const res = []
        for (let i = 0; i < length; i++) {
            const child = children[i]
            if (child?.status === AGENT_STATUS.ONLINE) {
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

    const onChange = e => {
        const agents = []
        if (multiple) {
            for (let i = 0; i < e.length; i++) {
                const item = e[i]
                agents.push(...filterAgent(item))
            }
        } else {
            agents.push(...filterAgent(e))
        }
        handleChange(agents, agentMapByUuid)
    }

    useEffect(() => {
        setNeedUpdate(visible)
    }, [visible])

    useEffect(() => {
        updateData()
    }, [needUpdate])

    useEffect(() => {
        setNeedUpdate(true)
    }, [labelName, type])

    const dropDownRenderProps = {
        type,
        handleChangeType,
        loading
    }
    return (
        <TreeSelect
            name={name}
            showSearch
            className={'agent-select-tree'}
            dropdownStyle={{
                maxHeight: 400,
                overflow: 'auto',
                width: '100%'
            }}
            placeholder={I18N.OriginTargetServer.index.qingXuanZeMuBiao}
            showArrow
            allowClear={allowClear}
            multiple={multiple}
            onSearch={handleSearch}
            treeData={treeData}
            filterTreeNode={false}
            getPopupContainer={getDefaultPopupContainer}
            treeDefaultExpandAll
            dropdownClassName={'agent-select-tree-dropdown'}
            onFocus={resetUserInputError}
            disabled={disabled}
            dropdownRender={originNode => <DropDownRender originNode={originNode} {...dropDownRenderProps} />}
            {...field}
            suffixIcon={<DownOutlined />}
            onChange={onChange}
        />
    )
}

export default TargetServer
