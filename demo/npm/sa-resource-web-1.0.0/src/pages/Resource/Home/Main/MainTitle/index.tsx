import I18N from '@src/i18n'
import React from 'react'
import { Button, Dropdown, Menu, Space } from 'antd'
import { mainTitle, title } from './index.less'
import { useDispatch } from 'react-redux'
import FilterColumn from '@com/FilterColumn'
import { updateAddAgentMode } from '@src/pages/Resource/resourceSlice'
import { useAddAgentModal, useAgentUpdate, useColumns } from '@src/pages/Resource/hook'
import { useToggleColumns } from '@src/pages/Resource/Home/Main/TableFilterCollection/hook'
import { PlusOutlined } from '@ant-design/icons'
import { checkIfUnallocatedGroup } from '@src/utils'
import { useAgentOperationType } from '../AddOrEditAgent/hook'
import { useAgentGroupData } from '@src/pages/Resource/components/AgentGroupTree/hook'
import { AGENT_OPERATION } from '@src/pages/Resource/constants/constant'
import { useAgentGroupOperation } from '@src/pages/Resource/components/AddGroupModal/hooks'
import { useRenderFinish } from '@src/hooks/useRenderFinish'
import { Skeleton, IconAndTextSkeleton } from '@src/components/Skeleton'
import EllipsisContainer from '@com/EllipsisContainer'
import {LIST_COLUMN_KEY} from '@src/pages/Resource/constants/constant'

const MainTitle: React.FC = () => {
    const dispatch = useDispatch()
    const agentGroupData = useAgentGroupData()
    const { currentAgentGroup } = agentGroupData
    const { renderLoading } = useRenderFinish()
    const {
        columns,
        visibleColumnsKeys
    } = useColumns()
    const {
        handleChange
    } = useToggleColumns()

    const { agentOperationType } = useAgentOperationType()

    const { toggleVisible } = useAddAgentModal()
    const { toggleVisible: toggleUpdateAgentVisible } = useAgentUpdate()
    const { toggleAgentOperation } = useAgentGroupOperation()
    const Menus = () => {
        const handleClick = ({
            // item,
            key
            // keyPath,
            // domEvent
        }: { key: string }) => {
            toggleAgentOperation(AGENT_OPERATION.ADD.value)
            // 切换添加类型
            dispatch(updateAddAgentMode(key))
            toggleVisible()
        }

        return <Menu
            onClick={handleClick}
            className={'agent-select-menu'}
        >
            {Object.values(agentOperationType).map(item => {
                return <Menu.Item key={item.value}>{item.label}</Menu.Item>
            })}
        </Menu>
    }
    return <div className={mainTitle}>
        <div className={title}>{renderLoading ? <Skeleton.Node style={{ width: '96px' }} /> :
            <EllipsisContainer val={checkIfUnallocatedGroup(currentAgentGroup?.displayName).name}
                               style={{ maxWidth: 500 }} />}</div>
        <Space>
            {/*  添加主机    */}
            <Dropdown overlay={<Menus />} trigger={['click']}>
                {
                    renderLoading ?
                        <Skeleton.Node style={{ width: '110px' }}><IconAndTextSkeleton
                            paragraphWidth='100%' /></Skeleton.Node>
                        : <Button type={'primary'} icon={<PlusOutlined />}>{I18N.Home.Main.tianJiaZhuJi}</Button>
                }
            </Dropdown>
            {/*  编辑数列 */}
            {
                renderLoading ? <Skeleton.Node style={{ width: '88px' }} />
                    : <FilterColumn
                        columnList={columns}
                        handleChange={handleChange}
                        value={visibleColumnsKeys as LIST_COLUMN_KEY[]}
                    />
            }
            {
                renderLoading ? <Skeleton.Node style={{ width: '88px' }} />
                    : <Button onClick={() => toggleUpdateAgentVisible(true)}>{I18N.Home.Main.shengJiPeiZhi}</Button>
            }

        </Space>
    </div>
}

export default MainTitle
