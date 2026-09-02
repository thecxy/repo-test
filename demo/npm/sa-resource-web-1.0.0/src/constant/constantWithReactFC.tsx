import I18N from '@src/i18n'
import React from 'react'
import Iconfont from '@com/Iconfont'
import { CheckOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons'
import { icon, errorMessage } from './index.less'
import { ERROR_COLOR, PRIMARY_COLOR, SUCCESS_COLOR } from '@src/constant/index'
import SuccessIcon from '@src/statics/icons/checkcircle.svg'
import ErrorIcon from '@src/statics/icons/info.svg'
import WarningIcon from '@src/statics/icons/warning-Circle-Fill.svg'

export const LEVEL_ICON_MAP = {
    success: <SuccessIcon/>,
    error: <span className={`${icon} ${errorMessage}`}><ErrorIcon/></span>,
    info: <WarningIcon/>,
    warning: <WarningIcon/>
}

export enum REMOTE_INSTALL_STATUS {
    WAITING,
    PROGRESSING,
    SUCCESS,
    FAIL
}

type RemoteInstallStatusMapType = {
    [key in REMOTE_INSTALL_STATUS]: {
        label: string,
        value: REMOTE_INSTALL_STATUS,
        icon: JSX.Element,
    }
}
const commonProps = {
    className: icon
}
// 远程安装状态 icon 对应
// 0:等待中;1:进行中;2:成功;3:失败
export const REMOTE_INSTALL_STATUS_MAP: RemoteInstallStatusMapType = {
    [REMOTE_INSTALL_STATUS.WAITING]: {
        label: I18N.constant.constantWithReactFC.dengDaiZhong,
        value: REMOTE_INSTALL_STATUS.WAITING,
        icon: <Iconfont type={'iconStarting-point'} style={{ color: '#DADEE3' }} {...commonProps}/>
    },
    [REMOTE_INSTALL_STATUS.PROGRESSING]: {
        label: I18N.constant.constantWithReactFC.jinXingZhong,
        value: REMOTE_INSTALL_STATUS.PROGRESSING,
        icon: <LoadingOutlined style={{ color: PRIMARY_COLOR }}{...commonProps}/>
    },
    [REMOTE_INSTALL_STATUS.SUCCESS]: {
        label: I18N.constant.constantWithReactFC.chengGong,
        value: REMOTE_INSTALL_STATUS.SUCCESS,
        icon: <CheckOutlined style={{ color: SUCCESS_COLOR }}{...commonProps}/>
    },
    [REMOTE_INSTALL_STATUS.FAIL]: {
        label: I18N.constant.constantWithReactFC.shiBai,
        value: REMOTE_INSTALL_STATUS.FAIL,
        icon: <CloseOutlined style={{ color: ERROR_COLOR }}{...commonProps}/>
    },
}
