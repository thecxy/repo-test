import { DataNode, TreeProps } from 'antd/lib/tree'
import I18N from '@src/i18n'
import { message } from 'antd'

type CustomDataNode = DataNode & {
    parent?: DataNode | null
    children?: CustomDataNode[]
}
type DealDrop = (dragNode: CustomDataNode, node: CustomDataNode, treeData: CustomDataNode[], dropPosition: number) => boolean | undefined

export const useDrag = (treeData: CustomDataNode[], onDropCallback: (data: CustomDataNode[]) => void) => {
    const dealDrop: DealDrop = (dragNode, node, treeData, dropPosition) => {
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

        const dragNodeResult = findItem(treeData, dragNode, null)
        const nodeResult = findItem(treeData, node, null)

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

    const data = treeData
    const onDrop: TreeProps['onDrop'] = info => {
        const dropKey = info.node.key
        const dragKey = info.dragNode.key
        const dropPos = info.node.pos.split('-')
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
        const dealData = treeData
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
        onDropCallback &&onDropCallback(data)
    }

    return {
        onDrop,
    }
}
