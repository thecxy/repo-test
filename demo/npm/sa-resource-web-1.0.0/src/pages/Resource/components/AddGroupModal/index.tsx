/**
 * 新建|查看|编辑 主机组| 移动到（移动主机）
 * 当前操作标识： agentGroupOperation
 */
import I18N from '@src/i18n'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Form, Select, Spin } from 'antd'
import { ModalForm, ProFormCheckbox, ProFormInstance, ProFormText, ProFormTextArea } from '@ant-design/pro-components'

import SaResourceTree from '@src/pages/Resource/components/AgentGroupTree'
import SelectAll from '@com/SelectAll'
import {
    ServiceUnit,
    useAddAgentGroupModal, useAgentGroupModalData,
    useAgentGroupOperation,
    useMoveAgent,
    useServiceUnits,
    useToggleGroupOperation,
    useViewAgentGroup
} from '@src/pages/Resource/components/AddGroupModal/hooks'

import { generateFormRequiredRule } from '@src/utils/utilsWithReactFC'
import { AgentGroupDetailFromServer, AgentGroupItem } from './addGroupModalTypes'
import { AGENT_GROUP_OPERATION, ROOT_TREE_NODE } from '@src/pages/Resource/constants/constant'
import { categoryDropdown, right, saSourceTreeContainer, sideBarTree, edit,modalContainer } from './index.less'
import { generateValidateRules, getContainerDOM } from '@src/utils'
import { useAgentGroupData, useAgentGroups } from '../AgentGroupTree/hook'
import { updateCurrentAgentGroupId } from './slice'
import { useDispatch } from 'react-redux'
import { DEFAULT_AGENT_GROUP, DEFAULT_AGENT_GROUP_ID } from '@src/pages/Resource/components/AddGroupModal/constant'
import { GROUP_TYPE } from '@src/constant'
import Iconfont from '@com/Iconfont'

const { Option } = Select

const AddGroupModal: React.FC = () => {
    const updateTimerRef = useRef<number | undefined>()
    const [editingSelectAgentGroupId, setEditingSelectAgentGroupId] = useState<StringOrNumber>(-1)
    const {
        serviceUnits,
        loading: serviceUnitsLoading
    } = useServiceUnits({})
    const {
        isAdding,
        isEditing,
        isViewing,
        isMoving,
        isDeleting,
        agentGroupOperation,
        handleOperateAgentGroup
    } = useAgentGroupOperation()
    const {
        addAgentGroupVisible,
        toggleAddAgentGroupModal
    } = useAddAgentGroupModal()
    const formRef = useRef<ProFormInstance<AgentGroupItem>>()
    useAgentGroups({isSlideBar: false})

    const {authorizeProjects} = useViewAgentGroup({
        formRef,
        isAdding,
        isDeleting,
        isMoving
    })
    useToggleGroupOperation({
        isAdding,
        formRef,
        addAgentGroupVisible,
    })
    const { currentAgentGroupId } = useAgentGroupModalData()

    const initialValues: AgentGroupItem = {
        ...DEFAULT_AGENT_GROUP,
        displayName: ''
    }
    const agentGroupData = useAgentGroupData()
    const {
        currentAgentGroup,
        // originTreeMap,
        fullOriginTreeMap,
    } = agentGroupData
    // update currentAgentGroupId
    useEffect(() => {
        if (addAgentGroupVisible) {
            updateTimerRef.current = window.setTimeout(() => {
                formRef.current?.setFieldsValue({
                    parentId: currentAgentGroupId ? isMoving ? [currentAgentGroup.id] : [currentAgentGroup.parentId] : []
                })
            }, 500)

            if (isEditing) {
                setEditingSelectAgentGroupId(currentAgentGroup.id)
            }
        } else {
            dispatch(updateCurrentAgentGroupId(DEFAULT_AGENT_GROUP_ID))
        }
        return () => {
            clearTimeout(updateTimerRef.current)
        }
    }, [addAgentGroupVisible, currentAgentGroup])

    const { handleCheckHasRunningAgent } = useMoveAgent()

    const modalFormProps = {
        formRef,
        visible: addAgentGroupVisible,
        initialValues,
        title: I18N.get(I18N.components.AddGroupModal.aGENT, { val1: AGENT_GROUP_OPERATION[agentGroupOperation].label }),
        onVisibleChange: (visible: boolean) => toggleAddAgentGroupModal(visible),
        autoFocusFirstInput: true,
        modalProps: {
            closeIcon: <Iconfont type={'iconcross'} />,
            getContainer: getContainerDOM,
            onCancel: () => {
                // TODO
            },
            wrapClassName:modalContainer,
        },
        onFinish: async (values: AgentGroupItem) => {
            if (isAdding || isEditing) {
                await handleOperateAgentGroup[agentGroupOperation](values)
            } else if (isViewing) {
                toggleAddAgentGroupModal(false)
            } else if (isMoving) {
                handleCheckHasRunningAgent(values)
            }
        }
    }
    const isViewingOrMoving = isViewing || isMoving
    const dispatch = useDispatch()
    const saResourceTreeProps = {
        onChange: (selectedKeysValue: React.Key[]) => {
            if (isMoving) {
                selectedKeysValue[0] && dispatch(updateCurrentAgentGroupId(selectedKeysValue[0]))
            } else if (isEditing || isAdding) {
                selectedKeysValue[0] && setEditingSelectAgentGroupId(selectedKeysValue[0])
            }
        },
        value: currentAgentGroupId ? [currentAgentGroupId] : [],
        disabled: isViewing,
        maxHeight:346,
        containerWidth:264,
        isSlideBar: false,
    }
    // 隐藏授权项目的情况：
    //       1. 根主机组
    //       2. 项目级主机组
    const hiddenProject = useMemo(() => {
        if (isAdding || isEditing) {
            return editingSelectAgentGroupId === ROOT_TREE_NODE.id || (fullOriginTreeMap[editingSelectAgentGroupId] as unknown as AgentGroupDetailFromServer)?.groupType === GROUP_TYPE.PROJECT
        } else {
            return currentAgentGroup?.groupType === GROUP_TYPE.PROJECT
        }
    }, [currentAgentGroup, isAdding, editingSelectAgentGroupId, fullOriginTreeMap, isEditing])

    return <ModalForm<AgentGroupItem>{...modalFormProps}>
        <div className={`${saSourceTreeContainer} ${edit}`}>
            <div className={sideBarTree}>
                {/* 主机分组最多支持层级为5层，等于5层的主机分组置灰无法被选中，鼠标悬浮时提示“主机分组不能超过5个层级” */}
                <Form.Item
                    name="parentId"
                    label={I18N.components.AddGroupModal.shangJiFenZu}
                    rules={generateValidateRules([generateFormRequiredRule(I18N.Home.Main.qingXuanZeShangJi)], isViewing)}>
                    <SaResourceTree {...saResourceTreeProps}/>
                </Form.Item>
            </div>
            <div className={right}>
                <div>
                    {/*  唯一标识只在VIEW|EDIT 操作时显示，且不可操作（禁用） */}
                    <ProFormText
                        label={I18N.components.AddGroupModal.weiYiBiaoZhi}
                        required
                        hidden={isAdding}
                        disabled
                        name="name"
                    />

                    <ProFormText
                        label={I18N.components.AddGroupModal.fenZuMing}
                        name="displayName"
                        placeholder={I18N.components.AddGroupModal.qingShuRuFenZu2}
                        required
                        disabled={isViewingOrMoving}
                        fieldProps={{
                            maxLength: 32,
                            showCount: true
                        }}
                        rules={generateValidateRules([generateFormRequiredRule(I18N.components.AddGroupModal.qingShuRuFenZu2)], isViewingOrMoving)}
                    />
                    {/*  服务单元：
                        编辑与查看，反显该分组下主机服务单元及数量
                        新增主机组的时候不显示
                        */}
                    <Spin spinning={serviceUnitsLoading}>
                        <ProFormCheckbox.Group
                            hidden={isAdding}
                            disabled
                            className={'serviceUnitCss'}
                            label={I18N.Home.Main.fuWuDanYuanZhu}
                            name="serviceUnitList"
                            options={serviceUnits.map((serviceUnit: ServiceUnit) => ({
                                label: `${serviceUnit.name} (${currentAgentGroup?.serviceUnitList?.filter(item => item.serviceUnitId === serviceUnit.id)[0]?.agentCount || 0})`,
                                value: serviceUnit.id
                            }))}/>
                    </Spin>
                    <ProFormTextArea
                        label={I18N.components.AddGroupModal.fenZuMiaoShu}
                        name="description"
                        placeholder={I18N.components.AddGroupModal.qingShuRuFenZu}
                        disabled={isViewingOrMoving}
                        fieldProps={{
                            showCount: true,
                            maxLength: 140,
                            autoSize:{ minRows: 3, maxRows: 9 }
                        }}
                    />
                    {/*  补充说明：参考现有项目选择，当项目设置进入时，编辑与新建分组不可默认为当前项目，不可修改授权项目 */}
                    <Form.Item
                        name="authorizeProjects"
                        label={I18N.Home.Main.shouQuanXiangMu}
                        hidden={hiddenProject}
                    >
                        <SelectAll
                            disabled={isViewingOrMoving}
                            className={categoryDropdown}
                            placeholder={I18N.components.AddGroupModal.qingXuanZeShouQuan}
                            filterOption
                        >
                            {
                                authorizeProjects.map(item => {
                                    return (
                                        <Option
                                            value={item.uuid}
                                            key={item.name}
                                        >{item.name}
                                        </Option>
                                    )
                                })
                            }
                        </SelectAll>
                    </Form.Item>
                </div>
            </div>
        </div>
    </ModalForm>
}
export default AddGroupModal
