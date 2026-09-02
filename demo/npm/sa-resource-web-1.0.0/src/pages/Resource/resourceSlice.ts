import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    ADD_AGENT_MODE,
    ADD_AGENT_STEP,
    AGENT_GROUP_OPERATION, AGENT_OPERATION, FIRST_STEP_PROGRESS,
    getDefaultColumnList,
    LIST_COLUMN_KEY
} from '@src/pages/Resource/constants/constant'
import { ListItem, SelectTreeRole } from '@src/pages/Resource/resourceTypes'
import urlJoin from 'url-join'
import { columnsEntity } from '@src/schema'
import { normalize } from 'normalizr'
import { RootState } from '@src/store'
import { AGENT_TERMINAL_TYPE } from '@src/constant'
import { submitFirstStep } from '@src/pages/Resource/Home/Main/AddOrEditAgent/BySSH/slice'
import { deleteAgents } from '@src/pages/Resource/resourceTableSlice'
import { updateAddAgentGroupModal } from '@src/pages/Resource/components/AddGroupModal/slice'
import { deleteAgentGroupById, getAgentGroups } from '@src/pages/Resource/components/AgentGroupTree/agentGroupTreeSlice'

export const resourceNameSpace = 'resource'

const defaultColumnList = getDefaultColumnList()
export const getColumns = createAsyncThunk(
    urlJoin(resourceNameSpace, 'getColumns'),
    async () => {
        const { entities } = normalize<AnyType, {
            columns: { [key in LIST_COLUMN_KEY]: ListItem }
        }>(defaultColumnList, [columnsEntity])
        return {
            entities
        }
    })

const resourceAdapter = createEntityAdapter<ListItem>()
const initialState = resourceAdapter.getInitialState({
    // 当前添加agent方式 (SSH|MANUAL)
    addAgentMode: ADD_AGENT_MODE.SSH.value,
    // 当前添加agent 终端方式 (Linux|Windows)
    addAgentType: AGENT_TERMINAL_TYPE.LINUX.value,
    // 当前添加 agent 步骤
    addAgentStep: ADD_AGENT_STEP.FIRST_STEP,
    // 当前添加 agent 步骤1 进度
    addAgentFirstStepProcess: FIRST_STEP_PROGRESS.FIRST_PROGRESS,
    // addAgentVisible: true,
    addAgentVisible: false,
    // 主机组操作类型
    agentGroupOperation: AGENT_GROUP_OPERATION.DEFAULT.value,
    agentOperation: AGENT_OPERATION.DEFAULT.value,
    // 关机|重启
    agentRebootOrShutdown: AGENT_OPERATION.SHUTDOWN.value,
    agentRebootOrShutdownVisible: false,
    // 当前 selectTree 的角色（sidebar|addAgent|operateAgentGroup）
    currentSelectTreeRole: SelectTreeRole.SIDE_BAR,
    // 主机组树是否已变更
    agentGroupsHasBeenChanged: true,
})
const resourceSlice = createSlice({
    name: resourceNameSpace,
    initialState,
    reducers: {
        updateAgentGroupsHasBeenChanged (state,action){
            state.agentGroupsHasBeenChanged = action.payload
        },
        updateAddAgentMode (state, action) {
            state.addAgentMode = action.payload
        },
        updateAgentType (state, action) {
            state.addAgentType = action.payload
        },
        updateAddAgentStep (state, action) {
            state.addAgentStep = action.payload
        },
        toggleAddAgentModal (state, action) {
            state.addAgentVisible = action.payload
            // 关闭添加modal, 重置 step progress
            if (!action.payload) {
                state.addAgentStep = ADD_AGENT_STEP.FIRST_STEP
                state.addAgentFirstStepProcess = FIRST_STEP_PROGRESS.FIRST_PROGRESS
                state.agentOperation = AGENT_OPERATION.DEFAULT.value
                state.agentGroupOperation = AGENT_GROUP_OPERATION.DEFAULT.value
                state.currentSelectTreeRole = SelectTreeRole.SIDE_BAR
            } else {
                state.currentSelectTreeRole = SelectTreeRole.ADDING_AGENT
            }
        },
        updateRebootOrShutDown (state, action) {
            state.agentRebootOrShutdown = action.payload
        },
        updateAgentOrAgentGroupOperation (state, action) {
            if (action.payload) {
                const {
                    agentOperation,
                    agentGroupOperation
                } = action.payload
                state.agentOperation = agentOperation
                state.agentGroupOperation = agentGroupOperation
            }
        },
        updateRebootOrShutDownVisible (state, action) {
            state.agentRebootOrShutdownVisible = action.payload
        },
        nextProcess (state, action) {
            state.addAgentFirstStepProcess = action.payload
        },
        previousProcess (state, action) {
            state.addAgentFirstStepProcess = action.payload
        },
        updateColumn: resourceAdapter.updateOne,
        updateSelectTreeRole (state, action) {
            state.currentSelectTreeRole = action.payload
        }
    },
    extraReducers (builder) {
        builder
            .addCase(deleteAgentGroupById.fulfilled, (state) => {
                state.agentGroupsHasBeenChanged = true
            })
            .addCase(getAgentGroups.fulfilled, (state) => {
                state.agentGroupsHasBeenChanged = false
            })
            .addCase(getColumns.fulfilled, (state, action) => {
                if (action.payload) {
                    const {
                        entities
                    } = action.payload
                    resourceAdapter.setAll(state, entities.columns)
                }
            })
            .addCase(submitFirstStep.fulfilled, (state) => {
                state.addAgentFirstStepProcess = FIRST_STEP_PROGRESS.SECOND_PROGRESS
            })
            .addCase(deleteAgents.fulfilled, (state) => {
                state.agentRebootOrShutdownVisible = false
            })
            .addCase(updateAddAgentGroupModal, (state, action) => {
                if (!action.payload) {
                    state.agentGroupOperation = AGENT_GROUP_OPERATION.DEFAULT.value
                    state.currentSelectTreeRole = SelectTreeRole.SIDE_BAR
                } else {
                    state.currentSelectTreeRole = SelectTreeRole.AGENT_GROUP_OPERATE
                }
            })
    }
})

export const {
    updateColumn,
    updateAddAgentMode,
    updateAgentType,
    updateAddAgentStep,
    toggleAddAgentModal,
    updateRebootOrShutDown,
    updateRebootOrShutDownVisible,
    previousProcess,
    nextProcess,
    updateAgentOrAgentGroupOperation,
    updateSelectTreeRole,
    updateAgentGroupsHasBeenChanged
} = resourceSlice.actions
export default resourceSlice.reducer

export const {
    selectAll: selectAllColumns
} = resourceAdapter.getSelectors((state: RootState) => state[resourceNameSpace])
