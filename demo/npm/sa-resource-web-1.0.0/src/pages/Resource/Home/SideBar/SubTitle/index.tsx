import I18N from '@src/i18n'
import { Button, Tooltip } from 'antd'
import React from 'react'
import { subTitle, left, childCountStyle, addGroupButton, active, hasChildren } from './index.less'
import { AGENT_GROUP_OPERATION, ROOT_TREE_NODE } from '@src/pages/Resource/constants/constant'
import { useAddAgentGroupModal, useAgentGroupOperation } from '@src/pages/Resource/components/AddGroupModal/hooks'
import IconFont from '@com/Iconfont'
import { useSelectTreeRole } from '@src/pages/Resource/hook'
import { MAX_COUNT } from '@src/constant'

type SubTitleProps = {
    displayName: string,
    titleDom: any,
    showOperation?: boolean,
    childCount: number,
    disabled?: boolean
}
const SubTitle: React.FC<SubTitleProps> = ({
    displayName,
    titleDom,
    showOperation,
    childCount,
    disabled
}) => {
    const {
        toggleAddAgentGroupModal
    } = useAddAgentGroupModal()
    const {
        toggleAgentGroupOperation,
    } = useAgentGroupOperation()
    const { currentAgentGroupId } = useSelectTreeRole()

    const handleAddAgentGroup = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation()
        toggleAddAgentGroupModal(true)
        toggleAgentGroupOperation(AGENT_GROUP_OPERATION.ADD.value)
    }
    const isActive = currentAgentGroupId === ROOT_TREE_NODE.id && !disabled
    return <div className={subTitle} title="">
        <div className={`${left} ${isActive ? active : ''} ${hasChildren}`}>
            {titleDom}
            <span className={childCountStyle}>{childCount > MAX_COUNT ? `${MAX_COUNT}+` : childCount}</span>
        </div>
        {showOperation && <Tooltip title={I18N.Home.SideBar.xinJianFenZu}>
            <Button
                type={'text'}
                icon={<IconFont type={'iconAdded'}/>}
                size={'small'}
                className={addGroupButton}
                onClick={handleAddAgentGroup}
            />
        </Tooltip>}
    </div>
}

export default SubTitle
