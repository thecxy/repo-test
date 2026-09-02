/* eslint-disable */
// @ts-nocheck
import { AGENT_STATUS } from '@src/constant'

export const getAgentMap = agents => {
    const tempMap = {}
    const agentMapByUuid = {}
    for (let i = 0; i < agents.length; i++) {
        const agent = agents[i]
        agent.title = agent.name
        agent.value = agent.uuid
        agent.key = agent.uuid
        agent.disabled = agent.status !== AGENT_STATUS.ONLINE

        const tempObj = tempMap[agent.labelId]
        agentMapByUuid[agent.uuid] = agent
        if (tempObj) {
            const {
                activeCount: originActiveCount,
                list: originList,
                totalCount: originTotalCount
            } = tempObj
            tempMap[agent.labelId] = {
                list: [...originList, agent],
                activeCount: agent.status === AGENT_STATUS.ONLINE ? originActiveCount + 1 : originActiveCount,
                totalCount: originTotalCount + 1,
            }
        } else {
            tempMap[agent.labelId] = {
                list: [agent],
                activeCount: agent.status === AGENT_STATUS.ONLINE ? 1 : 0,
                totalCount: 1,
            }
        }
    }
    return {
        tempMap,
        agentMapByUuid,
    }
}
