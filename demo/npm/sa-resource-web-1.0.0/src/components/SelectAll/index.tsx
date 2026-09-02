/* eslint-disable */
// @ts-nocheck
/**
 * antd Select 多选模式下 添加全选
 */
import I18N from '@src/i18n'
import React, { useState, useMemo, useEffect, useRef, ReactNode } from 'react'
import { omit } from 'lodash'
import { Select, Tag } from 'antd'

import { MILLI_SECOND_STEP, SYMBOL_FOR_ALL } from '@src/constant'
import AntdSelect from '@com/AntdSelect'

const DEFAULT_MAX_TAG_COUNT = 3
const SELECT_ALL_LABEL = I18N.SelectAll.index.quanXuan

let flag = false

type SelectAllProps = {
    className?: AnyType
    placeholder?: string
    onSearch?: (value: string) => void
    onPopupScroll?: React.UIEventHandler<HTMLDivElement>,
    value?: [],
    onChange?: (value: string) => void,
    filterOption?: boolean
    disabled?: boolean,
    children?: ReactNode,
    dropdownRender?: (menu: React.ReactElement) => React.ReactElement
}
const SelectAll: React.FC<SelectAllProps> = props => {
    const timerRef = useRef()
    const {
        onChange: change,
        dropdownRender,
        value = [],
        children
    } = props
    const [isSelectAll, setIsSelectAll] = useState(value?.length && value?.length === children?.length)
    // 不带全选的所有值
    const allVal = useMemo(() => props.children.map(item => item.props?.value), [props.children])

    // 带全选的所有值
    const allValWithAllSymbol = useMemo(() => [SYMBOL_FOR_ALL, ...allVal], [allVal])

    const onItClear = () => {
        setIsSelectAll(false)
        change([])
        flag = true
    }

    const generateApproach = (value, onClose, label) => {
        let finalOnClose
        if (value.length < allVal.length) {
            finalOnClose = onClose
        } else if (
            value.length === children.length &&
            value.length <= DEFAULT_MAX_TAG_COUNT &&
            label === SELECT_ALL_LABEL
        ) {
            finalOnClose = onItClear
        }

        return finalOnClose
    }
    const tagRender: (props: CustomTagProps) => React.ReactElement = ({
        label,
        closable,
        onClose
    }) => {
        let finalOnClose
        const [first, ...rest] = value
        if (first === SYMBOL_FOR_ALL) {
            finalOnClose = generateApproach(rest, onClose, label)
        } else {
            finalOnClose = generateApproach(value, onClose, label)
        }

        return finalOnClose
            ? (
                <Tag closable={closable} onClose={finalOnClose}>
                    {label}
                </Tag>
            )
            : null
    }

    const onItSelect = val => {
        if (val === SYMBOL_FOR_ALL) {
            setIsSelectAll(true)
            change(allValWithAllSymbol)
        } else {
            const newValues = [...value, val]
            const isSelectAll = newValues.length === allVal.length
            if (isSelectAll) {
                change(allValWithAllSymbol)
            } else {
                change(newValues)
            }
            setIsSelectAll(isSelectAll)
        }
    }

    const onItDeselect = val => {
        if (flag) {
            setIsSelectAll(false)
            change([])
        } else {
            if (val === SYMBOL_FOR_ALL) {
                change([])
            } else {
                const selectValuesLength = value.length
                const newValues = []
                for (let i = selectValuesLength - 1; i >= 0; i--) {
                    const item = value[i]
                    if (item !== val && item !== SYMBOL_FOR_ALL) {
                        newValues.push(item)
                    }
                }
                // 取消选中不需要判断是否全选
                change(newValues)
            }
        }
    }

    const existProps = ['mode', 'onSelect', 'onDeselect', 'onClear', 'maxTagPlaceholder', 'tagRender']

    const finalValue = useMemo(() => {
        const [first, ...rest] = value
        return first === SYMBOL_FOR_ALL && !isSelectAll ? rest : value
    }, [value, isSelectAll])

    useEffect(() => {
        if (flag) {
            timerRef.current = setTimeout(() => {
                flag = false
            }, MILLI_SECOND_STEP)
        }
    }, [flag])

    useEffect(() => {
        if (isSelectAll) {
            change(allValWithAllSymbol)
        } else {
            change(value)
        }
    }, [isSelectAll])

    const updateStatus = () => {
        if (props?.value?.length) {
            const {
                value,
                children
            } = props
            const childrenLength = children.length
            const valueLength = value.length
            const [first, ...restValue] = value
            // 加入分页以后，需要添加判断分页的逻辑，如果加载更多后，应该去除SelectAll "全选" 的状态
            if (first === SYMBOL_FOR_ALL) {
                const isSelectAll = restValue.length && restValue.length === childrenLength
                setIsSelectAll(isSelectAll)
            } else {
                const isSelectAll = valueLength && valueLength === childrenLength
                setIsSelectAll(isSelectAll)
            }
        }
    }

    useEffect(() => {
        return () => {
            clearTimeout(timerRef.current)
        }
    }, [])
    useEffect(() => {
        updateStatus()
    }, [props?.value, props?.children])

    return (
        <AntdSelect
            mode="multiple"
            onSelect={onItSelect}
            onDeselect={onItDeselect}
            showSearch
            autoClearSearchValue={false}
            optionFilterProp={'children'}
            onClear={onItClear}
            getPopupContainer={originNode => originNode.parentNode}
            maxTagPlaceholder={() => {
                if (value.length < allVal.length) {
                    return <Tag>......</Tag>
                }

                return (
                    <Tag
                        closable
                        onClose={onItClear}
                    >{SELECT_ALL_LABEL}
                    </Tag>
                )
            }}
            tagRender={tagRender}
            dropdownRender={dropdownRender}
            {...omit(props, existProps)}
            maxTagCount={DEFAULT_MAX_TAG_COUNT}
            value={finalValue}
        >
            {
                props?.children.length && (
                    <Select.Option key={SYMBOL_FOR_ALL} value={SYMBOL_FOR_ALL} title={SYMBOL_FOR_ALL}>
                        {I18N.SelectAll.index.quanXuan}</Select.Option>
                )
            }
            {props.children}
        </AntdSelect>
    )
}

export default SelectAll
