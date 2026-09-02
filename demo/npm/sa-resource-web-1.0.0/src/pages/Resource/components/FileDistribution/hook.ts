/* eslint-disable */
// @ts-nocheck
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@src/store'
import { RapidExecutionParamsType } from '@src/pages/Resource/resourceTypes'
import { stringifyUrl } from 'query-string'
import {
    fileDistributionNameSpace,
    rapidExecution, updateCurrentExecutionId,
    updateLoading,
    updateVisible,
} from '@src/pages/Resource/components/FileDistribution/slice'
import { updateCurrentExecute } from '@src/pages/AgentDetail/ExecutiveList/executiveSlice'
import { useExecuteDetail } from '@src/pages/AgentDetail/ExecutiveList/hook'
import { useEffect, useMemo, useState, useRef } from 'react'
import {
    DEFAULT_LOG_PAGE_SIZE,
    LOG_CONTENT_SEPARATOR,
    MILLI_SECOND_STEP,
    PROMISE_STATUS,
    REQUEST_CODE,
    REQUEST_URL_TYPES
} from '@src/constant'
import { LOG_RENDER } from '../../constants/apis'
import { assembleRequestUrl } from '@src/utils'
import { cloneDeep } from 'lodash'

export const useFileDistribution = () => {
    const executeData = useSelector((state: RootState) => state[fileDistributionNameSpace])
    const dispatch = useDispatch()
    const toggleVisible = (visible: boolean) => {
        dispatch(updateVisible(visible))
    }
    const handleRapidExecution = async (params: RapidExecutionParamsType) => {
        return dispatch(rapidExecution(params))
    }
    const handleChangeLoading = (loading) => {
        dispatch(updateLoading(loading))
    }
    return {
        ...executeData,
        toggleVisible,
        handleRapidExecution,
        handleChangeLoading
    }
}

export const useExecuteLog = () => {
    const [logList, setLogList] = useState([])
    const timer = useRef<number>()
    const dispatch = useDispatch()
    const {
        currentExecute: executionDetail,
    } = useExecuteDetail()
    const stageTriggerItemList = useMemo(() => {
        return executionDetail
            ?.stageTriggerList[0]?.stageTriggerItemList || []
    }, [executionDetail])
    const loadMoreLog = async (value, callback) => {
        const {
            params,
            index
        } = value
        const {logRenderEnded:originLogRenderEnded} = params
        if(originLogRenderEnded){
            return
        }
        const {
            content,
            offset,
            logRenderEnded,
        } = await fetchLog(params)
        if (!content) {
            return
        }
        const originLogList = cloneDeep(logList)
        const item = originLogList[index]
        let {
            content: originContent,
            params: originParams
        } = item
        originLogList[index] = {
            ...item,
            content: `${originContent}${LOG_CONTENT_SEPARATOR}${content}`,
            params: {
                ...originParams,
                logRenderEnded,
                offset,
            },
        }
        setLogList(originLogList)
        callback && callback()
    }

    const dataSource = useMemo(() => {
        return stageTriggerItemList?.map(item => {
            const {
                stageTriggerItemParams,
                consumeTime,
                logShowList,
                runStatus,
                errorInfo,
                allTaskSuccess,
            } = item
            const targetResource = stageTriggerItemParams?.targetResource
            const id = stageTriggerItemParams.id
            return targetResource && logShowList ? {
                key: id,
                id: id,
                IP: targetResource?.targetResourceName,
                consumeTime,
                logShowList,
                runStatus,
                errorInfo,
                allTaskSuccess,
            } : null
        }).filter(Boolean)
    }, [stageTriggerItemList])
    const currentData = dataSource[0]
    const fetchLog = async ({
        uuid,
        offset: originOffset = 0
    }: {
        uuid: string,
        offset?: number
    }) => {
        const params = {
            position: originOffset,
            jobUuid:uuid,
            limit: DEFAULT_LOG_PAGE_SIZE
        }
        const res = await fetch(stringifyUrl({
            url: assembleRequestUrl(LOG_RENDER, REQUEST_URL_TYPES.LOG.label),
            query: params,
        }))
        const {code,data} = await res.json()
        if (code === REQUEST_CODE.SUCCESS) {
            const {
                next, // 下一页开始标识
                end, // 日志是否结束
                // downloadPath,
                log,
            } = data

            return {
                content:log,
                offset:next,
                logRenderEnded: end === 1,
            }
        }else {
            return {
                content:'',
                logRenderEnded: true,
                offset:0,
            }
        }
    }
    const logShowList = useMemo(()=>{
        return currentData?.logShowList
    },[currentData])

    const fetchResList = async (logShowList, oldLogList) => {
      const newLogList = cloneDeep(oldLogList)
      Promise.allSettled(logShowList.map(async (logItem, index) => {
        const { logUuid: uuid } = logItem
        const originOffset = newLogList[index]?.params?.offset || 0
        
        const {
            offset,
            content,
            logRenderEnded
        } = await fetchLog({ uuid, offset: originOffset })
        // 根据index，拼接oldLogList
        if(content) {
          dispatch(updateLoading(false))
          newLogList[index] = {
            index,
            ...logItem,
            params: {
                uuid,
                offset,
                logRenderEnded
            },
            content: `${newLogList[index]?.content || ''}${LOG_CONTENT_SEPARATOR}${content}`,
          }
        }
        
        if(logRenderEnded) {
          clearTimeout(timer.current)
          setLogList(newLogList)
        } else {
          timer.current = window.setTimeout(() => {
            fetchResList(logShowList, newLogList)
          }, 2 * MILLI_SECOND_STEP)
          setLogList(newLogList)
        }
      }))
    }

    const getLogContent = async () => {        
        clearTimeout(timer.current)
        dispatch(updateLoading(true))
        setLogList([])
        if (!currentData) {
            dispatch(updateLoading(false))
            return
        }

        const { logShowList } = currentData
        if (!logShowList || !logShowList.length) {
            return
        }

        await fetchResList(logShowList, [])
        // @ts-ignore
        dispatch(updateCurrentExecutionId(null))
        dispatch(updateCurrentExecute(null))
    }
    useEffect(()=>{
        return ()=>{
            dispatch(updateLoading(false))
            clearTimeout(timer.current)
        }
    },[])
    return {
        hasReceivedLog: Boolean(logShowList?.length),
        logList,
        getLogContent,
        loadMoreLog
    }
}
