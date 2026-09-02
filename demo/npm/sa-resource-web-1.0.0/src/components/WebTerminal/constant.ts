import I18N from '@src/i18n'
import { CONNECT_TYPE, ERROR_TYPE } from '@com/WebTerminal/types'

const {
    PASSWORD,
    SECRET_KEY
} = CONNECT_TYPE
export const CONNECT_TYPES = {
    [CONNECT_TYPE[PASSWORD]]: {
        label: I18N.WebTerminal.constant.miMaLianJie,
        value: PASSWORD
    },
    [CONNECT_TYPE[SECRET_KEY]]: {
        label: I18N.WebTerminal.constant.miYaoLianJie,
        value: SECRET_KEY
    },
}

const {
    ERROR_CONNECTION_INFORMATION,
    INFORMATION_DOES_NOT_EXIST
} = ERROR_TYPE

export const ERROR_MSG = {
    [ERROR_TYPE[INFORMATION_DOES_NOT_EXIST]]: {
        label: I18N.WebTerminal.constant.lianJieXinXiBu
    },
    [ERROR_TYPE[ERROR_CONNECTION_INFORMATION]]: {
        label: I18N.WebTerminal.constant.lianJieXinXiCuo
    },
}
