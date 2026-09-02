import { AgentDetail } from '@src/pages/Resource/resourceTypes'

export type CPURateProps = {
    detail: AgentDetail,
    loading: boolean
}
export type Params = {
    startTime: NumberOrNull
    endTime: NumberOrNull
    uuid: string
}

export type Data = {
    time: string,
    value: string
}
