/**
 * 脚本执行
 */
import I18N from '@src/i18n'
import {
    DrawerForm,
    ProFormDependency,
    ProFormInstance,
    ProFormRadio,
    ProFormSelect
} from '@ant-design/pro-components'
import React, { useEffect, useMemo, useRef } from 'react'
import { SCRIPT_TYPES, SCRIPTS_ORIGIN as SCRIPTS_ORIGIN_OLD, INTEGER_MAX, STEP_TYPES } from '@src/constant'
import { useExecuteScript, useScripts } from '@src/pages/Resource/components/ExecuteScript/hook'
import ScriptContent from './ScriptContent'
import { Form, Input, InputNumber } from 'antd'
import { AgentDetail, ExecuteScriptForm, RapidExecutionParamsType } from '../../resourceTypes'
import { timeOutInput, groupContainer } from './index.less'
import { generateFormRequiredRule } from '@src/utils/utilsWithReactFC'
import { generateValidateRules } from '@src/utils'
import TargetServer from '../TargetServer'
import ExecutiveLog from '../ExecutiveLog'
import { useFileDistribution } from '@src/pages/Resource/components/FileDistribution/hook'
import Iconfont from '@com/Iconfont'
import FormErrorMessage from '@com/FormErrorMessage'
import { useExecuteDetail } from '@src/pages/AgentDetail/ExecutiveList/hook'

type ExecuteScriptProps = {
    executeCallback: () => void,
    currentAgentDetail?: AgentDetail
}
const ExecuteScript: React.FC<ExecuteScriptProps> = ({
    executeCallback,
    currentAgentDetail
}) => {
    const formRef = useRef<ProFormInstance<ExecuteScriptForm>>()
    const {
        exisPipe,
        updateScripts,
        scripts,
        scriptEntities
    } = useScripts()
    const {
        visible,
        drawerDisabled,
        toggleVisible,
        handleRapidExecution
    } = useExecuteScript()
    const { loading } = useFileDistribution()

    const {
        currentExecute: executionDetail
    } = useExecuteDetail()


    const transferParams = (originParams: ExecuteScriptForm): RapidExecutionParamsType => {
        const {
            // name,
            scriptContent: {
                scriptContents,
                scriptLanguage
            },
            currentScript,
            timeoutValue,
            scriptType,
            targetResourceList
        } = originParams
        return {
            name: `execute-${Date.now()}`,
            type: STEP_TYPES.EXECUTE_SCRIPT.value,
            currentScript,
            stageScriptBean: {
                scriptName: scripts.filter(item => item.id == currentScript)?.[0]?.name,
                scriptContents,
                scriptLanguage,
                timeoutValue,
                scriptType
            },
            targetResourceList
        }
    }

    const SCRIPTS_ORIGIN = useMemo(() => {
        const origin = SCRIPTS_ORIGIN_OLD
        if (exisPipe?.ifExistPipe === true) {
            origin.IMPORT_SCRIPTS.show = true
        } else if (exisPipe?.ifExistPipe === false) {
            origin.IMPORT_SCRIPTS.show = false
        }
        return origin
    }, [exisPipe])

    const initialValues = {
        // name: '',
        scriptType: SCRIPTS_ORIGIN.MANUAL_INPUT.value,
        currentScript: '',
        scriptName: '',
        scriptContent: {
            scriptLanguage: SCRIPT_TYPES[0].key,
            scriptContents: ''
        },
        timeoutValue: 60
    }
    useEffect(() => {
        const stageScript = executionDetail?.stageTriggerList[0]?.stageTriggerItemList[0]?.stageTriggerItemParams.stageScript
        if (stageScript) {
            formRef.current?.setFieldsValue({
                scriptType: stageScript?.scriptType,
                scriptName: stageScript?.scriptName,
                scriptContent: {
                    scriptContents: stageScript.scriptContents,
                    scriptLanguage: stageScript.scriptLanguage
                }
            })
        }
        // 如果是导入脚本，需要更新脚本列表
        if(stageScript?.scriptType === SCRIPTS_ORIGIN.IMPORT_SCRIPTS.value && SCRIPTS_ORIGIN.IMPORT_SCRIPTS.show) {
          updateScripts()
        }
    }, [executionDetail, formRef])

    const drawerFormProps = {
        title: !drawerDisabled ? I18N.constant.index.jiaoBenZhiXing : I18N.components.ExecuteScript.zhiXingXiangQing,
        width: 650,
        submitter: {
            searchConfig: {
                // resetText: '重置',
                submitText: I18N.components.ExecuteScript.zhiXing
            },
            submitButtonProps: {
                loading,
                disabled: drawerDisabled
                // disabled
            }
        },
        onValuesChange: (changeValues: ExecuteScriptForm) => {
            const { currentScript, scriptType } = changeValues
            if (currentScript) {
                const { script } = scriptEntities.scriptMap[currentScript]
                formRef.current?.setFieldsValue({
                    scriptContent: {
                        scriptLanguage: formRef.current?.getFieldsValue().scriptContent.scriptLanguage,
                        scriptContents: script
                    }
                })
            }
            if(scriptType === SCRIPTS_ORIGIN.IMPORT_SCRIPTS.value && SCRIPTS_ORIGIN.IMPORT_SCRIPTS.show) {
              updateScripts()
            }
        },
        onVisibleChange: (visible: boolean) => toggleVisible(visible),
        onFinish: async (values: ExecuteScriptForm) => {
            let params = values
            if (hideTargetServer) {
                const {
                    name,
                    uuid
                    // type,
                } = currentAgentDetail as AgentDetail
                params = {
                    ...params,
                    targetResourceList: [{
                        targetResourceName: name,
                        targetUuid: uuid
                    }]
                }
            }
            handleRapidExecution(transferParams(params))
            executeCallback()
        },
        initialValues,
        formRef,
        drawerProps: {
            className: 'execute-script-drawer',
            closeIcon: <Iconfont type={'iconcross'} />
        },
        visible
    }

    const targetServerProps = {
        disabled: drawerDisabled,
        formRef,
        visible,
        onFromChange: (value: any) => {
            formRef.current?.setFieldsValue({...value})
        },
    }
    useEffect(() => {
        if (!visible) {
            formRef.current?.resetFields()
        }
    }, [visible])
    // 当前页面在agent详情页时，主动选择当前的agent作为目标服务器 from 张超、徐明星
    const hideTargetServer = useMemo(() => {
        return Boolean(currentAgentDetail) || drawerDisabled
    }, [currentAgentDetail, drawerDisabled])

    return <DrawerForm<ExecuteScriptForm>
        {...drawerFormProps}
    >
        <ProFormDependency name={['scriptType', 'scriptLanguage', 'scriptContent']}>
            {
                ({
                    scriptType
                }) => {
                    const isManualInput = scriptType === SCRIPTS_ORIGIN.MANUAL_INPUT.value
                    const hiddenScripts = isManualInput || drawerDisabled
                    return <>
                        <ProFormRadio.Group
                            radioType='button'
                            width={'xl'}
                            required={!drawerDisabled}
                            // hidden={drawerDisabled}
                            fieldProps={{
                                className: groupContainer
                            }}
                            name={'scriptType'}
                            label={I18N.components.ExecuteScript.jiaoBenLaiYuan}
                            options={Object.values(SCRIPTS_ORIGIN).filter(item => item.show)
                                .map(item => ({
                                    ...item,
                                    disabled: drawerDisabled
                                }))}
                            rules={generateValidateRules([generateFormRequiredRule(I18N.components.ExecuteScript.qingXuanZeJiaoBen2)])}
                        />
                        <Form.Item
                            hidden={isManualInput || !drawerDisabled}
                            name={'scriptName'}
                            label={I18N.components.ExecuteScript.jiaoBenMingCheng}
                        >
                            <Input disabled/>
                        </Form.Item>
                        <ProFormSelect
                            hidden={hiddenScripts}
                            required={!hiddenScripts}
                            disabled={drawerDisabled}
                            rules={generateValidateRules([generateFormRequiredRule(I18N.components.ExecuteScript.qingXuanZeJiaoBen)], hiddenScripts)}
                            options={scripts.map(project => {
                                const {
                                    name,
                                    id,
                                    tags
                                } = project
                                return {
                                    label: name,
                                    value: id,
                                    key: id,
                                    tags
                                }
                            })}
                            name='currentScript'
                            label={I18N.components.ExecuteScript.xuanZeJiaoBen}
                        />

                        <Form.Item
                            required
                            name={'scriptContent'}
                            label={I18N.components.ExecuteScript.jiaoBenNeiRong}
                            rules={[
                                {
                                    validator: async (_rule: AnyType, value) => {
                                        if (!value.scriptContents) {
                                            return Promise.reject(<FormErrorMessage
                                                message={I18N.components.ExecuteScript.qingShuRuJiaoBen} />)
                                        }
                                    }
                                }
                            ]}
                        >
                            <ScriptContent
                                disabled={drawerDisabled}
                            />
                        </Form.Item>
                        <Form.Item
                            name={'timeoutValue'}
                            label={I18N.components.ExecuteScript.chaoShiShiChangMiao}
                            required
                            rules={generateValidateRules([generateFormRequiredRule(I18N.components.ExecuteScript.qingShuRuChaoShi)])}
                        >
                            <InputNumber
                                className={timeOutInput}
                                disabled={drawerDisabled}
                                max={INTEGER_MAX}
                                placeholder={I18N.components.ExecuteScript.qingShuRuChaoShi}
                            />
                        </Form.Item>
                        <Form.Item
                            hidden={hideTargetServer}
                            name={'targetResourceList'}
                            label={I18N.components.ExecuteScript.muBiaoFuWuQi}
                            required={!hideTargetServer}
                            rules={hideTargetServer ? [] : generateValidateRules([generateFormRequiredRule(I18N.OriginTargetServer.index.qingXuanZeMuBiao)])}
                        >
                            {!hideTargetServer && <TargetServer {...targetServerProps} />}
                        </Form.Item>
                    </>
                }
            }
        </ProFormDependency>
        {/* 日志执行结果 */}
        {visible && <ExecutiveLog />}
    </DrawerForm>
}

export default ExecuteScript
