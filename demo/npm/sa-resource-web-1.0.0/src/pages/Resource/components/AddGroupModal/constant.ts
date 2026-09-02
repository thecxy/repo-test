import I18N from '@src/i18n'
import { AgentGroupItem } from '@src/pages/Resource/components/AddGroupModal/addGroupModalTypes'

export const DEFAULT_AGENT_GROUP: AgentGroupItem = {
    parentId: [],
    displayName: I18N.components.AddGroupModal.suoYouZhuJi,
    description: '',
    authorizeProjects: [],
    serviceUnitList: [],
    children: [],
}
export const DEFAULT_AGENT_GROUP_ID = 0
