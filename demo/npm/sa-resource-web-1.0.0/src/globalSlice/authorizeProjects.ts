// /* eslint-disable */
// // @ts-nocheck
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import urlJoin from 'url-join'

import { request } from '@src/request/fetch'
import { REQUEST_CODE } from '@src/constant'
import { assembleRequestUrl } from '@src/utils'
import { FETCH_AUTHORIZE_PROJECTS } from '@src/globalApis'
import { authorizeProjectEntity } from '@src/schema'
import { normalize } from 'normalizr'
import { RootState } from '@src/store'

export const authorizeProjectNameSpace = 'authorizeProjects'

type ProjectItem = {
    id: number,
    name: string,
    uuid: string,
    companyUuid: string,
    createTime: number,
    tags: []
}
export const authorizeProjectAdapter = createEntityAdapter<ProjectItem>({
    sortComparer: (a, b) => b.createTime - a.createTime
})

const initialState = authorizeProjectAdapter.getInitialState({
    loading: false,
})

// 当前请求不分页，一次拿所有的数据
export const getAuthorizeProjects = createAsyncThunk(
    urlJoin(authorizeProjectNameSpace, 'getAuthorizeProjects'),
    async () => {
        const res = await request({
            url: assembleRequestUrl(FETCH_AUTHORIZE_PROJECTS),
        })
        const {
            code,
            data
        } = res
        if (code === REQUEST_CODE.SUCCESS && data.length) {
            const normalized = normalize<AnyType, {
                authorizeProjects: { [key: string]: ProjectItem }
            }>(data, [authorizeProjectEntity])
            return {
                entities: normalized.entities,
            }
        }
    })

const authorizeProjectsSlice = createSlice({
    name: authorizeProjectNameSpace,
    initialState,
    reducers: {},
    extraReducers (builder) {
        builder.addCase(getAuthorizeProjects.pending, state => {
            state.loading = true
        })
        builder.addCase(getAuthorizeProjects.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload) {
                const { entities } = action.payload
                authorizeProjectAdapter.setAll(state, entities.authorizeProjects || {})
            }
        })
        builder.addCase(getAuthorizeProjects.rejected, state => {
            state.loading = false
        })
    },
})

// export const {} = authorizeProjectsSlice.actions

export default authorizeProjectsSlice.reducer
export const {
    selectAll: selectAllAuthorizeProjects
} = authorizeProjectAdapter.getSelectors((state: RootState) => state[authorizeProjectNameSpace])
