import { ReactNode } from 'react'

export type AgentItemFromServer = {
    id: number,
    uuid: string,
    name: string,
    status: number,
    type: number,
    labelId: number,
}

export type AgentItem = AgentItemFromServer & {
    title?: string
    value?: string,
    key?: string
    disabled?: boolean
}

export type LabelItem = {
    id: number,
    displayName: string,
    registerAgentNum: number,
    activeAgentNum: number
}

export type AgentTempMapItem = {
    list: AgentItem[],
    activeCount: number,
    totalCount: number
}
export type AgentTempMap = {
    [key: string]: AgentTempMapItem
}

export type LabelChildNode = LabelItem & {
    title?: ReactNode
    value?: number,
    key?: number
    children?: AgentItem[],
    activeCount?: number
    totalCount?: number
}

export type LabelMapType = {
    [key: string]: LabelChildNode
}

export type AgentMapByUuid = {
    [key: string]: AgentItem
}
