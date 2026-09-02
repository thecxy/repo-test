/**
 * 动态筛选 antd Table 的 column
 * 编辑数据列
 */
import I18N from '@src/i18n'
import { Button, Tooltip } from 'antd'
import React from 'react'
import { filterColumnContainer, filterColumnTooltip } from './index.less'
import TooltipContent from './TooltipContent'
import { HandleChangeColumn, ListItem } from '@src/pages/Resource/resourceTypes'
import { LIST_COLUMN_KEY } from '@src/pages/Resource/constants/constant'
import { getDefaultPopupContainer } from '@src/utils'

type filterColumnProps = {
    columnList: ListItem[]
    handleChange: HandleChangeColumn
    value: LIST_COLUMN_KEY[]
}

const FilterColumn: React.FC<filterColumnProps> = ({
    columnList,
    handleChange,
    value,
}) => {
    return <div className={filterColumnContainer}>
        <Tooltip
            title={
                <TooltipContent
                    columnList={columnList}
                    handleChange={handleChange}
                    value={value}
                />}
            placement="bottomRight"
            getPopupContainer={getDefaultPopupContainer}
            color={'#FFF'}
            overlayClassName={filterColumnTooltip} trigger={'click'}>
            <Button>{I18N.FilterColumn.index.bianJiShuLie}</Button>
        </Tooltip>
    </div>
}

export default FilterColumn
