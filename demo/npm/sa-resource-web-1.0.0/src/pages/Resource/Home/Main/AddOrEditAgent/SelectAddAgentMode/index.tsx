/**
 * 切换安装主机类型(linux|windows)
 */
import I18N from '@src/i18n'
import React from 'react'
import { updateAgentType } from '@src/pages/Resource/resourceSlice'
import { AGENT_TERMINAL_TYPE } from '@src/constant'
import { ADD_AGENT_STEP } from '@src/pages/Resource/constants/constant'
import { Radio, RadioChangeEvent } from 'antd'
import { useAgentStep } from '@src/pages/Resource/Home/Main/AddOrEditAgent/hook'
import { useDispatch } from 'react-redux'
import {groupContainer} from './index.less'

type SelectAddAgentModeProps = {
    disabled?: boolean
}
const SelectAddAgentMode: React.FC<SelectAddAgentModeProps> = ({ disabled = false }) => {
    const dispatch = useDispatch()

    const handleChangeAgentType = (e: RadioChangeEvent) => {
        dispatch(updateAgentType(e.target.value))
    }
    const {
        currentStep,
        isFirstProcess,
        addAgentType
    } = useAgentStep()

    return <Radio.Group
        className={groupContainer}
        optionType='button'
        disabled={disabled}
        options={Object.values(AGENT_TERMINAL_TYPE).map(item => {
            return {
                ...item,
                label: I18N.get(I18N.Home.Main.iTEML, { val1: item.label }),
                disabled: (currentStep !== ADD_AGENT_STEP.FIRST_STEP || !isFirstProcess) && addAgentType !== item.value
            }
        })}
        value={addAgentType}
        onChange={handleChangeAgentType}
    />
}

export default SelectAddAgentMode
