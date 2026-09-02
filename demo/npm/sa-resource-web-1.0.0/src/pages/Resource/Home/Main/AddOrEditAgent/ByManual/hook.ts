import { useEffect, useRef } from 'react'
import {
    byManualSliceNameSpace,
    getManualScript,
    updateNextButtonDisabled,
    updateStatusDataList
} from '@src/pages/Resource/Home/Main/AddOrEditAgent/ByManual/byManualSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@src/store'
import { REMOTE_INSTALL_STATUS } from '@src/constant/constantWithReactFC'
import { request } from '@src/request/fetch'
import { assembleRequestUrl } from '@src/utils'
import { FETCH_MANUAL_INSTALL_STATUS } from '@src/pages/Resource/constants/apis'
import { MILLI_SECOND_STEP, REQUEST_CODE } from '@src/constant'
import { useAgentOperationType, useAgentStep } from '@src/pages/Resource/Home/Main/AddOrEditAgent/hook'
import { StatusData } from '../addOrEditTypes'
import useSwitch from '@react-hook/switch'
import { useAddAgentModal } from '@src/pages/Resource/hook'
import { useBySSHData } from '@src/pages/Resource/Home/Main/AddOrEditAgent/BySSH/hook'
import { useUuid } from '@src/pages/AgentDetail/hook'
import { AGENT_OPERATION } from '@src/pages/Resource/constants/constant'

export const useByManual = () => {
    const byManualData = useSelector((state: RootState) => state[byManualSliceNameSpace])
    return {
        byManualData
    }
}

export const useFirstProgress = () => {
    const uuidFromUrl = useUuid()
    const dispatch = useDispatch()
    const {isFirstProcess, addAgentType, agentOperation} = useAgentStep()
    const { isAdding} = useAgentOperationType()

    const {
        byManualData,
    } = useByManual()

    const {
        manualScripts,
    } = byManualData

    const { visible } = useAddAgentModal()
    const {goBackFromNextProcessOrStep} = useBySSHData()

    useEffect(() => {
        if (visible) {
            let uuid = (isAdding && isFirstProcess && !goBackFromNextProcessOrStep) ? '' : manualScripts[addAgentType].uuid || uuidFromUrl;
            if(agentOperation === AGENT_OPERATION.RE_CONNECT.value) {
                uuid = uuidFromUrl;
            }            
            dispatch(getManualScript(uuid))
        }
    }, [visible, isFirstProcess, goBackFromNextProcessOrStep])
    return null
}

export const useSecondProgress = () => {
    const [missionFailed, toggleFailed] = useSwitch(false)

    const {
        byManualData,
    } = useByManual()
    const {
        manualScripts,
        nextButtonDisabled,
        statusDataList
    } = byManualData
    const { addAgentType } = useAgentStep()
    const dispatch = useDispatch()

    const timerRef = useRef<number | undefined>()

    const updateManualInstallStatus = async (uuid: string) => {
        const res = await request({
            url: assembleRequestUrl(FETCH_MANUAL_INSTALL_STATUS.expand({ uuid }))
        })

        const {
            code,
            data
        } = res as unknown as {
            code: number,
            data: StatusData[]
        }
        if (code === REQUEST_CODE.SUCCESS) {
            dispatch(updateStatusDataList(data))
            const allSuccess = data.every((item: StatusData) => item.installStatus === REMOTE_INSTALL_STATUS.SUCCESS)
            const someFailed = data.some((item: StatusData) => item.installStatus === REMOTE_INSTALL_STATUS.FAIL)
            dispatch(updateNextButtonDisabled(!allSuccess))
            if (someFailed) {
                toggleFailed.on()
            }
            clearTimeout(timerRef.current)
            if (!allSuccess) {
                timerRef.current = window.setTimeout(() => {
                    updateManualInstallStatus(uuid)
                }, 5 * MILLI_SECOND_STEP)
            }
        } else {
            dispatch(updateNextButtonDisabled(true))
        }
    }

    useEffect(() => {
        updateManualInstallStatus(manualScripts[addAgentType].uuid)
        return () => {
            dispatch(updateStatusDataList(null))
            // dispatch(updateNextButtonDisabled(true))
            clearTimeout(timerRef.current)
        }
    }, [])

    return {
        statusDataList,
        nextButtonDisabled,
        hideLoading: missionFailed || !nextButtonDisabled
    }
}
