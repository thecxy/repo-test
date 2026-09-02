/* eslint-disable */
// @ts-nocheck
import I18N from '@src/i18n'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
    useExecuteLog,
    useFileDistribution
} from '@src/pages/Resource/components/FileDistribution/hook'
import { Collapse, Spin } from 'antd'
import { logContainer, label, bottom } from './index.less'
import LogItem from '../LogItem'
import { getExecutiveDetail } from '@src/pages/AgentDetail/ExecutiveList/executiveSlice'
import { MILLI_SECOND_STEP } from '@src/constant'
import EllipsisContainer from '@com/EllipsisContainer'
import { isEqual } from 'lodash'

const {Panel} = Collapse;

const ExecutiveLog: React.FC = () => {
    const {
        currentExecutionId,
        loading
    } = useFileDistribution()
    const dispatch = useDispatch()
    const timer = useRef<number>()

    const {
        logList,
        hasReceivedLog,
        getLogContent,
        loadMoreLog,
    } = useExecuteLog()

    // cloneLogList，深度监听变化则改变
    const [cloneLogList, setCloneLogList] = useState([]);
    useEffect(() => {
        if(isEqual(logList, cloneLogList)) {
          return ;
        } else {
          setCloneLogList(logList);
        }
    }, [logList]);


    const hasMultiLogs = cloneLogList.length > 1;
    const onlyOneLog = cloneLogList.length === 1;

    const firstLog = cloneLogList?.[0]
    useEffect(() => {
        if (hasReceivedLog) {
            clearInterval(timer.current)
        }
    }, [hasReceivedLog])

    useEffect(() => {
        if (currentExecutionId) {
            timer.current = window.setInterval(()=>{
                dispatch(getExecutiveDetail(currentExecutionId))
            }, 4 * MILLI_SECOND_STEP)
        }
    }, [currentExecutionId])

    useEffect(() => {
        if (currentExecutionId && hasReceivedLog) {
            getLogContent()
        }
    }, [currentExecutionId, hasReceivedLog])
    useEffect(()=>{
        return ()=>{
            clearInterval(timer.current)
        }
    },[])
    return <div className={logContainer}>
        <h3 className={label}>{I18N.components.ExecutiveLog.zhiXingJieGuo}</h3>
        <Spin spinning={loading}>
            <div className={bottom}
            style={{
                height: cloneLogList.length * 100
            }}>
            {
                hasMultiLogs && cloneLogList.map(logItem => {
                    const {
                      content,
                      filePath,
                  } = logItem;
                    return (
                        <Collapse className={'log-collapse'} key={content}>
                            <Panel
                                header={<EllipsisContainer val={filePath} style={{maxWidth:500}}/>}
                                className={'log-panel'}
                                forceRender key={content}
                            >
                                {/*  多阶段暂时不适配加载更多 */}
                                <LogItem logContent={content || I18N.components.ExecutiveLog.zanWuRiZhi} />
                            </Panel>
                        </Collapse>
                    );
                })
            }
            {
                onlyOneLog ? (
                    <LogItem
                        logContent={firstLog?.content || I18N.components.ExecutiveLog.zanWuRiZhi}
                        loadMoreLog={callback => loadMoreLog(firstLog, callback)}
                    />
                ) : null
            }
            </div>
        </Spin>
    </div>
}

export default ExecutiveLog
