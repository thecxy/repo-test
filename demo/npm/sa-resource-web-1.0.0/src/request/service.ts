import I18N, { defaultLanguage } from '@src/i18n'
import axios, { AxiosError, AxiosInstance } from 'axios'
import { isEmpty } from 'ramda'
import { getCompanyId, getSpaceId } from '../utils/getRouteIds'
import { generateGroupType, generateResponseMessage, Toast } from '../utils'
import { AxiosResponseExtend, PartialRequestData } from './request'
import { IS_PROD } from '@src/constant'

const service: AxiosInstance = axios.create({
    // timeout: 30000,
})

const {
    groupName,
    groupType
} = generateGroupType()

service.interceptors.request.use(
    config => {
        config.headers = {
            ...config.headers,
            'Company-Uuid': groupName,
            'HEADER-USERINFO': 'eyJ1U05DcmVhdGVkIjoiMTU1Iiwic0FNQWNjb3VudE5hbWUiOiJ6aGFuZ2NoYW8iLCJkaXNwbGF5TmFtZSI6IuW8oOi2hSJ9',
            // 'Company-Uuid': 'noah-company',
            // 'group-name': 'noah-project', // noah-project  noah-company
            'group-name': groupName,
            // 'group-type': 2
            'group-type': groupType,
            'Accept-Language': defaultLanguage,
        }
        if (IS_PROD) {
            delete config.headers['HEADER-USERINFO']
        }

        return config
    },
    async error => {
        return await Promise.reject(error)
    }
)

service.interceptors.response.use(
    (response: AxiosResponseExtend): PartialRequestData => {
        if (response.config.response === 'blob') {
            return {
                data: response.data
            }
        }

        const {
            status,
            statusCode,
            msg,
            ...other
        } = response.data
        if (status === 0 || statusCode === 200 || status === 'OK' || status === undefined) {
            return {
                ...other,
                status: 0,
                msg
            }
        }
        Toast.error(msg)
        return {
            ...other,
            status: -1,
            msg
        }
    },
    (error: AxiosError<PartialRequestData, PartialRequestData>) => {
        if (error.response != null) {
            const {
                status,
                data
            } = error.response

            let finalMessage = ''
            const localtions = window.location
            switch (status) {
            case 400:
                finalMessage = generateResponseMessage(data, I18N.request.service.cuoWuDeQingQiu)
                break
            case 401:
                window.location.href = `${localtions.origin}/login?redirect=${encodeURIComponent(localtions.href)}`
                break
            case 402:
                window.location.href = `${localtions.origin}/login?user_status=FORBIDDENED}`
                break
            case 403:
                window.location.href = `${localtions.origin}/${getCompanyId()}/${getSpaceId()}/403`
                break
            case 404:
                finalMessage = generateResponseMessage(data, I18N.request.service.ziYuanWeiKong)
                break
            case 500:
                finalMessage = generateResponseMessage(data, I18N.request.service.fuWuYiChangQing)
                break
            case 502:
                finalMessage = generateResponseMessage(data, I18N.request.service.wangGuanYiChangQing)
                break
            case 503:
                finalMessage = generateResponseMessage(data, I18N.request.service.fuWuBuKeYong)
                break
            case 504:
                finalMessage = generateResponseMessage(data, I18N.request.service.wangGuanQingQiuChao)
                break
            default:
                finalMessage = generateResponseMessage(data, I18N.request.service.fuWuQiCuoWu)
                break
            }
            if (!isEmpty(finalMessage)) {
                Toast.error(finalMessage)
            }
            return {
                status: -1,
                data: null,
                msg: finalMessage
            }
        }
    }
)

export default service
