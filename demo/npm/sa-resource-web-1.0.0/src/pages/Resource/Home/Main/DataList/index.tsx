/**
 * 主机列表
 */
import I18N from '@src/i18n'
import {
    ColumnsState,
    ActionType,
    ProColumns,
    ProFormInstance
} from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { getColumns } from '@src/pages/Resource/resourceSlice'
import { useColumns, useFilterFetchAgent, useSelectedRows } from '@src/pages/Resource/hook'
import {
    AgentType, TableDataType
} from '@src/pages/Resource/resourceTypes'

import {
    getAgents, resourceTableNameSpace,
    updatePagination
} from '@src/pages/Resource/resourceTableSlice'
import { useFetchTableData, usePagination } from '@src/pages/Resource/Home/Main/TableFilterCollection/hook'
import {
    tableContainer,
    dataContainer,
    customTableAlertRender,
    selectedCountInfo,
    selectedCss,
    fetchLoading
} from './index.less'
import { handleManage, renderAgentsTableColumns } from '@src/utils/utilsWithReactFC'
import { AGENT_STATUS_ENUM, DEFAULT_PAGINATION } from '@src/constant'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import DeleteAgentModal from '@src/pages/Resource/components/DeleteAgentModal'
import useSwitch from '@react-hook/switch'
import { AGENT_OPERATION, ROOT_TREE_NODE } from '@src/pages/Resource/constants/constant'
import { useAgentGroupOperation } from '@src/pages/Resource/components/AddGroupModal/hooks'
import { useAgentGroupData } from '@src/pages/Resource/components/AgentGroupTree/hook'
import { request } from '@src/request/fetch'
import { FETCH_AGENT_BY_AGENT_GROUP } from '@src/pages/Resource/constants/apis'
import { DEFAULT_AGENT_GROUP_ID } from '@src/pages/Resource/components/AddGroupModal/constant'
import { assembleRequestUrl, requestCallback } from '@src/utils'
import EllipsisContainer from '@com/EllipsisContainer'
import Pagination from '@com/Pagination'
import TableSkeleton from './TableSkeleton'

type DataListProps = {
    mainRef: React.RefObject<HTMLDivElement>
}
const DATA_LIST_PADDING = 8
const DataList: React.FC<DataListProps> = ({ mainRef }) => {
    const ref = useRef<ProFormInstance>()
    const requestData = useFetchTableData()
    const { total } = usePagination()
    const { toggleAgentOperation } = useAgentGroupOperation()
    const [visible, toggleDeleteAgentVisible] = useSwitch(false)
    const [deleteAgent, setDeleteAgent] = useState<TableDataType | undefined>()
    const [barWidth,setBarWidth] = useState<number>(0)

    const [loading, setLoading] = useState(true)
    const paginationConfig = useMemo(() => {
        return {
            ...DEFAULT_PAGINATION,
            pageSize: requestData.pageSize,
            current: requestData.currentPage,
            showTotal: () => {
                return null
            },
            total,
            onChange: (current: number, pageSize: number) => {
                dispatch(updatePagination({
                    current,
                    pageSize
                }))
            }
        }
    }, [requestData])

    useEffect(() => {
        dispatch(getColumns())
    }, [])

    const handleToggleDeleteAgentModal = (record: TableDataType) => {
        setDeleteAgent(record)
        toggleAgentOperation(AGENT_OPERATION.DELETE.value)
        toggleDeleteAgentVisible()
    }
    const {
        visibleColumns
    } = useColumns()

    const {
        selectedCount,
        selectedRowKeys,
        selectedRows,
        resetSelectRows,
        updateAgentSelectRows
    } = useSelectedRows()
    const navigate = useNavigate()

    const actionRef = useRef<ActionType>()
    const dispatch = useDispatch()
    const { currentAgentGroupId } = useAgentGroupData()
    const disableSelectAllButton = [ROOT_TREE_NODE.id, DEFAULT_AGENT_GROUP_ID].some(id => id === currentAgentGroupId)
    const { fetchAgentsByIdList } = useFilterFetchAgent()
    const handleSelectAllAgent = async () => {
        const res = await request({
            url: assembleRequestUrl(FETCH_AGENT_BY_AGENT_GROUP.expand({ labelId: currentAgentGroupId }))
        })
        requestCallback({
            res,
            hideMessage: true,
            callback: async (data) => {
                // 根据id列表获取agent详情列表
                fetchAgentsByIdList(data, (res) => {
                    updateAgentSelectRows(data, res.list)
                })
            }
        })
    }
    const columns: ProColumns<TableDataType>[] = visibleColumns.map(item => {
        return {
            title: <EllipsisContainer val={item.label} />,
            dataIndex: item.key,
            render: renderAgentsTableColumns(item, actionRef, dispatch, navigate, handleToggleDeleteAgentModal),
            width: item.width,
            fixed: item.fixed,
            className: item.className
        }
    })
    const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>({
        name: {
            show: false,
            order: 2
        }
    })

    const deleteModalProps = {
        idList: deleteAgent?.id ? [deleteAgent?.id] : [],
        visible,
        hasOnlineAgent: deleteAgent?.status === AGENT_STATUS_ENUM.ONLINE,
        onCancel: () => {
            toggleDeleteAgentVisible()
        },
        callback: () => {
            /* 移除已删除的选中主机 */
            updateAgentSelectRows(selectedRowKeys.filter(item => item != deleteAgent?.id), selectedRows.filter((item: AgentType) => item.id != deleteAgent?.id))
            toggleDeleteAgentVisible()
            actionRef.current?.reload(false)
        }
    }
    const resizeObserver = new ResizeObserver(() => {
        //回调
        setBarWidth((mainRef.current?.clientWidth||0) + DATA_LIST_PADDING)
    })

    useEffect(()=>{
        if(mainRef?.current){
            //监听对应的dom
            resizeObserver.observe(mainRef.current)
        }
        return ()=>{
            if (mainRef.current) {
                resizeObserver.unobserve(mainRef.current)
            }
        }
    },[mainRef.current])

    const paginationExtraClassName = useMemo(() => {
        return selectedCount && requestData.pageSize > 10 ? selectedCss : null
    }, [selectedCount, requestData.pageSize])
    return (
        <div className={`${dataContainer} ${paginationExtraClassName}`}>
            {loading && <TableSkeleton />}
            <ProTable<TableDataType>
                columns={columns}
                actionRef={actionRef}
                // cardBordered
                formRef={ref}
                search={false}
                tableClassName={`${tableContainer} ${loading ? fetchLoading : null}`}
                className={tableContainer}
                toolbar={{
                    settings: []
                }}
                revalidateOnFocus={false}
                columnEmptyText={'--'}
                debounceTime={500}
                params={{ current: requestData.currentPage, ...requestData }}
                scroll={{ x: 'max-content' }}
                onRow={record => {
                    return {
                        onClick: () => handleManage(record, navigate) // 点击行
                    }
                }}
                onRequestError={() => {
                    setLoading(false)
                }}
                request={
                    async (params = {}) => {
                        setLoading(true)
                        const res = await dispatch(getAgents(params))
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        return res?.payload
                    }
                }
                editable={{
                    type: 'multiple'
                }}
                columnsState={{
                    persistenceKey: resourceTableNameSpace,
                    persistenceType: 'localStorage',
                    value: columnsStateMap,
                    onChange: setColumnsStateMap
                }}
                rowKey='id'
                form={{
                    // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                    syncToUrl: (values, type) => {
                        if (type === 'get') {
                            return {
                                ...values,
                                created_at: [values.startTime, values.endTime]
                            }
                        }
                        return values
                    }
                }}
                pagination={false}
                dateFormatter='string'
                rowSelection={{
                    // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
                    // 注释该行则默认不显示下拉选项
                    // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                    selectedRowKeys,
                    preserveSelectedRowKeys: true,
                    // alwaysShowAlert: true,
                    // renderCell: () => {
                    //     return <Checkbox/>
                    // },
                    onChange: (selectedRowKeys, selectedRows) => {
                        updateAgentSelectRows(selectedRowKeys, selectedRows)
                    }
                    // defaultSelectedRowKeys: [0],
                }}
                onDataSourceChange={() => {
                    setLoading(false)
                }}
                tableAlertRender={() => false}
                tableAlertOptionRender={() => null}
                loading={false}
            />
            {!loading && <Pagination {...paginationConfig} />}
            <DeleteAgentModal {...deleteModalProps} />
            {
                selectedCount ? <div className={customTableAlertRender} style={{
                    right: 0,
                    width: barWidth
                }}>
                    <div>
                        <span
                            className={selectedCountInfo}>{I18N.Home.Main.yiXuanZhong}{selectedCount} {I18N.Home.Main.taiZhuJi}</span>
                        <Button
                            style={{ padding: 4 }}
                            onClick={handleSelectAllAgent}
                            type={'link'}
                            disabled={disableSelectAllButton}
                        >
                            {I18N.Home.Main.quanXuanDangQianFen}</Button>
                        <Button
                            type={'link'}
                            style={{ padding: 4 }}
                            onClick={resetSelectRows}
                        >
                            {I18N.Home.Main.quXiaoXuanZe}</Button>
                    </div>
                </div> : null
            }
        </div>
    )
}
export default DataList
