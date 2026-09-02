import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { DEFAULT_PAGINATION, TYPES_OF_FETCHING } from '@src/constant'
import { request } from '@src/request/fetch'
import {
    assembleRequestUrl,
    assembleExternalUrl,
    isFulfilledAction,
    isPendingAction,
    isRejectedAction
} from '@src/utils'
import { omit } from 'ramda'
import urlJoin from 'url-join'
import { GLOBAL_URLS } from '../../constants/apis'
import { scriptEntity } from '@src/schema'
import { normalize } from 'normalizr'
import { ScriptItem } from '@src/pages/Resource/resourceTypes'

export const executeScriptNameSpace = 'executeScript'
type SliceType = {
    visible: boolean
    scripts: AnyType[]
    drawerDisabled: boolean
    loading: boolean
    scriptEntities: { scriptMap: { [p: string]: ScriptItem } }
    exisPipe: {defaultLanguage:string,ifExistPipe:boolean}
}
const initialState: SliceType = {
    visible: false,
    scripts: [],
    drawerDisabled: false,
    scriptEntities: { scriptMap: {} },
    loading: false,
    exisPipe: {defaultLanguage:"zh_CN",ifExistPipe:true}
}

export const getExistPipe = createAsyncThunk(
  urlJoin(executeScriptNameSpace, 'getExistPipe'),
  async () => {
      const scriptObj = await request({
        url: assembleRequestUrl(GLOBAL_URLS.FRONTENV),
        params: {},
      })
      if (scriptObj.data) {
          return scriptObj.data as unknown as {defaultLanguage:string,ifExistPipe:boolean}
      }

      return {defaultLanguage:"zh_CN",ifExistPipe:false}
  }
)

export const getScripts = createAsyncThunk(
    urlJoin(executeScriptNameSpace, 'getScripts'),
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

const executeScriptSlice = createSlice({
    name: executeScriptNameSpace,
    initialState,
    reducers: {
        updateVisible (state, action) {
            state.visible = action.payload
        },
        updateDrawerDisabled (state, action) {
            state.drawerDisabled = action.payload
        }
    },
    extraReducers (builder) {
        builder
            .addCase(getScripts.fulfilled, (state, action) => {
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
            .addCase(getExistPipe.fulfilled, (state, action) => {
              if (action.payload) {
                  state.exisPipe = action.payload
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

export const { updateVisible, updateDrawerDisabled } = executeScriptSlice.actions
export default executeScriptSlice.reducer
