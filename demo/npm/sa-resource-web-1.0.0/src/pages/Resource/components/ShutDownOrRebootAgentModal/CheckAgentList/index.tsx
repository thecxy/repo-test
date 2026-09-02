/**
 * 已选择主机列表
 */
import I18N from '@src/i18n'
import React, { useRef, useState } from 'react'
import { ActionType, ColumnsState, ProColumns, ProFormInstance, ProTable } from '@ant-design/pro-components'

import { TableDataType } from '@src/pages/Resource/resourceTypes'
import { useColumns, useSelectedRows } from '@src/pages/Resource/hook'
import { checkAgentListContainer, tips, collapseButton } from './index.less'
import { Button } from 'antd'
import { renderCheckListTableColumns } from '@src/utils/utilsWithReactFC'
import useSwitch from '@react-hook/switch'

const CheckAgentList: React.FC = () => {
    const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>({
        name: {
            show: false,
            order: 2,
        },
    })
    const [showList, toggleShow] = useSwitch(true)
    const {
        checkedAgentsColumns,
    } = useColumns()
    const {
        selectedRows,
        selectedCount,
    } = useSelectedRows()
    const actionRef = useRef<ActionType>()

    const columns: ProColumns<TableDataType>[] = checkedAgentsColumns.map(item => {
        return renderCheckListTableColumns(item)
    })

    const ref = useRef<ProFormInstance>()

    return (<div className={checkAgentListContainer}>
        <div className={tips}>
            <span>{I18N.components.ShutDownOrRebootAgentModal.ninYiXuanZe}{selectedCount} {I18N.Home.Main.taiZhuJi}</span>
            <Button
                type={'link'}
                className={collapseButton}
                onClick={toggleShow}
            >{I18N.components.ShutDownOrRebootAgentModal.shouQi}</Button>
        </div>
        {
            showList &&
            <ProTable<TableDataType>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                dataSource={selectedRows}
                formRef={ref}
                tableStyle={{
                    padding: 0,
                }}
                search={false}
                scroll={{
                    y: 150,
                }}
                toolbar={{
                    settings: [],
                }}
                editable={{
                    type: 'multiple',
                }}
                columnsState={{
                    persistenceKey: 'pro-table-singe-demos',
                    persistenceType: 'localStorage',
                    value: columnsStateMap,
                    onChange: setColumnsStateMap,
                }}
                rowKey="id"
                form={{
                    // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                    syncToUrl: (values, type) => {
                        if (type === 'get') {
                            return {
                                ...values,
                                created_at: [values.startTime, values.endTime],
                            }
                        }
                        return values
                    },
                }}
                pagination={false}
                dateFormatter="string"
            />
        }
    </div>)
}

export default CheckAgentList

