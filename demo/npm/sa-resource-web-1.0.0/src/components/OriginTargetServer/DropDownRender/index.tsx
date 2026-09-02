/* eslint-disable */
// @ts-nocheck

import { AGENT_TERMINAL_TYPE } from '@src/constant'
import { Radio, Spin } from 'antd'

import '../index.less'
import {groupContainer} from './index.less'

const DropDownRender = ({
    type,
    originNode,
    handleChangeType,
    loading
}) => {
    const {
        LINUX,
        WINDOWS
    } = AGENT_TERMINAL_TYPE
    const options = [
        {
            ...LINUX,
            disabled: loading
        },
        {
            ...WINDOWS,
            disabled: loading
        }
    ]
    return (
        <>
            <div className={'dropdown-custom-content'}>
                <Radio.Group
                    className={groupContainer}
                    options={options}
                    value={type}
                    onChange={handleChangeType}
                    optionType="button"
                />
            </div>
            <Spin spinning={loading}>
                {originNode}
            </Spin>
        </>
    )
}

export default DropDownRender
