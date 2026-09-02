import I18N from '@src/i18n'
import { useMemo } from 'react'
import { prop, propOr } from 'ramda'

import { convertConsumeTime, formatTimeStamp } from '@src/utils'
import { executeStatus, status1, status2, status3, status4, status5, status6 } from './index.less'
import { RUN_STATUSES } from '../constant'
import { DEFAULT_STRING_VALUE } from '@src/constant'
import { useExecuteDetail } from '@src/pages/AgentDetail/ExecutiveList/hook'
import { ExecutionDetail } from '@src/pages/AgentDetail/ExecutiveList/executiveTypes'

const statues = ['', status1, status2, status3, status4, status5, status6]

const useExecDetail = () => {
    const { currentExecute } = useExecuteDetail()
    const executionDetail = currentExecute as ExecutionDetail
    const title = useMemo(() => {
        return I18N.get(I18N.ExecutiveList.ExecDetailDrawer.zuoYeEXE, { val1: executionDetail?.name || DEFAULT_STRING_VALUE })
    }, [executionDetail])

    const userName = prop('userName', executionDetail)

    // 是否忽略错误
    // @ts-ignore
    const ignoreError = prop('ignoreError', executionDetail)

    // 步骤列表
    const stageTriggerList = propOr([], 'stageTriggerList', executionDetail)

    const beginTime = useMemo(() => {
        const beginTime = (executionDetail)?.beginTime
        return formatTimeStamp(beginTime)
    }, [executionDetail])

    const runStatus = useMemo(() => {
        //    runStatus	执行状态 1：待执行；2：执行中；3：执行失败；4：执行成功；5：执行暂停；
        return (
            <span className={`${executeStatus} ${statues[executionDetail?.runStatus]}`}>
                {RUN_STATUSES.get((executionDetail)?.runStatus)?.label}
            </span>
        )

    }, [executionDetail])

    const headerDetail = [
        {
            label: I18N.ExecutiveList.ExecDetailDrawer.faQiRen,
            value: userName,
        },
        {
            label: I18N.ExecutiveList.ExecDetailDrawer.faQiShiJian,
            value: beginTime,
        },
        {
            label: I18N.ExecutiveList.ExecDetailDrawer.zhuangTai,
            value: runStatus,
        },
        {
            label: I18N.ExecutiveList.ExecDetailDrawer.zongHaoShi,
            value: convertConsumeTime(executionDetail),
        },
    ]

    return {
        title,
        headerDetail,
        stageTriggerList,
        ignoreError,
    }
}

export default useExecDetail
