/**
 * 上传限速、 下载限速 input number 封装
 */
import I18N from '@src/i18n'
import React from 'react'
import { InputNumber } from 'antd'

import { timeOutInput, uploadAddonAfter, assessment } from './index.less'
import { parseIntForDecimal } from '@src/utils'
import { deConvertFileSize } from '@src/utils/convertNoahDetail'
import { INTEGER_MAX, MAGE_BYTE_SCALE } from '@src/constant'

// @ts-ignore
const integerFormatter: (value: number | undefined, info: {
    userTyping: boolean
    input: string;
}) => string = (val) => {
    return val ? parseIntForDecimal(val) : 0
}
type AddAfterProp = {
    value?: number
}
const AddAfter: React.FC<AddAfterProp> = ({ value }) => {
    return (
        <span className={uploadAddonAfter}>
            KB/s
            <span className={assessment}>{I18N.UploadInputNumber.index.yueWei}{deConvertFileSize(value)} MB/s</span>
        </span>
    )
}

const UploadInputNumber: React.FC<AddAfterProp> = props => {
    return (
        <InputNumber
            {...props}
            max={INTEGER_MAX}
            className={timeOutInput}
            formatter={integerFormatter}
            addonAfter={<AddAfter {...props} />}
            step={MAGE_BYTE_SCALE}
        />
    )
}

export default UploadInputNumber
