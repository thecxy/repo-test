/**
 * TreeTitle 主机组树title
 */
import I18N from '@src/i18n'
import React, { useCallback, MouseEvent, useState } from 'react'
import { Button, Dropdown, Menu, MenuProps } from 'antd'
import { omit, pick } from 'ramda'
import { useDispatch } from 'react-redux'

import { treeTitle, dropDownCss, dragIcon, leafStyle, moreOperateButton, fixToggle, toggleActive } from './index.less'
import { AGENT_GROUP_OPERATION } from '@src/pages/Resource/constants/constant'
import { AgentGroupOperationLabel, AgentGroupOperationType } from '@src/pages/Resource/resourceTypes'
import Title from './Title'
import {
    useAddAgentGroupModal,
    useAgentGroupOperation,
    useDeleteAgentGroup
} from '@src/pages/Resource/components/AddGroupModal/hooks'
import { GROUP_TYPE } from '@src/constant'
import { updateCurrentAgentGroupId } from '../agentGroupTreeSlice'
import {
    updateCurrentAgentGroupId as updateCurrentAgentGroupIdByModal
} from '@src/pages/Resource/components/AddGroupModal/slice'
import IconFont from '@com/Iconfont'
import { generateGroupType } from '@src/utils'
import { useSelectTreeRole } from '@src/pages/Resource/hook'

type TreeTitleProps = {
    title: string,
    titleDom: any,
    showOperation: boolean
    disabled: boolean
    level: number
    id: number
    groupType: GROUP_TYPE
    childCount: number,
    viewOnly?: boolean,
    isLeaf: boolean,
    isAdding: boolean
    containerWidth: number,
    draggableFromParent: boolean
}
const TreeTitle: React.FC<TreeTitleProps> = ({
    title,
    titleDom,
    disabled,
    level,
    id,
    groupType,
    childCount,
    isLeaf,
    viewOnly = false,
    isAdding,
    containerWidth,
    draggableFromParent,
    showOperation
}) => {
    const [visible, setVisible] = useState(false)
    const { toggleAddAgentGroupModal } = useAddAgentGroupModal()
    const { currentAgentGroupId } = useSelectTreeRole()
    const { toggleAgentGroupOperation } = useAgentGroupOperation()
    const { confirmDeleteAgentGroup } = useDeleteAgentGroup()
    const dispatch = useDispatch()
    const handleMenuClick: MenuProps['onClick'] = e => {
        const { key } = e
        const {
            VIEW,
            EDIT,
            DELETE
        } = AGENT_GROUP_OPERATION
        toggleAgentGroupOperation(key as AgentGroupOperationLabel)
        dispatch(updateCurrentAgentGroupId(id))
        dispatch(updateCurrentAgentGroupIdByModal(id))
        switch (key) {
            case VIEW.value:
                toggleAddAgentGroupModal(true)
                break
            case EDIT.value:
                toggleAddAgentGroupModal(true)
                break
            case DELETE.value:
                confirmDeleteAgentGroup(title, id)
                break
        }
        setVisible(false);
    }
    const isSelected = id === currentAgentGroupId
    const {
        ADD,
        MOVETO,
        VIEW,
        EDIT,
        DELETE,
        DEFAULT
    } = AGENT_GROUP_OPERATION
    const {
        isEnterprise
    } = generateGroupType()
    const isEnterpriseAgentGroup = groupType === GROUP_TYPE.ENTERPRISE
    const disableDeleteAndEditButton = !isEnterprise && isEnterpriseAgentGroup
    // 项目设置中不可以删除和编辑企业级主机组
    const operationList = viewOnly ? pick([VIEW.value], AGENT_GROUP_OPERATION) : omit([MOVETO.value, ADD.value, DEFAULT.value], AGENT_GROUP_OPERATION)
    const items = Object.values(operationList as AgentGroupOperationType).map(({
        label,
        value
    }) => ({
        // 删除分组|编辑分组|查看分组
        label: I18N.get(I18N.components.AgentGroupTree.lABEL, { val1: label }),
        key: value,
        disabled: disableDeleteAndEditButton && ([EDIT.value, DELETE.value].some(item => item === value))
    }))

    const titleProps = {
        disabled,
        level,
        title: titleDom,
        groupType,
        childCount,
        viewOnly,
        id,
        isLeaf,
        containerWidth,
        isAdding,
        isSelected
    }

    const handleClickToggle = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setVisible(false);
    }, [])

    return <div
        title=""
        className={`${treeTitle}`}
    >
        {/* TODO: 去除isShowOperate的判定，改用css判断是否显示 （如有更优方案再行修改） */}
        {
            draggableFromParent && <div className={`${dragIcon} ${isLeaf ? leafStyle : ''}`}>
                <IconFont type={'iconMove'} />
            </div>
        }
        <Title {...titleProps} />
        {
            showOperation && <div className={`${dropDownCss} ${visible ? fixToggle : null}`}>
                <Dropdown
                    visible={visible}
                    trigger={['click']}
                    placement="bottomRight"
                    onVisibleChange={(visible) => { setVisible(visible) }}
                    overlay={
                        <Menu
                            onClick={(e) => handleMenuClick(e)}
                            items={items}
                            style={{ width: 128 }}
                        />}>
                    <Button
                        type={'text'}
                        onClick={handleClickToggle}
                        className={`${moreOperateButton} ${visible ? toggleActive : null}`}
                        icon={<IconFont type={'iconMoreoperations-copy'} />}
                    />
                </Dropdown>
            </div>
        }

        {/* } */}
    </div>
}

export default TreeTitle

