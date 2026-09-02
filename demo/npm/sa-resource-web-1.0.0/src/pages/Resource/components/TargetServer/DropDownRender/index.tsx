import { Radio, Tooltip, Spin, RadioChangeEvent } from 'antd'

import { dropdownCustomContent, groupContainer } from '../index.less'
import React, { ReactNode } from 'react'
import { WindowsStatus } from '../util'
import { AGENT_TERMINAL_TYPE } from '@src/constant'

type DropDownRenderProp = WindowsStatus & {
    type: number | string
    originNode: ReactNode
    handleChangeType: (value: number) => void
    loading: boolean
}
const DropDownRender: React.FC<DropDownRenderProp> = ({
    type,
    originNode,
    handleChangeType,
    loading,
    status,
    tips
}) => {
    const {
        LINUX,
        WINDOWS
    } = AGENT_TERMINAL_TYPE
    const options = [
      {
          ...LINUX,
          disabled: status === LINUX.value
      },
      {
          ...WINDOWS,
          disabled: status === WINDOWS.value
      }
  ]

    return (
        <>
            <div className={dropdownCustomContent}>
                <Tooltip title={tips} placement={'right'}>
                    <Radio.Group
                        className={groupContainer}
                        options={options}
                        value={type}
                        onChange={(e) => handleChangeType(e.target.value)}
                        optionType="button"
                    />
                </Tooltip>
            </div>
            <Spin spinning={loading}>
                {originNode}
            </Spin>
        </>
    )
}

export default DropDownRender
