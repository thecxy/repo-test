/**
 *  执行状态Tag
 */
import React from 'react'
import { EXECUTE_STATUS, EXECUTE_STATUS_VALUE } from '@src/pages/AgentDetail/Task/constant'
import { saStatusTag } from './index.less'

type StatusTagProps = {
    status: EXECUTE_STATUS_VALUE
}
const ExecuteStatusTag: React.FC<StatusTagProps> = ({ status }) => {
    const currentStatus = EXECUTE_STATUS[status]
    const {
        label,
        color,
        bgColor: backgroundColor
    } = currentStatus
    return (
        <span
            className={saStatusTag}
            style={{
                color,
                backgroundColor
            }}
        >
            {label}
        </span>
    )
}

export default ExecuteStatusTag
