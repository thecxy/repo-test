/* eslint-disable */
// @ts-nocheck
import { parseTemplate } from 'url-template'
import urlJoin from 'url-join'

export const COLORS = {
    ERROR: '#FF5630',
    SUCCESS: '#36B37E',
    HEIGHT_LIGHT: '#3C4655',
    DEFAULT: '#1A2638',
}

export const LOG_STATUS_KEY_WORDS = {
    SUCCESS: ['succ', 'success', 'successful', 'successfully'],
    ERROR: ['err', 'error'],
    FAIL: ['fail', 'failed', 'failure'],
    WARNING: ['warn', 'warning', ''],
}

export const URLS = {
    LOG_RENDER: parseTemplate(urlJoin('log', '{uuid}')),
    LOG_DOWNLOAD: parseTemplate(urlJoin('log/download/', '{logUuid}')),
}
