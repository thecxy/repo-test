/* eslint-disable */
// @ts-nocheck
import React, { useMemo, useRef } from 'react'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import CellMeasurer from 'react-virtualized/dist/commonjs/CellMeasurer'
import CellMeasurerCache from 'react-virtualized/dist/commonjs/CellMeasurer/CellMeasurerCache'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import { logItem } from './index.less'
import { LOG_CONTENT_SEPARATOR } from '@src/constant'
import { debounceWith250ms } from '@src/utils'
import PreTag from './PreTag'
import accesslog from 'react-syntax-highlighter/dist/esm/languages/hljs/accesslog'
import dark from 'react-syntax-highlighter/dist/esm/styles/hljs/dark'
import { COLORS, LOG_STATUS_KEY_WORDS } from './constant'
import { checkIfHasKeyWords } from './util'

const DEFAULT_HEIGHT = 20
// 多阶段日志不考虑打日志情况
const MULTI_LOG_ITEM_MIN_HEIGHT_TIMES = 4 * DEFAULT_HEIGHT
type LogItemProps = {
    logContent?: string,
    loadMoreLog?: () => {},
}
const LogItem: React.FC<LogItemProps> = ({
    logContent = '',
    loadMoreLog = null,
}) => {
    const listRef = useRef()
    const list = logContent.split(LOG_CONTENT_SEPARATOR)
    let cache = new CellMeasurerCache({
        defaultHeight: DEFAULT_HEIGHT,
        fixedWidth: true,
        minHeight: DEFAULT_HEIGHT,
    })

    const handleScroll = debounceWith250ms(async ({
        clientHeight,
        scrollHeight,
        scrollTop
    }) => {
        const lengthBeforeScroll = list.length - 1

        // 判断滑动到底部
        if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
            loadMoreLog && loadMoreLog(() => {
                listRef?.current?.scrollToRow(lengthBeforeScroll)
            })
        }
    })

    SyntaxHighlighter.registerLanguage('accesslog', accesslog)

    const generateCustomStyle = ({ currentLog }) => {
        const customStyle = {
            padding: '0 10px',
            boxSizing: 'border-box',
            backgroundColor: COLORS.DEFAULT,
            whiteSpace: 'pre-wrap',
            overflowX: 'auto',
        }
        const {
            FAIL,
            ERROR,
            WARNING,
            SUCCESS
        } = LOG_STATUS_KEY_WORDS
        const lowerCasedLog = currentLog.toLowerCase()
        if (checkIfHasKeyWords(lowerCasedLog, [...FAIL, ...ERROR, ...[WARNING]])) {
            customStyle.color = COLORS.ERROR
        } else if (checkIfHasKeyWords(lowerCasedLog, SUCCESS)) {
            customStyle.color = COLORS.SUCCESS
        }
        return customStyle
    }
    const rowRenderer = ({
        index,
        key,
        parent,
        style
    }) => {
        const currentLog = list[index]
        // const currentLog = `${index + 1} ${list[index]}`;
        // 暂时注释，后期可能加 索引
        // const logWithIndex = `${index + 1} ${currentLog}`;
        const customStyle = generateCustomStyle({ currentLog })
        return (
            <CellMeasurer
                cache={cache}
                columnIndex={0}
                key={key}
                parent={parent}
                rowIndex={index}
            >
                {/* {measure, registerChild} */}
                {currentLog && (
                    <div style={style}>
                        <SyntaxHighlighter
                            style={dark}
                            customStyle={customStyle}
                            PreTag={props => <PreTag {...props} log={currentLog}/>}
                            index={index}
                            language="text"
                        >
                            {currentLog}
                        </SyntaxHighlighter>
                    </div>
                )}
            </CellMeasurer>
        )
    }

    // AutoSizer组件添加了disableWidth属性。因为宽度变化会导致高度变化，导致抖动。
    // params: {height, width}
    const onResizeCallback = (size) => {        
        cache.clearAll()
    }

    const style = useMemo(() => {
        return !loadMoreLog ? { minHeight: `${list.length * MULTI_LOG_ITEM_MIN_HEIGHT_TIMES}px` } : null
    }, [list.length, loadMoreLog])
    return (
        <div
            className={logItem}
            style={style}
        >
            <AutoSizer onResize={onResizeCallback} disableWidth>
                {({
                    height,
                }) => {
                    return (
                        <List
                            deferredMeasurementCache={cache}
                            height={height}
                            rowCount={list.length}
                            rowHeight={cache.rowHeight}
                            rowRenderer={rowRenderer}
                            width={587}
                            onScroll={handleScroll}
                            ref={list => {
                                listRef.current = list
                            }}
                        />
                    )
                }}
            </AutoSizer>
        </div>
    )
}

export default LogItem
