/* eslint-disable */
// @ts-nocheck
/**
 * 主机组树
 * Notice: 关于 当前树的节点是否可选择 的细节说明：
 *          动作            是否禁用
 *    1.    查看主机组       是
*     2.    编辑主机组       暂无
 *    3.    新增主机
 *
 */
import React,{useContext, useMemo}  from 'react'
import { Tree } from 'antd'
import { SaResourceTreeProps } from '@src/pages/Resource/resourceTypes'
import { useDefaultData, useDrag, useSelectTreeNode, useTreeProps } from './hook'
import { treeContainer, disabledCss,moving } from './index.less'
import Delayed from '@com/Delayed'
import IconFont from '@com/Iconfont'
import TreeSkeleton from './TreeSkeleton'
import { DragSideBarContext,MouseStatus } from '@src/components/DragSideBar'
import SearchTree from './SearchTree'

const SaResourceTree: React.FC<SaResourceTreeProps> = ({
    isSlideBar = false,
    value,
    onChange,
    showOperation = false,
    disabled = false,
    containerWidth,
    background = '#FFF',
    maxHeight,
    draggableFromParent= false
}) => {
    const {
        loading
    } = useDefaultData()
    const {
        searchValue,
        treeData,
        defaultExpandedKeys,
        onDrop,
        onDragEnter,
        onExpand
    } = useDrag({
      isSlideBar,
    })

    const {
        titleRender,
        draggable
    } = useTreeProps({
        isSlideBar,
        searchValue,
        draggableFromParent,
        showOperation,
        disabledFromParent: disabled,
        containerWidth: containerWidth as number
    })
    const {
        onSelect
    } = useSelectTreeNode({
        onChange
    })

    const style = {
        width: containerWidth,
        maxHeight,
    }
    const {mouseStatus} = useContext(DragSideBarContext)


    const treeProps = useMemo(() => {
      const treeProps = {
        defaultSelectedKeys: value,
        selectedKeys:value,
        onSelect: onSelect,
        rootStyle: { background },
        switcherIcon: <IconFont type={'icondown_triangle'} style={{ fontSize: 16 }} />,
        disabled: disabled,
        titleRender: titleRender,
        draggable: draggable,
        blockNode: true,
        onDragEnter: onDragEnter,
        onDrop: onDrop,
        onExpand: onExpand,
        treeData: treeData,
      }
      if(isSlideBar) {
        treeProps.defaultExpandedKeys = defaultExpandedKeys
        treeProps.expandedKeys = defaultExpandedKeys
      } else {
        treeProps.defaultExpandedKeys = [-1]
      }
      console.log(isSlideBar, treeProps, 'treeProps');
      
      return treeProps;
    }, [value, onSelect, background, disabled, titleRender, draggable, onDragEnter, onDrop, onExpand, treeData, defaultExpandedKeys, isSlideBar])




    return (
        <div className={[`${treeContainer} ${mouseStatus!==MouseStatus.UP ? moving : null}`, disabled ? disabledCss : null].join(' ')}
            style={style}
        >
            <Delayed>
                <>
                    {loading && <TreeSkeleton />}
                    {!loading && <>
                        { isSlideBar && <SearchTree />}
                        <Tree
                          {...treeProps}
                        />
                    </>}
                       
                </>

            </Delayed>
        </div>
    )
}

export default SaResourceTree
