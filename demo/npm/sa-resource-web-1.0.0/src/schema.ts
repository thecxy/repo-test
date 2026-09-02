import { schema } from 'normalizr'

export const agentEntity = new schema.Entity('agent')

export const columnsEntity = new schema.Entity('columns', {}, {
    idAttribute: 'key'
})

export const agentGroupEntity = new schema.Entity('agentGroups')

export const childrenEntity = new schema.Entity('children')
export const treeDataEntity = new schema.Entity('treeDataList', {
    children: [childrenEntity]
})

export const authorizeProjectEntity = new schema.Entity('authorizeProjects')
export const scriptEntity = new schema.Entity('scriptMap')
