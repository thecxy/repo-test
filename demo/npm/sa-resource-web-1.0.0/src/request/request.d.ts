import { Method, AxiosRequestHeaders, AxiosResponse } from 'axios'

import { REQUEST_TYPE } from '../constant'

export type AxiosRequestHeadersExtend = AxiosRequestHeaders & {
    [key]?: string|boolean|number
}

export type RequestData = {
    status: number | string
    statusCode: number
    msg: string
    [key]: string
    data: any
}

export type PartialRequestData = Partial<RequestData>

export type AxiosResponseExtend = AxiosResponse<PartialRequestData, PartialRequestData> & {
    config: {
        response?: string
    }
}

export type RequestParams = {
    url: string
    params?: object
    method?: Method
    type?: REQUEST_TYPE
}

export type RequestResults = {
    code?: number
    data: Record<string, PartialRequestData>
    status: number
    msg?: string
}
