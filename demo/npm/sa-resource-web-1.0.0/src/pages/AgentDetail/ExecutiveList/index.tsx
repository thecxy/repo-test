/**
 * 主机详情 agent: 执行命令
 */
import I18N from '@src/i18n'
import React, { useMemo, useRef } from 'react'
import { Button } from 'antd'
import { AGENT_STATUS_ENUM, DEFAULT_PAGINATION, DEFAULT_STRING_VALUE, MILLI_SECOND_STEP } from '@src/constant'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { useDispatch } from 'react-redux'
import { useExecuteDetail, usePagination, useRequestData } from './hook'
import { omit } from 'ramda'
import {
    updatePagination,
    updateExecutiveList, getExecutiveDetail
} from './executiveSlice'
import { formatTimeStamp } from '@src/utils'
import ExecuteStatusTag from './ExecuteStatusTag'
import { inner,executiveContainer,fetchLoading, operationContainer } from './index.less'
import ExecDetailDrawer from './ExecDetailDrawer'
import { ExecutiveData } from '@src/pages/AgentDetail/ExecutiveList/executiveTypes'
import { useExecuteScript } from '@src/pages/Resource/components/ExecuteScript/hook'
import ExecuteScript from '@src/pages/Resource/components/ExecuteScript'
import { Helmet } from 'react-helmet'
import { useMetaTitleName } from '@src/hooks/useMetaTitleName'
import Pagination from '@com/Pagination'
import TableSkeleton from './TableSkeleton'
import useSwitch from '@react-hook/switch'
import { AgentDetail } from '@src/pages/Resource/resourceTypes'
import { updateCurrentExecutionId } from '@src/pages/Resource/components/FileDistribution/slice'

type DataType = ExecutiveData

type ExecutiveListProps = {
    currentAgentDetail?: AgentDetail,
}
const ExecutiveList: React.FC<ExecutiveListProps> = ({currentAgentDetail}) => {
    const dispatch = useDispatch()
    const [firstLoad, setFirstLoad] = useSwitch(true)
    const [loading, setLoading] = useSwitch(true)
    const {
        executeDetailVisible,
        toggleExecuteDetailVisible,
    } = useExecuteDetail()
    const {
        toggleVisible,
        toggleDrawerDisabled,
    } = useExecuteScript()

    const handleCheckDetail = (agentDetail: DataType) => {
        const { id } = agentDetail
        dispatch(getExecutiveDetail(id))
        toggleVisible(true)
        toggleDrawerDisabled(true)
        dispatch(updateCurrentExecutionId(id))
        // toggleExecuteDetailVisible()
    }
    const {total} = usePagination()

    const metaTitle = useMetaTitleName()
    const columns: ProColumns<DataType>[] = [
        {
            title: I18N.ExecutiveList.index.zhiXingID,
            dataIndex: 'id',
            key: 'id',
            render (val) {
                return <div>#{val}</div>
            }
        },
        {
            title: I18N.ExecutiveList.index.zuoYeID,
            dataIndex: 'workPlanId',
            key: 'workPlanId'
        },
        {
            title: I18N.ExecutiveList.index.zhiXingKaiShiShi,
            dataIndex: 'beginTime',
            key: 'beginTime',
            render (val, record) {
                return <div>{formatTimeStamp(record.beginTime)}</div>
            }
        },
        {
            title: I18N.ExecutiveList.index.haoShiS,
            render: (text, record) => {
                return (
                    <div>{record.consumeTime ? `${record.consumeTime}s`:DEFAULT_STRING_VALUE}</div>
                )
            },
        },
        {
            title: I18N.ExecutiveList.index.zhiXingZhuangTai,
            render: (val, record) => (
                <ExecuteStatusTag status={record.runStatus}/>
            ),
        },
        {
            title: I18N.FileSource.index.caoZuo,
            render (val, record) {
                return <Button
                    type={'link'}
                    onClick={() => handleCheckDetail(record)}
                    style={{ padding: '4px 0' }}
                >{I18N.ExecutiveList.index.chaKanXiangQing}</Button>
            }
        }
    ]
    const ref = useRef<ActionType>()
    const requestData = useRequestData()

    const executeCallback = ()=>{
        ref.current?.reload()
    }

    const execDetailProps = {
        visible: executeDetailVisible,
        onClose: () => {
            toggleExecuteDetailVisible()
        },
        executeCallback
    }

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
    }, [requestData, total])
    const {status} = currentAgentDetail as AgentDetail
    const isOnline = status === AGENT_STATUS_ENUM.ONLINE
    const showSkeleton = useMemo(()=> loading && firstLoad,[loading,firstLoad])

    return <div className={executiveContainer}>
        <div className={inner}>
            <Helmet title={`${I18N.ExecutiveList.index.zhiXingMingLing}${metaTitle}`} />
            <div className={operationContainer}>
                <Button
                    disabled={!isOnline}
                    type={'primary'}
                    style={{ marginBottom: 10 }}
                    onClick={() => {
                        toggleVisible(true)
                        toggleDrawerDisabled(false)
                    }}
                >{I18N.ExecutiveList.index.zhiXingMingLing}</Button>
            </div>
            {showSkeleton && <TableSkeleton />}
            <ProTable<DataType>
                columns={columns}
                actionRef={ref}
                search={false}
                polling={5 * MILLI_SECOND_STEP}
                toolbar={{
                    settings: []
                }}
                tableClassName={`${showSkeleton ? fetchLoading : null}`}
                revalidateOnFocus={false}
                columnEmptyText={'--'}
                debounceTime={500}
                params={requestData}
                onRequestError={() => {
                    setLoading.off()
                }}
                request={
                    async (params = {}) => {
                        setLoading.on()
                        // @ts-ignore
                        const res = await dispatch(updateExecutiveList(omit(['manualRefresh'], params)))
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        return res?.payload
                    }
                }
                onDataSourceChange={() => {
                    setFirstLoad.off()
                    setLoading.off()
                }}
                editable={{
                    type: 'multiple'
                }}
                columnsState={{
                    persistenceKey: 'pro-table-singe-demos',
                    persistenceType: 'localStorage'
                    // value: columnsStateMap,
                    // onChange: setColumnsStateMap,
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
                loading={false}
                dateFormatter='string'
            />
            {!showSkeleton && <Pagination {...paginationConfig} />}
            {/*  查看详情弹窗 */}
            <ExecDetailDrawer {...execDetailProps} />
            {/*  执行脚本 */}
            <ExecuteScript
                executeCallback={executeCallback}
                currentAgentDetail={currentAgentDetail}
            />
        </div>
    </div>
}

export default ExecutiveList
