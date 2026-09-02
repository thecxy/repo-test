import I18N from '@src/i18n'
import { updateAgentContainer } from '@src/utils/index.less'
import EllipsisContainer from '@com/EllipsisContainer'
import Iconfont from '@com/Iconfont'
import React from 'react'
import { Tooltip } from 'antd'
import { updateButton, disabled as disabledCss } from './index.less'
import { AGENT_STATUS_ENUM } from '@src/constant'
import { useAgentUpdate } from '@src/pages/Resource/hook'

type UpdateAgentType = {
    version: string,
    itUpgradeable: boolean
    status: AGENT_STATUS_ENUM
    uuid: string,
    callback: () => void
}
const UpdateAgent: React.FC<UpdateAgentType> = ({
    version,
    itUpgradeable,
    status,
    uuid,
    callback
}) => {
    const disabled = status === AGENT_STATUS_ENUM.OFFLINE
    const { handleUpdateAgent } = useAgentUpdate()
    const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
        if (disabled) return
        e.stopPropagation()
        handleUpdateAgent(uuid, callback)
    }

    return <div className={updateAgentContainer}>
        <EllipsisContainer val={version}/>
        {
            itUpgradeable &&
            <Tooltip title={I18N.components.UpdateAgent.aGENT}>
                <Iconfont
                    onClick={handleClick}
                    type={'iconUpgrade'}
                    className={`${updateButton} ${disabled ? disabledCss : null}`}
                />
            </Tooltip>
        }
    </div>
}

export default UpdateAgent
