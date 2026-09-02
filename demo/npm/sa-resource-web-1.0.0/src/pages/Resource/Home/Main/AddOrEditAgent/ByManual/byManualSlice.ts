import I18N from '@src/i18n'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import urlJoin from 'url-join'
import { omit } from 'ramda'
import { request } from '@src/request/fetch'
import { assembleRequestUrl, isFulfilledAction, isPendingAction, isRejectedAction } from '@src/utils'
import { FETCH_MANUAL_SCRIPT } from '@src/pages/Resource/constants/apis'
import { AGENT_TYPE, REQUEST_CODE } from '@src/constant'
import {
    nextProcess,
    previousProcess,
    toggleAddAgentModal,
    updateAddAgentMode
} from '@src/pages/Resource/resourceSlice'
import { ManualScript, SliceType } from '../addOrEditTypes'

export const byManualSliceNameSpace = 'byManual'

export const getManualScript = createAsyncThunk(
    urlJoin(byManualSliceNameSpace, 'getManualScript'),
    async (uuid?: string) => {
        const params = uuid ? { uuid } : {}
        const res = await request({
            url: assembleRequestUrl(FETCH_MANUAL_SCRIPT),
            params
        })
        const {
            code,
            data
        } = res
        return code === REQUEST_CODE.SUCCESS ? data : null
    }
)

const initialState: SliceType = {
    loading: false,
    getManualScriptLoading: false,
    goBackFromNextProcessOrStep: false,
    manualScripts: {
        [AGENT_TYPE.WINDOWS]: {
            commandList: [],
            uuid: '',
            id: 0,
            tips: I18N.Home.Main.qingYiGuanLiYuan
        },
        [AGENT_TYPE.LINUX]: {
            commandList: [],
            uuid: '',
            id: 0,
            tips: I18N.Home.Main.qingZaiNinDeZhu
        }
    },
    statusDataList: [],
    nextButtonDisabled: true
}
const byManualSlice = createSlice({
    name: byManualSliceNameSpace,
    initialState,
    reducers: {
        updateStatusDataList (state, action) {
            state.statusDataList = action.payload
        },
        updateNextButtonDisabled (state, action) {
            state.nextButtonDisabled = action.payload
        }
    },
    extraReducers (builder) {
        builder
            .addCase(toggleAddAgentModal,(state,action)=>{
                if(!action.payload){
                    state.nextButtonDisabled = true
                }
            })
            .addCase(previousProcess, (state) => {
                state.goBackFromNextProcessOrStep = true
                // 上一步 后重置下一步按钮禁用状态
                state.nextButtonDisabled = true
            })
            .addCase(nextProcess, (state) => {
                state.goBackFromNextProcessOrStep = false
            })
            .addCase(getManualScript.fulfilled, (state, action) => {
                state.getManualScriptLoading = false
                if (action.payload) {
                    const [one, another] = action.payload as unknown as ManualScript[]

                    state.manualScripts[one.systemType] = omit(['systemType'], {
                        ...state.manualScripts[one.systemType],
                        ...one
                    })
                    // 重连主机的时候不允许修改主机类型，这里只会返回一个主机脚本
                    if (another) {
                        state.manualScripts[another.systemType] = omit(['systemType'], {
                            ...state.manualScripts[another.systemType],
                            ...another
                        })
                    }
                }
            })
            .addCase(getManualScript.pending, (state) => {
                state.getManualScriptLoading = true
            })
            .addCase(getManualScript.rejected, (state) => {
                state.getManualScriptLoading = false
            })
            .addCase(updateAddAgentMode, (state) => {
                state.goBackFromNextProcessOrStep = false
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
    updateStatusDataList,
    updateNextButtonDisabled
} = byManualSlice.actions
export default byManualSlice.reducer
