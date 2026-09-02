/**
 * 作业执行步骤卡片 StepCard
 */

/**
 1：待执行；未开始、执行暂停（如果某步骤执行失败，之后的步骤变成执行暂停）
 2：执行中；执行中、待确认（对于人工确认步骤，执行中状态展示待确认文本）
 3：执行失败；执行失败
 4：执行成功：执行成功
 */
import I18N from '@src/i18n'
import React, { useMemo } from 'react'
import { propOr } from 'ramda'

import {
    execStepCard,
    execStepCardContent,
    execTitle,
    mainContent,
    right,
    top,
    bottom,
    execStatus,
    status1,
    status2,
    status3,
    status4,
    status5,
    status6,
} from './index.less'
import useStepCard from './hook'
import { IGNORE_ERROR } from '../../constant'
import TimeItem from './TimeItem'
import ContentExceptManualConfirm from './ContentExceptManualConfirm'
import {
    ContentExceptManualConfirmProps,
    StageTrigger,
    StageTriggerItem
} from '@src/pages/AgentDetail/ExecutiveList/executiveTypes'

type StepCardProps = {
    detail: StageTrigger,
    stepId: number,
    executeCallback: ()=>void
}
const statues = ['', status1, status2, status3, status4, status5, status6]
const StepCard: React.FC<StepCardProps> = ({
    detail,
    stepId,
    executeCallback,
}) => {

    const {
        consumeObj,
        operations,
        timeDetails,
        name,
        runStatusLabel,
    } = useStepCard(detail,executeCallback)

    // 运行状态
    const runStatus = useMemo(() => {
        const stageTriggerItemList = propOr([], 'stageTriggerItemList', detail) as StageTriggerItem[]

        let hasOvertime = false
        const length = stageTriggerItemList.length
        for (let i = 0; i < length; i++) {
            const item = stageTriggerItemList[i]
            if (item?.hasOvertime === 1) {
                hasOvertime = true
                break
            }
        }

        return (
            <div className={execStatus}>
                <span
                    className={`${execStepCard} ${statues[detail?.ignoreError
                        ? IGNORE_ERROR.styleLabel : detail?.runStatus]}`}
                >
                    {hasOvertime ? I18N.ExecutiveList.ExecDetailDrawer.zhiXingChaoShi : runStatusLabel}
                </span>
            </div>
        )
    }, [detail, runStatusLabel])

    const contentExceptManualConfirmProps: ContentExceptManualConfirmProps = {
        consumeObj,
        operations,
        stepId,
    }

    return (
        <div className={execStepCard}>
            {/* 执行成功 */}
            <div className={execStepCardContent}>
                <div className={execTitle}>{name}</div>
                <div className={mainContent}>
                    {/* 执行状态 */}
                    {runStatus}
                    <div className={right}>
                        <div className={top}>
                            {timeDetails.map(item => <TimeItem item={item} key={item?.label}/>)}
                        </div>
                        <div className={bottom}>
                            <ContentExceptManualConfirm {...contentExceptManualConfirmProps} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default StepCard
