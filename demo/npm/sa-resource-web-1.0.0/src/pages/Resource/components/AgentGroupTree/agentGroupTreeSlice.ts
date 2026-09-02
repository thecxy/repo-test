import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import urlJoin from 'url-join'
import {
    assembleRequestUrl,
    generateGroupType,
    generateTreeData,
    fillterTreeData,
} from '@src/utils'
import {
    DELETE_AGENT_GROUP,
    FETCH_AGENT_GROUP,
    FETCH_AGENT_GROUPS
} from '@src/pages/Resource/constants/apis'
import { request } from '@src/request/fetch'
import {
    DEFAULT_SUCCESS_MESSAGE,
    REQUEST_CODE,
    REQUEST_METHODS
} from '@src/constant'
import { RelationShip } from '@src/pages/Resource/resourceTypes'
import { DataNode } from 'antd/lib/tree'
import {
    AGENT_GROUP_DELETE_TYPE,
    AGENT_GROUP_OPERATION,
    AGENT_OPERATION,
    ROOT_TREE_NODE
} from '@src/pages/Resource/constants/constant'
import { message } from 'antd'
import { AgentGroupDetailFromServer } from '@src/pages/Resource/components/AddGroupModal/addGroupModalTypes'
import { updateAgentOrAgentGroupOperation } from '../../resourceSlice'
import {
    DEFAULT_AGENT_GROUP,
    DEFAULT_AGENT_GROUP_ID
} from '@src/pages/Resource/components/AddGroupModal/constant'

export const agentGroupTreeSliceNameSpace = 'agentGroupTreeSlice'

export type CustomDataNode = DataNode & { isLeaf: boolean };
type InitialValues = {
    fullOriginTreeData: DataNode[];
    originTreeData: DataNode[];
    originTreeMap: {
        [key: string]: DataNode;
    };
    fullOriginTreeMap: {
        [key: string]: DataNode;
    };
    searchValue: string;
    fullTreeData: CustomDataNode[];
    treeData: CustomDataNode[];
    defaultExpandedKeys: number[];
    relationshipMap: Map<number, RelationShip> | null;
    loading: boolean;
    currentAgentGroupId: number;
    currentAgentGroup: AgentGroupDetailFromServer;
};

const initialState: InitialValues = {
    fullOriginTreeData: [], // fullOriginTreeData用于储存搜索的全部数据
    originTreeData: [],
    originTreeMap: {},
    fullOriginTreeMap: {},
    searchValue: '',
    fullTreeData: [],
    treeData: [],
    defaultExpandedKeys: [-1],
    relationshipMap: null,
    loading: true,
    currentAgentGroupId: ROOT_TREE_NODE.id,
    currentAgentGroup: ROOT_TREE_NODE
}
const generateTreeMap = (data: DataNode[]) => {
    const map: {
        [key: string]: DataNode;
    } = {};
    data.forEach((item) => {
        const { id } = item as unknown as { id: string };
        map[id] = item;
    });
    return map;
};

// 请求主机树状数据
export const getAgentGroups = createAsyncThunk(
    urlJoin(agentGroupTreeSliceNameSpace, 'getAgentGroups'),
    async () => {
        const res = await request({
            url: assembleRequestUrl(FETCH_AGENT_GROUPS)
        })
        const {
            code,
            data
        } = res

        if (code === REQUEST_CODE.SUCCESS) {
            return {
                data
            }
        }
    }
);

export const getAgentGroup = createAsyncThunk(
    urlJoin(agentGroupTreeSliceNameSpace, "getAgentGroup"),
    async (id: number) => {
        if (id === DEFAULT_AGENT_GROUP_ID) return DEFAULT_AGENT_GROUP;
        if (id !== ROOT_TREE_NODE.id) {
            const res = await request({
                url: assembleRequestUrl(FETCH_AGENT_GROUP.expand({ id })),
            });
            const { code, data } = res;
            if (code === REQUEST_CODE.SUCCESS) {
                return data;
            }
        } else {
            return ROOT_TREE_NODE;
        }
    }
);

export const deleteAgentGroupById = createAsyncThunk(
    urlJoin(agentGroupTreeSliceNameSpace, "deleteAgentGroupById"),
    async (ids: number): Promise<number> => {
        const res = await request({
            // TODO 主机组相关主机处理：1彻底删除,2归还未分配 这里暂时先传2
            url: assembleRequestUrl(DELETE_AGENT_GROUP),
            params: {
                deleteMethod: AGENT_GROUP_DELETE_TYPE.RETURN_TO_UNALLOCATED,
                idList: ids,
            },
            method: REQUEST_METHODS.DELETE,
        });
        const { code } = res;
        if (code === REQUEST_CODE.SUCCESS) {
            message.success(DEFAULT_SUCCESS_MESSAGE);
        }
        return ids;
    }
);

const updateAgentGroupsWithOutFetchingReducer = (state: InitialValues, action: { payload: { isAddingAgentGroup: boolean, isAddingAgent: boolean, isSlideBar: boolean, isGetNew: boolean } }) => {
    const {
        isAddingAgentGroup,
        isAddingAgent,
        isSlideBar,
        isGetNew,
    } = action.payload    
    const { isEnterprise } = generateGroupType()


    if(isGetNew) {
      const {
        treeData,
        relationshipMap
      } = generateTreeData({
          originData: state.fullOriginTreeData,
          isEnterprise,
          isAddingAgentGroup,
          isAddingAgent
      })
      state.searchValue = ''
      const fullOriginTreeMap = generateTreeMap(state.fullOriginTreeData)
      state.fullOriginTreeMap = fullOriginTreeMap
      state.fullTreeData = treeData
      state.originTreeMap = fullOriginTreeMap
      state.treeData = treeData
      state.relationshipMap = relationshipMap
      return;
    }


    if (isSlideBar) {
      const {
        treeData,
        relationshipMap
      } = generateTreeData({
          originData: state.originTreeData,
          isEnterprise,
          isAddingAgentGroup,
          isAddingAgent
      })
      state.originTreeMap = generateTreeMap(state.originTreeData)
      state.treeData = treeData
      state.relationshipMap = relationshipMap
    } else if(isAddingAgentGroup || isAddingAgent) {
      const {
        treeData,
        relationshipMap
      } = generateTreeData({
          originData: state.fullOriginTreeData,
          isEnterprise,
          isAddingAgentGroup,
          isAddingAgent
      })
      const fullOriginTreeMap = generateTreeMap(state.fullOriginTreeData)
      state.fullOriginTreeMap = fullOriginTreeMap
      state.fullTreeData = treeData
      state.relationshipMap = relationshipMap
    } else {
      const {
        treeData,
        relationshipMap
      } = generateTreeData({
          originData: state.fullOriginTreeData,
          isEnterprise,
          isAddingAgentGroup,
          isAddingAgent
      })
      const fullOriginTreeMap = generateTreeMap(state.fullOriginTreeData)
      state.fullOriginTreeMap = fullOriginTreeMap
      state.fullTreeData = treeData
      state.originTreeMap = fullOriginTreeMap
      state.treeData = treeData
      state.relationshipMap = relationshipMap
    }



}
const agentGroupTreeSlice = createSlice({
    name: agentGroupTreeSliceNameSpace,
    initialState,
    reducers: {
        updateTreeData(state, action) {
            state.treeData = action.payload;
        },
        updateRelationShipMap(state, action) {
            state.relationshipMap = action.payload;
        },
        updateCurrentAgentGroupId(state, action) {
            state.currentAgentGroupId = action.payload;
        },
        updateAgentGroupsWithOutFetching:updateAgentGroupsWithOutFetchingReducer,
        selectTreeData(state, action) {
          // 搜索主机树
          const {filterTreeData, defaultExpandedKeys} = fillterTreeData(state.fullOriginTreeData, action.payload)
          state.searchValue = action.payload
          state.originTreeData = filterTreeData
          state.defaultExpandedKeys = defaultExpandedKeys
          updateAgentGroupsWithOutFetchingReducer(state,{payload:{ isAddingAgentGroup: false, isAddingAgent: false, isSlideBar: true, isGetNew: false }})
        },
        updataeExpandedKeys(state, action) {
          state.defaultExpandedKeys = action.payload
        },
        updateSearchValue(state, action) {
          state.searchValue = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(getAgentGroups.pending,(state)=>{
            state.loading = true;
        })
        builder
            .addCase(deleteAgentGroupById.fulfilled,(state)=>{
                state.currentAgentGroupId = ROOT_TREE_NODE.id
            })
            .addCase(getAgentGroups.fulfilled, (state, action) => {
                if (action.payload) {
                    const { data } =
                        action.payload as unknown as {
                            data: DataNode[];
                        }
                    state.fullOriginTreeData = data
                    state.originTreeData = data
                    state.loading = false
                    updateAgentGroupsWithOutFetchingReducer(state,{payload:{ isAddingAgentGroup: false, isAddingAgent: false, isSlideBar: false, isGetNew: true }})
                }
            })
            .addCase(getAgentGroup.fulfilled, (state, action) => {
                state.currentAgentGroup = action.payload as AnyType;
            })
            .addCase(updateAgentOrAgentGroupOperation, (state, action) => {
                if (action.payload) {
                    const { isEnterprise } = generateGroupType();
                    const { agentOperation, agentGroupOperation } =
                        action.payload;
                    const isAddingAgentGroup =
                        agentGroupOperation === AGENT_GROUP_OPERATION.ADD.value;
                    const isAddingAgent =
                        agentOperation === AGENT_OPERATION.ADD.value;
                    const { treeData, relationshipMap } = generateTreeData({
                        originData: state.originTreeData,
                        isEnterprise,
                        isAddingAgentGroup,
                        isAddingAgent,
                    });
                    state.treeData = treeData;
                    state.relationshipMap = relationshipMap;
                }
            })
            builder.addCase(getAgentGroups.rejected,(state)=>{
                state.loading = false
            })
            // TODO: 改为单独触发loading 后续需要观察是否有bug
            // .addMatcher(isPendingAction, (state) => {
            //     state.loading = true;
            // })
            // .addMatcher(isRejectedAction, (state) => {
            //     state.loading = false;
            // })
            // .addMatcher(isFulfilledAction, (state) => {
            //     state.loading = false;
            // });
    },
});

export const {
    updateTreeData,
    updateRelationShipMap,
    updateCurrentAgentGroupId,
    updateAgentGroupsWithOutFetching,
    updateSearchValue,
    selectTreeData,
    updataeExpandedKeys,
} = agentGroupTreeSlice.actions

export default agentGroupTreeSlice.reducer;
