/**
 * tree title 内部title
 */
import I18N from '@src/i18n'
import React, { useContext,memo } from 'react'
import { GROUP_TYPE, AGENT_GROUP_DISABLED_LEVEL } from '@src/constant'
import { label, icon, activeColor, childCountStyle, titleStyle, hasChildren, titleContainer } from '../index.less'
import { Tooltip } from 'antd'
import { MAX_COUNT } from '@src/constant'
import CorporateIcon from '@src/statics/icons/corporate.svg'
import ProjectIcon from '@src/statics/icons/project.svg'
import { DragSideBarContext } from '@src/components/DragSideBar'

type TitleProps = {
    disabled: boolean
    level: number
    id?: number
    title: string
    isLeaf: boolean
    groupType: GROUP_TYPE
    childCount: number
    viewOnly: boolean
    containerWidth: number
    isAdding: boolean
    isSelected: boolean
}
const Title: React.FC<TitleProps> = ({
    disabled,
    level,
    title,
    groupType,
    childCount,
    isLeaf,
    viewOnly,
    isAdding,
    isSelected,
    containerWidth
}) => {
    const {
        ENTERPRISE,
        PROJECT
    } = GROUP_TYPE
    const TREE_INDENT = 18
    const { width: treeWidth } = useContext(DragSideBarContext);
    const currentWidth = containerWidth || treeWidth
    const TITLE_MAX_WIDTH = `${currentWidth - (TREE_INDENT * level + 120)}px`
    return <span className={label} style={{
        cursor: disabled ? 'not-allowed' : 'pointer'
    }}>

        <div
            className={`${titleStyle} ${isLeaf ? hasChildren : null}`}
        >
            {
                !viewOnly && (
                    <>
                        {
                            groupType === ENTERPRISE &&
                            <Tooltip mouseLeaveDelay={0} title={I18N.components.AgentGroupTree.qiYeJi} placement={'right'}>
                                <span className={`${icon} ${isSelected ? activeColor : null}`}><CorporateIcon /></span>
                            </Tooltip>
                        }
                        {
                            groupType === PROJECT &&
                            <Tooltip mouseLeaveDelay={0} title={I18N.components.AgentGroupTree.xiangMuJi} placement={'right'}>
                                <span className={`${icon} ${isSelected ? activeColor : null}`}><ProjectIcon /></span>
                            </Tooltip>
                        }

                    </>)
            }
            <Tooltip mouseLeaveDelay={0} title={level === AGENT_GROUP_DISABLED_LEVEL && isAdding ? I18N.components.AgentGroupTree.zhuJiFenZuBu : title}>
                <div className={`${titleContainer} ${isSelected ? activeColor : null}`} style={{
                    maxWidth: TITLE_MAX_WIDTH
                }}>{title}</div>
            </Tooltip>
        </div>

        <span className={childCountStyle}>{childCount > MAX_COUNT ? `${MAX_COUNT}+` : childCount}</span>
    </span>
}

export default memo(Title)
