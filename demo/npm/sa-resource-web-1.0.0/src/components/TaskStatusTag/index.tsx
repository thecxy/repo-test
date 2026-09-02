/**
 *  任务状态Tag
 */
import React from 'react'
import { AGENT_STATUS, AGENT_STATUS_VALUE } from '@src/pages/AgentDetail/Task/constant'
import { saStatusTag } from './index.less'

type StatusTagProps = {
    status: AGENT_STATUS_VALUE
}
const TaskStatusTag: React.FC<StatusTagProps> = ({ status }) => {
    const currentStatus = AGENT_STATUS[status]
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
    );
};

export default TaskStatusTag;
