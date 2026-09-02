/**
 * 编辑数据列 tooltip content
 */
import I18N from '@src/i18n'
import { Checkbox, message } from 'antd'
import React from 'react'
import { TooltipContentProps } from '../filterColumn'
import {tooltipContent} from './index.module.less'

const TooltipContent: React.FC<TooltipContentProps> = ({
    columnList,
    handleChange,
    value,
}) => {
    return <div className={tooltipContent}>
        <Checkbox.Group
            value={value}
            options={
                columnList.map(item => ({
                    label: item.label,
                    value: item.key,
                    onChange: (e) => {
                        const { checked } = e.target
                        if (value.length == 1 && !checked) {
                            message.error(I18N.TooltipContent.index.qingZhiShaoXuanZe)
                            return
                        }
                        handleChange({
                            id: item.id,
                            key: item.key,
                            disabled: !checked
                        })
                    }
                }))}
        />
    </div>
}

export default TooltipContent
