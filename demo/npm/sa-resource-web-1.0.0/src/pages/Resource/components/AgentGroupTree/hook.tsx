import I18N from '@src/i18n'
import React, { useEffect } from 'react'
import { message } from 'antd'
import { AntTreeNode, DataNode, TreeProps } from 'antd/lib/tree'
import { OriginData, RelationShip, SaResourceTreeProps } from '../../resourceTypes'
import TreeTitle from '@src/pages/Resource/components/AgentGroupTree/TreeTitle'
import { ROOT_TREE_NODE } from '../../constants/constant'
import { request } from '@src/request/fetch'
import { assembleRequestUrl, checkIfUnallocatedGroup, generateRelationShipMap, requestCallback } from '@src/utils'
import { SORT_AGENT_GROUP } from '@src/pages/Resource/constants/apis'
import { REQUEST_METHODS } from '@src/constant'
import { useAddAgentGroupModal, useAgentGroupOperation } from '@src/pages/Resource/components/AddGroupModal/hooks'
import { clone } from 'ramda'
import {
    agentGroupTreeSliceNameSpace, updataeExpandedKeys
} from '@src/pages/Resource/components/AgentGroupTree/agentGroupTreeSlice'
import { useSelector, useDispatch } from 'react-redux'
import SubTitle from '@src/pages/Resource/Home/SideBar/SubTitle'
import { useAddAgentModal, useAgentGroup } from '@src/pages/Resource/hook'
import { RootState } from '@src/store'

type CustomDataNode = DataNode & {
    parent?: DataNode | null
    children?: CustomDataNode[]
}
type DealDrop = (dragNode: CustomDataNode, node: CustomDataNode, treeData: CustomDataNode[], dropPosition: number) => boolean | undefined

export const useAgentGroupData = () => {
    return useSelector((state: RootState) => state[agentGroupTreeSliceNameSpace])
}
export const useDrag = ({isSlideBar}: {isSlideBar: boolean}) => {

    const dispath = useDispatch()

    const agentGroupData = useAgentGroupData()
    const { initAgentGroups } = useAgentGroup()
    const {
        searchValue,
        treeData,
        fullTreeData,
        defaultExpandedKeys,
    } = agentGroupData

    
    const currentTreeData = isSlideBar ? (treeData.length ? treeData : fullTreeData) : fullTreeData


    const dealDrop: DealDrop = (dragNode, node, currentTreeData, dropPosition) => {
        function findItem(datas: CustomDataNode[], node: CustomDataNode, parentItem: DataNode | null): CustomDataNode | null {
            let findResult: CustomDataNode | null = null
            datas.find((data) => {
                if (data?.key === node?.key) {
                    if (parentItem != null) {
                        data.parent = parentItem
                        return (findResult = data)
                    } else {
                        return (findResult = data)
                    }
                } else if (data?.children?.length) {
                    return (findResult = findItem(data.children, node, data))
                }
            })
            return findResult
        }

        const dragNodeResult = findItem(currentTreeData, dragNode, null)
        const nodeResult = findItem(currentTreeData, node, null)

        // 0是移动到他下面作为他子集
        if (dropPosition === 0) {
            return dragNodeResult?.parent?.key === nodeResult?.key
        }
        // -1是移动到和他平级在他上面    1是移动到和他平级在他下面
        if (dropPosition === 1 || dropPosition === -1) {
            // 都有父
            if (((dragNodeResult?.parent) != null) && ((nodeResult?.parent) != null)) {
                // 父相等
                return dragNodeResult?.parent?.key == nodeResult?.parent?.key
            }
            // 有父无父
            if (((dragNodeResult?.parent) != null) && ((nodeResult?.parent) == null)) {
                return false
            }
            // 无父有父
            if (((dragNodeResult?.parent) == null) && ((nodeResult?.parent) != null)) {
                return false
            }
            if (((dragNodeResult?.parent) == null) && ((nodeResult?.parent) == null)) {
                return true
            }
        }
    }

    const onDrop: TreeProps['onDrop'] = info => {
        const dropKey = info.node.key
        const dragKey = info.dragNode.key
        const dropPos = info.node.pos.split('-')
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

        const dealData = clone(currentTreeData)
        const result = dealDrop(info.dragNode, info.node, [...dealData], dropPosition)
        if (!result) {
            message.error(I18N.components.AgentGroupTree.dangQianJinZhiChi)
            return
        }

        const loop = (
            data: DataNode[],
            key: React.Key,
            callback: (node: DataNode, i: number, data: DataNode[]) => void
        ) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    return callback(data[i], i, data)
                }
                if (data[i].children != null) {
                    loop(data[i].children!, key, callback)
                }
            }
        }
        const data = clone(currentTreeData)

        // Find dragObject
        let dragObj: DataNode
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1)
            dragObj = item
        })

        if (!info.dropToGap) {
            // Drop on the content
            loop(data, dropKey, item => {
                item.children = Array.isArray(item.children) ? item.children : []
                item.children.unshift(dragObj)
            })
        } else if (
            ((info.node as AnyType).props.children || []).length > 0 && // Has children
            (info.node as AnyType).props.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            loop(data, dropKey, item => {
                item.children = Array.isArray(item.children) ? item.children : []
                item.children.unshift(dragObj)
            })
        } else {
            let ar: DataNode[] = []
            let i: number
            loop(data, dropKey, (_item, index, arr) => {
                ar = arr
                i = index
            })
            if (dropPosition === -1) {
                ar.splice(i!, 0, dragObj!)
            } else {
                ar.splice(i! + 1, 0, dragObj!)
            }
        }
        onDropCallback(data, info)
    }
    // 拖拽后的接口回调，保存当前拖拽结构
    const onDropCallback = async (data: DataNode[], info: { node: DataNode, dragNode: DataNode }) => {
        const {
            parentId,
            id
        } = info.dragNode as OriginData

        const relationShipMap = generateRelationShipMap(data)

        // 获取当前拖拽节点后的children 索引
        // const children = treeData[parentId].children
        // const length = children.length
        // const index = children.findIndex((item: number) => item === id)
        /**
         * 服务端所需数据：
         * afterId: 拖拽元素后兄弟元素的id,如果拖拽元素是最后一个元素，则当前值为null
         * beforeId: 拖拽元素前兄弟元素的id,如果拖拽元素是第一个元素，则当前值为null
         * targetId: 拖拽元素Id
         * targetParentId: 拖拽元素父元素Id
         */
        const relationship = relationShipMap?.get(parentId) as RelationShip
        const { childrenIds = [] } = relationship
        const index = childrenIds.findIndex((item: number) => item === id)
        const params = {
            afterId: index === length - 1 ? null : childrenIds[index + 1],
            beforeId: index === 0 ? null : childrenIds[index - 1],
            targetId: id,
            targetParentId: parentId
        }

        const res = await request({
            url: assembleRequestUrl(SORT_AGENT_GROUP),
            method: REQUEST_METHODS.PUT,
            params
        })
        requestCallback({
            res,
            callback() {
                initAgentGroups()
            },
        })
    }

    const onDragEnter: TreeProps['onDragEnter'] = info => {
        // expandedKeys 需要受控时设置
        // setExpandedKeys(info.expandedKeys)
    }

    const onExpand = (expandedKeys: React.Key[], {expanded, node}: {expanded: boolean, node: DataNode}) => {
        if(isSlideBar) {
          dispath(updataeExpandedKeys(expandedKeys))
        }

    }    
    return {
        searchValue,
        treeData: currentTreeData,
        defaultExpandedKeys,
        onDrop,
        onDragEnter,
        onExpand,
    }
}

export const useDefaultData = () => {
    const agentGroupData = useAgentGroupData()
    const {
        treeData,
        loading
    } = agentGroupData

    return {
        loading,
        defaultData: treeData
    }
}

export const useAgentGroups = ({isSlideBar = false}) => {
    const { addAgentGroupVisible } = useAddAgentGroupModal()
    const { visible: addAgentVisible } = useAddAgentModal()
    const {
        isViewing,
        isAdding,
        isAddingAgent,
        isReconnecting
    } = useAgentGroupOperation()

    const { updateAgentGroups } = useAgentGroup()

    useEffect(() => {
        if (
            (!addAgentGroupVisible && !isViewing)
            || addAgentGroupVisible
            || !addAgentVisible
        ) {
            updateAgentGroups(isAdding, isAddingAgent || isReconnecting, isSlideBar)
        }
    }, [addAgentGroupVisible, addAgentVisible])
}

type UseTreeProps = { showOperation: boolean, disabledFromParent: boolean, containerWidth: number, disabledRoot?: boolean, draggableFromParent:boolean, searchValue: string, isSlideBar: boolean }
export const useTreeProps = ({
    isSlideBar = false,
    searchValue = '',
    draggableFromParent,
    showOperation,
    disabledFromParent,
    containerWidth,
    disabledRoot = false
}: UseTreeProps) => {
    const {
        isAdding,
        isEditing
    } = useAgentGroupOperation()


    const getRenderTitle = (strTitle: string) => {
      const index = strTitle.indexOf(searchValue);
      const beforeStr = strTitle.substring(0, index);
      const afterStr = strTitle.slice(index + searchValue.length);
      const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{color: 'red'}}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
      return title;
    } 

    const titleRender = (nodeData: DataNode) => {
        const {
            displayName,
            id,
            disabled,
            level,
            groupType,
            childCount,
            isLeaf = true,
        } = nodeData as unknown as OriginData

        if (id !== ROOT_TREE_NODE.id) {
            const {
                name,
                flag
            } = checkIfUnallocatedGroup(displayName)
            return <TreeTitle
                viewOnly={flag}
                title={name}
                titleDom={isSlideBar ? getRenderTitle(name) : name}
                level={level}
                showOperation={showOperation}
                disabled={disabledFromParent || disabled as boolean}
                id={id}
                isLeaf={isLeaf}
                childCount={childCount}
                groupType={groupType}
                isAdding={isAdding}
                containerWidth={containerWidth}
                draggableFromParent={draggableFromParent}
            />
        } else {
            return <SubTitle
                displayName={displayName}
                titleDom={isSlideBar ? getRenderTitle(displayName) : displayName}
                showOperation={showOperation}
                childCount={childCount}
                disabled={disabledRoot}
            />
        }
    }

    const draggable = {
        icon: false,
        nodeDraggable: (node: AntTreeNode): boolean => {
            return !isAdding && !isEditing
        }
    }
    return {
        titleRender,
        draggable
    }
}

export const useSelectTreeNode = ({
    onChange
}: SaResourceTreeProps) => {
    const onSelect = (selectedKeysValue: React.Key[]) => {
        if (onChange != null) {
            onChange(selectedKeysValue)
        }
    }
    return {
        onSelect
    }
}
