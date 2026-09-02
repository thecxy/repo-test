import { createSlice } from '@reduxjs/toolkit'
import { ROOT_TREE_NODE } from '@src/pages/Resource/constants/constant'

export const agentGroupModalNameSpace = 'agentGroupModal'
const initialState = {
    currentAgentGroupId: ROOT_TREE_NODE.id,
    addAgentGroupVisible: false,
}
const agentGroupModalSlice = createSlice({
    name: agentGroupModalNameSpace,
    initialState,
    reducers: {
        updateCurrentAgentGroupId (state, action) {
            state.currentAgentGroupId = action.payload
        },
        updateAddAgentGroupModal (state, action) {
            state.addAgentGroupVisible = action.payload
        },
    }
})

export const {
    updateCurrentAgentGroupId,
    updateAddAgentGroupModal,
} = agentGroupModalSlice.actions
export default agentGroupModalSlice.reducer
