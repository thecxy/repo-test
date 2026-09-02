import I18N from '@src/i18n'
import { useAddAgentModal, useAgentGroup } from '@src/pages/Resource/hook'
import { Button } from 'antd'
import React, { useEffect, useRef } from 'react'
import { thirdContainer, successIcon, title, tip, top, bottom, tips, inner } from './index.less'
import IconFont from '@com/Iconfont'
import { MILLI_SECOND_STEP } from '@src/constant'
import { useDispatch } from 'react-redux'
import { updateManualRefresh } from '@src/pages/Resource/resourceTableSlice'
import { useFetchTableData } from '@src/pages/Resource/Home/Main/TableFilterCollection/hook'
import { useBySSHData } from '../hook'
import { useAgentOperationType } from '@src/pages/Resource/Home/Main/AddOrEditAgent/hook'
import { useNavigate } from 'react-router-dom'
import { generateFullPath } from '@src/utils'
import { routes } from '@src/routes'
import { useAgentGroupOperation } from '@src/pages/Resource/components/AddGroupModal/hooks'
import { AGENT_OPERATION } from '@src/pages/Resource/constants/constant'

// 当前步骤在返回上一步的时候由于第二步的作用是检测状态，所以会直接返回到第一步

const SSHThirdStep: React.FC = () => {
    const { secondResponseData } = useBySSHData()
    const { toggleVisible } = useAddAgentModal()
    const { manualRefresh } = useFetchTableData()
    const timerRef = useRef<number | undefined>()
    const dispatch = useDispatch()
    const { agentOperation } = useAgentOperationType()
    const { toggleAgentOperation } = useAgentGroupOperation()
    const { resetAgentGroups } = useAgentGroup()

    const navigate = useNavigate()
    const handleComplete = () => {
        toggleVisible()
        // 更新主机组树
        resetAgentGroups()
        navigate(generateFullPath(routes.HOME.path))
        // 更新主机
        dispatch(updateManualRefresh(!manualRefresh))
        toggleAgentOperation(AGENT_OPERATION.DEFAULT.value)
    }

    useEffect(() => {
        timerRef.current = window.setTimeout(() => {
            handleComplete()
        }, 5 * MILLI_SECOND_STEP)
        return () => {
            clearTimeout(timerRef.current)
        }
    }, [])
    return <div className={thirdContainer}>
        <div className={top}>
            <div className={inner}>
                <IconFont type={'iconSuccess-1'} className={successIcon}/>
                <div className={tips}>
                    {/* {{主机名称}}添加成功 */}
                    <p className={title}>
                        <span>{secondResponseData.name}</span>
                        {AGENT_OPERATION[agentOperation].label}{I18N.constant.constantWithReactFC.chengGong}</p>
                    <p className={tip}>{I18N.Home.Main.sHouZiDongFan}</p>
                </div>
            </div>
        </div>
        <div className={bottom}>
            <Button type={'primary'} onClick={handleComplete}>{I18N.Home.Main.wanCheng}</Button>
        </div>
    </div>
}

export default SSHThirdStep
