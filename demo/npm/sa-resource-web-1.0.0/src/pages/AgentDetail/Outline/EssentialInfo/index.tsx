/**
 * 主机详情/基础信息
 */
import I18N from '@src/i18n'
import React, { useEffect, useMemo, useState } from 'react'
import {
    statusBox,
    statusIcon,
    essentialInfoContainer,
    content,
    title,
    labelCss,
    valueCss,
    infoItem
} from './index.less'
import { AgentDetail } from '@src/pages/Resource/resourceTypes'
import {
    AGENT_STATUS,
    AGENT_STATUS_ENUM,
    DEFAULT_EXECUTOR_COUNT,
    DEFAULT_STRING_VALUE,
} from '@src/constant'
import { message, Spin, Typography } from 'antd'
import { getDetail } from '@src/utils'
import { editAgent } from '@src/pages/AgentDetail/agentDetailSlice'
import { useDispatch } from 'react-redux'
import EllipsisContainer from '@com/EllipsisContainer'

const { Paragraph } = Typography
type EssentialInfoProps = {
    detail: AgentDetail,
    loading: boolean
}
const EssentialInfo: React.FC<EssentialInfoProps> = ({
    detail,
    loading
}) => {
    const dispatch = useDispatch()
    const [name, setName] = useState(DEFAULT_STRING_VALUE)
    const [note, setNote] = useState(DEFAULT_STRING_VALUE)
    const modifyAgent = async ({
        name,
        note
    }: { name: string, note: string }) => {
        const {
            id,
            executorCount,
        } = detail
        let params: AnyType = {
            id,
            name,
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
                setName(name)
                setNote(note)
            }
        }))
    }

    const infos = useMemo(() => {
        const status = AGENT_STATUS_ENUM[Number(getDetail(detail, 'status'))]
        return [
            {
                label: I18N.Outline.EssentialInfo.mingCheng,
                value: <Paragraph editable={{
                    onChange: (newVal) => {
                        if (!newVal) {
                            message.error(I18N.Outline.EssentialInfo.zhuJiMingChengBu)
                            return
                        }
                        modifyAgent({
                            name: newVal,
                            note
                        })
                    },
                    maxLength: 32,
                }}>{name}</Paragraph>
            },
            {
                label: I18N.Outline.EssentialInfo.zhuangTai,
                value: <div className={statusBox}>
                    <i className={statusIcon} style={{ background: AGENT_STATUS[status]?.color }}/>
                    <span>{AGENT_STATUS[status]?.label}</span>
                </div>
            },
            {
                label: I18N.Outline.EssentialInfo.xiTongYingPan,
                value: getDetail(detail, 'diskVolume')
            },
            {
                label: 'HostName',
                value: getDetail(detail, 'hostName')
            },
            {
                label: I18N.Outline.EssentialInfo.zhuJiGuiGe,
                value: I18N.get(I18N.Outline.EssentialInfo.cPUGE, {
                    val1: getDetail(detail, 'cpuCount'),
                    val2: getDetail(detail, 'memory')
                }),
            },
            {
                label: I18N.Outline.EssentialInfo.caoZuoXiTong,
                value: getDetail(detail, 'systemType')
            },
            {
                label: I18N.Outline.EssentialInfo.miaoShu,
                value: <Paragraph
                    ellipsis
                    editable={{
                        onChange: (newVal) => {
                            modifyAgent({
                                name,
                                note: newVal
                            })
                        },
                        maxLength: 140
                    }}>{note}</Paragraph>
            }
        ]
    }, [detail, name, note])

    useEffect(() => {
        setName(getDetail(detail, 'name'))
        setNote(getDetail(detail, 'note'))
    }, [detail])

    return <div className={essentialInfoContainer}>
        <h3 className={title}>{I18N.Outline.EssentialInfo.zhuJiXinXi}</h3>
        <div className={content}>
            <Spin spinning={loading}>
                {
                    infos.map(({
                        label,
                        value
                    }) => {
                        return <div key={label} className={infoItem}>
                            <div className={labelCss}>
                                <EllipsisContainer val={`${label}：`} style={{ maxWidth: 200 }}/>
                            </div>
                            <div className={valueCss}>{value}</div>
                        </div>
                    })
                }
            </Spin>
        </div>
    </div>
}

export default EssentialInfo
