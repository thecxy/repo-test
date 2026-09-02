import { descItem, value } from './index.less'
import React from 'react'

type HeaderDetailItemProps = {
    item: {
        label: string,
        value: StringOrNumber
    }
}
const HeaderDetailItem: React.FC<HeaderDetailItemProps> = ({ item }) => {
    return (<span className={descItem}>
            <span>{item?.label}</span>
            <span className={value}>{item?.value}</span>
        </span>)
}
export default HeaderDetailItem
