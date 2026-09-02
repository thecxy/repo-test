/**
 * 操作合集(状态筛选|主机名称、主机别名、IP、MAC、OS 搜索|编辑数据列|批量升级Agent|批量删除)
 */
import I18N from '@src/i18n'
import React from 'react'
import { Button, Space } from 'antd'

import { operationContainer, visible } from './index.less'
import AgentTypeSelect from './AgentStatusSelect'
import {
    useInputFilter,
    useSelectStatus,
} from './hook'
import AgentNameNickNameIPMacOSFilter from './AgentNameNickNameIPMacOSFilter'

type TableFilterCollectionProps = {
    showFilter: boolean,
    closeFilter: () => void
}
const TableFilterCollection: React.FC<TableFilterCollectionProps> = ({ showFilter, closeFilter }) => {

    const {
        agentStatus,
        onChange: SelectOnChange,
        reset: resetSelect,
        hasFilterSelect
    } = useSelectStatus()
    const {
        value,
        onChange,
        reset: resetInput,
        hasFilterInput
    } = useInputFilter()

    const handleReset = () => {
        resetSelect();
        resetInput();
        closeFilter();
    }
    const hasFilter = hasFilterInput || hasFilterSelect;
    return (
        <div className={`${operationContainer} ${showFilter ? visible : null}`}>
            <Space>
                {/*  状态筛选 */}
                <AgentTypeSelect onChange={SelectOnChange} value={agentStatus}/>
                {/* 主机名称、主机别名、IP、MAC、OS 搜索  */}
                <AgentNameNickNameIPMacOSFilter value={value} onChange={onChange}/>
            </Space>
            <Button type="link" disabled={!hasFilter}  onClick={handleReset}>{I18N.Home.Main.qingKong}</Button>
        </div>
    )
}

export default TableFilterCollection
