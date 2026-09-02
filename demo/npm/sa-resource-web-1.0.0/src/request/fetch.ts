import service from './service'
import { REQUEST_METHODS, REQUEST_TYPE } from '../constant'
import { AxiosRequestHeadersExtend, RequestData, RequestParams, RequestResults } from './request'

export const fetch = async ({
    url,
    params,
    method,
    type
}: RequestParams): Promise<RequestResults> => {
    const {
        POST,
        GET,
        PUT,
        DELETE
    } = REQUEST_METHODS
    const {
        FORM_DATA,
        BLOB,
        JSON: JSON_TYPE
    } = REQUEST_TYPE

    const headers: AxiosRequestHeadersExtend = {
        'Access-Control-Allow-Origin': '*'
    }
    const METHOD_TYPE_1 = [POST, PUT]
    const METHOD_TYPE_2 = [GET, DELETE]
    const isMethodType1 = METHOD_TYPE_1.includes(method as REQUEST_METHODS)
    const isMethodType2 = METHOD_TYPE_2.includes(method as REQUEST_METHODS)
    if (isMethodType1) {
        if (type === FORM_DATA) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded'
        } else {
            headers['Content-Type'] = 'application/json'
        }
    }

    return await service({
        method,
        headers,
        url,
        data: isMethodType1 ? params : '',
        responseType: type === BLOB ? BLOB : JSON_TYPE,
        transformRequest: [
            function (data): RequestData['data'] {
                if (isMethodType1) {
                    if (type === FORM_DATA) {
                        return data
                    }
                    return JSON.stringify(data)
                }
            }
        ],
        params: isMethodType2 ? params : ''
    })
}

export const request = async ({
    url,
    params,
    method = REQUEST_METHODS.GET,
    type
}: RequestParams): Promise<RequestResults> => {
    return await new Promise((resolve, reject) => {
        fetch({
            url,
            params,
            method,
            type
        }).then(res => {
            resolve(res)
        }).catch(e => {
            reject(e)
        })
    })
}
