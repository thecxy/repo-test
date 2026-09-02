import I18N from '@src/i18n'
import { useMemo } from 'react'
import { prop } from 'ramda'
import urlJoin from 'url-join'
import { useDispatch } from 'react-redux'

import {
    convertConsumeTime,
    formatTimeStamp,
} from '@src/utils'
import {
    FAILED,
    IGNORE_ERROR,
    RUN_STATUSES,
    SUCCESS
} from '../../constant'
import { PUBLIC_ROUTE } from '@src/constant'
import { useExecuteDetail } from '@src/pages/AgentDetail/ExecutiveList/hook'
import { ExecutionDetail, StageTrigger } from '@src/pages/AgentDetail/ExecutiveList/executiveTypes'
import { entirelyRetry } from '../../executiveSlice'

const useStepCard = (
    detail: StageTrigger,
    executeCallback: ()=>void
) => {
    const dispatch = useDispatch()
    const {
        currentExecute: executionDetail,
    } = useExecuteDetail()
    const name = prop('name', detail)

    const viewLog = () => {
        const {
            id: executeId,
            workPlanId: detailId
        } = executionDetail as ExecutionDetail

        const { id: stepId } = detail
        const {
            pathname,
            origin
        } = window.location
        const mainPath = pathname.split(PUBLIC_ROUTE)[0]
        const params = `${detailId}/${executeId}/${stepId}`
        window.open(urlJoin(origin, mainPath, '_noah/exec/step/log', params))
    }

    // NOTE  步骤类型
    const stageTriggerItemList = prop('stageTriggerItemList', detail) || []

    const stageTriggerItemParams = prop('stageTriggerItemParams', stageTriggerItemList[0])

    // 是否忽略错误 	错误是否被忽略：0：否；1：是
    const ignoreError = prop('ignoreError', detail)

    // 人工确认结果（不通过或通过）
    const stageConfirmResult = prop('stageConfirmResult', stageTriggerItemParams)

    const timeDetails = useMemo(() => {
        if (!detail) {
            return []
        }
        const {
            beginTime,
            endTime
        } = detail
        const endTimeObj = {
            label: I18N.ExecutiveList.ExecDetailDrawer.jieShuShiJian,
            value: formatTimeStamp(endTime)
        }

        return [
            {
                label: I18N.ExecutiveList.ExecDetailDrawer.kaiShiShiJian,
                value: formatTimeStamp(beginTime)
            },
            endTimeObj
        ]
    }, [detail])

    const consumeObj = {
        label: I18N.ExecutiveList.ExecDetailDrawer.haoShi,
        value: convertConsumeTime(detail)
    }

    const operations = useMemo(() => {
        const {
            runStatus,
            ignoreError
        } = detail

        // 快速执行不显示 忽略错误
        // const ignoreErrorObj = {
        //     label: '忽略错误',
        //     execution: ({ id }: { id: number }) => dispatch(neglectErrors(id)),
        //     disabled: !!ignoreError
        // }

        const failedOperations = [
            // ignoreErrorObj,
            {
                label: I18N.ExecutiveList.ExecDetailDrawer.quanBuZhuJiZhong,
                execution: ({ id }: { id: number }) => {
                    dispatch(entirelyRetry(id))
                    executeCallback()
                },
                disabled: !!ignoreError
            }
        ]

        const viewLogObj = {
            label: I18N.ExecutiveList.ExecDetailDrawer.chaKanRiZhi,
            execution: viewLog
        }

        const tempArr = []
        if (runStatus === FAILED.value) {
            tempArr.unshift(...failedOperations)
        }
        if (runStatus === FAILED.value || runStatus === SUCCESS.value) {
            tempArr.push(viewLogObj)
        }
        return tempArr
    }, [detail, viewLog])

    const runStatusLabel = useMemo(() => {
        const getTitle = () => {
            if (ignoreError) {
                return IGNORE_ERROR.label
            }
            return RUN_STATUSES.get(detail?.runStatus)?.label
        }
        return getTitle()
    }, [detail, ignoreError, stageConfirmResult])

    return {
        timeDetails,
        consumeObj,
        operations,
        name,
        runStatusLabel,
    }
}

export default useStepCard
