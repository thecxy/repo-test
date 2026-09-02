/**
 * 作业任务详情查看 Drawer
 */

import { Steps } from 'antd'

import StepCard from './StepCard/StepCard'
import {
    execViewStepContent,
    execViewStepHeaderContainer
} from './index.less'
import { IGNORE_ERROR, RUN_STATUSES } from '../constant'
import useExecDetail from './hook'
import HeaderDetailItem from '../../components/HeaderDetailItem'
import React from 'react'
import { StageTrigger } from '@src/pages/AgentDetail/ExecutiveList/executiveTypes'
import BasicDrawer from '@com/BasicDrawer'

const { Step } = Steps
type ExecDetailDrawerProps = {
    onClose: () => void,
    visible: boolean,
    executeCallback: () => void
}
const ExecDetailDrawer: React.FC<ExecDetailDrawerProps> = ({
    onClose,
    visible,
    executeCallback,
}) => {
    const {
        title,
        headerDetail,
        stageTriggerList,
    } = useExecDetail()
    return (
        <BasicDrawer
            className={'exec-detail-drawer'}
            title={title}
            width={720}
            placement="right"
            onClose={onClose}
            visible={visible}
        >
            <div className={execViewStepHeaderContainer}>
                {headerDetail.map((item: AnyType) => (<HeaderDetailItem key={item?.label} item={item}/>))}
            </div>
            <Steps direction="vertical" className={execViewStepContent}>
                {
                    (stageTriggerList as StageTrigger[]).map((stageTrigger: StageTrigger) => {
                        const icon = stageTrigger?.ignoreError
                            ? IGNORE_ERROR.icon : RUN_STATUSES.get(stageTrigger?.runStatus)?.icon
                        return (
                            <Step
                                key={stageTrigger?.id}
                                status="finish"
                                title={(
                                    <StepCard
                                        executeCallback={executeCallback}
                                        detail={stageTrigger}
                                        stepId={stageTrigger?.id}
                                    />
                                )}
                                icon={icon}
                            />
                        )
                    })
                }
            </Steps>
        </BasicDrawer>
    )
}
export default ExecDetailDrawer
