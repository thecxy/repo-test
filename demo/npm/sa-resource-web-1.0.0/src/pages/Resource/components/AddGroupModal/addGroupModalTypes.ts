import React from 'react'

export type ServiceUnitFromServer = {
    agentCount: number,
    serviceUnitId: number,
    serviceUnitName: string
}

export type AgentGroupItem = {
    id?: NumberOrNull,
    parentId: React.Key[] | number | string,
    displayName: string,
    description: string,
    authorizeProjects: (number | string)[] | string
    serviceUnitList: AnyType[],
    title?: string,
    key?: number,
    disabled?: boolean,
    children?: AgentGroupItem[] | null,
    name?: string
}

export type ProjectFromServer = {
    id: number
    uuid: string|number
    name: string
}
export type AgentGroupDetailFromServer = {
    allocation: number
    childCount: number
    createTime: number
    deleteStatus: number
    description: string
    displayName: string
    groupId: NumberOrNull
    groupType: number
    id: number
    level: number
    name: string
    parentId: number
    projectList: ProjectFromServer[]
    serviceUnitList: ServiceUnitFromServer[]
    sortIndex: number
    updateTime: number
}
