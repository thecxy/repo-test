/**
 * 添加 agent 步骤一阶段2
 * @constructor
 */
import I18N from '@src/i18n'
import { Button, Space } from 'antd'
import React from 'react'
import { FIRST_STEP_PROGRESS } from '@src/pages/Resource/constants/constant'
import {
    secondProgressContainer,
    title,
    subTitle,
    secondStepsContainer,
    stepItem,
    stepDescription,
    stepTitle,
    stepIcon,
    footer,
    mainInfo
} from './index.less'
import GiteeLoading from '@com/GiteeLoading'
import { REMOTE_INSTALL_STATUS_MAP } from '@src/constant/constantWithReactFC'
import { useAgentStep } from '../../../hook'
import { useSecondProgress } from '../../hook'

const SecondProgress: React.FC = () => {
    const {
        previousToFirstProgress,
        updateToNextProcess
    } = useAgentStep()

    const {
        statusDataList,
        nextButtonDisabled,
        hideLoading
    } = useSecondProgress()
    const handlePrevious = () => {
        previousToFirstProgress(FIRST_STEP_PROGRESS.FIRST_PROGRESS)
    }
    return <div className={secondProgressContainer}>
        <div className={mainInfo}>
            {
                !hideLoading && <>
                    <GiteeLoading/>
                    <div className={title}>{I18N.Home.Main.zhengZaiPeiZhiZhu}</div>
                    <div className={subTitle}>{I18N.Home.Main.peiZhiWanChengDa}</div>
                </>
            }

            <div className={secondStepsContainer}>
                {
                    statusDataList?.map((statusData) => <div key={statusData.sortIndex} className={stepItem}>
                        <div className={stepTitle}>
                            <div className={stepIcon}>
                                {REMOTE_INSTALL_STATUS_MAP[statusData.installStatus].icon}
                            </div>
                            <span>{statusData.stepTitle}</span>
                        </div>
                        {statusData.stepMessage && <div className={stepDescription}>{statusData.stepMessage}</div>}
                    </div>)
                }
            </div>
        </div>

        <div className={footer}>
            <Space>
                <Button
                    type={'primary'}
                    onClick={handlePrevious}
                >{I18N.Home.Main.shangYiBu}</Button>
                <Button onClick={() => updateToNextProcess(FIRST_STEP_PROGRESS.THIRD_PROGRESS)}
                        disabled={nextButtonDisabled}> {I18N.Home.Main.xiaYiBu}</Button>
            </Space>
        </div>

    </div>
}

export default SecondProgress
