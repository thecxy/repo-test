import React from 'react'

import {
    execStepCardGrid,
    execStepCardKey,
    execStepCardValue
} from '../index.less'
import { ConsumeObj } from '@src/pages/AgentDetail/ExecutiveList/executiveTypes'

type TimeItemProps = {
    item: ConsumeObj
}
const TimeItem: React.FC<TimeItemProps> = ({ item }) => {
    return (
        <span className={execStepCardGrid}>
            <span className={execStepCardKey}>{item?.label}</span>
            <span className={execStepCardValue}>{item?.value}</span>
        </span>
    )
}

export default TimeItem
