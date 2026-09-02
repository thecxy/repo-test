/* eslint-disable */
// @ts-nocheck
import I18N from '@src/i18n'
import { Tooltip } from 'antd'
import { nameLabel, icon } from './index.less'
import Iconfont from '@com/Iconfont'

const OriginName = () => {
    const Title = () => {
        const tips = [
            I18N.OriginName.index.zhiChiZhongWenWen,
            I18N.OriginName.index.tianJiaFuWuQi,
        ]
        return (
            <>
                {
                    tips.map(item => (<p key={item}>{item}</p>))
                }
            </>
        )
    }
    return (
        <div className={nameLabel}>
            <span>{I18N.OriginName.index.yuanWenJian}</span>
            <Tooltip title={<Title/>}>
                <span className={icon}>
                    <Iconfont type={'iconHelp'}/>
                </span>
            </Tooltip>
        </div>
    )
}

export default OriginName
