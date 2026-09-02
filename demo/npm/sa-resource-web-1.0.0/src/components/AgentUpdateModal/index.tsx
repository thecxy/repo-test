/**
 * 升级配置
 */
import I18N from '@src/i18n'
import React, { useEffect, useRef } from 'react'
import { ModalForm, ProFormDependency, ProFormInstance, ProFormRadio } from '@ant-design/pro-components'
import FormErrorMessage from '@com/FormErrorMessage'
import { agentUpdateContainer, strategyRadioTooltip, groupContainer } from './index.less'
import { useAgentUpdate } from '@src/pages/Resource/hook'
import { generateValidateRules, getContainerDOM } from '@src/utils'
import { Form, Radio, Spin, TimePicker, Tooltip } from 'antd'
import QuestionIcon from '@src/statics/icons/question.svg'
import { generateFormRequiredRule } from '@src/utils/utilsWithReactFC'
import { UPDATE_STRATEGIES, UPDATE_TYPE_RADIOS } from '@src/constant'
import { getCompanyId } from '@src/utils/getRouteIds'
import { fetchUpdateConfig, UpdateAgentFormType } from './slice'
import { useDispatch } from 'react-redux'
import Iconfont from '@com/Iconfont'

const AgentUpdateModal: React.FC = () => {
    const dispatch = useDispatch()
    const {
        visible,
        toggleVisible,
        handleUpdateAgentConfig,
        loading,
        requestData,
    } = useAgentUpdate()

    const formRef = useRef<ProFormInstance<UpdateAgentFormType>>()

    const initData = async () => {
        dispatch(fetchUpdateConfig())
    }

    useEffect(() => {
        if (visible) {
            initData()
        }
    }, [visible])

    useEffect(() => {
        formRef.current?.setFieldsValue(requestData)
    }, [requestData])

    const modalFormProps = {
        width: 520,
        formRef,
        title: I18N.AgentUpdateModal.index.aGENT2,
        visible,
        initialValues: {
            mode: UPDATE_TYPE_RADIOS.AUTO.value,
            strategy: UPDATE_STRATEGIES.DEFAULT.value,
            startTime: null,
            endTime: null,
        },
        submitter: {
            submitButtonProps: {
                loading
            }
        },
        modalProps: {
            getContainer: getContainerDOM,
            closeIcon: <Iconfont type={'iconcross'} />,
            onCancel: () => {
                toggleVisible(false)
            },
        },
        onFinish: async (values: UpdateAgentFormType) => {
            const {
                startTime,
                endTime,
                mode
            } = values
            const params: UpdateAgentFormType = {
                mode,
                companyUuid: getCompanyId()
            }
            if (mode === UPDATE_TYPE_RADIOS.MANUAL.value) {
                params.startTime = (startTime as string).split(' ') [1]
                params.endTime = (endTime as string).split(' ')[1]
            }
            handleUpdateAgentConfig(params)
        }
    }

    return <ModalForm<UpdateAgentFormType>{...modalFormProps}>
        <Spin spinning={loading}>
            <div className={agentUpdateContainer}>
                {/* agent 升级方式 */}
                <ProFormRadio.Group
                    radioType="button"
                    width={'xl'}
                    required
                    fieldProps={{
                        className: groupContainer
                    }}
                    name={'mode'}
                    label={I18N.AgentUpdateModal.index.aGENT}
                    options={Object.values(UPDATE_TYPE_RADIOS)}
                    rules={[
                        {
                            required: true,
                            message: <FormErrorMessage message={I18N.AgentUpdateModal.index.qingXuanZeRenZheng}/>
                        },
                    ]}
                />
                {/* 升级策略 */}
                <Form.Item
                    required
                    name={'strategy'}
                    label={I18N.AgentUpdateModal.index.shengJiCeLue}
                    rules={[
                        {
                            required: true,
                            message: <FormErrorMessage message={I18N.AgentUpdateModal.index.qingXuanZeShengJi}/>
                        },
                    ]}
                >
                    <Radio.Group
                        optionType="button"
                        className={groupContainer}
                    >
                        {
                            Object.values(UPDATE_STRATEGIES).map(radio => {
                                const {
                                    value,
                                    label,
                                    tooltip
                                } = radio
                                return tooltip ? (
                                    <Tooltip
                                        title={tooltip}
                                        className={strategyRadioTooltip}
                                        key={value}
                                    >
                                        <Radio value={value}>
                                            <span>{label}</span>
                                            <QuestionIcon/>
                                        </Radio>
                                    </Tooltip>
                                ) : (
                                    <Radio key={value} value={value}>{label}</Radio>
                                )
                            })
                        }
                    </Radio.Group>
                </Form.Item>
                <ProFormDependency name={['mode']}>
                    {({ mode }) => {
                        const hidden = mode === UPDATE_TYPE_RADIOS.AUTO.value
                        return <div>
                            <Form.Item
                                required={!hidden}
                                hidden={hidden}
                                name={'startTime'}
                                label={I18N.AgentUpdateModal.index.kaiShiShiJian}
                                rules={generateValidateRules([generateFormRequiredRule(I18N.AgentUpdateModal.index.qingXuanZeKaiShi)], hidden)}
                            >
                                <TimePicker/>
                            </Form.Item>
                            <Form.Item
                                required={!hidden}
                                hidden={hidden}
                                rules={generateValidateRules([generateFormRequiredRule(I18N.AgentUpdateModal.index.qingXuanZeJieShu)], hidden)}
                                name={'endTime'}
                                label={I18N.AgentUpdateModal.index.jieShuShiJian}
                            >
                                <TimePicker/>
                            </Form.Item>
                        </div>
                    }}
                </ProFormDependency>
            </div>
        </Spin>
    </ModalForm>
}

export default AgentUpdateModal
