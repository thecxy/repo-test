import KiwiIntl from 'kiwi-intl'

import zhCN from '../../.kiwi/zh-CN'
import enUS from '../../.kiwi/en-US'

import useLocal from '@src/hooks/useLocal'

type ItemType = {
    [key: string]: {
        [key: string]: {
            [key: string]: string
        }
    }
}

export type Lang = 'zh-CN' | 'en-US'

const {currentLanguage} = useLocal();
export const defaultLanguage = currentLanguage;


const I18N = KiwiIntl.init <ItemType>(currentLanguage, {
    'en-US': enUS,
    'zh-CN': zhCN
})

export default I18N
