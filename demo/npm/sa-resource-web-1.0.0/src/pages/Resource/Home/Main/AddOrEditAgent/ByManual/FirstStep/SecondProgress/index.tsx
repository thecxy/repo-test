/**
 * 添加 agent 步骤一阶段2
 * @constructor
 */
import I18N from '@src/i18n'
import React from 'react'
import {
    secondProgressContainer,
    title,
    subTitle,
    secondStepsContainer,
    stepItem,
    stepDescription,
    stepTitle,
    stepIcon,
    mainInfo
} from './index.less'
import GiteeLoading from '@com/GiteeLoading'
import { REMOTE_INSTALL_STATUS_MAP } from '@src/constant/constantWithReactFC'
import { useSecondProgress } from '../../hook'

const SecondProgress: React.FC = () => {

    const {
        statusDataList,
        hideLoading
    } = useSecondProgress()

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
    </div>
}

export default SecondProgress
