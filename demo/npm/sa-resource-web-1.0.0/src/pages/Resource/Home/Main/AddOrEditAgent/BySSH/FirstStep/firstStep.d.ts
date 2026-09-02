import { AGENT_TYPE } from '@src/constant'

export type InitialValues = {
    ip: string,
    authenticationType?: string,
    user: string,
    password: string,
    executorCount?: StringOrNumber | null,
    port: StringOrNumber
}
export type Params = {
    agentUuid: string
    executorCount?: StringOrNumber | null
    ip: string
    password: string
    port: StringOrNumber
    type: AGENT_TYPE
    user: string
}
