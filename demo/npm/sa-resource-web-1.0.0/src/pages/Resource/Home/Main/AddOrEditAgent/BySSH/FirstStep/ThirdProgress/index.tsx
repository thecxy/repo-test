import I18N from '@src/i18n'
import { FIRST_STEP_PROGRESS } from '@src/pages/Resource/constants/constant'
import { Button, Space, Spin } from 'antd'
import React from 'react'
import { propOr } from 'ramda'
import { DEFAULT_STRING_VALUE } from '@src/constant'
import { footer, detailContainer, detailItem, detailLabel, detailValue, dataContainer, title } from './index.less'
import { useAgentStep } from '../../../hook'
import { useThirdProgress } from '../../hook'

const ThirdProgress: React.FC = () => {
    const {
        next,
        previousToFirstProgress,
        isSSHInstall
    } = useAgentStep()
    const {
        currentAgentDetail,
        loading
    } = useThirdProgress()
    type Data = {
        label: string,
        value: StringOrNumber
    }

    const getSystemDetail = (key: string): string => {
        return propOr(DEFAULT_STRING_VALUE, key, currentAgentDetail)
    }

    // TODO 等待 bingYang 更新系统
    const dataList: Data[] = [
        {
            label: I18N.AgentInfoModal.index.zhuJiMingCheng,
            value: getSystemDetail('name'),
        },
        {
            label: 'HostName',
            value: getSystemDetail('hostName')
        },
        {
            label: I18N.Outline.EssentialInfo.caoZuoXiTong,
            value: getSystemDetail('systemType')
        },
        {
            label: I18N.Outline.EssentialInfo.zhuJiGuiGe,
            value: I18N.get(I18N.Home.Main.cPUGE, { val1: getSystemDetail('cpuCount'),
val2: getSystemDetail('memory') })
        },
        {
            label: I18N.Outline.EssentialInfo.xiTongYingPan,
            value: getSystemDetail('diskVolume')
        },
        {
            label: I18N.Home.Main.iPXinXi,
            // TODO
            value: getSystemDetail('ip')
        },
        {
            label: I18N.Home.Main.mACDiZhi,
            value: getSystemDetail('mac')
        },
    ]
    return <div className={detailContainer}>
        <div className={dataContainer}>
            <Spin spinning={loading}>

                <p className={title}>{I18N.Home.Main.aGENT}</p>
                {
                    dataList.map(({
                        label,
                        value
                    }) => {
                        return <div key={label} className={detailItem}>
                            <span className={detailLabel}>{label}:</span>
                            <span className={detailValue}>{value}</span>
                        </div>
                    })
                }
            </Spin>
        </div>
        {
            isSSHInstall ? <div className={footer}>
                <Space>
                    <Button onClick={() => previousToFirstProgress(FIRST_STEP_PROGRESS.FIRST_PROGRESS)}>{I18N.Home.Main.shangYiBu}</Button>
                    <Button
                        onClick={() => next()}
                        type={'primary'}
                        disabled={loading}
                    >{I18N.Home.Main.xiaYiBu}</Button>
                </Space>
            </div> : null
        }
    </div>
}
export default ThirdProgress
