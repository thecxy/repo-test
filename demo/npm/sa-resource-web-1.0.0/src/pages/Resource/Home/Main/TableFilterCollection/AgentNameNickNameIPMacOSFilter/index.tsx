// 主机名称、主机别名、IP、MAC、OS 搜索
import I18N from '@src/i18n'
import { Input, Space } from 'antd'
import React from 'react'
import { input, inputContainer } from './index.less'
import { FilterValueType } from '@src/pages/Resource/resourceTypes'

type AgentNameNickNameIPMacOSFilter = {
    value: {
        [key in FilterValueType]: string
    },
    onChange: {
        [key in FilterValueType]: (e: React.ChangeEvent<HTMLInputElement>) => void
    }
}
const AgentNameNickNameIPMacOSFilter: React.FC<AgentNameNickNameIPMacOSFilter> = ({
    value,
    onChange
}) => {

    const {
        NAME,
        IP,
        OS
    } = FilterValueType

    const inputs = [
        {
            label: I18N.AgentInfoModal.index.zhuJiMingCheng,
            value: value[NAME],
            onClick: onChange[NAME]
        },
        {
            label: I18N.AgentInfoModal.index.zhuJiIP,
            value: value[IP],
            onClick: onChange[IP]
        },
        {
            label: I18N.Outline.EssentialInfo.caoZuoXiTong,
            value: value[OS],
            onClick: onChange[OS]
        }
    ]
    return (
        <div className={inputContainer}>
            <Space>
                {
                    inputs.map(({
                        value,
                        label,
                        onClick
                    }) => {
                        return (<Input
                            className={input}
                            key={label}
                            value={value}
                            placeholder={label}
                            onChange={onClick}
                        />)
                    })
                }
            </Space>
        </div>
    )
}

export default AgentNameNickNameIPMacOSFilter
