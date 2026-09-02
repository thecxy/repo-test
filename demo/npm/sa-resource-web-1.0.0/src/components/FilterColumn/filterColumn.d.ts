import { LIST_COLUMN_KEY, LIST_ITEM } from '@src/pages/Resource/constants/constant'

type ChangeItem = LIST_ITEM & {
    checked: boolean
}

export type handleChange = (isCheckAll: boolean, changeItem?: ChangeItem) => void

export type TooltipContentProps = {
    columnList: LIST_ITEM[]
    handleChange,
    value: LIST_COLUMN_KEY[],
}
