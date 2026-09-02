/**
 * 添加|重连主机选择目标分组
 */
import I18N, { defaultLanguage } from '@src/i18n'
import { Button, Form, Select, Space, Spin } from 'antd'
import React, { useEffect, useRef } from 'react'
import { FIRST_STEP_PROGRESS } from '@src/pages/Resource/constants/constant'
import { ProForm, ProFormCheckbox, ProFormInstance, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { generateFormRequiredRule } from '@src/utils/utilsWithReactFC'
import {
    assembleRequestUrl,
    generateGroupType,
    generateValidateRules,
    omitEnglishWords,
    requestCallback
} from '@src/utils'
import SaResourceTree from '@src/pages/Resource/components/AgentGroupTree'
import SelectAll from '@com/SelectAll'
import {
    categoryDropdown,
    formBody,
} from '@src/pages/Resource/components/AddGroupModal/index.less'

import {saSourceTreeContainer,sideBarTree, right,formFooter} from './index.less'
import { useAuthorizeProject } from '@src/hooks/useAuthorizeProject'
import {
    ServiceUnit,
    useServiceUnits,
} from '@src/pages/Resource/components/AddGroupModal/hooks'
import { useDispatch } from 'react-redux'
import { request } from '@src/request/fetch'
import { EDIT_AGENT } from '@src/pages/Resource/constants/apis'
import { DEFAULT_EXECUTOR_COUNT, REQUEST_METHODS, SPLIT_SYMBOL, SYMBOL_FOR_ALL } from '@src/constant'
import { updateCurrentAgentGroupId, updateSecondResponseData } from '../slice'
import { useAgentOperationType, useAgentStep, useAuthorizeProjectsDisabled } from '../../hook'
import { useBySSHData } from '../hook'
import { FormType } from '../../addOrEditTypes'
import { useByManual } from '@src/pages/Resource/Home/Main/AddOrEditAgent/ByManual/hook'
import { getAgentGroup } from '@src/pages/Resource/components/AgentGroupTree/agentGroupTreeSlice'
import { DEFAULT_AGENT_GROUP_ID } from '@src/pages/Resource/components/AddGroupModal/constant'
import { useAgentGroupData, useAgentGroups } from '@src/pages/Resource/components/AgentGroupTree/hook'
import { ProjectFromServer } from '@src/pages/Resource/components/AddGroupModal/addGroupModalTypes'
import { useAgentGroup } from '@src/pages/Resource/hook'
import { updateAgentGroupsHasBeenChanged } from '@src/pages/Resource/resourceSlice'

const { Option } = Select

const SSHSecondStep: React.FC = () => {
    const formRef = useRef<ProFormInstance<FormType>>()
    useAgentGroups({isSlideBar: false})
    const { initAgentGroups } = useAgentGroup()

    const dispatch = useDispatch()
    const { isEnterprise } = generateGroupType()
    const {
        previous,
        next,
        previousToFirstProgress,
        isSSHInstall,
        addAgentType
    } = useAgentStep()
    const { isReconnect } = useAgentOperationType()

    const { byManualData } = useByManual()
    const { manualScripts } = byManualData
    const handlePrevious = () => {
        previousToFirstProgress(FIRST_STEP_PROGRESS.FIRST_PROGRESS)
        previous(null)
    }
    const {
        serviceUnits,
        loading: serviceUnitsLoading
    } = useServiceUnits({})
    const { authorizeProjects } = useAuthorizeProject()
    const authorizeProjectsDisabled = useAuthorizeProjectsDisabled()
    const {
        firstResponseData,
        currentAgentGroupId
    } = useBySSHData()

    const initialValues: FormType = {
        authorizeProjects: [],
        name: '',
        // executorCount: 0, // 并发限制
        // id: 0,
        labelId: [], // 主机组id
        note: '', // 主机描述
        serviceUnitIds: [], // serviceUnitIds	服务单元id集合，多个用英文逗号分隔
        // type: 0 // 操作系统类型：1:Windows;2:Linux
    }

    // 提交并下一步
    const onFinish = async (values: FormType) => {
        const {
            executorCount,
            id,
            type
        } = firstResponseData
        const {
            labelId,
            name,
            note,
            serviceUnitIds,
            // authorizeProjects
        } = values

        let params: AnyType = {
            id,
            labelId: labelId[0],
            name,
            note,
            serviceUnitIds: serviceUnitIds.join(SPLIT_SYMBOL),
            // authorizeProjects: finalProjectList.join(SPLIT_SYMBOL)
        }
        if (isSSHInstall) {
            params = {
                ...params,
                type,
                executorCount: executorCount === DEFAULT_EXECUTOR_COUNT ? null : executorCount
            }
        } else {
            params = {
                ...params,
                type: addAgentType,
                id: manualScripts[addAgentType].id
            }
        }

        const res = await request({
            url: assembleRequestUrl(EDIT_AGENT),
            method: REQUEST_METHODS.PUT,
            params
        })
        requestCallback({
            res,
            hideMessage: true,
            callback (data) {
                dispatch(updateSecondResponseData(data))
                dispatch(updateAgentGroupsHasBeenChanged(true))
                next()
            }
        })
    }

    const formProps = {
        initialValues,
        onFinish,
        formRef,
        validateTrigger: ['onChange', 'onBlur'],
        // labelWidth: 'auto',
        submitter: {
            render: () => [],
        }
    }
    const handleSubmit = () => {
        formRef.current?.submit?.()
    }
    useEffect(() => {
        if(isReconnect){
            initAgentGroups()
        }
        // 重置当前选中主机为空(0),这里禁止用户选择顶级主机组
        dispatch(updateCurrentAgentGroupId(DEFAULT_AGENT_GROUP_ID))
    }, [])
    useEffect(() => {
        if(currentAgentGroupId){
            dispatch(getAgentGroup(currentAgentGroupId))
        }
    }, [currentAgentGroupId])
    // 回显第一步主机名 和 分组
    useEffect(() => {
        const {
            name,
            labelId
        } = firstResponseData
        const params: { name: string, labelId?: number[] } = {
            name
        }
        if (isReconnect) {
            params.labelId = [labelId as number]
            // 回显主机组所选授权项目
            dispatch(updateCurrentAgentGroupId(labelId))
        }
        formRef.current?.setFieldsValue(params)
    }, [])

    const saResourceTreeProps = {
        onChange: (selectedKeysValue: React.Key[]) => {
            selectedKeysValue[0] && dispatch(updateCurrentAgentGroupId(selectedKeysValue[0]))
        },
        value: currentAgentGroupId ? [currentAgentGroupId] : [],
        containerWidth: 264,
        maxHeight:418,
    }
    const { currentAgentGroup } = useAgentGroupData()
    useEffect(() => {
        const projectList = currentAgentGroup.projectList || []
        const filterProject = projectList.filter((item: ProjectFromServer) => item.name == SYMBOL_FOR_ALL || item.uuid == SYMBOL_FOR_ALL)
        const tempAuthorizeProjects = filterProject.length ? [SYMBOL_FOR_ALL, ...authorizeProjects.map(({uuid}) => uuid)] : projectList.map(({uuid}) => uuid)
        formRef.current?.setFieldsValue({
            authorizeProjects: tempAuthorizeProjects
        })
    }, [currentAgentGroup, authorizeProjects, formRef.current])
    useEffect(() => {
      formRef.current?.setFieldsValue({
        serviceUnitIds: serviceUnits.map(({id}) => id)
    })
    }, [serviceUnits])
    
    return <div>
        <ProForm<FormType> {...formProps}>
            <div className={saSourceTreeContainer}>
                <div className={sideBarTree}>
                    <Form.Item
                        name="labelId"
                        label={I18N.Home.Main.muBiaoFenZu}
                        rules={generateValidateRules([generateFormRequiredRule(I18N.Home.Main.qingXuanZeShangJi)], false)}>
                        <SaResourceTree {...saResourceTreeProps}/>
                    </Form.Item>
                </div>
                <div className={right}>
                    <div className={formBody}>
                        <Form.Item
                            hidden={authorizeProjectsDisabled || !isEnterprise}
                            name="authorizeProjects"
                            label={I18N.Home.Main.muBiaoFenZuShou}
                        >
                            <SelectAll
                                disabled
                                className={categoryDropdown}
                                placeholder={I18N.Home.Main.shouQuanXiangMu}
                                filterOption
                            >
                                {
                                    authorizeProjects.map(({
                                        uuid,
                                        name
                                    }) => (<Option value={uuid} key={name}>{name}</Option>))
                                }
                            </SelectAll>
                        </Form.Item>

                        <ProFormText
                            label={I18N.AgentInfoModal.index.zhuJiMingCheng}
                            name="name"
                            placeholder={I18N.AgentInfoModal.index.qingShuRuZhuJi}
                            required
                            fieldProps={{
                                maxLength: 32,
                                showCount: true
                            }}
                            rules={generateValidateRules([generateFormRequiredRule(I18N.AgentInfoModal.index.qingShuRuZhuJi)], false)}
                        />
                        <Spin spinning={serviceUnitsLoading}>
                            <ProFormCheckbox.Group
                                label={I18N.Home.Main.fuWuDanYuanZhu}
                                name="serviceUnitIds"
                                required
                                rules={generateValidateRules([generateFormRequiredRule(I18N.Home.Main.qingZhiShaoXuanZe)], false)}
                                options={serviceUnits.map((serviceUnit: ServiceUnit) => ({
                                    label: defaultLanguage === 'zh-CN' ? omitEnglishWords(serviceUnit.name) : serviceUnit.name,
                                    value: serviceUnit.id
                                }))}/>
                        </Spin>
                        <ProFormTextArea
                            label={I18N.Home.Main.zhuJiMiaoShu}
                            name="note"
                            placeholder={I18N.Home.Main.qingShuRuZhuJi3}
                            fieldProps={{
                                showCount: true,
                                maxLength: 140,
                                autoSize:{ minRows: 3, maxRows: 6 }
                            }}
                        />
                    </div>
                    <div className={formFooter}>
                        <Space>
                            <Button onClick={handlePrevious}>{I18N.Home.Main.shangYiBu}</Button>
                            <Button type={'primary'} onClick={handleSubmit}>{I18N.Home.Main.xiaYiBu}</Button>
                        </Space>
                    </div>
                </div>
            </div>
        </ProForm>
    </div>
}

export default SSHSecondStep

