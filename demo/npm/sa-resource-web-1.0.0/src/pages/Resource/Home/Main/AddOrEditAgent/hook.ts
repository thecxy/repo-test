import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@src/store'
import { nextProcess, previousProcess, resourceNameSpace, updateAddAgentStep } from '@src/pages/Resource/resourceSlice'
import {
    ADD_AGENT_MODE,
    ADD_AGENT_STEP,
    ADD_AGENT_STEP_OR_PROGRESS_TITLE, AGENT_OPERATION,
    FIRST_STEP_PROGRESS, RE_CONNECT_AGENT_MODE
} from '@src/pages/Resource/constants/constant'
import { useMemo } from 'react'
import { checkIfUnallocatedGroup } from '@src/utils'
import { useAgentGroupData } from '@src/pages/Resource/components/AgentGroupTree/hook'
import { GROUP_TYPE } from '@src/constant'

export const useAgentStep = () => {
    const {
        addAgentStep: currentStep,
        addAgentFirstStepProcess,
        addAgentType,
        addAgentMode,
        agentOperation,
    } = useSelector((state: RootState) => state[resourceNameSpace])
    const dispatch = useDispatch()
    const previous = (step: number | null) => {
        dispatch(updateAddAgentStep(step ? step : currentStep - 1))
    }
    const next = () => {
        dispatch(updateAddAgentStep(currentStep + 1))
    }
    const previousToFirstProgress = (process: number) => {
        dispatch(previousProcess(process))
    }
    const updateToNextProcess = (process: number) => {
        dispatch(nextProcess(process))
    }
    const isFirstStep = currentStep === ADD_AGENT_STEP.FIRST_STEP
    const isThirdStep = currentStep === ADD_AGENT_STEP.THIRD_STEP
    const {
        FIRST_PROGRESS,
        THIRD_PROGRESS,
        SECOND_PROGRESS
    } = FIRST_STEP_PROGRESS
    const currentTitle = useMemo(() => {
        if (isFirstStep) {
            return ADD_AGENT_STEP_OR_PROGRESS_TITLE[addAgentMode][ADD_AGENT_STEP.FIRST_STEP][addAgentFirstStepProcess].title
        } else {
            return ADD_AGENT_STEP_OR_PROGRESS_TITLE[addAgentMode][currentStep].title
        }
    }, [isFirstStep, addAgentMode, currentStep, addAgentFirstStepProcess])

    return {
        currentStep,
        agentOperation,
        previous,
        currentStepProcessRent: isFirstStep ? addAgentFirstStepProcess * FIRST_PROGRESS / THIRD_PROGRESS * 100 : undefined,
        currentStepProcess: isFirstStep ? addAgentFirstStepProcess : undefined,
        next,
        updateToNextProcess,
        previousToFirstProgress,
        isFirstProcess: isFirstStep && addAgentFirstStepProcess === FIRST_PROGRESS,
        isSecondProcess: isFirstStep && addAgentFirstStepProcess === SECOND_PROGRESS,
        isThirdProcess: isFirstStep && addAgentFirstStepProcess === THIRD_PROGRESS,
        isFirstStep,
        isThirdStep,
        addAgentType,
        addAgentMode,
        currentTitle,
        isSSHInstall: addAgentMode === ADD_AGENT_MODE.SSH.value
    }
}

export const useAgentOperationType = () => {
    const {
        agentOperation,
    } = useSelector((state: RootState) => state[resourceNameSpace])
    const {
        ADD,
        RE_CONNECT
    } = AGENT_OPERATION
    let agentOperationType = ADD_AGENT_MODE
    if (agentOperation === RE_CONNECT.value) {
        agentOperationType = RE_CONNECT_AGENT_MODE
    }
    return {
        agentOperation,
        agentOperationType,
        isAdding: agentOperation === ADD.value,
        isReconnect: agentOperation === RE_CONNECT.value
    }
}

export const useAuthorizeProjectsDisabled = () => {
    const agentGroupData = useAgentGroupData()
    const { currentAgentGroup } = agentGroupData
    const isProjectGroup = currentAgentGroup?.groupType === GROUP_TYPE.PROJECT
    // 禁止分配项目的情况：
    // 1. 未分配主机组
    // 2. 当前主机组类型为 项目级主机组
    return checkIfUnallocatedGroup(currentAgentGroup.displayName).flag || isProjectGroup
}
