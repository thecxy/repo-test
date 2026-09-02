import zhCN from 'antd/lib/locale/zh_CN'
import enUS from 'antd/lib/locale/en_US'
import { defaultLanguage } from '@src/i18n'

export const langs = {
    'zh-CN': zhCN,
    'en-US': enUS,
}


export const currentAntdLang = langs[defaultLanguage]
