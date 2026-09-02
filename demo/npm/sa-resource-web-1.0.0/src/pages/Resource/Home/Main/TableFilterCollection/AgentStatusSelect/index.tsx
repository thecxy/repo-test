// 主机状态过滤
import React from 'react'
import { selectContainer, select } from './index.less'
import { AGENT_STATUS } from '@src/constant'
import AntdSelect from '@com/AntdSelect'

type operationCollectionProps = {
    value: number | null,
    onChange: (target: number) => void
}
const options = Object.values(AGENT_STATUS)

const AgentStatusSelect: React.FC<operationCollectionProps> = ({
    value,
    onChange
}) => {
    const selectProps = {
        className: select,
        bordered: false,
        options,
        style: { width: 100 },
        onChange,
        value,
    }
    return <div className={selectContainer}>
        <AntdSelect {...selectProps}/>
    </div>
}

export default AgentStatusSelect
