/* eslint-disable */
// @ts-nocheck
import React, { useMemo } from 'react'
import { isNil } from 'ramda'
import { Tooltip } from 'antd'

import {
    errorMessage,
    hint,
    root as rootCss,
    label as labelCss,
    horizontal as horizontalCss,
    control as controlCss,
    input as inputCss,
    error as errorCss,
    required as requiredCss,
    text as textCss,
    tooltip as tooltipCss,
    vertical as verticalCss
} from './index.module.less'
import { LAYOUTS } from '@src/constant'
import { LEVEL_ICON_MAP } from '@src/constant/constantWithReactFC'
import Warning from '@src/statics/icons/warning-Circle-Fill.svg'
import Question from '@src/statics/icons/question.svg'

const Layout = ({
    id,
    layout = LAYOUTS.VERTICAL, // vertical|horizontal
    label,
    className,
    tooltip = null,
    required = false,
    children = null,
    errors = [],
    hints = [],
    style,
    hideLabel = false,
    hideError = false,
    // ...rest
}) => {
    const layoutCssMap = {
        [LAYOUTS.VERTICAL]: verticalCss,
        [LAYOUTS.HORIZONTAL]: horizontalCss
    }
    const hasError = useMemo(
        () => Array.isArray(errors) && errors.some(e => (e && 'text' in e)),
        [errors],
    )

    const printableErrors = useMemo(
        () => {
            if (Array.isArray(errors)) {
                const errorMap = {}
                errors.forEach(e => {
                    if (e) {
                        if (!e?.text) {
                            for (const eElement of Object.values(e)) {
                                errorMap[eElement[0].text] = eElement[0]
                            }
                        } else {
                            errorMap[e.text] = e
                        }
                    }

                })
                return Object.values(errorMap)
            }
            return []
        },
        [errors],
    )
    return (
        <div
            className={[rootCss, layoutCssMap[layout], isNil(label) ? 'no-label' : '', className].join(' ')}
            style={style}
        >
            {!hideLabel && !isNil(label) && (
                <label htmlFor={id} className={labelCss}>
                    {required && layout === LAYOUTS.VERTICAL && (
                        <span className={requiredCss}>*</span>
                    )}
                    <span className={textCss}>
                        {label}
                    </span>
                    {
                        layout === LAYOUTS.VERTICAL && (
                            <span className={tooltipCss}>
                                {tooltip && (
                                    <Tooltip title={tooltip}>
                                        <Warning/>
                                    </Tooltip>
                                )}
                            </span>
                        )
                    }
                    {required && layout === LAYOUTS.HORIZONTAL && (
                        <span className={requiredCss}>*</span>
                    )}
                </label>
            )}
            <div className={[inputCss, hasError ? errorCss : null].join(' ')}>
                <div className={controlCss}>
                    {children}
                </div>
                {!hideError && printableErrors.map(({
                    text,
                    level
                }, index) => (
                    // <div key={index} className={`${errorMessage} `[, `level-${level}`].join(' ')}>
                    <div key={index} className={errorMessage}>
                        {LEVEL_ICON_MAP[level]}
                        {text}
                    </div>
                ))}
                {hints.map((text, i) => (
                    <div key={i} className={hint}>
                        {text}
                    </div>
                ))}
            </div>
            {
                layout === LAYOUTS.HORIZONTAL && (
                    <span className={horizontalCss}>
                        {tooltip && (
                            <Tooltip title={tooltip}>
                                <Question/>
                            </Tooltip>
                        )}
                    </span>
                )
            }
        </div>
    )
}

export default Layout
