/**
 * 排队中的任务 | 运行中的任务|已完成的任务
 */
import I18N from '@src/i18n'
import React, { useMemo, useRef } from 'react'
import { Modal, Typography } from 'antd'
import { DEFAULT_PAGINATION } from '@src/constant'
import { ProColumns, ProFormInstance, ProTable } from '@ant-design/pro-components'
import { useDispatch } from 'react-redux'
import { omit } from 'ramda'
import { usePagination, useRequestData } from '@src/pages/AgentDetail/Task/hook'
import { cancelAgent, Data, updateManualRefresh, updatePagination, updateTaskList } from '../taskSlice'
import { formatTimeStamp, getContainerDOM } from '@src/utils'
import { uuidCss,fetchLoading } from './index.less'
import { AGENT_STATUS_VALUE } from '@src/pages/AgentDetail/Task/constant'
import TaskStatusTag from '@com/TaskStatusTag'
import Pagination from '@com/Pagination'
import useSwitch from '@react-hook/switch'
import TableSkeleton from '../TableSkeleton'

const { Paragraph } = Typography

type BasicTaskProps = {
    type: AGENT_STATUS_VALUE
}

type DataType = Data

const BasicTask: React.FC<BasicTaskProps> = ({ type }) => {
    const { manualRefresh } = useRequestData()
    const [loading, setLoading] = useSwitch(true)

    const manipulateClick = async (uuid: string) => {
        Modal.confirm({
            title: I18N.Task.BasicTask.queDingYaoQuXiao,
            getContainer: getContainerDOM,
            onOk: async () => {
                await dispatch(cancelAgent(uuid))
                dispatch(updateManualRefresh(!manualRefresh))
            },
        })
    }
    const commonColumns: ProColumns<DataType>[] = [
        {
            title: I18N.Task.BasicTask.faQiShiJian,
            dataIndex: 'createTime',
            key: 'createTime',
            render (val, record) {
                return <div>{formatTimeStamp(record.createTime)}</div>
            }
        },
        {
            title: I18N.Task.BasicTask.aGENT,
            dataIndex: 'uuid',
            key: 'uuid',
            render: (text) => {
                return (
                    <div className={uuidCss}>
                        <Paragraph copyable>{text}</Paragraph>
                    </div>
                )
            },
        },
        {
            title: I18N.Task.BasicTask.renWuZhuangTai,
            dataIndex: 'status',
            key: 'status',
            render: (val, record) => (
                <TaskStatusTag status={record.status}/>
            ),
        },
    ]
    const runningOrWaitingColumns: ProColumns<DataType>[] = [
        ...commonColumns,
        {
            title: I18N.FileSource.index.caoZuo,
            render: (text, record) => (
                <a onClick={() => manipulateClick(record.uuid)}>{I18N.FormikComp.index.quXiao}</a>
            )
        }
    ]
    const successColumns: ProColumns<DataType>[] = [
        ...commonColumns,
        {
            title: I18N.Task.BasicTask.zhiXingShiJian,
            dataIndex: 'startTime',
            key: 'startTime',
            render (val, record) {
                return <div>{formatTimeStamp(record.startTime)}</div>
            }
        },
        {
            title: I18N.AgentUpdateModal.index.jieShuShiJian,
            dataIndex: 'endTime',
            key: 'endTime',
            render (val, record) {
                return <div>{formatTimeStamp(record.endTime)}</div>
            }
        },
        {
            title: I18N.Task.BasicTask.zhiXingShiChang,
            dataIndex: 'executionDuration',
            key: 'executionDuration',
        }
    ]
    const columns = Number(type) === AGENT_STATUS_VALUE.SUCCESS ? successColumns : runningOrWaitingColumns
    const ref = useRef<ProFormInstance>()
    const dispatch = useDispatch()
    const requestData = useRequestData()
    const {total} = usePagination()
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

    const loadingConfig = {
        tableClassName:`${loading ? fetchLoading : null}`,
        onRequestError:() => {
            setLoading.off()
        },
        loading:false,
        onDataSourceChange:() => {
            setLoading.off()
        }
    }
    return <div>
        {loading && <TableSkeleton />}
        <ProTable<DataType>
            {...loadingConfig}
            columns={columns}
            formRef={ref}
            search={false}
            toolbar={{
                settings: [],
            }}
            revalidateOnFocus={false}
            columnEmptyText={'--'}
            debounceTime={10}
            params={requestData}
            request={
                async (params = {}) => {
                    setLoading.on()
                    // @ts-ignore
                    const res = await dispatch(updateTaskList(omit(['manualRefresh'], params)))
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    return res?.payload
                }
            }
            editable={{
                type: 'multiple',
            }}
            columnsState={{
                persistenceKey: 'pro-table-singe-demos',
                persistenceType: 'localStorage',
                // value: columnsStateMap,
                // onChange: setColumnsStateMap,
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
        {!loading && <Pagination {...paginationConfig} />}
    </div>
}

export default BasicTask
