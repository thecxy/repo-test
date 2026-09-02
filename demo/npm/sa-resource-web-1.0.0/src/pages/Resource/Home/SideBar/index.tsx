import I18N from '@src/i18n'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sideBar, title, container, treePlaceholder, sideBarSelector, visible } from './index.less'
import LeftIcon from '@src/statics/icons/left.svg'
import SaResourceTree from '../../components/AgentGroupTree'
import AddGroupModal from '@src/pages/Resource/components/AddGroupModal'
import { useAgentGroupData, useAgentGroups } from '@src/pages/Resource/components/AgentGroupTree/hook'
import {
    getAgentGroup,
    updateCurrentAgentGroupId
} from '@src/pages/Resource/components/AgentGroupTree/agentGroupTreeSlice'
import { ROOT_TREE_NODE } from '@src/pages/Resource/constants/constant'
import { Context } from '@src/pages/Resource/Home'
import DragSideBar from '@src/components/DragSideBar'
import { useAgentGroup } from '@src/pages/Resource/hook'
import { RootState } from '@src/store'
import { generateGroupType } from '@src/utils'
import { resourceNameSpace } from '@src/pages/Resource/resourceSlice'
import { COLLAPSED_STATUS_WIDTH, IS_PROD } from '@src/constant'

type SideBarProps = {
    toggleSideBar: (() => void) & { on: () => void, off: () => void }
}

const SideBar: React.FC<SideBarProps> = ({ toggleSideBar }) => {
    const [leftDistance, setLeftDistance] = useState(
        window.globalState?.getItem('collapsedStatus') ?
            COLLAPSED_STATUS_WIDTH.CLOSE :
            COLLAPSED_STATUS_WIDTH.OPEN
    )
    const { isEnterprise } = generateGroupType()
    useAgentGroups({isSlideBar: true})
    const { agentGroupsHasBeenChanged } = useSelector((state: RootState) => state[resourceNameSpace])
    const { showSideBar } = useContext(Context)
    const dispatch = useDispatch()
    const headerTitle = I18N.Home.SideBar.zhuJiZiYuanZu

    const updateAgentGroup = () => {
        dispatch(updateCurrentAgentGroupId(ROOT_TREE_NODE.id))
    }
    const { currentAgentGroupId } = useAgentGroupData()
    const { initAgentGroups } = useAgentGroup()

    useEffect(() => {
        if (agentGroupsHasBeenChanged) {
            initAgentGroups()
        }
    }, [agentGroupsHasBeenChanged])

    const saResourceTreeProps = {
        showOperation: true,
        draggableFromParent: true,
        background: '#FBFBFB',
        onChange: (selectedKeysValue: React.Key[]) => {
            selectedKeysValue[0] && dispatch(updateCurrentAgentGroupId(selectedKeysValue[0]))
        },
        value: currentAgentGroupId ? [currentAgentGroupId] : [],
        isSlideBar: true
    }

    useEffect(() => {
        if (currentAgentGroupId) {
            dispatch(getAgentGroup(currentAgentGroupId))
        }
    }, [currentAgentGroupId])

    useEffect(() => {
        if (!IS_PROD) {
            setLeftDistance(0)
            return;
        }
        const clearSubscribe = window.globalState?.subscribe('collapsedStatus', (status: boolean) => {
            const {
                CLOSE,
                OPEN
            } = COLLAPSED_STATUS_WIDTH
            const width = isEnterprise ? 240 : status ? CLOSE : OPEN
            setLeftDistance(width)
        })
        return () => {
            clearSubscribe()
        }
    }, [])

    return (
        <>
            <div className={container}>
                {
                    <DragSideBar
                        unsafe={{ zIndex: 9 }}
                        open={showSideBar}
                        leftDistance={leftDistance}
                        callback={(open) => {
                            open ? toggleSideBar.on() : toggleSideBar.off()
                        }}
                    >
                        {
                            showSideBar ? <div className={sideBar}>
                                <div className={title} onClick={updateAgentGroup}>{headerTitle}</div>
                                
                                <SaResourceTree {...saResourceTreeProps} />
                            </div> : <div className={treePlaceholder} />
                        }
                    </DragSideBar>
                }
                <div className={`${sideBarSelector} ${showSideBar ? visible : null}`} onClick={toggleSideBar}>
                    <LeftIcon />
                </div>
                <AddGroupModal />
            </div>
        </>

    )

}

export default SideBar
