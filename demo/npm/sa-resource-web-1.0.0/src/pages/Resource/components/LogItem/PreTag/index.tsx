/* eslint-disable */
// @ts-nocheck
import I18N from '@src/i18n'
import IconFont from '@com/Iconfont'
import { message } from 'antd'
import CopyToClipboard from 'react-copy-to-clipboard'
import { preContainer, link } from './index.less'

const PreTag = ({
    children,
    style,
    log
}) => {

    const handleCopy = (text, result) => {
        if (result) {
            if (text) {
                message.success(I18N.components.LogItem.fuZhiChengGong)
            } else {
                message.warning(I18N.components.LogItem.wuXiaoFuZhiNei)
            }
        } else {
            message.error(I18N.components.LogItem.fuZhiShiBai)
        }
    }

    style.overflowX = 'hidden'

    return (
        <pre
            className={preContainer}
            style={style}
        >
            {children}
            <CopyToClipboard
                text={log}
                onCopy={handleCopy}
            >
                <IconFont type={'iconText_link'} className={link}/>
            </CopyToClipboard>
        </pre>
    )
}

export default PreTag
