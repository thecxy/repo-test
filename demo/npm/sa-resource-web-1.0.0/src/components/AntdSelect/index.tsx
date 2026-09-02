/**
 * 当前 Select 针对antd的Select 做了 suffixIcon 的定制化
 */
import { Select, SelectProps } from 'antd'
import DownOutlined from '@src/statics/icons/down.svg'
import React from 'react'

const AntdSelect: React.FC<SelectProps> = (props) => {
    return <Select suffixIcon={<DownOutlined />} {...props} />
}

export default AntdSelect
