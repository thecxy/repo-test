import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { DEFAULT_PAGINATION, REQUEST_CODE, REQUEST_METHODS, REQUEST_URL_TYPES, TYPES_OF_FETCHING } from '@src/constant'
import { request } from '@src/request/fetch'
import {
    assembleExternalUrl,
    assembleRequestUrl,
} from '@src/utils'
import { omit } from 'ramda'
import urlJoin from 'url-join'
import { GLOBAL_URLS, RAPID_EXECUTION } from '../../constants/apis'
import { scriptEntity } from '@src/schema'
import { normalize } from 'normalizr'
import { RapidExecutionParamsType, ScriptItem } from '@src/pages/Resource/resourceTypes'

import { updateVisible as updateExecuteScriptVisible } from '../ExecuteScript/slice'

export const fileDistributionNameSpace = 'fileDistribution'
type SliceType = {
    visible: boolean
    scripts: AnyType[]
    loading: boolean
    scriptEntities: { scriptMap: { [p: string]: ScriptItem } },
    currentExecutionId: NumberOrNull
}
const initialState: SliceType = {
    visible: false,
    scripts: [],
    scriptEntities: { scriptMap: {} },
    loading: false,
    currentExecutionId: null
}

export const getScripts = createAsyncThunk(
    urlJoin(fileDistributionNameSpace, 'getScripts'),
    async (payload: { type: TYPES_OF_FETCHING, currentPage: number }) => {
        const {
            INIT,
            // MORE
        } = TYPES_OF_FETCHING
        const {
            currentPage = 0,
            type = INIT
        } = payload
        let scriptObj
        const { pageSize } = DEFAULT_PAGINATION
        scriptObj = await request({
            url: assembleExternalUrl(GLOBAL_URLS.GET_SCRIPTS),
            params: {
                _offset: currentPage * pageSize,
                _limit: pageSize,
                keyword: '',
            },
        })
        console.log(scriptObj,'scriptObj')
        if (scriptObj.data === null) {
            return {
                type,
                scripts: []
            }
        }
        scriptObj = omit(['status', 'msg'], scriptObj) as unknown as AnyType[]
        scriptObj.length = Object.keys(scriptObj).length
        const newScripts = Array.from(scriptObj)

        return {
            type,
            scripts: newScripts,
        }
    }
)

export const rapidExecution = createAsyncThunk(
    urlJoin(fileDistributionNameSpace, 'rapidExecution'),
    async (params: RapidExecutionParamsType) => {
        const res = await request({
            url: assembleRequestUrl(RAPID_EXECUTION, REQUEST_URL_TYPES.NOAH.label),
            method: REQUEST_METHODS.POST,
            params
        })

        const {
            code,
            data
        } = res

        return code === REQUEST_CODE.SUCCESS ? data : null
    })

const fileDistributionSlice = createSlice({
    name: fileDistributionNameSpace,
    initialState,
    reducers: {
        updateVisible (state, action) {
            state.visible = action.payload
            if (!action.payload) {
                state.currentExecutionId = null
            }
        },
        updateCurrentExecutionId (state, action) {
            state.currentExecutionId = action.payload
        },
        updateLoading (state, action) {
            state.loading = action.payload
        }
    },
    extraReducers (builder) {
        builder
            .addCase(getScripts.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    const {
                        type,
                        scripts,
                    } = action.payload
                    let finalScript = []
                    if (type === TYPES_OF_FETCHING.INIT) {
                        finalScript = scripts
                    } else {
                        finalScript = [...state.scripts, ...scripts]
                    }

                    const normalized = normalize<AnyType, {
                        scriptMap: { [key: string]: ScriptItem }
                    }>(finalScript, [scriptEntity])
                    state.scripts = finalScript
                    state.scriptEntities = normalized.entities
                }
            })
            .addCase(getScripts.pending, (state) => {
                state.loading = true
            })
            .addCase(rapidExecution.pending, (state) => {
                state.loading = true
            })
            .addCase(updateExecuteScriptVisible, (state, action) => {
                if (!action.payload) {
                    state.currentExecutionId = null
                }
            })
            .addCase(rapidExecution.fulfilled, ((state, action) => {
                if (action.payload) {
                    const { id } = action.payload
                    state.currentExecutionId = id as number
                }
            }))
    }
})

export const {
    updateVisible,
    updateCurrentExecutionId,
    updateLoading
} = fileDistributionSlice.actions
export default fileDistributionSlice.reducer
