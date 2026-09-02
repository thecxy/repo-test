import React, { ReactNode } from 'react'
import { Tooltip } from 'antd'
import { maxWidth } from './index.less'
import { TooltipPlacement } from 'antd/lib/tooltip'

type Prop = {
    val: string | ReactNode
    className?: string,
    tipVal?: string,
    style?: {
        [key: string]: StringOrNumber,
    },
    placement?: TooltipPlacement
}

const EllipsisContainer: React.FC<Prop> = ({
    val,
    tipVal = val,
    className = '',
    style = {},
    placement = 'top'
}) => (
    <Tooltip title={tipVal} placement={placement}>
        <div className={`${maxWidth} ${className}`} style={style}>{val}</div>
    </Tooltip>
)

export default EllipsisContainer
