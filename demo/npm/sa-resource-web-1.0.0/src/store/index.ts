import { configureStore } from '@reduxjs/toolkit'

import resourceReducer, { resourceNameSpace } from '@src/pages/Resource/resourceSlice'
import resourceTableReducer, { resourceTableNameSpace } from '@src/pages/Resource/resourceTableSlice'
import agentGroupReducer, {
    agentGroupTreeSliceNameSpace
} from '@src/pages/Resource/components/AgentGroupTree/agentGroupTreeSlice'
import authorizeProjectReducer, { authorizeProjectNameSpace } from '@src/globalSlice/authorizeProjects'
import bySSHSliceReducer, {
    bySSHSliceNameSpace
} from '@src/pages/Resource/Home/Main/AddOrEditAgent/BySSH/slice'
import byManualReducer, {
    byManualSliceNameSpace
} from '@src/pages/Resource/Home/Main/AddOrEditAgent/ByManual/byManualSlice'
import agentDetailReducer, { agentDetailNameSpace } from '@src/pages/AgentDetail/agentDetailSlice'
import taskReducer, { taskNameSpace } from '@src/pages/AgentDetail/Task/taskSlice'
import executiveReducer, { executiveNameSpace } from '@src/pages/AgentDetail/ExecutiveList/executiveSlice'
import agentGroupModalReducer, { agentGroupModalNameSpace } from '@src/pages/Resource/components/AddGroupModal/slice'
import agentUpdateReducer, { agentUpdateNameSpace } from '@com/AgentUpdateModal/slice'
import executeScriptReducer, { executeScriptNameSpace } from '@src/pages/Resource/components/ExecuteScript/slice'
import agentReducer, { agentNameSpace } from '@src/pages/Resource/components/TargetServer/agentSlice'
import fileDistributionReducer, {
    fileDistributionNameSpace
} from '@src/pages/Resource/components/FileDistribution/slice'
import uploadDetailReducer, { uploadDetailNameSpace } from '@com/FileSource/uploadDetailSlice'
import webTerminalReducer, { webTerminalNameSpace } from '@com/WebTerminal/slice'

const store = configureStore({
    reducer: {

        [resourceNameSpace]: resourceReducer,
        [resourceTableNameSpace]: resourceTableReducer,
        [agentGroupTreeSliceNameSpace]: agentGroupReducer,
        [authorizeProjectNameSpace]: authorizeProjectReducer,
        [bySSHSliceNameSpace]: bySSHSliceReducer,
        [byManualSliceNameSpace]: byManualReducer,
        [agentDetailNameSpace]: agentDetailReducer,
        [taskNameSpace]: taskReducer,
        [executiveNameSpace]: executiveReducer,
        [agentGroupModalNameSpace]: agentGroupModalReducer,
        [agentUpdateNameSpace]: agentUpdateReducer,
        [executeScriptNameSpace]: executeScriptReducer,
        [agentNameSpace]: agentReducer,
        [fileDistributionNameSpace]: fileDistributionReducer,
        [uploadDetailNameSpace]: uploadDetailReducer,
        [webTerminalNameSpace]: webTerminalReducer
    },
    middleware: (getDefaultMiddleware) =>
        // Warning A non-serializable value was detected in an action
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
