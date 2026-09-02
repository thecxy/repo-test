import {getItem} from '@src/utils/storage';

// 当前系统支持的语言
const langMap = {
    'zhCN': 'zh-CN',
    'enUS': 'en-US',
    // 'ruRU': 'ru-RU',
};

export type Lang = 'zh-CN' | 'en-US';

const useLocal = () => {
    let currentLanguage = getItem('lang');
    const coverCurrentLanguage = Object.values(langMap).includes(currentLanguage);
    if (!coverCurrentLanguage) {
        currentLanguage = window.globalState?.defaultLanguage || 'en-US';
    }

    return {currentLanguage: currentLanguage as Lang };
};

export default useLocal;