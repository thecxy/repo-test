import I18N from '@src/i18n'
import React from 'react'
import { firstProgressContainer, tipTitle, manualItemContent, top, bottom } from './index.less'
import {
    useByManual,
    useFirstProgress,
} from '@src/pages/Resource/Home/Main/AddOrEditAgent/ByManual/hook'
import { useAgentOperationType, useAgentStep } from '@src/pages/Resource/Home/Main/AddOrEditAgent/hook'
import { Button, Space, Spin, Typography } from 'antd'
import IconFont from '@com/Iconfont'
import { FIRST_STEP_PROGRESS } from '@src/pages/Resource/constants/constant'
import SecondProgress from '@src/pages/Resource/Home/Main/AddOrEditAgent/ByManual/FirstStep/SecondProgress'
import ThirdProgress from '@src/pages/Resource/Home/Main/AddOrEditAgent/BySSH/FirstStep/ThirdProgress'
import SelectAddAgentMode from '../../../SelectAddAgentMode'

const { Paragraph } = Typography
const FirstProgress: React.FC = () => {
    useFirstProgress()
    const {
        byManualData,
    } = useByManual()
    const {
        manualScripts,
        getManualScriptLoading,
        nextButtonDisabled
    } = byManualData
    const {
        updateToNextProcess,
        isFirstProcess,
        isSecondProcess,
        isThirdProcess,
        next,
        addAgentType
    } = useAgentStep()

    const { isReconnect } = useAgentOperationType()

    const handleNext = () => {
        const {
            FIRST_PROGRESS,
            SECOND_PROGRESS,
            THIRD_PROGRESS
        } = FIRST_STEP_PROGRESS
        let nextProgress = FIRST_PROGRESS
        if (isThirdProcess) {
            next()
        } else {
            if (isFirstProcess) {
                nextProgress = SECOND_PROGRESS
            } else if (isSecondProcess) {
                nextProgress = THIRD_PROGRESS
            }
            updateToNextProcess(nextProgress)
        }
    }

    return <div className={firstProgressContainer}>
        <div className={top}>
            <SelectAddAgentMode disabled={isReconnect} />
            <Spin spinning={getManualScriptLoading}>
                <div className={tipTitle}>{manualScripts[addAgentType].tips}</div>
                {
                    manualScripts[addAgentType].commandList.map(manualScript => {
                        return <div key={manualScript} className={manualItemContent}>
                            <Paragraph copyable={{
                                icon: [<IconFont key="iconcopy" type={'iconcopy'} style={{ color: '#FFF' }}/>],
                            }}>{manualScript}
                            </Paragraph>
                        </div>
                    })
                }
            </Spin>
            {isSecondProcess && <SecondProgress/>}
            {isThirdProcess && <ThirdProgress/>}
        </div>
        <div className={bottom}>
            <Space>
                <Button type="primary" onClick={handleNext} disabled={!isFirstProcess}>{I18N.Home.Main.zhiXingWanCheng}</Button>
                <Button
                    type={'primary'}
                    key="submit"
                    disabled={nextButtonDisabled}
                    onClick={handleNext}
                >{I18N.Home.Main.xiaYiBu}</Button>
            </Space>
        </div>
    </div>
}

export default FirstProgress
