import { RootState } from '@src/store'
import {
    bySSHSliceNameSpace,
} from '@src/pages/Resource/Home/Main/AddOrEditAgent/BySSH/slice'
import { REMOTE_INSTALL_STATUS } from '@src/constant/constantWithReactFC'
import { request } from '@src/request/fetch'
import { assembleRequestUrl } from '@src/utils'
import { FETCH_REMOTE_INSTALL_STATUS } from '@src/pages/Resource/constants/apis'
import { MILLI_SECOND_STEP, REQUEST_CODE } from '@src/constant'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import useSwitch from '@react-hook/switch'
import { useByManual } from '@src/pages/Resource/Home/Main/AddOrEditAgent/ByManual/hook'
import { useAgentStep } from '@src/pages/Resource/Home/Main/AddOrEditAgent/hook'
import { ADD_AGENT_MODE } from '@src/pages/Resource/constants/constant'
import { agentDetailNameSpace, getAgent } from '@src/pages/AgentDetail/agentDetailSlice'

export const useBySSHData = () => {
    const {
        goBackFromNextProcessOrStep,
        firstRequestData,
        firstProgressFormValues,
        firstResponseData,
        secondResponseData,
        loading,
        testLoading,
        currentAgentGroupId
    } = useSelector((state: RootState) => state[bySSHSliceNameSpace])

    return {
        goBackFromNextProcessOrStep,
        firstRequestData,
        firstProgressFormValues,
        firstResponseData,
        loading,
        testLoading,
        secondResponseData,
        currentAgentGroupId
    }
}

export const useSecondProgress = () => {
    type StatusData = {
        installStatus: REMOTE_INSTALL_STATUS
        sortIndex: number
        stepMessage: null | string
        stepTitle: string
        updateTime: number
    }
    const timerRef = useRef<number | undefined>()

    const [statusDataList, setStatusDataList] = useState<StatusData[] | null>(null)
    const [nextButtonDisabled, toggleDisabled] = useSwitch(true)
    const [missionFailed, toggleFailed] = useSwitch(false)
    const updateRemoteInstallStatus = async (uuid: string) => {
        const res = await request({
            url: assembleRequestUrl(FETCH_REMOTE_INSTALL_STATUS.expand({ uuid }))
        })
        const {
            code,
            data
        } = res as unknown as {
            code: number,
            data: StatusData[]
        }
        clearTimeout(timerRef.current)

        if (code === REQUEST_CODE.SUCCESS) {
            setStatusDataList(data)
            data.every(item => item.installStatus === REMOTE_INSTALL_STATUS.SUCCESS) ? toggleDisabled.off() : toggleDisabled.on()
            if (data.some(item => item.installStatus === REMOTE_INSTALL_STATUS.FAIL)) {
                toggleFailed.on()
            }
            timerRef.current = window.setTimeout(() => {
                updateRemoteInstallStatus(uuid)
            }, 5 * MILLI_SECOND_STEP)
        } else {
            toggleDisabled.on()
        }
    }
    const {
        firstResponseData,
    } = useSelector((state: RootState) => state[bySSHSliceNameSpace])
    useEffect(() => {
        updateRemoteInstallStatus(firstResponseData.uuid)
        return () => {
            setStatusDataList(null)
            toggleDisabled.on()
            clearTimeout(timerRef.current)
        }
    }, [])

    return {
        statusDataList,
        nextButtonDisabled,
        hideLoading: missionFailed || !nextButtonDisabled
    }
}

export const useThirdProgress = () => {
    const dispatch = useDispatch()
    const {
        firstResponseData,
        loading
    } = useSelector((state: RootState) => state[bySSHSliceNameSpace])
    const {
        currentAgentDetail,
        loading: detailLoading
    } = useSelector((state: RootState) => state[agentDetailNameSpace])
    const {
        addAgentType,
        addAgentMode
    } = useAgentStep()
    const { byManualData } = useByManual()
    const manualUuid = byManualData.manualScripts[addAgentType].uuid
    const remoteUuid = firstResponseData.uuid
    const uuid = addAgentMode === ADD_AGENT_MODE.SSH.value ? remoteUuid : manualUuid
    useEffect(() => {
        dispatch(getAgent(uuid))
    }, [])
    return {
        loading: loading || detailLoading,
        currentAgentDetail
    }
}
