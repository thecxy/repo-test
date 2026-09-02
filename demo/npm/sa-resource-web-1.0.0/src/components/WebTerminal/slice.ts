import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { assembleRequestUrl, isFulfilledAction, isPendingAction, isRejectedAction } from '@src/utils'
import urlJoin from 'url-join'
import { SAVE_WEB_TERMINAL_INFO } from '@src/pages/Resource/constants/apis'
import { REQUEST_CODE, REQUEST_METHODS } from '@src/constant'
import { request } from '@src/request/fetch'

export const webTerminalNameSpace = 'webTerminal'
const initialState = {
    agentInfoVisible: false,
    visible: false,
    loading: false,
    // visible: true,
    webTerminalId: ''
}
export const saveLinkInfo = createAsyncThunk(
    urlJoin(webTerminalNameSpace, 'saveLinkInfo'),
    async (params: AnyType) => {
        const res = await request({
            url: assembleRequestUrl(SAVE_WEB_TERMINAL_INFO),
            params,
            method: REQUEST_METHODS.POST
        })
        const {
            code,
            data
        } = res
        return code === REQUEST_CODE.SUCCESS ? data : null
    }
)

const webTerminalSlice = createSlice({
    name: webTerminalNameSpace,
    initialState,
    reducers: {
        updateVisible (state, action) {
            state.visible = action.payload
        },
        updateAgentInfoVisible (state, action) {
            state.agentInfoVisible = action.payload
        }
    },
    extraReducers (builder) {
        builder
            .addCase(saveLinkInfo.fulfilled, (state, action) => {
                if (action.payload) {
                    state.webTerminalId = action.payload as unknown as string
                    state.agentInfoVisible = false
                    state.visible = true
                }
            })
            .addMatcher(isPendingAction, (state) => {
                state.loading = true
            })
            .addMatcher(isRejectedAction, (state) => {
                state.loading = false
            })
            .addMatcher(isFulfilledAction, (state) => {
                state.loading = false
            })
    }
})

export const {
    updateVisible,
    updateAgentInfoVisible
} = webTerminalSlice.actions
export default webTerminalSlice.reducer
