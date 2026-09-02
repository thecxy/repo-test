/**
 * 主机详情/Agent 配置
 */
import I18N from '@src/i18n'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { message, Spin, Typography } from 'antd'

import {
    agentConfigContainer,
    content,
    title,
    labelCss,
    valueCss,
    infoItem,
    agentVersionCss,
} from './index.less'
import { AgentDetail } from '@src/pages/Resource/resourceTypes'
import { getDetail } from '@src/utils'
import EllipsisContainer from '@com/EllipsisContainer'
import { DEFAULT_EXECUTOR_COUNT, MILLI_SECOND_STEP } from '@src/constant'
import { CONCURRENCE_REGEXP } from '@src/constant/regExp'
import { editAgent, getAgent } from '@src/pages/AgentDetail/agentDetailSlice'
import { useDispatch } from 'react-redux'
import { prop } from 'ramda'
import UpdateAgent from '@src/pages/Resource/components/UpdateAgent'

const { Paragraph } = Typography

type AgentConfigProps = {
    detail: AgentDetail,
    loading: boolean
}

const AgentConfig: React.FC<AgentConfigProps> = ({
    detail,
    loading
}) => {
    const dispatch = useDispatch()
    const [executorCount, setExecutorCount] = useState<StringOrNumber>('')
    const NO_LIMIT_LABEL = I18N.Outline.AgentConfig.wuXianZhi
    const updateTimer = useRef<number | undefined>()
    const modifyAgent = async ({
        executorCount
    }: { executorCount: StringOrNumber }) => {
        const {
            id,
            name,
            note,
        } = detail
        let params: AnyType = {
            name,
            id,
            note,
        }
        if (executorCount !== DEFAULT_EXECUTOR_COUNT) {
            params = {
                ...params,
                executorCount
            }
        }

        dispatch(editAgent({
            params,
            callback () {
                setExecutorCount(executorCount)
            }
        }))
    }
    const infos = useMemo(() => {
        return [
            {
                label: I18N.Outline.AgentConfig.aGENT5,
                value: <div className={agentVersionCss}>
                    <UpdateAgent
                        version={getDetail(detail, 'version')}
                        itUpgradeable={prop('itUpgradeable', detail)}
                        status={prop('status', detail)}
                        uuid={prop('uuid', detail)}
                        callback={() => {
                            updateTimer.current = window.setTimeout(() => {
                                dispatch(getAgent(prop('uuid', detail)))
                            }, MILLI_SECOND_STEP)
                        }}
                    />
                </div>
            },
            {
                label: I18N.Outline.AgentConfig.aGENT4,
                value: <Paragraph editable={{
                    // editing: true,
                    onChange: (val) => {
                        const value = val.trim()
                        if (value === NO_LIMIT_LABEL) {
                            setExecutorCount('')
                            return false
                        } else if (value?.length && !CONCURRENCE_REGEXP.test(value)) {
                            message.error(I18N.Outline.AgentConfig.qingShuRuDeZheng)
                            return false
                        }
                        modifyAgent({ executorCount: value })
                    },
                    maxLength: 4,
                }}>{executorCount == String(DEFAULT_EXECUTOR_COUNT) || !executorCount ? NO_LIMIT_LABEL : executorCount}</Paragraph>
            },
            {
                label: I18N.Outline.AgentConfig.aGENT3,
                value: <EllipsisContainer val={getDetail(detail, 'agentPath')}/>
            },
            {
                label: I18N.Outline.AgentConfig.aGENT2,
                value: getDetail(detail, 'agentUser')
            }
        ]
    }, [detail, executorCount])

    useEffect(() => {
        setExecutorCount(getDetail(detail, 'executorCount'))
        return () => {
            clearTimeout(updateTimer.current)
        }
    }, [detail])

    return <div className={agentConfigContainer}>
        <h3 className={title}>{I18N.Outline.AgentConfig.aGENT}</h3>
        <Spin spinning={loading}>

            <div className={content}>
                {
                    infos.map(({
                        label,
                        value
                    }) => {
                        return <div key={label} className={infoItem}>
                        <span className={labelCss}>{
                            label
                        }：</span>
                            <span className={valueCss}>{value}</span>
                        </div>
                    })
                }
            </div>
        </Spin>

    </div>
}

export default AgentConfig
